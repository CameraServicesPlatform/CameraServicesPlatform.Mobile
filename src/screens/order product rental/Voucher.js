import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert } from 'react-native';

const Voucher = ({ route, navigation }) => {
  const { productID, shippingMethod, address, startDate, endDate, returnDate, totalPrice } = route.params || {};
  const [vouchers, setVouchers] = useState([]); // Danh sách voucher
  const [selectedVoucher, setSelectedVoucher] = useState(null); // Voucher được chọn
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        // Gọi API để lấy thông tin sản phẩm
        const productResponse = await fetch(
          `http://14.225.220.108:2602/product/get-product-by-id?id=${productID}`
        );
        const productData = await productResponse.json();

        if (productData.isSuccess && productData.result.listVoucher) {
          const voucherIDs = productData.result.listVoucher.map(v => v.vourcherID);
          const fetchedVouchers = [];

          for (const id of voucherIDs) {
            const voucherResponse = await fetch(
              `http://14.225.220.108:2602/voucher/get-voucher-by-id?id=${id}`
            );
            const voucherData = await voucherResponse.json();
            if (voucherData.isSuccess) {
              fetchedVouchers.push(voucherData.result);
            }
          }

          setVouchers(fetchedVouchers);
        } else {
          Alert.alert('Lỗi', 'Không tìm thấy voucher khả dụng.');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        Alert.alert('Lỗi', 'Không thể kết nối tới máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [productID]);

  const handleSelectVoucher = (voucher) => {
    if (selectedVoucher?.vourcherID === voucher.vourcherID) {
      setSelectedVoucher(null); // Hủy chọn nếu nhấn lần nữa
    } else {
      setSelectedVoucher(voucher); // Chọn voucher
    }
  };

  const handleNext = () => {
    navigation.navigate('ReviewOrder', {
      productID,
      shippingMethod,
      address,
      startDate,
      endDate,
      returnDate,
      totalPrice,
      voucherID: selectedVoucher ? selectedVoucher.vourcherID : '', // Gửi ID hoặc rỗng
      durationUnit: route.params.durationUnit, // Đơn vị thời gian (hour, day, week, month)
      durationValue: route.params.durationValue // Giá trị thời gian (số lượng tương ứng với đơn vị thời gian)
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Đang tải danh sách voucher...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voucher</Text>
      {vouchers.length > 0 ? (
        <FlatList
          data={vouchers}
          keyExtractor={(item) => item.vourcherID}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.voucherItem,
                selectedVoucher?.vourcherID === item.vourcherID && styles.selectedVoucher,
              ]}
              onPress={() => handleSelectVoucher(item)}
            >
              <Text style={styles.voucherCode}>{item.vourcherCode}</Text>
              <Text style={styles.voucherDescription}>{item.description}</Text>
              <Text style={styles.voucherDiscount}>Giảm giá: {item.discountAmount.toLocaleString()} vnđ</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.text}>Không có voucher khả dụng.</Text>
      )}
      <Button title="Tiếp theo" onPress={handleNext} />
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
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  voucherItem: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  selectedVoucher: {
    borderColor: 'green',
    backgroundColor: '#e6ffe6',
  },
  voucherCode: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  voucherDescription: {
    fontSize: 14,
    color: '#666',
  },
  voucherDiscount: {
    fontSize: 16,
    color: 'red',
  },
});

export default Voucher;
