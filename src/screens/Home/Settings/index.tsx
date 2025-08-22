import React from 'react';
import { OutlinedButton, SAScrollView, Text } from '../../../components';
import { Image, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '../../../context/themeContext';
import { Images } from '../../../assets/images';
import { Icons } from '../../../assets/Icons';
import { useStyles } from './styles';
import { useOverlay } from '../../../context/OverlayContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProfileStatusStore } from '../../../store/profileStatusStore';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const Settings: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { setLoggedOut } = useProfileStatusStore();
  const { setFadeInViewVisible, setFadeInViewContent, setFadeInViewStyle } = useOverlay();

  // TODO: API Integration Required
  // Call: GET /user/me
  // Send: No data required
  // Expect: { user: { id: string, firstName: string, lastName: string, email: string, phone: string, image?: string } }
  // Handle: Update user profile data in store, display user info

  const handleHideAlert = () => {
    setFadeInViewVisible(false);
    setFadeInViewContent(null);
  };

  const DeleteAccountModel = () => (
    <>
      <TouchableWithoutFeedback onPress={handleHideAlert}>
        <View style={StyleSheet.absoluteFillObject} />
      </TouchableWithoutFeedback>
      <View style={styles.alertContainer}>
        <Pressable onPress={handleHideAlert} style={styles.alertCloseButton}>
          <Image source={Icons.cross} style={styles.alertCloseIcon} />
        </Pressable>
        <Text center textStyle='bold24' color={colors.textPrimary}>
          Delete Your Account?
        </Text>
        <Text center textStyle='medium16' color={colors.lightGrey}>
          Are you sure you want to delete your account? This action is permanent and cannot be
          undone. All your data will be lost.
        </Text>
        <OutlinedButton
          onPress={() => {
            setFadeInViewVisible(false);
            navigation.replace('AuthStack');
            setFadeInViewContent(null);
          }}
          title='Delete Account'
          tagColor={colors.red}
          smallVariant
          style={{
            backgroundColor: colors.red,
            experimental_backgroundImage: '',
            width: 200,
            alignSelf: 'center',
          }}
        />
      </View>
    </>
  );

  return (
    <SAScrollView removeSafeAreaInsets>
      <View style={styles.mainContainer}>
        <View style={styles.avatarOuter}>
          <View style={styles.avatarInner}>
            <Image source={Images.avatar} style={styles.avatarImage} />
          </View>
        </View>
        <Text textStyle='bold20' color={colors.textPrimary}>
          {'John Doe'}
        </Text>
        <Text textStyle='black16' color={colors.lightGrey}>
          {'john.doe@example.com'}
        </Text>

        <View style={{ gap: 10, marginTop: 30 }}>
          <Pressable
            style={styles.profilePressable}
            onPress={() => navigation.navigate('SettingStack', { screen: 'EditProfile' })}
          >
            <View style={styles.profileRow}>
              <Image source={Icons.user} style={styles.iconUser} />
              <Text style={styles.buttonText} textStyle='black16' color={colors.textPrimary}>
                Edit Profile Information
              </Text>
            </View>
            <Image
              source={Icons.arrowRight}
              style={[styles.iconArrow, { tintColor: colors.lightGrey }]}
            />
          </Pressable>
          <Pressable
            style={styles.profilePressable}
            onPress={() =>
              navigation.navigate('SettingStack', {
                screen: 'ManageSubscription',
              })
            }
          >
            <View style={styles.profileRow}>
              <Image source={Icons.notification} style={styles.iconUser} />
              <Text style={styles.buttonText} textStyle='black16' color={colors.textPrimary}>
                Manage Subscription
              </Text>
            </View>
            <Image
              source={Icons.arrowRight}
              style={[styles.iconArrow, { tintColor: colors.lightGrey }]}
            />
          </Pressable>
          <Pressable
            style={styles.profilePressable}
            onPress={() => navigation.navigate('SettingStack', { screen: 'Notifications' })}
          >
            <View style={styles.profileRow}>
              <Image source={Icons.notification} style={styles.iconUser} />
              <Text style={styles.buttonText} textStyle='black16' color={colors.textPrimary}>
                Notification
              </Text>
            </View>
            <Image
              source={Icons.arrowRight}
              style={[styles.iconArrow, { tintColor: colors.lightGrey }]}
            />
          </Pressable>
          <Pressable
            style={styles.profilePressable}
            onPress={() => navigation.navigate('SettingStack', { screen: 'ChangePassword' })}
          >
            <View style={styles.profileRow}>
              <Image source={Icons.clock} style={styles.iconUser} />
              <Text style={styles.buttonText} textStyle='black16' color={colors.textPrimary}>
                Change Password
              </Text>
            </View>
            <Image
              source={Icons.arrowRight}
              style={[styles.iconArrow, { tintColor: colors.lightGrey }]}
            />
          </Pressable>
          <Pressable
            style={styles.profilePressable}
            onPress={() =>
              navigation.navigate('SettingStack', {
                screen: 'EditErrandDay',
              })
            }
          >
            <View style={styles.profileRow}>
              <Image source={Icons.calendar} style={styles.iconUser} />
              <Text style={styles.buttonText} textStyle='black16' color={colors.textPrimary}>
                Edit Errand Day
              </Text>
            </View>
            <Image
              source={Icons.arrowRight}
              style={[styles.iconArrow, { tintColor: colors.lightGrey }]}
            />
          </Pressable>
          <Pressable
            style={styles.profilePressable}
            onPress={() =>
              navigation.navigate('SettingStack', {
                screen: 'ShoppingPreferences',
              })
            }
          >
            <View style={styles.profileRow}>
              <Image source={Icons.cart} style={styles.iconUser} />
              <Text style={styles.buttonText} textStyle='black16' color={colors.textPrimary}>
                Add/Edit Shopping Preferences
              </Text>
            </View>
            <Image
              source={Icons.arrowRight}
              style={[styles.iconArrow, { tintColor: colors.lightGrey }]}
            />
          </Pressable>
          <Pressable
            style={styles.profilePressable}
            onPress={() => navigation.navigate('SettingStack', { screen: 'PrivacyPolicy' })}
          >
            <View style={styles.profileRow}>
              <Image source={Icons.privacyPolicy} style={styles.iconUser} />
              <Text
                numberOfLines={1}
                textStyle='black16'
                color={colors.textPrimary}
                style={styles.buttonText}
              >
                Terms & Conditions and Privacy Policy
              </Text>
            </View>
            <Image
              source={Icons.arrowRight}
              style={[styles.iconArrow, { tintColor: colors.lightGrey }]}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              // TODO: API Integration Required
              // Call: DELETE /settings/account
              // Send: No data required
              // Expect: { success: boolean, message: string }
              // Handle: Show delete confirmation modal, navigate to AuthStack on success

              setFadeInViewStyle({
                backgroundColor: 'rgba(0,0,0,0.5)',
              });
              setFadeInViewContent(<DeleteAccountModel />);
              setFadeInViewVisible(true);
            }}
            style={styles.profilePressable}
          >
            <View style={styles.profileRow}>
              <Image source={Icons.trash} style={[styles.iconUser, { tintColor: colors.error }]} />
              <Text style={styles.buttonText} textStyle='medium16' color={colors.error}>
                Delete Account
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              // TODO: API Integration Required
              // Call: POST /settings/logout
              // Send: No data required
              // Expect: { success: boolean, message: string }
              // Handle: Clear local storage, navigate to AuthStack on success

              setLoggedOut();
              navigation.replace('AuthStack');
            }}
            style={styles.profilePressable}
          >
            <View style={styles.profileRow}>
              <Image source={Icons.logout} style={[styles.iconUser, { tintColor: colors.error }]} />
              <Text style={styles.buttonText} textStyle='medium16' color={colors.error}>
                Log Out
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SAScrollView>
  );
};

export default Settings;
