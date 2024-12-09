import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Voucher = ({ route, navigation }) => {
  const { productID, shippingMethod, address } = route.params || {};

  const handleNext = () => {
    navigation.navigate('ReviewOrder', {
      productID,
      shippingMethod,
      address,
      voucherID: '', // Không có voucher
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voucher</Text>
      <Text style={styles.text}>Không có voucher khả dụng.</Text>
      <Button title="Tiếp theo" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Voucher;
