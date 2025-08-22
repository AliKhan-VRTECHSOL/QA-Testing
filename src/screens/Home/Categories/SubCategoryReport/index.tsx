import React from 'react';
import { SectionList, View } from 'react-native';

import { Text, CategoryProgressBar, SAScrollView } from '../../../../components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../../context/themeContext';
import Header from '../../../../components/Headers/Header';
import CircularProgressBar from '../../../../components/CircularProgressBar';
import { mockTranscationHistory } from '../../../../constants';
import { Category } from '../../../../constants/categories';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

function calculateSectionTotal(section: any) {
  return section.data.reduce((sum: number, item: any) => sum + item.amount, 0);
}

function calculateTotalAmount(sectionList: any[]) {
  return sectionList.reduce((total: number, section: any) => {
    const sectionSum = section.data.reduce((sum: number, item: any) => sum + item.amount, 0);
    return total + sectionSum;
  }, 0);
}

// Remove dummy data - we'll use the category data from route params

const SubCategoryReport: React.FC<ScreenProps> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { item } = route.params;

  const renderItem = ({ item, index, section }: { item: any; index: number; section: any }) => {
    return (
      <CategoryProgressBar
        title={item.name}
        date={item.date}
        amount={item.amount}
        progress={Math.round((item.amount / calculateSectionTotal(section)) * 100)}
        variant='date'
        onPress={() => {
          navigation.navigate('HistoryOrderStack', {
            screen: 'OrderDetail',
            params: {
              orderData: mockTranscationHistory[0],
            },
          });
        }}
      />
    );
  };

  return (
    <SAScrollView header={<Header title={item.name} variant='titleLeft' />}>
      <SectionList
        sections={item.subcategories}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}
            >
              <Text textStyle='bold16' color={colors.black}>
                {section.title}
              </Text>
              <CircularProgressBar
                totalAmount={calculateSectionTotal(section)}
                progress={calculateSectionTotal(section) / calculateTotalAmount(item.subcategories)}
                size={70}
                strokeWidth={6}
              />
            </View>
          );
        }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: colors.gray5,
              marginVertical: 12,
            }}
          />
        )}
      />
    </SAScrollView>
  );
};

export default SubCategoryReport;
