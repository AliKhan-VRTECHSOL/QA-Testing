import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { SAScrollView, CustomHighlightButton, DropDownModal, Text } from '../../../../components';
import Header from '../../../../components/Headers/Header';
import { useTheme } from '../../../../context/themeContext';
import { useStyles } from './styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRecieptStore } from '../../../../store/receiptStore';
import { UploadChannel } from '../../../../store/transactionStore';
import { generateRandomReceipt } from '../../../../utils/utils';
import CalendarStrip from '../../../../components/CalendarStrip';



interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route?: any;
}

interface ColumnMapping {
  shopomationField: string;
  csvField: string;
}

const CSVMapping: React.FC<ScreenProps> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shopomationMappings, setShopomationMappings] = useState<string[]>([
    'Store Branch', 'Category', 'Product', 'Unit Price'
  ]);
  const [csvMappings, setCsvMappings] = useState<string[]>([
    'Store', 'Category', 'Name', 'Price'
  ]);

  const shopomationOptions = ['Store Branch', 'Category', 'Product', 'Unit Price'];
  const csvOptions = ['Store', 'Category', 'Name', 'Price'];



  const handleSaveAndNext = async () => {
    // Set upload channel to CSV
    useRecieptStore.getState().setCurrentUploadChannel(UploadChannel.CSV);

    // Simulate CSV processing - generate multiple receipts
    const numberOfReceipts = Math.floor(Math.random() * 5) + 3; // 3-7 receipts

    for (let i = 0; i < numberOfReceipts; i++) {
      const receipts = generateRandomReceipt(i).map(receipt => ({
        ...receipt,
        receiptId: `csv_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      }));
      useRecieptStore.getState().addToQueue(receipts);
    }

    // Navigate to Receipt screen
    navigation.navigate('CommonStack', {
      screen: 'Reciept',
      params: {
        type: 'add',
        fromOnboarding: route?.params?.fromOnboarding !== false,
      },
    });
  };



  return (
    <SAScrollView
      contentContainerStyle={styles.contentContainerStyle}
      header={<Header title="CSV Mapping" variant="titleLeft" />}
    >
      <View style={styles.container}>
        <Text style={styles.title} textStyle="bold24" color={colors.black}>
          Map the columns
        </Text>
        <Text style={styles.subtitle} textStyle="regular14" color={colors.gray3}>
          Let's get these uploaded.
        </Text>

        <CalendarStrip onDateSelected={setSelectedDate} style={styles.calendar} />

        <View style={styles.mappingContainer}>
          <View style={styles.columnContainer}>
            <Text style={styles.columnTitle} textStyle="bold16" color={colors.black}>
              Shopomation's Fields
            </Text>
            {shopomationMappings.map((field, index) => (
              <View key={index} style={styles.fieldContainer}>
                <DropDownModal
                  selectedValue={field}
                  setSelectedValue={(value) => {
                    const newMappings = [...shopomationMappings];
                    newMappings[index] = value;
                    setShopomationMappings(newMappings);
                  }}
                  options={shopomationOptions}
                  placeholder="Select field"
                />
              </View>
            ))}
          </View>

          <View style={styles.columnContainer}>
            <Text style={styles.columnTitle} textStyle="bold16" color={colors.black}>
              Uploaded CSV
            </Text>
            {csvMappings.map((field, index) => (
              <View key={index} style={styles.fieldContainer}>
                <DropDownModal
                  selectedValue={field}
                  setSelectedValue={(value) => {
                    const newMappings = [...csvMappings];
                    newMappings[index] = value;
                    setCsvMappings(newMappings);
                  }}
                  options={csvOptions}
                  placeholder="Select field"
                />
              </View>
            ))}
          </View>
        </View>

        <CustomHighlightButton
          title="Save and next"
          style={styles.saveButton}
          onPress={handleSaveAndNext}
        />
      </View>
    </SAScrollView>
  );
};

export default CSVMapping;
