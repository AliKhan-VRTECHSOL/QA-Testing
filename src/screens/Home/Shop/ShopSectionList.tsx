import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Pressable, Image, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { useTheme } from '../../../context/themeContext';
import useStyles from './styles';
import { ReceiptItem, ReceiptSection, ComponentProps } from './types';
import Item from './Item';
import { Text, CustomHighlightButton, OutlinedButton } from '../../../components';
import BottomSheet from '../../../components/BottomSheet';
import { Icons } from '../../../assets/Icons';
import { useFeedback } from '../../../utils/feedbackUtils';
import { useOverlay } from '../../../context/OverlayContext';
import ShopSuccess from '../../../components/ShopSuccess';
import { useNavigation } from '@react-navigation/native';

// Remove the global strikethrough state map since we're now storing it in the data
// export const strikethroughStateMap = new Map<string, boolean>();

/**
 * Converts flattened data back to sections structure
 * Removes footer entries and reconstructs sections with their items
 */
function unflattenData(flattened: any[]) {
  // Remove footer entries first
  const filtered = flattened.filter(entry => !entry.id.startsWith('footer'));

  let sections = [];
  let currentSection = '';

  for (const entry of filtered) {
    if (entry.type === 'header') {
      currentSection = entry.section.title;
      sections.push({
        ...entry.section,
        data: [],
      });
    } else if (entry.type === 'item' && entry.item) {
      const sectionIndex = sections.findIndex(section => section.title === currentSection);
      if (sectionIndex !== -1) {
        sections[sectionIndex].data.push(entry.item);
      }
    }
  }

  return sections;
}

/**
 * Determines the correct drop position when dropping near headers
 * If there's a footer right before a header, redirect to the footer position
 * This prevents items from being placed between footer and header
 */
function getAdjustedDropPosition(data: any[], dropIndex: number): number {
  // If dropping on a header and there's a footer right before it, redirect to footer
  if (dropIndex > 0 && data[dropIndex - 1]?.type === 'footer') {
    return dropIndex - 1;
  }
  return dropIndex;
}

const ReceiptSectionList: React.FC<ComponentProps> = ({
  ListSections,
  onItemPress = () => {},
  isShoppingMode,
  setIsShoppingMode,
}) => {
  const navigation = useNavigation();
  const { setFadeInViewContent, setFadeInViewStyle, setFadeInViewVisible } = useOverlay();
  const { colors } = useTheme();
  const styles = useMemo(() => useStyles(colors), [colors]);
  const [sections, setSections] = useState<ReceiptSection[]>(ListSections);

  // Shopping mode state

  // Remove the strikethrough update trigger since we're managing state in data
  // const [strikethroughUpdateTrigger, setStrikethroughUpdateTrigger] = useState(0);

  // Bottom sheet state
  const [showConfirmationSheet, setShowConfirmationSheet] = useState(false);

  // FlatList ref
  const flatListRef = useRef<any>(null);

  const handleShowShoppingSuccess = () => {
    setFadeInViewStyle({
      backgroundColor: colors.white,
    });
    setFadeInViewContent(<ShopSuccess />);
    setFadeInViewVisible(true);
  };

  // Check selected items count - now using data.strikethrough property
  const selectedItemsCount = useMemo(() => {
    let count = 0;
    sections.forEach(section => {
      section.data.forEach((item: any) => {
        if (item.strikethrough) {
          count++;
        }
      });
    });
    return count;
  }, [sections]);

  // Get unselected items for confirmation - now using data.strikethrough property
  const unselectedItems = useMemo(() => {
    const items: any[] = [];
    sections.forEach(section => {
      section.data.forEach((item: any) => {
        if (!item.strikethrough) {
          items.push(item);
        }
      });
    });
    return items;
  }, [sections]);

  // Remove the triggerStrikethroughUpdate function since we're managing state in data
  // const triggerStrikethroughUpdate = useCallback(() => {
  //   setStrikethroughUpdateTrigger(prev => prev + 1);
  // }, []);

  // Handle strikethrough change - update the data structure
  const handleStrikethroughChange = useCallback((itemId: string, strikethrough: boolean) => {
    setSections(prev =>
      prev.map(section => ({
        ...section,
        data: section.data.map(item => {
          const itemKey = item.receiptId || `${item.productName}-${item.quantity}`;
          if (itemKey === itemId) {
            return { ...item, strikethrough };
          }
          return item;
        }),
      })),
    );
  }, []);

  const handleSaveNote = useCallback((itemId: string, notes: string) => {
    console.log('Save here note:', itemId, notes);
    setSections(prev =>
      prev.map(section => ({
        ...section,
        data: section.data.map(item => {
          if (item.receiptId === itemId) {
            return { ...item, notes };
          }
          return item;
        }),
      })),
    );
  }, []);

  const handleCancelAllStrikeThrough = useCallback(() => {
    setSections(prev =>
      prev.map(section => ({
        ...section,
        data: section.data.map(item => ({ ...item, strikethrough: false })),
      })),
    );
  }, []);

  // Handle "Let's shop" button press
  const handleLetsShop = useCallback(() => {
    if (!isShoppingMode) {
      // Enter shopping mode
      setIsShoppingMode(true);
      console.log('Entered shopping mode');
    } else {
      // Check if there are unselected items
      if (unselectedItems.length > 0) {
        // Show confirmation sheet
        setShowConfirmationSheet(true);
      } else {
        // No unselected items, proceed with completion
        completeShopping();
      }
    }
  }, [isShoppingMode, unselectedItems]);

  // Complete shopping function
  const completeShopping = useCallback(() => {
    handleShowShoppingSuccess();
    setIsShoppingMode(false);
    // Clear strikethrough state from all items
    setSections(prev =>
      prev.map(section => ({
        ...section,
        data: section.data.map(item => ({ ...item, strikethrough: false })),
      })),
    );
    console.log('Completed shopping');
  }, []);

  // Handle confirmation actions
  const handleCancel = useCallback(() => {
    setShowConfirmationSheet(false);
  }, []);

  const handleFinalize = useCallback(() => {
    setShowConfirmationSheet(false);
    completeShopping();
  }, [completeShopping]);

  // Handle API data updates while preserving strikethrough state
  const updateSectionsWithAPI = useCallback((newSections: ReceiptSection[]) => {
    setSections(prev =>
      newSections.map(newSection => {
        const existingSection = prev.find(s => s.title === newSection.title);
        if (existingSection) {
          // Preserve strikethrough state for existing items
          const updatedData = newSection.data.map(newItem => {
            const existingItem = existingSection.data.find(
              existing =>
                existing.receiptId === newItem.receiptId ||
                `${existing.productName}-${existing.quantity}` ===
                  `${newItem.productName}-${newItem.quantity}`,
            );
            return {
              ...newItem,
              strikethrough: existingItem?.strikethrough || false,
            };
          });
          return {
            ...newSection,
            data: updatedData,
            orderData: { ...newSection.orderData, receipt: updatedData },
          };
        }
        // Initialize new sections with strikethrough state
        const initializedData = newSection.data.map(item => ({
          ...item,
          strikethrough: false,
        }));
        return {
          ...newSection,
          data: initializedData,
          orderData: {
            ...newSection.orderData,
            receipt: initializedData,
          },
        };
      }),
    );
  }, []);

  // Toggle section collapse
  const toggleSectionCollapse = useCallback((sectionTitle: string) => {
    setSections(prev =>
      prev.map(s => (s.title === sectionTitle ? { ...s, collapsed: !s.collapsed } : s)),
    );
  }, []);

  // Handle item deletion
  const handleDeleteItem = useCallback((itemId: string) => {
    setSections(prev =>
      prev.map(section => {
        const updatedData = section.data.filter(
          item => (item.receiptId || `${item.productName}-${item.quantity}`) !== itemId,
        );
        return {
          ...section,
          data: updatedData,
          orderData: { ...section.orderData, receipt: updatedData },
        };
      }),
    );
    // Also trigger strikethrough update in case the deleted item had strikethrough
    // triggerStrikethroughUpdate(); // This line is removed as per the new_code
  }, []);

  // Handle item press
  const handleItemPress = useCallback(
    (item: ReceiptItem) => {
      onItemPress(item);
    },
    [onItemPress],
  );

  /**
   * Flattens sections data into a single array for DraggableFlatList
   * Creates header, item, and footer entries for each section
   */
  const flattenedData = useMemo(() => {
    const flattened: any[] = [];

    sections.forEach((section, sectionIndex) => {
      // Add section header
      flattened.push({
        id: `header-${section.title}-${sectionIndex}`,
        type: 'header',
        section,
        sectionIndex,
      });

      // Add all items regardless of collapse state
      section.data.forEach((item, itemIndex) => {
        flattened.push({
          id: item.receiptId || `${item.productName}-${item.quantity}-${itemIndex}`,
          type: 'item',
          item,
          section,
          sectionIndex,
        });
      });

      // Add section footer (always present, even for collapsed sections)
      flattened.push({
        id: `footer-${section.title}-${sectionIndex}`,
        type: 'footer',
        section,
        sectionIndex,
      });
    });

    return flattened;
  }, [sections]);

  /**
   * Memoized ItemSeparator component for better performance
   * Only shows separator when there are visible items
   */
  const ItemSeparator = useCallback(
    ({ leadingItem, trailingItem }: any) => {
      // Don't show separator if the trailing item is a footer and the leading item is a header
      // This prevents the line from showing under collapsed section headers
      if (trailingItem?.type === 'footer' && leadingItem?.type === 'header') {
        return null;
      }

      // Don't show separator if the leading item is a footer
      if (leadingItem?.type === 'footer') {
        return null;
      }

      // Don't show separator if the trailing item is a header
      if (trailingItem?.type === 'header') {
        return null;
      }

      return (
        <View
          style={{
            width: '90%',
            height: 1,
            backgroundColor: colors.imageBGColor,
            alignSelf: 'center',
          }}
        />
      );
    },
    [colors.imageBGColor],
  );

  /**
   * Section footer renderer - renders "Add item" button for each section
   */
  const renderSectionFooter = useCallback(
    ({ section }: any) => {
      return (
        <View style={styles.addItemContainer}>
          <Pressable
            style={styles.addItemButton}
            onPress={() => {
              (navigation as any).navigate('AddItem', {
                onAdd: (item: any) => {
                  // Ensure new items have strikethrough property initialized
                  const newItem = { ...item, strikethrough: false };
                  setSections(prev =>
                    prev.map(k => ({
                      ...k,
                      data: k.title === newItem.storeBranch ? [...k.data, newItem] : k.data,
                      // Auto-expand the section when an item is added
                      collapsed: k.title === newItem.storeBranch ? false : k.collapsed,
                    })),
                  );
                },
                storeBranch: section.title,
              });
            }}
          >
            <Text textStyle='regular14' color={colors.primary}>
              Add item
            </Text>
          </Pressable>
        </View>
      );
    },
    [colors, styles, navigation, setSections],
  );

  /**
   * Handles the end of drag and drop operations
   * Converts the reordered flattened data back to sections structure
   * and expands the target section if it was collapsed
   */
  const handleDragEnd = useCallback(
    ({ data, from, to }: { data: any[]; from: number; to: number }) => {
      const newSections = unflattenData(data);

      // Find the target section where the item was dropped
      // Look for the section that contains the drop position
      let currentIndex = 0;
      let targetSectionIndex = -1;

      for (let i = 0; i < newSections.length; i++) {
        const section = newSections[i];
        const sectionItemCount = section.data.length;

        // Each section takes up: 1 (header) + sectionItemCount (items) + 1 (footer) positions
        const sectionSize = 2 + sectionItemCount;

        if (to >= currentIndex && to < currentIndex + sectionSize) {
          targetSectionIndex = i;
          break;
        }

        currentIndex += sectionSize;
      }

      // If the target section was collapsed, expand it
      if (targetSectionIndex !== -1 && newSections[targetSectionIndex].collapsed) {
        newSections[targetSectionIndex] = {
          ...newSections[targetSectionIndex],
          collapsed: false,
        };
      }

      setSections(newSections);
    },
    [],
  );

  /**
   * Renders individual items in the DraggableFlatList
   * Handles headers, items, and footers
   */
  const renderItem = useCallback(
    ({
      item,
      drag,
      isActive,
    }: RenderItemParams<{
      id: string;
      type: 'header' | 'item' | 'footer';
      item?: ReceiptItem;
      section: ReceiptSection;
      sectionIndex: number;
    }>) => {
      if (item.type === 'header') {
        return (
          <Pressable
            onPress={() => toggleSectionCollapse(item.section.title)}
            style={styles.sectionHeader}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Text textStyle='bold16' color={colors.black}>
                {item.section.title}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text textStyle='regular14' color={colors.lightGrey}>
                  {item.section.data.length} items
                </Text>
                <Image
                  source={Icons.ChevronDown}
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                    transform: [
                      {
                        rotate: `${item.section.collapsed ? 0 : 180}deg`,
                      },
                    ],
                    tintColor: colors.primary,
                  }}
                />
              </View>
            </View>
          </Pressable>
        );
      }

      // Footer rendering is handled by renderSectionFooter prop
      if (item.type === 'footer') {
        return null;
      }

      // Don't render items if the section is collapsed
      if (item.section.collapsed) {
        return null;
      }

      return (
        <ScaleDecorator>
          <Item
            item={item.item!}
            drag={isShoppingMode ? undefined : drag}
            index={item.sectionIndex}
            isActive={isActive}
            onPress={() => handleItemPress(item.item!)}
            onDelete={handleDeleteItem}
            isShoppingMode={isShoppingMode}
            onStrikethroughChange={handleStrikethroughChange}
            onNotesChange={handleSaveNote}
          />
          <View
            style={{
              width: '90%',
              height: 1,
              backgroundColor: colors.imageBGColor,
              alignSelf: 'center',
            }}
          />
        </ScaleDecorator>
      );
    },
    [
      handleItemPress,
      toggleSectionCollapse,
      colors,
      styles,
      handleDeleteItem,
      isShoppingMode,
      handleStrikethroughChange,
      handleSaveNote,
    ],
  );

  useEffect(() => {
    if (isShoppingMode == false) {
      handleCancelAllStrikeThrough();
    }
  }, [isShoppingMode]);

  return (
    <GestureHandlerRootView style={[styles.container, { flex: 1 }]}>
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          ref={flatListRef}
          data={flattenedData}
          {...({ renderSectionFooter } as any)}
          onDragEnd={handleDragEnd}
          keyExtractor={(item: any, index: number) => {
            // Use the id property which is guaranteed to be unique
            if (item && typeof item === 'object' && 'id' in item) {
              return item.id;
            }
            // Fallback for edge cases
            return `fallback-${index}-${Date.now()}`;
          }}
          renderItem={renderItem as any}
          showsVerticalScrollIndicator={false}
          dragItemOverflow={true}
          dragHitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
          // Performance optimizations
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={15}
          windowSize={10}
          getItemLayout={undefined}
          maintainVisibleContentPosition={undefined}
          ItemSeparatorComponent={null}
        />
      </View>

      {/* "Let's shop" button - changes based on shopping mode */}
      <View style={[styles.letsShopContainer]}>
        <Pressable
          style={[
            styles.letsShopButton,
            {
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 15,
              paddingHorizontal: 20,
            },
          ]}
          onPress={handleLetsShop}
          disabled={isShoppingMode && selectedItemsCount === 0}
        >
          <Text textStyle='bold16' color={colors.white}>
            {isShoppingMode ? `Done (${selectedItemsCount})` : "Let's shop"}
          </Text>
        </Pressable>
      </View>

      {/* Confirmation Bottom Sheet */}
      <BottomSheet
        visible={showConfirmationSheet}
        onClose={handleCancel}
        heading='Are you sure?'
        subtitle='Uncrossed items will not appear in your history after finalizing your shopping checklist.'
        maxHeight='80%'
      >
        <View style={styles.confirmationContent}>
          {/* List of unselected items */}
          <ScrollView
            style={styles.scrollableList}
            contentContainerStyle={styles.scrollableListContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {unselectedItems.map((item, index) => (
              <View key={item.receiptId || index} style={styles.unselectedItem}>
                <Text textStyle='regular16' color={colors.textPrimary}>
                  {item.productName}
                </Text>
                <Text textStyle='medium14' color={colors.lightGrey}>
                  ${item.subTotal}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.confirmationButtons}>
            <OutlinedButton style={{ width: '45%' }} title='Cancel' onPress={handleCancel} />
            <CustomHighlightButton
              style={{ width: '45%' }}
              title='Finalize'
              onPress={handleFinalize}
            />
          </View>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default ReceiptSectionList;
