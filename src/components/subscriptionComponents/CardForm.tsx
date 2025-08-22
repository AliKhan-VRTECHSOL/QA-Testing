import React, { Dispatch, SetStateAction } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { InputField } from '..';
import { Icons } from '../../assets/Icons';
import { Images } from '../../assets/images';

export interface CardData {
  cardNumber: string;
  nameOnCard: string;
  cardExpiryDate: string;
  cardSecurityCode: string;
}

interface CardFormProps {
  cardData: CardData;
  setCardData: Dispatch<SetStateAction<any>>;
}

const CardForm: React.FC<CardFormProps> = ({ cardData, setCardData }) => {
  const handleUpdateCard = (value: string, field: keyof CardData) => {
    let formattedValue = value;

    switch (field) {
      case 'nameOnCard':
        formattedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 26);
        break;

      case 'cardNumber':
        formattedValue = value.replace(/\D/g, '').slice(0, 16); // limit to 16 digits
        // Format as "1234 5678 9012 3456"
        formattedValue = formattedValue.replace(/(.{4})/g, '$1 ').trim();
        break;

      case 'cardExpiryDate': {
        // Handle backspace/deletion by checking if value is getting shorter
        const currentValue = cardData.cardExpiryDate || '';
        const isDeleting = value.length < currentValue.length;

        if (isDeleting) {
          // If user is deleting and hits the slash, remove it and the digit before
          if (value.endsWith('/')) {
            formattedValue = value.slice(0, -1);
          } else {
            formattedValue = value;
          }
        } else {
          const digits = value.replace(/\D/g, '').slice(0, 4);

          if (digits.length === 0) {
            formattedValue = '';
          } else if (digits.length === 1) {
            // Don't auto-add slash for single digits, let user type more
            if (digits[0] != '1') {
              formattedValue = '0' + digits[0] + '/';
            } else {
              formattedValue = digits[0];
            }
          } else if (digits.length === 2) {
            const monthNum = parseInt(digits, 10);
            if (monthNum >= 1 && monthNum <= 12) {
              formattedValue = `${digits.padStart(2, '0')}/`;
            } else {
              // Invalid month, keep as single digit
              formattedValue = digits[0];
            }
          } else if (digits.length === 3) {
            const month = digits.slice(0, 2);
            const year = digits.slice(2, 3);
            const monthNum = parseInt(month, 10);

            if (monthNum >= 1 && monthNum <= 12) {
              formattedValue = `${month.padStart(2, '0')}/${year}`;
            } else {
              formattedValue = digits.slice(0, 2);
            }
          } else {
            const month = digits.slice(0, 2);
            const year = digits.slice(2, 4);
            const monthNum = parseInt(month, 10);

            if (monthNum >= 1 && monthNum <= 12) {
              formattedValue = `${month.padStart(2, '0')}/${year}`;
            } else {
              formattedValue = digits.slice(0, 2);
            }
          }
        }
        break;
      }

      case 'cardSecurityCode':
        formattedValue = value.replace(/\D/g, '').slice(0, 4);
        break;

      default:
        break;
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  return (
    <>
      <View style={styles.cardsWrapper}>
        {[Images.visa, Images.amex, Images.discover, Images.mastercard].map((k, index) => (
          <Image key={index} source={k} style={styles.cardImage} />
        ))}
      </View>

      <InputField
        label='Card number'
        value={cardData.cardNumber}
        onChangeText={newText => handleUpdateCard(newText, 'cardNumber')}
        placeholder='1111 2222 3333 4444'
        icon={Icons.lock}
        iconStyle={styles.icnoStyle}
      />

      <InputField
        label='Name on the card'
        value={cardData.nameOnCard}
        onChangeText={newText => handleUpdateCard(newText, 'nameOnCard')}
        placeholder='John Doe'
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <InputField
          label='Expiry Date'
          value={cardData.cardExpiryDate}
          onChangeText={newText => handleUpdateCard(newText, 'cardExpiryDate')}
          placeholder='MM / YYYY'
        />
        <InputField
          label='Security Code'
          value={cardData.cardSecurityCode}
          onChangeText={newText => handleUpdateCard(newText, 'cardSecurityCode')}
          placeholder='123'
          icon={Icons.info}
          iconStyle={styles.icnoStyle}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cardImage: {
    width: 34,
    height: 24,
    resizeMode: 'contain',
  },
  icnoStyle: {
    width: 16,
    height: 16,
  },
});

export default CardForm;
