import { StyleSheet } from 'react-native';
import { Colors } from '../../../../theme/colors';

export const useStyles = (colors: Colors) => {
  return StyleSheet.create({
    contentContainerStyle: {
      paddingTop: 20,
      paddingBottom: 100,
    },
    descriptionText: {
      textAlign: 'center',
      lineHeight: 18,
    },
    uploadLaterButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.gray3,
    },
  });
};
