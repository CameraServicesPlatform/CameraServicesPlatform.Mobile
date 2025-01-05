// OrderExtend.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const OrderExtend = ({ route, navigation }) => {
  const {
    orderID,
    rentalStartDate,
    rentalStartDateRaw,
    returnDate,
    orderStatus,
    orderType,
    deliveriesMethod,
    product,
  } = route.params || {};

  // Kiểm tra rentalStartDateRaw hợp lệ để đặt computedStartDate
  let computedStartDate;
  if (rentalStartDateRaw && !isNaN(new Date(rentalStartDateRaw).getTime())) {
    computedStartDate = new Date(rentalStartDateRaw);
  } else {
    console.warn('rentalStartDateRaw không hợp lệ. Sử dụng ngày hiện tại');
    console.log("rentalStartDateRaw123", rentalStartDateRaw);
    computedStartDate = new Date();
  }

  // ----------------------------
  // State quản lý
  // ----------------------------
  const [loading, setLoading] = useState(true);
  const [serverProduct, setServerProduct] = useState(null);

  // Đơn vị thời gian: hour, day, week, month
  const [unit, setUnit] = useState('hour');
  // Số giờ/ngày/tuần/tháng
  const [value, setValue] = useState('');

  // Thời gian bắt đầu, kết thúc, và ngày trả
  const [startDate, setStartDate] = useState(computedStartDate);
  const [endDate, setEndDate] = useState(null);
  const [finalReturnDate, setFinalReturnDate] = useState(null);

  // Tổng giá tiền
  const [totalPrice, setTotalPrice] = useState(0);

  // Điều khiển hiển thị DatePicker / TimePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Hàm format ISO => "HH:mm DD/MM/YYYY"
  const formatDateTime = (isoString) => {
    if (!isoString) return 'Không có';
    const dateObj = new Date(isoString);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  // ----------------------------
  // 1) Gọi API lấy product theo productID
  // ----------------------------
  useEffect(() => {
    if (!product || !product.productID) {
      Alert.alert('Lỗi', 'Không có thông tin productID để lấy sản phẩm từ server.');
      setLoading(false);
      return;
    }

    const fetchServerProduct = async () => {
      try {
        const response = await fetch(
          `http://14.225.220.108:2602/product/get-product-by-id?id=${product.productID}`
        );
        const data = await response.json();

        if (data.isSuccess && data.result) {
          setServerProduct(data.result);
        } else {
          Alert.alert('Lỗi', 'Không lấy được thông tin sản phẩm từ server.');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể kết nối tới máy chủ.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServerProduct();
  }, [product]);

  // ----------------------------
  // 2) Tính toán ngày kết thúc, ngày trả, và tổng giá
  // ----------------------------
  useEffect(() => {
    if (!value || isNaN(value) || value <= 0 || !serverProduct) {
      setEndDate(null);
      setFinalReturnDate(null);
      setTotalPrice(0);
      return;
    }

    const calculateDates = () => {
      const start = new Date(startDate);
      const end = new Date(start);

      // Kiểm tra: nếu đơn vị là 'hour'
      if (unit === 'hour') {
        // Giờ bắt đầu < 17
        if (start.getHours() >= 17) {
          Alert.alert(
            'Không thể gia hạn',
            'Chỉ gia hạn theo giờ trước 17h'
          );
          setEndDate(null);
          setFinalReturnDate(null);
          setTotalPrice(0);
          return;
        }
      }

      switch (unit) {
        case 'hour':
          if (value > 8) {
            Alert.alert('Lỗi', 'Giá trị thời gian không được vượt quá 8 giờ.');
            return;
          }
          end.setHours(start.getHours() + parseInt(value));
          if (end.getHours() > 20) {
            Alert.alert('Không thể gia hạn', 'Thời gian gia hạn vượt quá 20h.');
            setEndDate(null);
            setFinalReturnDate(null);
            setTotalPrice(0);
            return;
          }
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

      // Thêm 1h cho finalReturnDate
      const tmpReturn = new Date(end);
      tmpReturn.setHours(end.getHours() + 1);
      setFinalReturnDate(tmpReturn);

      // Tính tiền
      const rentalPrice =
        unit === 'hour'
          ? serverProduct.pricePerHour * value
          : unit === 'day'
          ? serverProduct.pricePerDay * value
          : unit === 'week'
          ? serverProduct.pricePerWeek * value
          : serverProduct.pricePerMonth * value;

      setTotalPrice(serverProduct.depositProduct + rentalPrice);
    };

    calculateDates();
  }, [value, unit, startDate, serverProduct]);

  // ----------------------------
  // 3) Map unit -> durationUnit (0,1,2,3)
  // ----------------------------
  const mapUnitToNumber = (u) => {
    switch (u) {
      case 'hour':
        return 0;
      case 'day':
        return 1;
      case 'week':
        return 2;
      case 'month':
        return 3;
      default:
        return 0; // Mặc định
    }
  };

  // ----------------------------
  // 4) Giao diện
  // ----------------------------
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
        {serverProduct ? (
          <>
            {!!serverProduct.listImage?.length && (
              <Image
                source={{ uri: serverProduct.listImage[0].image }}
                style={styles.productImage}
              />
            )}

            <Text style={styles.title}>
              {serverProduct.productName || 'Sản phẩm không xác định'}
            </Text>

            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Giá cọc: </Text>
                {serverProduct.depositProduct.toLocaleString()} vnđ
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Thuê theo giờ: </Text>
                {serverProduct.pricePerHour.toLocaleString()} vnđ
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Thuê theo ngày: </Text>
                {serverProduct.pricePerDay.toLocaleString()} vnđ
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Thuê theo tuần: </Text>
                {serverProduct.pricePerWeek.toLocaleString()} vnđ
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Thuê theo tháng: </Text>
                {serverProduct.pricePerMonth.toLocaleString()} vnđ
              </Text>
            </View>

            <Text style={styles.label}>Ngày bắt đầu gia hạn:</Text>
            <View style={styles.buttonGroup}>
              <Button title="Chọn ngày" onPress={() => setShowDatePicker(true)} />
              <Button title="Chọn giờ" onPress={() => setShowTimePicker(true)} />
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
              Ngày bắt đầu gia hạn: {formatDateTime(startDate?.toISOString())}
            </Text>
            <Text style={styles.text}>
              Ngày kết thúc thuê: {formatDateTime(endDate?.toISOString())}
            </Text>
            <Text style={styles.text}>
              Ngày trả hàng: {formatDateTime(finalReturnDate?.toISOString())}
            </Text>
            <Text style={styles.totalText}>
              Tổng giá tiền: {totalPrice.toLocaleString()} vnđ
            </Text>

            <Button
              title="Tiếp tục hoặc Gửi Gia hạn"
              onPress={() => {
                // map unit -> number
                const numericUnit = mapUnitToNumber(unit);

                navigation.navigate('ConfirmExtend', {
                  orderID,
                  extendData: {
                    startDate: startDate.toISOString(),
                    endDate: endDate?.toISOString(),
                    returnDate: finalReturnDate?.toISOString(),
                    totalPrice,
                    durationUnit: numericUnit,      // <--- Thay đổi ở đây
                    durationValue: parseInt(value), // Số giờ/ngày/tuần/tháng
                  },
                });
              }}
            />
          </>
        ) : (
          <Text style={styles.errorText}>Không tìm thấy thông tin sản phẩm.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default OrderExtend;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  productImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
  },
  picker: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 20,
    color: '#d9534f',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
