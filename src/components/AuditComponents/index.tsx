import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CustomHighlightButton, OutlinedButton } from '..';
import BottomSheet from '../BottomSheet';
import CustomCarousel from '../CustomCarousel';
import { DimensionsData } from '../../utils/scaling';
import { Icons } from '../../assets/Icons';
import FileItem from '../FileItem';
import { TranscationItemType, UploadChannel } from '../../constants';
import { formatDate } from '../../utils/utils';

const images = [
  {
    uri: 'https://picsum.photos/200/300',
  },
  {
    uri: 'https://picsum.photos/200/300',
  },
  {
    uri: 'https://picsum.photos/200/300',
  },
];

// ✅ Component Map (only known upload channels)
const UploadChannelComponentMap = {
  [UploadChannel.PHOTOS]: CustomCarousel,
  [UploadChannel.CSV]: FileItem,
} as const;

// ✅ Prop Type Map (optional but clean for typing)
type UploadComponentPropsMap = {
  [UploadChannel.PHOTOS]: React.ComponentProps<typeof CustomCarousel>;
  [UploadChannel.CSV]: React.ComponentProps<typeof FileItem>;
};

// ✅ Props generator with safe fallback
const getUploadComponentProps = (
  uploadChannel: UploadChannel,
  orderData: TranscationItemType,
): any => {
  switch (uploadChannel) {
    case UploadChannel.PHOTOS:
      return {
        images,
        imageHeight: DimensionsData.windowHeight * 0.5,
      };

    case UploadChannel.CSV:
      return {
        title: 'Coles-shopping-feb.csv',
        date: formatDate(orderData.newDate),
        icon: Icons.csv,
        size: '604 KB',
      };

    default:
      return null;
  }
};

// ✅ BottomSheet props (safe default)
const getBottomSheetProps = (uploadChannel: UploadChannel, orderData: TranscationItemType) => {
  switch (uploadChannel) {
    case UploadChannel.PHOTOS:
      return {
        subtitle: 'Uploaded Date: ' + formatDate(orderData.newDate),
        maxHeight: '80%',
      };
    case UploadChannel.CSV:
      return {};
    default:
      return {};
  }
};

// ✅ Main Component
interface ComponentProps {
  orderData: TranscationItemType;
}

const AuditOrder: React.FC<ComponentProps> = ({ orderData }) => {
  const [showAudit, setShowAudit] = useState(false);

  const UploadComponent = UploadChannelComponentMap[orderData.uploadChannel];
  const uploadProps = getUploadComponentProps(orderData.uploadChannel, orderData);
  const BottomSheetProps = getBottomSheetProps(orderData.uploadChannel, orderData);

  const onClose = () => setShowAudit(false);

  if (!UploadComponent || !uploadProps) return null;

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <CustomHighlightButton
        title='Audit Order'
        onPress={() => setShowAudit(true)}
        style={{ borderRadius: 50 }}
        smallVariant
        titleStyle={'bold16'}
      />

      <BottomSheet
        visible={showAudit}
        onClose={onClose}
        heading='Audit'
        {...BottomSheetProps}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {UploadComponent && uploadProps ? <UploadComponent {...uploadProps} /> : null}

        <View style={styles.buttonsWrapper}>
          <OutlinedButton onPress={onClose} title='Close' style={{ width: '48%' }} smallVariant />
          <CustomHighlightButton
            title='Export'
            style={{ width: '48%' }}
            smallVariant
            titleStyle={'bold16'}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: 0,
    gap: 8,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default AuditOrder;
