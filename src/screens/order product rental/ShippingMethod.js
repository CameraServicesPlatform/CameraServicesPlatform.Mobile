import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ShippingMethod = ({ route, navigation }) => {
  const { productID } = route.params || {};

  const handleNext = () => {
    // Chuyển tiếp sang màn hình Voucher, mặc định shippingMethod = 0 (Nhận tại cửa hàng)
    navigation.navigate('Voucher', {
      productID,
      shippingMethod: 0,
      address: '', // không cần nhập địa chỉ
      startDate: route.params.startDate,
      endDate: route.params.endDate,
      returnDate: route.params.returnDate,
      totalPrice: route.params.totalPrice,
      durationUnit: route.params.durationUnit,
      durationValue: route.params.durationValue,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhận tại cửa hàng</Text>
      <Text style={styles.subtitle}>
        Bạn sẽ đến cửa hàng để lấy và trả sản phẩm.
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Tiếp theo" onPress={handleNext} color="#2E86DE" />
      </View>
    </View>
  );
};

export default ShippingMethod;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#555',
  },
  buttonContainer: {
    marginHorizontal: 80,
    marginTop: 10,
  },
});
