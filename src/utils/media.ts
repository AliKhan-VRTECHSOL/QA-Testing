import ImagePicker from 'react-native-image-crop-picker';
import { pick } from '@react-native-documents/picker';
import { Alert, Platform } from 'react-native';
import { requestGalleryPermission } from './permissions';

const updateImageObject = img => {
  return {
    uri: Platform.select({
      android: img.path.replace('file:///', 'file:/'),
      ios: img.sourceURL,
    }),
    type: img.mime,
    name: Platform.select({
      ios: img.filename,
      android: img.path.split('/').pop(),
    }),
  };
};

export const openImagePicker = async (multiple = false) => {
  try {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Please allow access to your photo library to upload images.',
        [{ text: 'OK', style: 'cancel' }],
      );
      return;
    }
    const images = await ImagePicker.openPicker({
      cropping: true,
      compressImageQuality: 1,
      multiple: multiple,
      includeBase64: false,
      avoidEmptySpaceAroundImage: true,
      mediaType: 'photo',
      forceJpg: true,
      freeStyleCropEnabled: true,
    });

    return multiple ? images?.map(k => updateImageObject(k)) : updateImageObject(images);
  } catch (error: any) {
    if (error.code !== 'E_PICKER_CANCELLED') {
      console.log('Image Picker Error:', error);
      console.log('Error Code:', error.code);
      console.log('Error Message:', error.message);
      Alert.alert('Error', 'Failed to open image picker.');
    }
    return null;
  }
};

export const handleCSVUpload = async (navigation?: any, closeSheet?: () => void) => {
  const hasPermission = await requestGalleryPermission();
  if (!hasPermission) {
    Alert.alert(
      'Permission Required',
      'Please grant storage/gallery permission to upload a CSV file.',
      [{ text: 'OK', style: 'cancel' }],
    );
    return;
  }

  try {
    const [file] = await pick({
      allowMultiSelection: false,
    });

    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Selected CSV file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      uri: file.uri,
    });

        // Simulate CSV processing and navigate to CSV Mapping screen
    if (navigation) {
      // Close bottom sheet first
      if (closeSheet) {
        closeSheet();
      }

      // Set upload channel to CSV
      const { useRecieptStore } = require('../store/receiptStore');
      const { UploadChannel } = require('../store/transactionStore');
      useRecieptStore.getState().setCurrentUploadChannel(UploadChannel.CSV);

      // Navigate to CSV Mapping screen
      navigation.navigate('CommonStack', {
        screen: 'CSVMapping',
        params: {
          csvFile: file,
          fromOnboarding: true,
        },
      });
    }
  } catch (err: any) {
    if (err?.code === 'DOCUMENT_PICKER_CANCELED') {
      console.log('User canceled file picker');
    } else {
      console.log('Error picking CSV file:', err);
    }
  }
};
