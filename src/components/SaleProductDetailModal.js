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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SaleProductDetailModal = ({ visible, productId, onClose }) => {
  const navigation = useNavigation();

  // State để lưu dữ liệu sản phẩm fetch được
  const [productData, setProductData] = useState(null);

  // Mỗi khi modal mở & có productId, ta fetch chi tiết sản phẩm
  useEffect(() => {
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
      // Nếu modal đóng hoặc chưa có productId => reset
      setProductData(null);
    }
  }, [visible, productId]);

  // Nếu modal chưa mở hoặc chưa có productId => không render gì
  if (!visible || !productId) {
    return null;
  }

  // Nếu đang fetch hoặc chưa có data => Hiển thị "Loading..."
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

  // Hàm xử lý mua sản phẩm
  const handleBuyProduct = async () => {
    const accountID = await AsyncStorage.getItem('accountId');
    const token = await AsyncStorage.getItem('token');

    if (!accountID || !token) {
      Alert.alert('Thông báo', 'Bạn cần đăng nhập để mua sản phẩm.');
      return;
    }

    onClose(); // Đóng modal trước khi chuyển trang
    navigation.navigate('OrderProductSale', { productID: productData.productID });
  };

  const brandNames = [
    "Canon", "Nikon", "Sony", "Fujifilm", "Olympus", "Panasonic", 
    "Leica", "Pentax", "Hasselblad", "Sigma", "GoPro", "DJI", 
    "Polaroid", "Kodak", "Blackmagic Design", "Phase One", 
    "Z Cam", "RED Digital Cinema", "Arri", "YI Technology", 
    "Instax", "Lomography", "Samsung", "CineAlta"
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Nút đóng */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Hình ảnh sản phẩm */}
            <Image
              source={{ uri: productData?.listImage?.[0]?.image }}
              style={styles.productImage}
            />

            {/* Tên sản phẩm */}
            <Text style={styles.productName}>{productData.productName}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thương hiệu:</Text>
              <Text style={styles.infoValue}>{brandNames[productData.brand] || 'Đang cập nhật'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mô tả:</Text>
              <Text style={styles.infoValue}>{productData.productDescription || 'Đang cập nhật'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá mua:</Text>
              <Text style={styles.infoValue}>
                {productData.priceBuy
                  ? productData.priceBuy.toLocaleString()
                  : 'Đang cập nhật'} vnđ
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số lượng:</Text>
              <Text style={styles.infoValue}>{productData.quantity || 0}</Text>
            </View>
            {productData.rating != 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Đánh giá:</Text>
              <Text style={styles.infoValue}>{productData.rating || 0} ⭐</Text>
            </View>
            )}
          </ScrollView>

          {/* Hiển thị nút dựa trên số lượng sản phẩm */}
          {productData.quantity > 0 ? (
            <Button title="Mua sản phẩm" onPress={handleBuyProduct} />
          ) : (
            <TouchableOpacity style={styles.disabledButton} disabled={true}>
              <Text style={styles.disabledButtonText}>Hết hàng</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SaleProductDetailModal;

// CSS giữ nguyên, thêm styles cho nút Hết hàng
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
    elevation: 5,
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
    marginTop: 20,
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
  disabledButton: {
    backgroundColor: '#d3d3d3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButtonText: {
    color: '#7f7f7f',
    fontWeight: 'bold',
  },
});