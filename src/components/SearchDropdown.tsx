import React, {
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  TextInput,
  View,
  StyleSheet,
} from 'react-native';
import debounce from 'lodash/debounce';
import { Text } from '.';
import { Icons } from '../assets/Icons';
import { useTheme } from '../context/themeContext';
import fonts from '../theme/fonts';
import { CommonLayoutStyles } from '../theme/commonLayout';

interface SearchDropdownProps {
  setSelectAddress: SetStateAction<any>;
  selectAddress: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  setSelectAddress,
  selectAddress,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query: string) => {
    try {
      const result = await fetch(
        `https://dummyjson.com/products/search?q=${query}`,
      );
      const response = await result.json();
      setSearchResults(response?.products || []);
    } catch (error) {
      console.log('Search error:', error);
    }
  };

  const debouncedSearchRef = useRef(
    debounce((query: string) => {
      handleSearch(query);
    }, 500),
  ).current;

  useEffect(() => {
    if (search.trim()) {
      debouncedSearchRef(search);
    } else {
      setSearchResults([]);
    }

    return () => {
      debouncedSearchRef.cancel();
    };
  }, [search]);

  const renderItem = ({ item }: any) => (
    <Pressable
      onPress={() => setSelectAddress(item.title)}
      style={styles.itemContainer}
    >
      <Text
        numberOfLines={1}
        textStyle="bold12"
        color={colors.searchResultText}
      >
        {item?.title}
      </Text>
      <Text
        numberOfLines={1}
        textStyle="bold16"
        color={colors.searchResultText}
      >
        {item?.description}
      </Text>
    </Pressable>
  );

  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={Icons.Search}
        tintColor={colors.black}
        style={styles.icon}
      />
      <Text textStyle="bold12" color={colors.textPrimary}>
        No result found
      </Text>
    </View>
  );

  if (selectAddress.length > 0) {
    return (
      <View
        style={{
          borderRadius: 24,
          borderWidth: 1,
          width: '100%',
          minHeight: 56,
          overflow: 'hidden',
          borderColor: colors.lightGrey,
          justifyContent: 'space-between',
          paddingHorizontal: CommonLayoutStyles.paddingHorizontal,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
          }}
          textStyle="medium16"
          color={colors.black}
        >
          {selectAddress}
        </Text>
        <Pressable
          onPress={() => {
            setSelectAddress('');
            setSearch('');
          }}
        >
          <Image
            source={Icons.CloseCircle}
            style={{
              width: 16,
              height: 16,
              resizeMode: 'contain',
            }}
          />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder={'Address or city'}
          placeholderTextColor={colors.lightGrey}
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
        {search.length > 0 && (
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={listEmptyComponent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={styles.list}
          />
        )}
      </View>
      <Text textStyle="medium14" color={colors.lightGrey}>
        Select from dropdown
      </Text>
    </View>
  );
};

const useStyles = (colors: any) => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: '100%',
          gap: 10,
        },
        searchContainer: {
          borderRadius: 24,
          borderWidth: 1,
          borderColor: colors.lightGrey,
          overflow: 'hidden',
          width: '100%',
        },
        input: {
          height: 56,
          paddingHorizontal: CommonLayoutStyles.paddingHorizontal,
          color: colors.black,
          fontFamily: fonts.family.medium,
          fontSize: 16,
        },
        list: {
          maxHeight: 250,
          borderTopWidth: 1,
          borderColor: colors.lightGrey,
        },
        itemContainer: {
          padding: CommonLayoutStyles.paddingHorizontal,
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
      }),
    [colors],
  );
};

export default SearchDropdown;
