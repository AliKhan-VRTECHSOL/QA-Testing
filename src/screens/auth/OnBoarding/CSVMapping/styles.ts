import { StyleSheet } from 'react-native';
import { Colors } from '../../../../theme/colors';

export const useStyles = (colors: Colors) => {
  return StyleSheet.create({
    contentContainerStyle: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 100,
    },
    container: {
      flex: 1,
    },
    title: {
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: 30,
    },
    calendar: {
      marginBottom: 30,
    },
    mappingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 40,
      gap: 20,
    },
    columnContainer: {
      flex: 1,
    },
    columnTitle: {
      marginBottom: 20,
      textAlign: 'center',
    },
    fieldContainer: {
      marginBottom: 15,
    },
    saveButton: {
      marginTop: 20,
    },
  });
};
