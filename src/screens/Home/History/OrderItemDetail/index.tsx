import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Image, Platform, Pressable } from 'react-native';

import { LineChart } from 'react-native-chart-kit';

import { SAScrollView, Text } from '../../../../components';
import { useTheme } from '../../../../context/themeContext';
import Header from '../../../../components/Headers/Header';
import { ThemeColors } from '../../../../theme/colors';
import { Icons } from '../../../../assets/Icons';
import { DimensionsData } from '../../../../utils/scaling';
import fonts from '../../../../theme/fonts';
import BottomSheet from '../../../../components/BottomSheet';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const OrderItemDetail: React.FC<ScreenProps> = ({ route, navigation }) => {
  const { orderData, item } = route.params;
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [currentItem, setCurrentItem] = useState(item);

  return (
    <SAScrollView
      nestedScrollEnabled
      contentContainerStyle={styles.contentContainerStyle}
      header={<Header title={`Order ${orderData?.orderId || 'N/A'}`} />}
    >
      <View style={styles.headingContainer}>
        <Text textStyle='bold16' color={colors.screenHeadingColor}>
          Item Detail
        </Text>
        <Pressable
          onPress={() =>
            navigation.navigate('CommonStack', {
              screen: 'AddProducts',
              params: {
                type: 'edit',
                item: currentItem,
                index: null,
                onUpdate: (itemData: any) => {
                  // Update the state with the edited item data
                  setCurrentItem(itemData);
                },
              },
            })
          }
          style={styles.editPenContainer}
        >
          <Image source={Icons.pen} style={styles.editPen} />
        </Pressable>
      </View>
      <View style={styles.FieldsWrapper}>
        <Field heading='Store Name' value={currentItem?.storeBranch} />
        <Field heading='Category' value={currentItem?.category} />
        <Field heading='Product Name' value={currentItem?.productName} />
        <Field heading='Unit Price' value={`$${currentItem?.unitPrice} / ${currentItem.unit}`} />
        <Field heading='Qty' value={currentItem?.quantity} />
        <Field heading='Subtotal' value={currentItem?.subTotal} />
      </View>
      <Text textStyle='bold16' color={colors.screenHeadingColor}>
        Product Price Trend
      </Text>

      <LineChart
        height={250}
        data={{
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'Auguts',
            'September',
            'October',
            'November',
            'December',
          ],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ],
            },
          ],
        }}
        width={DimensionsData.windowWidth * 2}
        transparent
        style={{
          left: -10,
        }}
        segments={4}
        yAxisInterval={2}
        yAxisLabel='$'
        chartConfig={{
          decimalPlaces: 2,
          color: (opacity = 1) => colors.primary,
          labelColor: (opacity = 1) => colors.gray3,
          fillShadowGradientFrom: colors.primary,
          fillShadowGradientFromOpacity: Platform.select({
            android: 0.4,
            ios: 0,
            default: 0,
          }),
          fillShadowGradientTo: colors.white,
          fillShadowGradientToOpacity: 1,
          propsForBackgroundLines: {
            strokeDasharray: null,
            stroke: colors.gray5,
          },
          propsForHorizontalLabels: {
            fill: colors.gray3,
            fontFamily: fonts.family.medium,
            fontSize: 12,
          },
          propsForVerticalLabels: {
            fill: colors.gray3,
            fontFamily: fonts.family.medium,
            fontSize: 12,
          },
        }}
        bezier
        withDots={false}
        withInnerLines={false}
      />
    </SAScrollView>
  );
};

interface FieldProps {
  heading: string;
  value: string;
}

const Field: React.FC<FieldProps> = ({ heading, value }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.field}>
      <Text color={colors.gray3} textStyle='bold12'>
        {heading}
      </Text>
      <Text textStyle='bold16' color={colors.textPrimary}>
        {value}
      </Text>
    </View>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        contentContainerStyle: {
          paddingTop: 24,
        },
        headingContainer: {
          flexDirection: 'row',
          gap: 8,
          alignItems: 'center',
        },
        editPen: {
          width: 12,
          height: 12,
          resizeMode: 'contain',
        },
        FieldsWrapper: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          columnGap: 40,
          rowGap: 32,
          marginTop: 16,
          marginBottom: 32,
        },
        field: {
          gap: 8,
          flex: 1,
          minWidth: (DimensionsData.windowWidth - 32) / 2 - 40,
        },
        editPenContainer: {
          padding: 8,
          borderRadius: 100,
        },
        inputField: {
          flex: undefined,
        },
      }),
    [colors],
  );
};

export default OrderItemDetail;
