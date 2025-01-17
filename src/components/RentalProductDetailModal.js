import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RentalProductDetailModal = ({ visible, productId, onClose }) => {
  const navigation = useNavigation();
  
  // Tạo state để lưu chi tiết sản phẩm sau khi fetch
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    // Nếu modal đang mở & có productId => Fetch chi tiết sản phẩm
    if (visible && productId) {
      const fetchProductDetail = async () => {
        try {
          const response = await fetch(
            `http://14.225.220.108:2602/product/get-product-by-id?id=${productId}`
          );
          const data = await response.json();
          if (data.isSuccess && data.result) {
            setProductData(data.result);
          } else {
            console.log('Unexpected Data:', data);
          }
        } catch (error) {
          console.error('Error fetching product detail:', error);
        }
      };
      fetchProductDetail();
    } else {
      // Nếu modal tắt hoặc chưa có productId => reset productData
      setProductData(null);
    }
  }, [visible, productId]);

  // Nếu modal chưa mở hoặc chưa có productId, không render Modal
  if (!visible || !productId) {
    return null;
  }

  // Nếu đang fetch hoặc chưa có productData => Hiển thị tạm "Loading..."
  if (!productData) {
    return (
      <Modal visible={visible} transparent={true} onRequestClose={onClose}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text>Đang tải dữ liệu sản phẩm...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  const handleRentProduct = async () => {
    try {
      const accountID = await AsyncStorage.getItem('accountId');
      const token = await AsyncStorage.getItem('token');

      if (!accountID || !token) {
        Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để thuê sản phẩm.');
        return;
      }

      onClose(); // Đóng modal trước khi chuyển trang
      navigation.navigate('OrderProductRental', { productID: productData.productID });
    } catch (error) {
      console.error('Error checking login status:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };
  const brandNames = [
    "Canon", "Nikon", "Sony", "Fujifilm", "Olympus", "Panasonic", 
    "Leica", "Pentax", "Hasselblad", "Sigma", "GoPro", "DJI", 
    "Polaroid", "Kodak", "Blackmagic Design", "Phase One", 
    "Z Cam", "RED Digital Cinema", "Arri", "YI Technology", 
    "Instax", "Lomography", "Samsung", "CineAlta"
  ];
  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Nút đóng */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Hình ảnh sản phẩm */}
            <Image
              source={{ uri: productData.listImage?.[0]?.image }}
              style={styles.productImage}
            />

            {/* Tên sản phẩm */}
            <Text style={styles.productName}>{productData.productName}</Text>

            {/* Thông tin chi tiết */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Serial Number:</Text>
              <Text style={styles.infoValue}>{productData.serialNumber || 'N/A'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mô tả:</Text>
              <Text style={styles.infoValue}>{productData.productDescription || 'Không có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cọc sản phẩm:</Text>
              <Text style={styles.infoValue}>
                {productData.depositProduct
                  ? productData.depositProduct.toLocaleString()
                  : 'Không có'} vnđ
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/giờ:</Text>
              <Text style={styles.infoValue}>
                {productData.pricePerHour
                  ? productData.pricePerHour.toLocaleString()
                  : 'Không có'} vnđ
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/ngày:</Text>
              <Text style={styles.infoValue}>
                {productData.pricePerDay
                  ? productData.pricePerDay.toLocaleString()
                  : 'Không có'} vnđ
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/tuần:</Text>
              <Text style={styles.infoValue}>
                {productData.pricePerWeek
                  ? productData.pricePerWeek.toLocaleString()
                  : 'Không có'} vnđ
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/tháng:</Text>
              <Text style={styles.infoValue}>
                {productData.pricePerMonth
                  ? productData.pricePerMonth.toLocaleString()
                  : 'Không có'} vnđ
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thương hiệu:</Text>
              <Text style={styles.infoValue}>{brandNames[productData.brand] || 'Không có'}</Text>
            </View>
            {productData.rating > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Đánh giá:</Text>
              <Text style={styles.infoValue}>{productData.rating || 0} ⭐</Text>
            </View>
            )}
          </ScrollView>

          {/* Nút Thuê sản phẩm */}
          <Button title="Thuê sản phẩm" onPress={handleRentProduct} />
        </View>
      </View>
    </Modal>
  );
};

export default RentalProductDetailModal;

// CSS giữ nguyên
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#afaaa8',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: 'bold',
    flex: 1,
  },
  infoValue: {
    flex: 2,
  },
});
