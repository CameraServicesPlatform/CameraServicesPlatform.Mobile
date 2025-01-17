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

const OrderProductRental = ({ route, navigation }) => {
  const { productID } = route.params || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Đơn vị thời gian: hour, day, week, month
  const [unit, setUnit] = useState('hour');
  // Giá trị thời gian
  const [value, setValue] = useState('');

  // Thời gian bắt đầu, kết thúc thuê, và ngày trả
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour < 8 || currentHour > 20) {
      // Nếu trước 8h sáng hoặc sau 20h tối, thiết lập 8h sáng ngày hôm sau
      const nextDay = new Date(now);
      nextDay.setDate(now.getDate() + 1); // Chuyển sang ngày hôm sau
      nextDay.setHours(8, 0, 0, 0); // Đặt giờ là 8:00:00 sáng
      return nextDay;
    }

    return now; // Nếu trong khoảng 8h - 20h, dùng thời gian hiện tại
  });

  const [endDate, setEndDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  // Tổng giá tiền
  const [totalPrice, setTotalPrice] = useState(0);

  // Điều khiển hiển thị DatePicker, TimePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Hàm chuyển định dạng chuỗi ISO thành "HH:mm DD/MM/YYYY"
  const formatDateTime = (isoString) => {
    if (!isoString) return 'Không có';

    const dateObj = new Date(isoString);

    // Lấy ngày/tháng/năm
    const day = dateObj.getDate().toString().padStart(2, '0');       // Thêm '0' nếu chỉ có 1 chữ số
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString();

    // Lấy giờ/phút
    const hours = dateObj.getHours().toString().padStart(2, '0');    // Thêm '0' nếu chỉ có 1 chữ số
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    // Format lại theo "HH:mm DD/MM/YYYY"
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };
  // Lấy thông tin chi tiết sản phẩm
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

  // Tính toán ngày kết thúc, ngày trả, và tổng giá thuê
  useEffect(() => {
    // Nếu người dùng chưa nhập đủ dữ liệu hoặc chưa có product, reset
    if (!value || isNaN(value) || value <= 0 || !product) {
      setEndDate(null);
      setReturnDate(null);
      return;
    }

    const calculateDates = () => {
      const start = new Date(startDate);
      const end = new Date(start);

      switch (unit) {
        case 'hour':
          // Kiểm tra số giờ thuê không vượt quá 8
          if (value > 8) {
            Alert.alert('Lỗi', 'Giá trị thời gian không được vượt quá 8 giờ.');
            return;
          }

          // Cộng giờ theo giá trị nhập
          end.setHours(start.getHours() + parseInt(value));

          // Lấy tổng số phút bắt đầu và kết thúc
          const startMinutes = start.getHours() * 60 + start.getMinutes();
          const endMinutes = end.getHours() * 60 + end.getMinutes();

          // Giới hạn thời gian từ 8:00 (480 phút) đến 20:00 (1200 phút)
          if (startMinutes < 480 || endMinutes > 1200) {
            Alert.alert(
              'Lỗi',
              'Thời gian thuê vượt quá khung giờ cho phép từ 8:00 đến 20:00. Vui lòng chọn lại thời gian!'
            );
            // Reset
            setEndDate(null);
            setReturnDate(null);
            setTotalPrice(0);
            return;
          }

          // Kiểm tra chi tiết từng giờ trong khoảng từ start đến end
          for (let i = 0; i < value; i++) {
            const currentHour = start.getHours() + i;
            if (currentHour < 8 || currentHour >= 20) {
              Alert.alert(
                'Lỗi',
                'Thời gian thuê bao gồm giờ vượt ngoài khung từ 8:00 đến 20:00. Vui lòng chọn lại thời gian!'
              );
              // Reset
              setEndDate(null);
              setReturnDate(null);
              setTotalPrice(0);
              return;
            }
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

      // Gán endDate
      setEndDate(end);

      // Tính returnDate (thêm 1 giờ sau endDate)
      const returnTime = new Date(end);
      returnTime.setHours(end.getHours() + 1);
      setReturnDate(returnTime);

      // Tính tổng tiền thuê
      const rentalPrice =
        unit === 'hour'
          ? product.pricePerHour * value
          : unit === 'day'
            ? product.pricePerDay * value
            : unit === 'week'
              ? product.pricePerWeek * value
              : product.pricePerMonth * value;

      // Tổng tiền = tiền đặt cọc + tiền thuê
      setTotalPrice(product.depositProduct + rentalPrice);
    };

    calculateDates();
  }, [value, unit, startDate, product]);

  // Nếu đang tải dữ liệu
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
            {/* Ảnh sản phẩm (nếu có) */}
            {!!product.listImage?.length && (
              <Image
                source={{ uri: product.listImage[0].image }}
                style={styles.productImage}
              />
            )}

            <Text style={styles.title}>{product.productName}</Text>

            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Giá cọc:</Text> {product.depositProduct} vnđ
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Thuê theo giờ:</Text> {product.pricePerHour} vnđ
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Thuê theo ngày:</Text> {product.pricePerDay} vnđ
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Thuê theo tuần:</Text> {product.pricePerWeek} vnđ
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Thuê theo tháng:</Text> {product.pricePerMonth} vnđ
              </Text>
            </View>
            {/* Chọn ngày & giờ bắt đầu */}
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
            {/* Chọn đơn vị thời gian */}
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

            {/* Nhập giá trị thời gian (giờ, ngày, tuần, tháng) */}
            <Text style={styles.label}>Giá trị thời gian:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={value}
              onChangeText={setValue}
              placeholder="Nhập số giờ/ngày/tuần/tháng..."
            />



            {/* Date picker */}
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

            {/* Time picker */}
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
              Ngày bắt đầu: {formatDateTime(startDate?.toISOString()) || 'Chưa xác định'}
            </Text>
            <Text style={styles.text}>
              Ngày kết thúc thuê: {formatDateTime(endDate?.toISOString()) || 'Chưa xác định'}
            </Text>
            <Text style={styles.text}>
              Ngày trả hàng: {formatDateTime(returnDate?.toISOString()) || 'Chưa xác định'}
            </Text>

            <Text style={styles.totalText}>
              Tổng giá tiền: {totalPrice.toLocaleString()} vnđ
            </Text>

            {/* Nút chuyển sang trang ShippingMethod */}
            <Button
              title="Tiếp theo"
              onPress={() =>
                navigation.navigate('ShippingMethod', {
                  productID,
                  startDate: startDate.toISOString(),
                  endDate: endDate?.toISOString(),
                  returnDate: returnDate?.toISOString(),
                  totalPrice,
                  durationUnit: unit,      // Đơn vị (hour, day, week, month)
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