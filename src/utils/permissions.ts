import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestGalleryPermission = async (): Promise<boolean> => {
  let permission;

  if (Platform.OS === 'ios') {
    permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
  } else if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      // Android 13+ (API 33): use READ_MEDIA_IMAGES
      permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
    } else {
      // Below Android 13
      permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    }
  } else {
    return false; // Unsupported platform
  }

  try {
    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      return true;
    }

    const result = await request(permission);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.warn('Permission error:', error);
    return false;
  }
};
