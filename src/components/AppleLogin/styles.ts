import { StyleSheet } from 'react-native';
import { DimensionsData } from '../../utils/scaling';

const styles = StyleSheet.create({
  buttonContainerStyle: {
    width: DimensionsData.windowWidth - 32,
    height: 50,
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: 18,
    fontWeight: '600',
  },
  logoStyle: {
    alignSelf: 'center',
    width: 16,
    height: 16,
    marginRight: 7,
    resizeMode: 'contain',
  },
});

export default styles;
