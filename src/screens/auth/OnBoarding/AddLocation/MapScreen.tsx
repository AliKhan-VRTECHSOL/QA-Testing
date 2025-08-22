import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { useTheme } from '../../../../context/themeContext';

const MapScreen = () => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
    >
      <MapView
        provider={'google'}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      />
    </View>
  );
};

export default MapScreen;
