import React, { useState } from 'react';
import { View, Switch } from 'react-native';
import { SAScrollView, Text } from '../../../../components';
import { useTheme } from '../../../../context/themeContext';
import { useStyles } from './styles';

const Notifications: React.FC = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);

  return (
    <SAScrollView removeSafeAreaInsets>
      <View style={styles.mainContainer}>
        <Text textStyle='bold20' color={colors.textPrimary}>
          Email Notifications
        </Text>
        <View style={styles.notificationContainer}>
          <View>
            <Text textStyle='medium16' color={colors.textPrimary}>
              Enable Email Notifications
            </Text>
            <Text textStyle='regular14' color={colors.textPrimary}>
              Turn on or off all email notifications
            </Text>
          </View>
          <Switch
            value={emailNotifications}
            onValueChange={() => setEmailNotifications(!emailNotifications)}
            trackColor={{ false: colors.gray5, true: colors.primaryLowOpacity }}
          />
        </View>
        <View style={styles.notificationContainer}>
          <View>
            <Text textStyle='medium16' color={colors.textPrimary}>
              Reminders
            </Text>
            <Text textStyle='regular14' color={colors.textPrimary}>
              Turn on or off all reminders
            </Text>
          </View>
          <Switch
            value={reminders}
            onValueChange={() => setReminders(!reminders)}
            trackColor={{ false: colors.gray5, true: colors.primaryLowOpacity }}
          />
        </View>
      </View>
    </SAScrollView>
  );
};

export default Notifications;
