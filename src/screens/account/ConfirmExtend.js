// ConfirmExtend.js
import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

const ConfirmExtend = ({ route, navigation }) => {
  // Nhận lại params từ OrderExtend
  const { orderID, extendData } = route.params || {};
  // extendData gồm: 
  // { startDate, endDate, returnDate, totalPrice, durationUnit, durationValue }

  const handleSubmitExtend = async () => {
    try {
      // Chuẩn bị body gửi lên API
      const body = {
        orderID: orderID.toString(),         // Chuyển sang string nếu cần
        durationUnit: extendData?.durationUnit || 0,
        durationValue: extendData?.durationValue || 0,
        extendReturnDate: extendData?.returnDate || '',         // VD: 2025-01-03T15:00:50.943Z
        rentalExtendStartDate: extendData?.startDate || '',     // VD: 2025-01-03T15:00:50.943Z
        totalAmount: extendData?.totalPrice || 0,               // VD: 0
        rentalExtendEndDate: extendData?.endDate || '',         // VD: 2025-01-03T15:00:50.943Z
      };

      console.log('Body gửi lên API:', body);

      const response = await fetch('http://14.225.220.108:2602/extend/create-extend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log('Kết quả API create-extend:', data);

      if (response.ok && data.isSuccess) {
        Alert.alert('Thành công', 'Gia hạn thành công!');
        // Sau khi thành công, bạn có thể điều hướng quay về hoặc trang khác
        navigation.goBack();
      } else {
        Alert.alert('Thất bại', 'Gia hạn không thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API create-extend:', error);
      Alert.alert('Lỗi', 'Không thể gia hạn. Vui lòng thử lại sau!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận Gia hạn</Text>

      {/* Hiển thị đơn giản các giá trị */}
      <Text style={styles.text}>Order ID: {orderID}</Text>
      <Text style={styles.text}>Ngày bắt đầu: {extendData?.startDate}</Text>
      <Text style={styles.text}>Ngày kết thúc: {extendData?.endDate}</Text>
      <Text style={styles.text}>Ngày trả hàng: {extendData?.returnDate}</Text>
      <Text style={styles.text}>Tổng giá: {extendData?.totalPrice} VNĐ</Text>
      <Text style={styles.text}>Đơn vị thời gian: {extendData?.durationUnit}</Text>
      <Text style={styles.text}>Giá trị thời gian: {extendData?.durationValue}</Text>

      {/* Nút gọi API để Submit Gia hạn */}
      <Button title="Hoàn tất" onPress={handleSubmitExtend} />
    </View>
  );
};

export default ConfirmExtend;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
});
