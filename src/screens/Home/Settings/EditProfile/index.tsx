import React, { useState } from 'react';
import { Image, Pressable, View, Platform } from 'react-native';
import DatePicker from 'react-native-date-picker';

import {
  CustomHighlightButton,
  DropDownModal,
  InputField,
  SAScrollView,
  Text,
  PhoneInputField,
} from '../../../../components';
import { Images } from '../../../../assets/images';
import { useTheme } from '../../../../context/themeContext';
import { useStyles } from './styles';
import { Icons } from '../../../../assets/Icons';
import { openImagePicker } from '../../../../utils/media';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  image: {
    uri: string;
    name: string;
    type: string;
  };
  gender: string;
  occupation: string;
  country: string;
  city: string;
  state: string;
  streetAddress: string;
  premise: string;
  phone: string;
}

const EditProfile = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [openPicker, setOpenPicker] = useState(false);

  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    email: '',
    image: {
      name: '',
      uri: '',
      type: '',
    },
    gender: '',
    occupation: '',
    country: '',
    city: '',
    state: '',
    streetAddress: '',
    premise: '',
    phone: '',
  });

  const updateFormData = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagePicker = async () => {
    const image = await openImagePicker();
    updateFormData('image', image || { name: '', uri: '', type: '' });
  };

  const Footer = () => {
    return (
      <CustomHighlightButton
        title='Save'
        onPress={() => {
          // TODO: API Integration Required
          // Call: PUT /settings/profile
          // Send: {
          //   firstName: string,
          //   lastName: string,
          //   dateOfBirth: string,
          //   email: string,
          //   image?: File,
          //   gender: string,
          //   occupation: string,
          //   country: string,
          //   city: string,
          //   state: string,
          //   streetAddress: string,
          //   premise: string,
          //   phone: string
          // }
          // Expect: { success: boolean, message: string, user: UserData }
          // Handle: Update user data in store, show success message, navigate back
        }}
        style={{
          alignSelf: 'center',
          marginVertical: 10,
        }}
      />
    );
  };

  return (
    <SAScrollView
      removeSafeAreaInsets
      IndividualkeyboardVerticalOffset={Platform.select({
        ios: -35,
        android: -25,
      })}
      footer={<Footer />}
    >
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Image
                source={formData.image.uri ? { uri: formData.image.uri } : Images.avatar}
                style={styles.avatarImage}
              />
            </View>
          </View>
          <Text textStyle='bold20' color={colors.textPrimary}>
            {'John Doe'}
          </Text>
          <Pressable
            onPress={handleImagePicker}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 8,
              gap: 6,
            }}
          >
            <Text
              textStyle='black16'
              color={colors.primary}
              style={{ textDecorationLine: 'underline' }}
            >
              Edit Photo
            </Text>
            <Image source={Icons.camera} style={{ width: 18, height: 18 }} resizeMode='contain' />
          </Pressable>
        </View>
        <View style={{ gap: 10, marginTop: 30, width: '100%' }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'space-between',
            }}
          >
            <InputField
              label='First Name'
              smallVariant
              placeholder='First name'
              value={formData.firstName}
              onChangeText={value => updateFormData('firstName', value)}
            />
            <InputField
              label='Last Name'
              smallVariant
              placeholder='Last name'
              value={formData.lastName}
              onChangeText={value => updateFormData('lastName', value)}
            />
          </View>
          <InputField
            label='Email'
            smallVariant
            placeholder='Enter your email'
            value={formData.email}
            onChangeText={value => updateFormData('email', value)}
          />
          <PhoneInputField
            value={formData.phone}
            title='Phone Number'
            smallVariant
            setValue={value => updateFormData('phone', value)}
            setIsPhoneValid={setIsPhoneValid}
          />
          <InputField
            label='Date of Birth'
            onPressIcon={() => {
              setOpenPicker(true);
            }}
            editable={false}
            smallVariant
            icon={Icons.calendar}
            placeholder='Select date of birth'
            value={formData.dateOfBirth.toLocaleDateString()}
          />
          <DropDownModal
            options={['Male', 'Female', 'Other']}
            selectedValue={formData.gender}
            setSelectedValue={value => updateFormData('gender', value)}
            title='Gender'
            smallVariant
          />
          <InputField
            label='Occupation'
            smallVariant
            placeholder='Occupation'
            value={formData.occupation}
            onChangeText={value => updateFormData('occupation', value)}
          />

          <InputField
            label='Country'
            smallVariant
            placeholder='Enter your Country'
            value={formData.country}
            onChangeText={value => updateFormData('country', value)}
          />
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'space-between',
            }}
          >
            <InputField
              label='City'
              smallVariant
              placeholder='Enter your City'
              value={formData.city}
              onChangeText={value => updateFormData('city', value)}
            />
            <InputField
              label='State'
              smallVariant
              placeholder='Enter your State'
              value={formData.state}
              onChangeText={value => updateFormData('state', value)}
            />
          </View>
          <InputField
            label='Street Address'
            smallVariant
            placeholder='Enter your Street Address'
            value={formData.streetAddress}
            onChangeText={value => updateFormData('streetAddress', value)}
          />
          <InputField
            label='Premises'
            smallVariant
            placeholder='Unit 1'
            value={formData.premise}
            onChangeText={value => updateFormData('premise', value)}
          />
        </View>
      </View>
      <DatePicker
        modal
        open={openPicker}
        date={formData.dateOfBirth}
        maximumDate={new Date()}
        onConfirm={date => {
          setOpenPicker(false);
          updateFormData('dateOfBirth', date);
        }}
        onCancel={() => {
          setOpenPicker(false);
        }}
      />
    </SAScrollView>
  );
};

export default EditProfile;
