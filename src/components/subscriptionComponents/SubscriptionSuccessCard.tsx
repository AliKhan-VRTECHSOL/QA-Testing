import React, { useMemo } from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { OutlinedButton, Text } from '..';
import { Icons } from '../../assets/Icons';
import { ThemeColors } from '../../theme/colors';
import { progressBarWidth } from '../../screens/auth/Subscription/constants';
import { useTheme } from '../../context/themeContext';

interface SubscriptionSuccessCardProps {
  onPressGotoDashboard: () => void;
}

const SubscriptionSuccessCard: React.FC<SubscriptionSuccessCardProps> = ({
  onPressGotoDashboard,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const numberOfDots = Math.round(progressBarWidth / 30);

  return (
    <>
      <View style={styles.container}>
        {/* Floating Check Icon */}
        <View style={styles.floatingIconWrapper}>
          <View style={styles.innerIcon}>
            <Image source={Icons.Check} style={styles.checkIcon} />
          </View>
        </View>

        {/* Success Messages */}
        <View style={styles.centeredTextGroup}>
          <Text center color={colors.white} textStyle='black20'>
            You're Subscribed!
          </Text>
          <Text textStyle='medium14' color={colors.white} center>
            Your payment has been successfully done.
          </Text>
        </View>

        <Text textStyle='medium14' color={colors.white} center>
          Your subscription{' '}
          <Text textStyle='bold14' color={colors.white}>
            6 Months
          </Text>{' '}
          plan is now active, and you have full access to all premium features.
        </Text>

        <View style={styles.divider} />

        {/* Total Payment */}
        <View style={styles.centeredTextGroup}>
          <Text center textStyle='medium14' color={colors.white}>
            Total Payment
          </Text>
          <Text textStyle='bold22' color={colors.white} center>
            $55
          </Text>
        </View>

        {/* Ref Numbers */}
        <View style={styles.refNumberContainer}>
          {[1, 2].map((_, i) => (
            <View style={styles.refBox} key={i}>
              <Text textStyle='medium12' color={colors.white}>
                Ref Number
              </Text>
              <Text textStyle='bold12' color={colors.white}>
                000085752257
              </Text>
            </View>
          ))}
        </View>

        {/* Download Button */}
        <Pressable style={styles.downloadButton}>
          <Image source={Icons.download} style={styles.downloadIcon} />
          <Text textStyle='bold14' color={colors.white}>
            Get PDF Receipt
          </Text>
        </Pressable>

        {/* Bottom Dots */}
        <View style={styles.bottomDotsContainer}>
          {Array.from({ length: numberOfDots }).map((_, idx) => (
            <View key={idx} style={styles.dot} />
          ))}
        </View>
      </View>
      <OutlinedButton title='Go to Dashboard' onPress={onPressGotoDashboard} />
    </>
  );
};

export default SubscriptionSuccessCard;

const getStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: progressBarWidth,
          padding: 16,
          paddingTop: 40,
          backgroundColor: colors.primary,
          alignSelf: 'center',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginTop: 25,
          gap: 22,
        },
        floatingIconWrapper: {
          position: 'absolute',
          top: -25,
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: colors.primary,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        },
        innerIcon: {
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: colors.success,
          alignItems: 'center',
          justifyContent: 'center',
        },
        checkIcon: {
          width: 16,
          height: 16,
          tintColor: colors.white,
          resizeMode: 'contain',
        },
        centeredTextGroup: {
          gap: 4,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          width: '100%',
          backgroundColor: colors.white,
        },
        refNumberContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 12,
        },
        refBox: {
          padding: 10,
          borderWidth: 1,
          borderColor: colors.white,
          borderRadius: 6,
          gap: 4,
          flex: 1,
        },
        downloadButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          paddingHorizontal: 10,
          paddingVertical: 5,
        },
        downloadIcon: {
          width: 24,
          height: 24,
          resizeMode: 'contain',
          marginRight: 4,
        },
        bottomDotsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          position: 'absolute',
          width: progressBarWidth,
          bottom: -10,
          alignSelf: 'center',
        },
        dot: {
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: 'white',
        },
      }),
    [colors],
  );
};
