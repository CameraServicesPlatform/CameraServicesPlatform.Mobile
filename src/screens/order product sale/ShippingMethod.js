import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

const ShippingMethod = ({ route, navigation }) => {
  const { productID } = route.params || {};
  const [shippingMethod, setShippingMethod] = useState(null); // 0: Nhận tại cửa hàng, 1: Giao hàng tận nơi
  const [address, setAddress] = useState(''); // Địa chỉ giao hàng
  const [error, setError] = useState(''); // Thông báo lỗi

  const handleNext = () => {
    if (shippingMethod === null) {
      setError('Vui lòng chọn phương thức giao hàng.');
      return;
    }

    if (shippingMethod === 1 && !address.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng.');
      return;
    }

    // Xóa thông báo lỗi và chuyển tiếp
    setError('');
    navigation.navigate('Voucher', {
      productID,
      shippingMethod,
      address: shippingMethod === 1 ? address.trim() : '',
      
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phương thức giao hàng</Text>

      {/* Hiển thị thông báo lỗi */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Chọn phương thức giao hàng */}
      <View style={styles.optionsContainer}>
        <Button
          title="Nhận tại cửa hàng"
          color={shippingMethod === 0 ? 'green' : 'gray'}
          onPress={() => {
            setShippingMethod(0);
            setAddress(''); // Reset địa chỉ nếu chọn nhận tại cửa hàng
          }}
        />
        <Button
          title="Giao hàng tận nơi"
          color={shippingMethod === 1 ? 'green' : 'gray'}
          onPress={() => setShippingMethod(1)}
        />
      </View>

      {/* Nhập địa chỉ giao hàng */}
      {shippingMethod === 1 && (
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ giao hàng..."
          value={address}
          onChangeText={setAddress}
        />
      )}

      {/* Nút Tiếp theo */}
      <Button title="Tiếp theo" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ShippingMethod;
