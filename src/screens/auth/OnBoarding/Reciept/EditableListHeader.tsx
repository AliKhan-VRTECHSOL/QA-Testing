import React, { useMemo, useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { Icons } from '../../../../assets/Icons';
import { Text, CustomHighlightButton } from './../../../../components';
import { useTheme } from '../../../../context/themeContext';
import { ThemeColors } from '../../../../theme/colors';
import { useRecieptStore } from '../../../../store/receiptStore';

interface EditableHeaderProps {
  title: string;
}

const EditableListHeader: React.FC<EditableHeaderProps> = ({ title }) => {
  const { colors } = useTheme();
  const { updateStoreBranch } = useRecieptStore();
  const styles = useMemo(() => useStyles(colors), [colors]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleCancel = () => {
    setTempTitle(title); // reset to original
    setIsEditing(false);
  };

  const handleSave = () => {
    updateStoreBranch(title, tempTitle);
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <View style={styles.row}>
          <TextInput
            value={tempTitle}
            onChangeText={setTempTitle}
            style={styles.input}
            placeholder='Enter title'
          />
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text textStyle='bold14' color={colors.white}>
              Cancel
            </Text>
          </Pressable>
          <CustomHighlightButton
            title='Save'
            style={styles.saveButton}
            titleStyle='bold14'
            titleColor={colors.white}
            onPress={handleSave}
          />
        </View>
      ) : (
        <View style={styles.listHeader}>
          <Text textStyle='black16' color={colors.black}>
            {title}
          </Text>
          <Pressable onPress={() => setIsEditing(true)}>
            <Image source={Icons.edit} style={styles.editIcon} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default EditableListHeader;

const useStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      paddingTop: 26,
      marginTop: 5,
    },
    row: {
      width: '100%',
      height: 50,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    input: {
      paddingHorizontal: 10,
      flex: 1,
      borderWidth: 1,
      borderColor: colors.lightGrey,
      borderRadius: 10,
      height: '100%',
    },
    cancelButton: {
      width: 70,
      height: 40,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.red,
    },
    saveButton: {
      width: 70,
      height: 40,
    },
    listHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      alignSelf: 'flex-start',
      marginBottom: 10,
      gap: 10,
    },
    editIcon: {
      width: 20,
      height: 20,
      tintColor: colors.black,
    },
  });
