import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  Image,
  ScrollView, // Thêm ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const OrderProductRental = ({ route, navigation }) => {
  const { productID } = route.params || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState('hour'); // Đơn vị thời gian: hour, day, week, month
  const [value, setValue] = useState('');   // Giá trị thời gian
  const [startDate, setStartDate] = useState(new Date()); // Ngày bắt đầu thuê
  const [endDate, setEndDate] = useState(null);           // Ngày kết thúc thuê
  const [returnDate, setReturnDate] = useState(null);     // Ngày trả hàng
  const [totalPrice, setTotalPrice] = useState(0);        // Tổng giá tiền
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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải thông tin sản phẩm...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {product ? (
          <>
            {/* Thêm field ảnh (lấy ảnh đầu tiên trong mảng listImage) */}
            {!!product.listImage?.length && (
              <Image
                source={{ uri: product.listImage[0].image }}
                style={styles.productImage}
              />
            )}

            <Text style={styles.title}>{product.productName}</Text>

            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Giá cọc:</Text> {product.depositProduct} đ
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Thuê theo giờ:</Text> {product.pricePerHour} đ
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Thuê theo ngày:</Text> {product.pricePerDay} đ
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Thuê theo tuần:</Text> {product.pricePerWeek} đ
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Thuê theo tháng:</Text> {product.pricePerMonth} đ
              </Text>
            </View>

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
              placeholder="Nhập số giờ/ngày/tuần/tháng..."
            />

            <Text style={styles.label}>Ngày bắt đầu thuê:</Text>
            <View style={styles.buttonGroup}>
              <Button
                title="Chọn ngày"
                onPress={() => setShowDatePicker(true)}
              />
              <Button
                title="Chọn giờ"
                onPress={() => setShowTimePicker(true)}
              />
            </View>

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

            <Text style={styles.totalText}>
              Tổng giá tiền: {totalPrice.toLocaleString()} đ
            </Text>

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
                  durationValue: parseInt(value), // Giá trị thời gian
                })
              }
            />
          </>
        ) : (
          <Text style={styles.errorText}>Không tìm thấy thông tin sản phẩm.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ScrollView
  scrollContent: {
    paddingBottom: 40, // chừa khoảng trống dưới cùng để không bị che nội dung
  },
  // Container chính
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  // Khi đang loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  // Ảnh sản phẩm
  productImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  // Tiêu đề sản phẩm
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  // Phần thông tin nhóm
  infoContainer: {
    marginBottom: 20,
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderRadius: 8,
  },
  infoLabel: {
    fontWeight: '600',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 3,
  },
  // Nhãn
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
  },
  // Picker
  picker: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  // Input
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  // Button group
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  // Text chung
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  // Tổng tiền
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 20,
    color: '#d9534f',
  },
  // Khi lỗi
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default OrderProductRental;
