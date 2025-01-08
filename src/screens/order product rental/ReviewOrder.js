import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';

const ReviewOrder = ({ route, navigation }) => {
  const {
    productID,
    shippingMethod,
    address,
    startDate,
    endDate,
    returnDate,
    totalPrice,
    voucherID,
  } = route.params || {};

  const [productDetails, setProductDetails] = useState(null);
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch product details
        const productResponse = await fetch(`http://14.225.220.108:2602/product/get-product-by-id?id=${productID}`);
        const productData = await productResponse.json();

        if (productData.isSuccess) {
          setProductDetails(productData.result);
        } else {
          Alert.alert('Lỗi', 'Không thể lấy thông tin sản phẩm.');
        }

        // Fetch voucher details if voucherID exists
        if (voucherID) {
          const voucherResponse = await fetch(`http://14.225.220.108:2602/voucher/get-voucher-by-id?id=${voucherID}`);
          const voucherData = await voucherResponse.json();

          if (voucherData.isSuccess) {
            setVoucherDetails(voucherData.result);
          } else {
            Alert.alert('Lỗi', 'Không thể lấy thông tin voucher.');
          }
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        Alert.alert('Lỗi', 'Không thể kết nối tới máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [productID, voucherID]);
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
  const handleNext = () => {
    navigation.navigate('OrderConfirmation', {
      productID,
      shippingMethod,
      address,
      startDate,
      endDate,
      returnDate,
      totalPrice,
      voucherID,
      supplierID: productDetails?.supplierID || '',
      productPriceRent: totalPrice - productDetails?.depositProduct,
      durationUnit: route.params.durationUnit, // Đơn vị thời gian (hour, day, week, month)
      durationValue: route.params.durationValue // Giá trị thời gian (số lượng tương ứng với đơn vị thời gian)
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Review Order</Text>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: productDetails.listImage[0].image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
        {productDetails && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin sản phẩm</Text>
            <Text style={styles.text}>Tên sản phẩm: {productDetails.productName}</Text>
            <Text style={styles.text}>Mô tả: {productDetails.productDescription}</Text>
            <Text style={styles.text}>Giá thuê/giờ: {productDetails.pricePerHour?.toLocaleString() || 'Không có'} vnđ</Text>
            <Text style={styles.text}>Giá thuê/ngày: {productDetails.pricePerDay?.toLocaleString() || 'Không có'} vnđ</Text>
            <Text style={styles.text}>Giá thuê/tuần: {productDetails.pricePerWeek?.toLocaleString() || 'Không có'} vnđ</Text>
            <Text style={styles.text}>Giá thuê/tháng: {productDetails.pricePerMonth?.toLocaleString() || 'Không có'} vnđ</Text>
            <Text style={styles.text}>Đánh giá: {productDetails.rating} ⭐</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin thời gian thuê và giao hàng</Text>
          <Text style={styles.text}>Ngày bắt đầu thuê: {formatDateTime(startDate)}</Text>
          <Text style={styles.text}>Ngày kết thúc thuê: {formatDateTime(endDate)}</Text>
          <Text style={styles.text}>Ngày trả hàng: {formatDateTime(returnDate)}</Text>
          <Text style={styles.text}>Tổng giá tiền: {totalPrice.toLocaleString()} vnđ</Text>
          <Text style={styles.text}>Phương thức giao hàng: {shippingMethod === 0 ? 'Giao hàng tận nơi' : 'Nhận tại cửa hàng'}</Text>
          {shippingMethod === 0 && <Text style={styles.text}>Địa chỉ giao hàng: {address}</Text>}
        </View>

        {voucherDetails ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin voucher</Text>
            <Text style={styles.text}>Mã giảm giá: {voucherDetails.vourcherCode}</Text>
            <Text style={styles.text}>Mô tả: {voucherDetails.description}</Text>
            <Text style={styles.text}>Số tiền giảm: {voucherDetails.discountAmount.toLocaleString()} vnđ</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin voucher</Text>
            <Text style={styles.text}>Không sử dụng voucher</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Xác nhận" onPress={handleNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default ReviewOrder;