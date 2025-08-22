import React, { useEffect } from 'react';
import { CustomHighlightButton, SAScrollView, Text } from '../../../../components';
import { useTheme } from '../../../../context/themeContext';
import { useStyles } from './styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UploadReceipt from '../../../../components/Forms/UploadReceiptList';
import { useProfileStatusStore, ProfileStatus } from '../../../../store/profileStatusStore';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route?: any;
}

const ScanPurchase: React.FC<ScreenProps> = ({ navigation, route }) => {
  const { setProfileStatus } = useProfileStatusStore();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  console.log('ScanPurchase - route params:', route?.params);
  console.log('ScanPurchase - mode:', route?.params?.mode);
  console.log('ScanPurchase - fromOnboarding:', route?.params?.fromOnboarding);

  const handleUploadLater = () => {
    navigation.navigate('Subscription');
  };

  useEffect(() => {
    setProfileStatus(ProfileStatus.TRANSACTIONS_UPLOADING);
  }, []);

  return (
    <SAScrollView removeSafeAreaInsets contentContainerStyle={styles.contentContainerStyle}>
      <Text style={styles.descriptionText} textStyle='black12' color={colors.gray3}>
        Let us know what you bought before so we can predict what you will need later!
      </Text>
      <UploadReceipt
        navigation={navigation}
        mode={route?.params?.mode || 'new'}
        fromOnboarding={route?.params?.fromOnboarding !== false}
      />
      <CustomHighlightButton
        titleColor={colors.black}
        title='Upload Later'
        onPress={handleUploadLater}
        style={styles.uploadLaterButton}
      />
    </SAScrollView>
  );
};

export default ScanPurchase;
