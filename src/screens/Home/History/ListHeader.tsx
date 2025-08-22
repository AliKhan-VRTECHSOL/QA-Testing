import { View } from 'react-native';
import { useTheme } from '../../../context/themeContext';
import useStyles from './styles';
import { DateRangeFilter, Text, TopNavBar, StoreStatusFilter } from '../../../components';
import { useEffect } from 'react';

const orderTypes = ['All', 'Estimated', 'Confirmed'];

interface ListHeaderComponentProps {
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedStore: string;
  setSelectedStore: (value: string) => void;
  statistics: {
    totalOrders: number;
    totalAmount: number;
    estimatedOrders: number;
    confirmedOrders: number;
  };
  selectedDateRange: string;
  setSelectedDateRange: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
}

const ListHeaderComponent: React.FC<ListHeaderComponentProps> = ({
  selectedStatus,
  setSelectedStatus,
  selectedStore,
  setSelectedStore,
  statistics,
  selectedDateRange,
  setSelectedDateRange,
  selectedType,
  setSelectedType,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  useEffect(() => {
    if (selectedStatus.length !== 0) {
      setSelectedType(selectedStatus);
    }
  }, [selectedStatus]);

  return (
    <View style={styles.listHeader}>
      <View style={styles.rowSpaced}>
        <Text textStyle='bold20' color={colors.textPrimary}>
          Your Orders
        </Text>
        <StoreStatusFilter
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
        />
      </View>
      <View style={styles.rowSpaced}>
        <Text textStyle='regular14' color={colors.textPrimary}>
          {statistics.totalOrders} orders
        </Text>
        <DateRangeFilter
          selectedValue={selectedDateRange}
          setSelectedValue={setSelectedDateRange}
        />
      </View>
      <TopNavBar navTitles={orderTypes} selected={selectedType} setSelected={setSelectedType} />
    </View>
  );
};

export default ListHeaderComponent;
