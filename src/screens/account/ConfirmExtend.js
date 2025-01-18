import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';

const ConfirmExtend = ({ route, navigation }) => {
  const { orderID, extendData } = route.params || {};
  const [loading, setLoading] = useState(false); // Thêm state loading

  const handleSubmitExtend = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const body = {
        orderID: orderID.toString(),
        durationUnit: extendData?.durationUnit || 0,
        durationValue: extendData?.durationValue || 0,
        extendReturnDate: extendData?.returnDate || '',
        rentalExtendStartDate: extendData?.startDate || '',
        totalAmount: extendData?.totalPrice || 0,
        rentalExtendEndDate: extendData?.endDate || '',
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
        navigation.navigate('Account');
      } else {
        Alert.alert('Thất bại', 'Gia hạn không thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API create-extend:', error);
      Alert.alert('Lỗi', 'Không thể gia hạn. Vui lòng thử lại sau!');
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận Gia hạn</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Thêm dòng chữ Lưu ý */}
          <Text style={styles.noteText}>
            Lưu ý hãy đọc kỹ các{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('Policy')}>
              chính sách
            </Text>
            {' '}của chúng tôi.
          </Text>
          <Button title="Hoàn tất" onPress={handleSubmitExtend} />
        </>
      )}
    </View>
  );
};

export default ConfirmExtend;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  noteText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginVertical: 15,
  },
  linkText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});
