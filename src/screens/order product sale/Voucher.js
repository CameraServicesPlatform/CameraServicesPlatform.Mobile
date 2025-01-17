import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert } from 'react-native';

const Voucher = ({ route, navigation }) => {
  const {
    productID,
    shippingMethod,
    address,
    startDate,
    endDate,
    returnDate,
    totalPrice,
    durationUnit,
    durationValue,
    supplierID,
    quantityToBuy // Nhận thêm quantityToBuy
  } = route.params || {};

  const [vouchers, setVouchers] = useState([]); // Danh sách voucher
  const [selectedVoucher, setSelectedVoucher] = useState(null); // Voucher được chọn
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        // Gọi API lấy sản phẩm để có danh sách voucher ID
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
  
          // Loại bỏ các phần tử trùng lặp trong fetchedVouchers
          const uniqueVouchers = fetchedVouchers.filter(
            (voucher, index, self) =>
              index === self.findIndex(v => v.vourcherID === voucher.vourcherID)
          );
  
          setVouchers(uniqueVouchers);
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
    // Chuyển sang ReviewOrder, kèm voucherID (nếu có)
    navigation.navigate('ReviewOrder', {
      productID,
      shippingMethod,
      address,
      startDate,
      endDate,
      returnDate,
      totalPrice,
      durationUnit,
      durationValue,
      supplierID,
      quantityToBuy, // Chuyển quantityToBuy
      voucherID: selectedVoucher ? selectedVoucher.vourcherID : ''
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
        keyExtractor={(item, index) => `${item.vourcherID}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.voucherItem,
              selectedVoucher?.vourcherID === item.vourcherID && styles.selectedVoucher,
            ]}
            onPress={() => handleSelectVoucher(item)}
          >
            <Text style={styles.voucherCode}>{item.voucherCode}</Text>
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
