import React, { SetStateAction, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { FlatList, Image, Pressable, TextInput, View, StyleSheet, Platform } from 'react-native';
import debounce from 'lodash/debounce';
import { Text } from '.';
import { Icons } from '../assets/Icons';
import { useTheme } from '../context/themeContext';
import fonts from '../theme/fonts';
import { LayoutMetrics } from '../theme/commonLayout';

import { mockLocations } from '../constants';

interface LocationItem {
  id?: string;
  place_id?: string;
  name: string;
  formatted_address?: string;
  address?: string;
}

interface SearchDropdownProps {
  setSelectAddress: SetStateAction<any>;
  selectAddress: string;
  smallVariant?: boolean;
  rightIcon?: number;
  title?: string;
  onAddressSelected?: (address: string) => void;
  useGoogleMaps?: boolean;
}

// Try to get API key from different sources
const getGoogleMapsApiKey = () => {
  // Try environment variable first
  if (process.env.GOOGLE_MAPS_API_KEY) {
    return process.env.GOOGLE_MAPS_API_KEY;
  }

  // For iOS, try to get from Info.plist (this would need native module)
  // For now, we'll use a hardcoded key for development
  if (Platform.OS === 'ios') {
    return 'AIzaSyCGGFZrbvJ3_fW3gMDYIr49Y-pw8FKhxHo'; // From Info.plist
  }

  return null;
};

const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKey();

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  setSelectAddress,
  selectAddress,
  smallVariant = false,
  rightIcon,
  title,
  onAddressSelected,
  useGoogleMaps = false,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors, smallVariant);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleMapsSearch = useCallback(async (query: string) => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not found');
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔍 Searching Google Maps for:', query);
      console.log('🔑 Using API key:', GOOGLE_MAPS_API_KEY.substring(0, 10) + '...');

      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query,
      )}&key=${GOOGLE_MAPS_API_KEY}`;

      console.log('🌐 Request URL:', url);

      const response = await fetch(url);
      const json = await response.json();

      console.log('📡 Google Maps response status:', json.status);
      console.log('📡 Google Maps response:', json);

      if (json.status === 'OK') {
        console.log('✅ Found', json.results?.length || 0, 'results');
        setSearchResults(json.results || []);
      } else {
        console.error('❌ Google Maps API error:', json.status, json.error_message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('❌ Google Maps search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMockSearch = useCallback((query: string) => {
    const filtered = mockLocations.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase()),
    );
    setSearchResults(filtered);
  }, []);

  const debouncedSearchRef = useRef(
    debounce((query: string) => {
      if (useGoogleMaps) {
        handleGoogleMapsSearch(query);
      } else {
        handleMockSearch(query);
      }
    }, 300),
  ).current;

  useEffect(() => {
    if (search.trim()) {
      debouncedSearchRef(search);
    } else {
      if (useGoogleMaps) {
        setSearchResults([]);
      } else {
        setSearchResults(mockLocations);
      }
    }
    return () => {
      debouncedSearchRef.cancel();
    };
  }, [search, useGoogleMaps, debouncedSearchRef]);

  const renderItem = useCallback(
    ({ item }: { item: LocationItem }) => (
      <Pressable
        onPress={() => {
          const address = item.formatted_address || item.address || item.name;
          setSelectAddress(address);
          onAddressSelected?.(address);
        }}
        style={styles.itemContainer}
      >
        <Text numberOfLines={1} textStyle='bold12' color={colors.searchResultText}>
          {item.name}
        </Text>
        <Text numberOfLines={1} textStyle='bold16' color={colors.searchResultText}>
          {item.formatted_address || item.address || item.name}
        </Text>
      </Pressable>
    ),
    [colors.searchResultText, setSelectAddress, onAddressSelected],
  );

  const listEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Image source={Icons.Search} tintColor={colors.black} style={styles.icon} />
        <Text textStyle='bold12' color={colors.textPrimary}>
          {isLoading ? 'Searching...' : 'No result found'}
        </Text>
      </View>
    ),
    [colors, isLoading],
  );

  const handleClear = useCallback(() => {
    setSelectAddress('');
    setSearch('');
  }, [setSelectAddress]);

  // Show selected address if one is selected
  if (selectAddress && selectAddress.length > 0) {
    return (
      <View style={styles.container}>
        {title && (
          <Text textStyle='medium14' color={colors.textPrimary}>
            {title}
          </Text>
        )}
        <View style={styles.selectedContainer}>
          <Text numberOfLines={1} textStyle='medium16' color={colors.black} style={styles.flexOne}>
            {selectAddress}
          </Text>
          <Pressable onPress={handleClear}>
            <Image source={Icons.CloseCircle} style={styles.closeIcon} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && (
        <Text textStyle='medium14' color={colors.textPrimary}>
          {title}
        </Text>
      )}
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder={useGoogleMaps ? 'Type to search location' : 'Address or city'}
            placeholderTextColor={colors.lightGrey}
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
          {rightIcon && <Image source={rightIcon} style={styles.rightIcon} />}
        </View>
        {search.length > 0 && (
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.place_id || item.id || index.toString()}
            keyboardShouldPersistTaps='handled'
            ListEmptyComponent={listEmptyComponent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={styles.list}
          />
        )}
      </View>
      {!smallVariant && search.length == 0 && (
        <Text textStyle='medium14' color={colors.lightGrey}>
          {useGoogleMaps ? 'Search for real locations' : 'Select from dropdown'}
        </Text>
      )}
    </View>
  );
};

const useStyles = (colors: any, smallVariant: boolean) =>
  useMemo(
    () =>
      StyleSheet.create({
        mainContainer: { gap: 12, width: '100%' },
        container: {
          width: '100%',
          gap: 10,
        },
        searchContainer: {
          borderRadius: smallVariant ? 24 : LayoutMetrics.input.borderRadius,
          borderWidth: 1,
          borderColor: colors.lightGrey,
          overflow: 'hidden',
          width: '100%',
        },
        inputWrapper: {
          flexDirection: 'row',
          height: smallVariant
            ? LayoutMetrics.input.heightSmall
            : LayoutMetrics.input.heightDefault,
          alignItems: 'center',
          paddingHorizontal: LayoutMetrics.padding.horizontal,
        },
        input: {
          flex: 1,
          color: colors.black,
          fontFamily: fonts.family.medium,
          fontSize: 16,
        },
        rightIcon: {
          width: smallVariant ? 16 : 24,
          height: smallVariant ? 16 : 24,
          marginLeft: 10,
          resizeMode: 'contain',
        },
        list: {
          maxHeight: 250,
          borderTopWidth: 1,
          borderColor: colors.lightGrey,
        },
        itemContainer: {
          padding: LayoutMetrics.padding.horizontal,
          gap: 10,
        },
        separator: {
          height: 1,
          backgroundColor: colors.lightGrey,
        },
        emptyContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          paddingVertical: 10,
        },
        icon: {
          width: 18,
          height: 18,
          resizeMode: 'contain',
        },
        selectedContainer: {
          borderRadius: smallVariant ? 24 : LayoutMetrics.input.borderRadius,
          borderWidth: 1,
          borderColor: colors.lightGrey,
          minHeight: smallVariant
            ? LayoutMetrics.input.heightSmall
            : LayoutMetrics.input.heightDefault,
          paddingHorizontal: LayoutMetrics.padding.horizontal,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        closeIcon: {
          width: 16,
          height: 16,
          resizeMode: 'contain',
        },
        flexOne: {
          flex: 1,
        },
      }),
    [colors, smallVariant],
  );

export default SearchDropdown;
