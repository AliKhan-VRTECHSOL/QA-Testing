import { Image, StyleSheet, View } from 'react-native';
import { CustomHighlightButton, Text } from '.';
import { useTheme } from '../context/themeContext';
import { ThemeColors } from '../theme/colors';
import { useEffect, useMemo, useState } from 'react';
import { Icons } from '../assets/Icons';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useOverlay } from '../context/OverlayContext';
import { runOnJS } from 'react-native-worklets';

interface ScreenProps {
  isVisible: boolean;
  message?: string;
  onAcknowledge?: () => void;
}

const AnnounceMent: React.FC<ScreenProps> = ({ isVisible, message, onAcknowledge }) => {
  const { setShowAnnouncement, setOnPressAcknowledgeButtonFunction } = useOverlay();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const viewOpacity = useSharedValue(0);
  const [shouldRender, setShouldRender] = useState(isVisible);

  const mainContainerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: viewOpacity.value,
  }));

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      viewOpacity.value = withTiming(1, { duration: 200 });
    } else {
      viewOpacity.value = withTiming(0, { duration: 200 }, finished => {
        if (finished) {
          runOnJS(setShouldRender)(false);
        }
      });
    }

    return () => cancelAnimation(viewOpacity);
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <Animated.View style={[styles.mainContainer, mainContainerAnimatedStyle]}>
      <View style={styles.acknowledgementContentContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIconContainer}>
            <Image source={Icons.Logo} style={styles.logoIcon} />
          </View>
          <Text textStyle='logo38' color={colors.white}>
            Shopomation
          </Text>
        </View>
        <View style={styles.noticeCard}>
          <View style={styles.speakerIconContainer}>
            <Image source={Icons.speaker} style={styles.speakerIcon} />
          </View>
          <Text textStyle='bold18' color={colors.textPrimary}>
            Notice
          </Text>
          <Text center textStyle='medium12' color={colors.textPrimary}>
            {message ||
              'If your receipt is too long to capture in one photo, start from the top and take multiple photos as needed. For now, just upload one image per receipt. After uploading, you can review each transaction and add more images to the same receipt if needed. This keeps everything organized and accurate.'}
          </Text>
        </View>

        <CustomHighlightButton
          style={styles.acknowledgeButton}
          titleColor={colors.primary}
          title='Acknowledge'
          onPress={() => {
            setShowAnnouncement(false);
            if (onAcknowledge) {
              onAcknowledge();
              setOnPressAcknowledgeButtonFunction(() => {});
            }
          }}
        />
      </View>
    </Animated.View>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        mainContainer: StyleSheet.absoluteFillObject,
        acknowledgementContentContainer: {
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          gap: 50,
          backgroundColor: colors.primary,
        },
        logoIconContainer: {
          backgroundColor: colors.white,
          padding: 19,
          borderRadius: 100,
        },
        logoIcon: {
          width: 60,
          height: 60,
        },
        logoContainer: {
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 10,
        },
        noticeCard: {
          backgroundColor: colors.white,
          width: '80%',
          paddingBottom: 30,
          paddingHorizontal: 17,
          gap: 8,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
        },
        speakerIconContainer: {
          backgroundColor: colors.pressedColor,
          paddingHorizontal: 11,
          paddingVertical: 20,
          borderRadius: 18,
          marginTop: -33,
        },
        speakerIcon: {
          width: 26,
          height: 26,
        },
        acknowledgeButton: {
          backgroundColor: colors.white,
          experimental_backgroundImage: '',
          borderRadius: 100,
          width: '80%',
        },
      }),
    [colors],
  );
};

export default AnnounceMent;
