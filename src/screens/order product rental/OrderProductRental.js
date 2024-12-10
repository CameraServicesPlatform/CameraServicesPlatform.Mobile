import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const OrderProductRental = ({ route, navigation }) => {
  const { productID } = route.params || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState('hour'); // Đơn vị thời gian: hour, day, week, month
  const [value, setValue] = useState(''); // Giá trị thời gian
  const [startDate, setStartDate] = useState(new Date()); // Ngày bắt đầu thuê
  const [endDate, setEndDate] = useState(null); // Ngày kết thúc thuê
  const [returnDate, setReturnDate] = useState(null); // Ngày trả hàng
  const [totalPrice, setTotalPrice] = useState(0); // Tổng giá tiền
  const [showDatePicker, setShowDatePicker] = useState(false); // Hiển thị DatePicker cho ngày
  const [showTimePicker, setShowTimePicker] = useState(false); // Hiển thị DatePicker cho giờ

  // Gọi API để lấy chi tiết sản phẩm
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://14.225.220.108:2602/product/get-product-by-id?id=${productID}`
        );
        const data = await response.json();

        if (data.isSuccess) {
          setProduct(data.result);
        } else {
          Alert.alert('Lỗi', 'Không thể lấy thông tin sản phẩm.');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        Alert.alert('Lỗi', 'Không thể kết nối tới máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    if (productID) {
      fetchProductDetails();
    }
  }, [productID]);

  // Tính toán ngày kết thúc và ngày trả hàng
  useEffect(() => {
    if (!value || isNaN(value) || value <= 0 || !product) {
      setEndDate(null);
      setReturnDate(null);
      return;
    }

    const calculateDates = () => {
      const start = new Date(startDate);
      let end = new Date(start);

      switch (unit) {
        case 'hour':
          if (value > 8) {
            Alert.alert('Lỗi', 'Giá trị thời gian không được vượt quá 8 giờ.');
            return;
          }
          end.setHours(start.getHours() + parseInt(value));
          break;
        case 'day':
          if (value > 3) {
            Alert.alert('Lỗi', 'Giá trị thời gian không được vượt quá 3 ngày.');
            return;
          }
          end.setDate(start.getDate() + parseInt(value));
          break;
        case 'week':
          if (value > 2) {
            Alert.alert('Lỗi', 'Giá trị thời gian không được vượt quá 2 tuần.');
            return;
          }
          end.setDate(start.getDate() + parseInt(value) * 7);
          break;
        case 'month':
          if (value > 1) {
            Alert.alert('Lỗi', 'Giá trị thời gian không được vượt quá 1 tháng.');
            return;
          }
          end.setMonth(start.getMonth() + parseInt(value));
          break;
        default:
          break;
      }

      setEndDate(end);

      const returnTime = new Date(end);
      returnTime.setHours(end.getHours() + 1); // Thêm 1 giờ vào ngày trả hàng
      setReturnDate(returnTime);

      // Tính tổng giá tiền
      const rentalPrice =
        unit === 'hour'
          ? product.pricePerHour * value
          : unit === 'day'
          ? product.pricePerDay * value
          : unit === 'week'
          ? product.pricePerWeek * value
          : product.pricePerMonth * value;

      setTotalPrice(product.depositProduct + rentalPrice);
    };

    calculateDates();
  }, [value, unit, startDate, product]);

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Đang tải thông tin sản phẩm...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {product ? (
        <>
          <Text style={styles.title}>{product.productName}</Text>
          <Text style={styles.text}>Giá cọc: {product.depositProduct} đ</Text>

          <Text style={styles.label}>Đơn vị thời gian:</Text>
          <Picker
            selectedValue={unit}
            onValueChange={(itemValue) => setUnit(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Giờ" value="hour" />
            <Picker.Item label="Ngày" value="day" />
            <Picker.Item label="Tuần" value="week" />
            <Picker.Item label="Tháng" value="month" />
          </Picker>

          <Text style={styles.label}>Giá trị thời gian:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />

          <Text style={styles.label}>Ngày bắt đầu thuê:</Text>
          <Button
            title="Chọn ngày"
            onPress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setStartDate(selectedDate);
                }
              }}
            />
          )}

          <Button
            title="Chọn giờ"
            onPress={() => setShowTimePicker(true)}
          />
          {showTimePicker && (
            <DateTimePicker
              value={startDate}
              mode="time"
              display="spinner"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  const updatedDate = new Date(startDate);
                  updatedDate.setHours(selectedTime.getHours());
                  updatedDate.setMinutes(selectedTime.getMinutes());
                  setStartDate(updatedDate);
                }
              }}
            />
          )}

          <Text style={styles.text}>
            Ngày bắt đầu: {startDate?.toISOString() || 'Chưa xác định'}
          </Text>
          <Text style={styles.text}>
            Ngày kết thúc thuê: {endDate?.toISOString() || 'Chưa xác định'}
          </Text>
          <Text style={styles.text}>
            Ngày trả hàng: {returnDate?.toISOString() || 'Chưa xác định'}
          </Text>

          <Text style={styles.text}>Tổng giá tiền: {totalPrice.toLocaleString()} đ</Text>

          <Button
            title="Tiếp theo"
            onPress={() =>
                navigation.navigate('ShippingMethod', {
                  productID,
                  startDate: startDate.toISOString(),
                  endDate: endDate?.toISOString(),
                  returnDate: returnDate?.toISOString(),
                  totalPrice,
                  durationUnit: unit, // Đơn vị thời gian (hour, day, week, month)
                  durationValue: parseInt(value), // Giá trị thời gian (số lượng tương ứng với đơn vị thời gian)
                })
              }
              
          />
        </>
      ) : (
        <Text style={styles.errorText}>Không tìm thấy thông tin sản phẩm.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default OrderProductRental;