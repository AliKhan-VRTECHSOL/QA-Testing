import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PieChart } from 'react-native-chart-kit';

import { useTheme } from '../../../context/themeContext';
import { DateRangeFilter, SAScrollView, Text, CategoryProgressBar } from '../../../components';
import Header from '../../../components/Headers/Header';
import { DimensionsData } from '../../../utils/scaling';
import fonts from '../../../theme/fonts';
import { assignOpacityColors } from '../../../utils/assignOpacityColors';
import { categoriesData } from '../../../constants/categories';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

// TODO: API Integration Required
// Call: GET /home/categories
// Send: { dateRange?: string, filters?: object }
// Expect: { categories: Category[], totalSpending: number }
// Handle: Update categories data and total spending

const data = categoriesData.map(category => ({
  name: category.name,
  expense: category.expense,
  id: category.id,
}));

const Categories: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedDateUpper, setSelectedDateUpper] = useState('');
  const [selectedDateLower, setSelectedDateLower] = useState('');
  const [totalSpendings, setTotalSpendings] = useState(0);

  const legendHeadingStyle = {
    legendFontSize: 12,
    legendFontColor: colors.textPrimary,
    legendFontFamily: fonts.family.bold,
  };

  const legendSubTitleStyle = {
    legendFontSize: 12,
    legendFontColor: colors.textPrimary,
    legendFontFamily: fonts.family.regular,
  };

  const dataFormatting = assignOpacityColors(data, colors.primary).map(k => {
    const name = k.name;
    const expenseText = `$${k.expense}-`;
    const customLegend = {
      name: name,
      expenseText: expenseText,
    };

    return {
      ...k,
      customLegend,
    };
  });

  return (
    <SAScrollView
      header={<Header title={'Top categories'} variant='titleLeft' />}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.section}>
        <Text textStyle='bold16' color={colors.textPrimary}>
          Product Category Report
        </Text>
        <DateRangeFilter
          selectedValue={selectedDateUpper}
          setSelectedValue={setSelectedDateUpper}
        />
      </View>
      <View style={styles.chartContainer}>
        <PieChart
          data={dataFormatting}
          width={DimensionsData.windowWidth}
          height={200}
          onSlicePress={(item, index, sliceData) => {
            const category = categoriesData.find(cat => cat.name === item.name);
            if (category) {
              navigation.navigate('SubCategoryReport', {
                item: category,
              });
            }
          }}
          chartConfig={{
            color: opacity => 'red',
            centerRender: (total: number) => {
              setTotalSpendings(total);
              return (
                <>
                  <Text textStyle='bold24'>${total}</Text>
                  <Text textStyle='regular10' color={colors.lightGrey}>
                    Total Spendings
                  </Text>
                </>
              );
            },
            customLegendStyle: {
              name: legendHeadingStyle,
              expenseText: legendSubTitleStyle,
            },
          }}
          accessor={'expense'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          style={styles.pieChart}
        />
      </View>
      <View style={styles.section}>
        <Text textStyle='bold16' color={colors.textPrimary}>
          Product Category Report
        </Text>
        <DateRangeFilter
          selectedValue={selectedDateLower}
          setSelectedValue={setSelectedDateLower}
        />
      </View>
      <View style={styles.progressBarsContainer}>
        {data.map(k => (
          <CategoryProgressBar
            key={k.name}
            onPress={() => {
              const category = categoriesData.find(cat => cat.name === k.name);
              if (category) {
                navigation.navigate('SubCategoryReport', {
                  item: category,
                });
              }
            }}
            title={k.name}
            amount={k.expense}
            progress={Math.round((k.expense / totalSpendings) * 100)}
          />
        ))}
      </View>
    </SAScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 40,
    gap: 16,
  },
  section: {
    gap: 6,
  },
  chartContainer: {
    height: 250,
    justifyContent: 'center',
  },
  pieChart: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  progressBarsContainer: {
    gap: 12,
  },
});

export default Categories;
