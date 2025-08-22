import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../../context/themeContext';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import {
  CustomHighlightButton,
  OutlinedButton,
  Text,
  KeyboardHeightView,
  ExpandableText,
} from '../../../components';
import { ThemeColors } from '../../../theme/colors';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { FeedbackTypes } from '../../../utils/feedbackUtils';
import { Icons } from '../../../assets/Icons';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native';
import BottomSheet from '../../../components/BottomSheet';
import fonts from '../../../theme/fonts';
import { DimensionsData } from '../../../utils/scaling';

interface ComponentProps {
  item: any;
  drag?: () => void;
  isActive?: boolean;
  isDragging?: boolean;
  onPress?: () => void;
  index: number;
  onDelete?: (itemId: string) => void;
  isShoppingMode?: boolean;
  onStrikethroughChange?: (itemId: string, strikethrough: boolean) => void;
  onNotesChange?: (itemId: string, notes: string) => void;
}

const formatPrice = (price: number | string) =>
  `$${(typeof price === 'string' ? parseFloat(price) : price).toFixed(2)}`;

const Item: React.FC<ComponentProps> = ({
  item,
  drag,
  index,
  isActive,
  isDragging,
  onPress,
  onDelete,
  isShoppingMode = false,
  onStrikethroughChange,
  onNotesChange,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => useStyles(colors), [colors]);
  const navigation = useNavigation();
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const [notes, setNotes] = useState(item.notes || '');
  // Generate unique key for item identification
  const itemKey = useMemo(
    () => item.receiptId || item.id || `${item.productName}-${item.quantity}`,
    [item.receiptId, item.id, item.productName, item.quantity],
  );

  // Animation values for strikethrough effect (0 = hidden, 1 = visible)
  const strikeThroughOpacity = useSharedValue(item.strikethrough ? 1 : 0);
  const strikeThroughWidth = useSharedValue(item.strikethrough ? 1 : 0);
  const backgroundColor = useSharedValue(item.strikethrough ? 1 : 0);

  // Sync animation values with item state changes
  useEffect(() => {
    if (item.strikethrough) {
      strikeThroughOpacity.value = 1;
      strikeThroughWidth.value = 1;
      backgroundColor.value = 1;
    } else {
      strikeThroughOpacity.value = 0;
      strikeThroughWidth.value = 0;
      backgroundColor.value = 0;
    }
  }, [item.strikethrough, strikeThroughOpacity, strikeThroughWidth, backgroundColor]);

  // Animated strikethrough styles for different text elements
  const productNameStrikeStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.black,
    opacity: strikeThroughOpacity.value,
    transform: [{ scaleX: strikeThroughWidth.value }],
    zIndex: 1,
  }));

  const quantityStrikeStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.black,
    opacity: strikeThroughOpacity.value,
    transform: [{ scaleX: strikeThroughWidth.value }],
    zIndex: 1,
  }));

  const priceStrikeStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: -'50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.black,
    opacity: strikeThroughOpacity.value,
    transform: [{ scaleX: strikeThroughWidth.value }],
    zIndex: 1,
  }));

  // Background color animation for completed items
  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value === 0 ? colors.white : 'rgba(4, 121, 0, 0.05)',
  }));

  const playStrikeThroughFeedback = useCallback(() => {
    try {
      FeedbackTypes.tap();
    } catch (error) {
      console.warn('Failed to trigger feedback:', error);
    }
  }, []);

  const handleViewDetail = useCallback(() => {
    // Create mock order data for navigation to detail screen
    const orderData = {
      orderId: `#${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      storeName: item.storeBranch || 'Unknown Store',
      orderStatus: 'Estimated',
      newDate: new Date().toISOString(),
      uploadChannel: 'PHOTOS',
      subTotal: item.subTotal,
      reciept: [item],
      inWishlist: false,
    };

    (navigation as any).navigate('HistoryOrderStack', {
      screen: 'OrderItemDetail',
      params: { orderData, item },
    });
  }, [item, navigation]);

  const handleAddNotes = useCallback(() => {
    setIsNotesVisible(true);
    setNotes(item.notes || '');
  }, [item.notes]);

  const handleSaveNote = useCallback(() => {
    if (onNotesChange) {
      console.log('Save note there:', notes, onNotesChange);
      onNotesChange(itemKey, notes);
    }
    setIsNotesVisible(false);
    setNotes('');
  }, [notes, onNotesChange, itemKey]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(itemKey);
    }

    console.log('Delete item:', item.productName);
  }, [item, onDelete, itemKey]);

  // Toggle strikethrough state with animation and feedback
  const triggerStrikeThrough = useCallback(() => {
    const newStrikethroughState = !item.strikethrough;

    if (newStrikethroughState) {
      playStrikeThroughFeedback();

      backgroundColor.value = withTiming(1, { duration: 300 });
      strikeThroughOpacity.value = withTiming(1, { duration: 300 });
      strikeThroughWidth.value = withTiming(1, { duration: 300 });
    } else {
      backgroundColor.value = withTiming(0, { duration: 300 });
      strikeThroughOpacity.value = withTiming(0, { duration: 300 });
      strikeThroughWidth.value = withTiming(0, { duration: 300 });
    }

    onStrikethroughChange?.(itemKey, newStrikethroughState);
  }, [
    item.strikethrough,
    itemKey,
    backgroundColor,
    strikeThroughOpacity,
    strikeThroughWidth,
    playStrikeThroughFeedback,
    onStrikethroughChange,
  ]);

  const handlePress = useCallback(() => {
    // In shopping mode, toggle strikethrough on press
    if (isShoppingMode) {
      triggerStrikeThrough();
    }
    onPress?.();
  }, [triggerStrikeThrough, onPress, isShoppingMode]);

  const menuOptionsCustomStyles = useMemo(
    () => ({
      optionsContainer: {
        width: 120,
        backgroundColor: colors.white,
        borderRadius: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
      },
      optionText: {
        fontSize: 14,
        fontFamily: 'Satoshi-Regular',
        color: colors.textPrimary,
      },
    }),
    [colors],
  );

  return (
    <Animated.View
      style={[
        styles.itemContainer,
        animatedBackgroundStyle,
        { zIndex: 1000 - index }, // Ensure proper layering during drag
      ]}
    >
      <Pressable
        onLongPress={() => {
          console.log('Long press detected!', { drag: !!drag, isActive });
          if (drag) {
            FeedbackTypes.select();
            drag();
          }
        }}
        disabled={isActive}
        onPress={handlePress}
        style={styles.pressableContent}
      >
        <View style={styles.item}>
          <View style={styles.rowCenter}>
            <View style={styles.textContainer}>
              <Text textStyle='bold16' color={colors.textPrimary}>
                {item.productName}
              </Text>
              <Animated.View style={productNameStrikeStyle} />
            </View>
            <View style={styles.textContainer}>
              <Text textStyle='regular14' color={colors.lightGrey}>
                {item.quantity}
                {item.unit}
              </Text>
              <Animated.View style={quantityStrikeStyle} />
            </View>
          </View>
          <ExpandableText text={item.notes} maxLines={1} emptyTag='No notes' />
        </View>
        <View style={styles.rowCenter}>
          <View style={styles.textContainer}>
            <Text textStyle='bold14' color={colors.lightGrey}>
              {formatPrice(item.subTotal)}
            </Text>
            <Animated.View style={priceStrikeStyle} />
          </View>
          <Menu>
            <MenuTrigger>
              <View style={styles.menuButton}>
                <Image source={Icons.dots} style={styles.menuIcon} />
              </View>
            </MenuTrigger>
            <MenuOptions customStyles={menuOptionsCustomStyles}>
              <MenuOption onSelect={handleViewDetail}>
                <View style={styles.menuItem}>
                  <Image source={Icons.eyeOpen} style={styles.menuIcon} />
                  <Text textStyle='regular12' color={colors.textPrimary}>
                    View Detail
                  </Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={handleAddNotes}>
                <View style={styles.menuItem}>
                  <Image source={Icons.edit} style={styles.menuIcon} />
                  <Text textStyle='regular12' color={colors.textPrimary}>
                    {item.notes ? 'Edit' : 'Add'} notes
                  </Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={handleDelete}>
                <View style={styles.menuItem}>
                  <Image
                    source={Icons.trash}
                    style={[styles.menuIcon, { tintColor: colors.error || '#FF4444' }]}
                  />
                  <Text textStyle='regular12' color={colors.error || '#FF4444'}>
                    Delete
                  </Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </Pressable>
      <BottomSheet
        heading={item.notes ? 'Edit Notes' : 'Notes'}
        visible={isNotesVisible}
        onClose={() => setIsNotesVisible(false)}
        maxHeight={DimensionsData.windowHeight}
      >
        <View style={styles.notesInputContainer}>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder='Write Note'
            placeholderTextColor={colors.lightGrey}
            multiline
            style={styles.notesInput}
          />
        </View>
        <View style={styles.notesInputButtonContainer}>
          <View style={{ flex: 1 }}>
            <OutlinedButton title='Cancel' smallVariant onPress={() => setIsNotesVisible(false)} />
          </View>
          <View style={{ flex: 1 }}>
            <CustomHighlightButton
              title={item.notes ? 'Update' : 'Add'}
              smallVariant
              onPress={handleSaveNote}
            />
          </View>
        </View>
        <KeyboardHeightView />
      </BottomSheet>
    </Animated.View>
  );
};

const useStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    itemContainer: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 30,
      overflow: 'visible', // Allow dropdown menu to extend beyond container
    },
    pressableContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 30,
    },
    item: { gap: 4, flex: 1 },
    rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    menuButton: { padding: 4 },
    textContainer: {
      position: 'relative', // Required for absolute positioned strikethrough
      justifyContent: 'center',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      height: 20,
    },
    menuIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
      tintColor: colors.primary,
    },
    notesInput: {
      width: '100%',
      padding: 12,
      textAlignVertical: 'top',
      fontSize: 16,
      fontFamily: fonts.family.medium,
      color: colors.black,
      height: '100%',
    },
    notesInputButtonContainer: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 16,
    },
    notesInputContainer: {
      borderWidth: 1,
      borderColor: colors.gray3,
      borderRadius: 27.5,
      overflow: 'hidden',
      marginTop: 16,
      height: 100,
    },
  });

// Memoized component to prevent unnecessary re-renders
const OptimizedItem = React.memo(Item, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.strikethrough === nextProps.item.strikethrough &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.isShoppingMode === nextProps.isShoppingMode &&
    prevProps.item.notes === nextProps.item.notes
  );
});

export default OptimizedItem;
