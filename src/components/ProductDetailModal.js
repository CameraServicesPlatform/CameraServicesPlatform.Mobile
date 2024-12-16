import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

const ProductDetailModal = ({ visible, productId, onClose }) => {
  // Tạo state để lưu chi tiết sản phẩm sau khi fetch
  const [productData, setProductData] = useState(null);

  // Khi modal mở (visible=true) và có productId, ta fetch chi tiết sản phẩm
  useEffect(() => {
    if (visible && productId) {
      const fetchProductDetail = async () => {
        try {
          const response = await fetch(`http://14.225.220.108:2602/product/get-product-by-id?id=${productId}`);
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
      // Nếu tắt modal hoặc chưa có productId, reset lại productData
      setProductData(null);
    }
  }, [visible, productId]);

  // Nếu modal chưa mở hoặc chưa có ID, không render gì cả
  if (!visible || !productId) {
    return null;
  }

  // Nếu đang fetch hoặc chưa có productData, có thể hiển thị "Loading..."
  if (!productData) {
    return (
      <Modal
        visible={visible}
        transparent={true}
        onRequestClose={onClose}
        animationType="slide"
      >
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

  // Render thông tin sản phẩm sau khi đã fetch xong
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
              <Text style={styles.infoValue}>{productData.depositProduct || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/giờ:</Text>
              <Text style={styles.infoValue}>{productData.pricePerHour || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/ngày:</Text>
              <Text style={styles.infoValue}>{productData.pricePerDay || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/tuần:</Text>
              <Text style={styles.infoValue}>{productData.pricePerWeek || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/tháng:</Text>
              <Text style={styles.infoValue}>{productData.pricePerMonth || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thương hiệu:</Text>
              <Text style={styles.infoValue}>{productData.brand || 'Không có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Đánh giá:</Text>
              <Text style={styles.infoValue}>{productData.rating || 0} ⭐</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

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
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff0000',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
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

export default ProductDetailModal;
