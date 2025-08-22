import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { CustomHighlightButton, DropDownModal, OutlinedButton } from '.';
import { useTheme } from '../context/themeContext';
import { Icons } from '../assets/Icons';
import { ThemeColors } from '../theme/colors';
import BottomSheet from './BottomSheet';

interface ComponentProps {
  selectedStore: string;
  setSelectedStore: Dispatch<SetStateAction<string>>;
  selectedStatus: string;
  setSelectedStatus: Dispatch<SetStateAction<string>>;
}

const storeOptions = ['DoorDash', 'Woolsworths'];

const statusOptions = ['Confirmed', 'Estimated'];

const StoreStatusFilter: React.FC<ComponentProps> = ({
  selectedStatus,
  selectedStore,
  setSelectedStatus,
  setSelectedStore,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [visible, setVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState('');
  const [tempStore, setTempStore] = useState('');

  const handleReset = () => {
    setTempStore('');
    setTempStatus('');
    setSelectedStatus('');
    setSelectedStore('');
    setVisible(false);
  };

  const handleApply = () => {
    setSelectedStatus(tempStatus);
    setSelectedStore(tempStore);
    setVisible(false);
  };

  const handleShowFilterSheet = () => {
    setVisible(true);
    if (selectedStatus == '') {
      setTempStatus('');
    } else {
      setTempStatus(selectedStatus);
    }
    if (selectedStore == '') {
      setTempStore('');
    } else {
      setTempStore(selectedStore);
    }
  };

  return (
    <>
      <Pressable onPress={handleShowFilterSheet} style={styles.moreDownOptions}>
        <Image
          source={selectedStatus != '' || selectedStore != '' ? Icons.filterFilled : Icons.filter}
          style={styles.downIcon}
        />
      </Pressable>
      <BottomSheet visible={visible} onClose={() => setVisible(false)} heading='Filter'>
        <View style={styles.optionsContainer}>
          <DropDownModal
            selectedValue={tempStore}
            setSelectedValue={setTempStore}
            options={storeOptions}
            placeholder='Filter by store'
            smallVariant
          />
          <DropDownModal
            selectedValue={tempStatus}
            setSelectedValue={setTempStatus}
            options={statusOptions}
            placeholder='Status'
            smallVariant
          />
          <View
            style={{
              flexDirection: 'row',
              gap: 16,
            }}
          >
            <View style={styles.buttonContainer}>
              <OutlinedButton smallVariant title='Reset' onPress={handleReset} />
            </View>

            <View style={styles.buttonContainer}>
              <CustomHighlightButton smallVariant title='Apply' onPress={handleApply} />
            </View>
          </View>
        </View>
      </BottomSheet>
    </>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        moreDownOptions: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        downIcon: {
          width: 20,
          height: 20,
          resizeMode: 'contain',
          tintColor: colors.primary,
        },
        optionsContainer: {
          paddingVertical: 8,
          gap: 16,
        },
        optionItem: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.gray5,
        },
        selectedOption: {
          backgroundColor: colors.secondaryOpacity1,
        },
        checkIcon: {
          width: 20,
          height: 20,
          resizeMode: 'contain',
          tintColor: colors.primary,
        },
        buttonContainer: {
          flex: 1,
        },
      }),
    [colors],
  );
};

export default StoreStatusFilter;
