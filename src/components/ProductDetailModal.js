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
  const [productData, setProductData] = useState(null);

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
      setProductData(null);
    }
  }, [visible, productId]);

  if (!visible || !productId) {
    return null;
  }

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

  // Kiểm tra xem priceBuy có giá trị (không null, không rỗng)
  // Lưu ý: tùy cấu trúc dữ liệu, bạn kiểm tra thêm kiểu number hay string.
  const hasPriceBuy = productData.priceBuy !== null && productData.priceBuy !== '';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>

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

            {/* Thương hiệu */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thương hiệu:</Text>
              <Text style={styles.infoValue}>{productData.brand || 'Không có'}</Text>
            </View>

            {/* Đánh giá */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Đánh giá:</Text>
              <Text style={styles.infoValue}>{productData.rating || 0} ⭐</Text>
            </View>

            {/* Serial Number */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Serial Number:</Text>
              <Text style={styles.infoValue}>{productData.serialNumber || 'N/A'}</Text>
            </View>

            {/* Mô tả */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mô tả:</Text>
              <Text style={styles.infoValue}>{productData.productDescription || 'Không có'}</Text>
            </View>

            {hasPriceBuy ? (
              // Nếu có priceBuy, hiển thị giá mua và ẩn các field liên quan tới thuê
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Giá mua:</Text>
                <Text style={styles.infoValue}>{productData.priceBuy} đ</Text>
              </View>
            ) : (
              // Ngược lại, hiển thị các thông tin giá thuê
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cọc sản phẩm:</Text>
                  <Text style={styles.infoValue}>
                    {productData.depositProduct || 'Không có'} đ
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Giá (Thuê)/giờ:</Text>
                  <Text style={styles.infoValue}>
                    {productData.pricePerHour || 'Không có'} đ
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Giá (Thuê)/ngày:</Text>
                  <Text style={styles.infoValue}>
                    {productData.pricePerDay || 'Không có'} đ
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Giá (Thuê)/tuần:</Text>
                  <Text style={styles.infoValue}>
                    {productData.pricePerWeek || 'Không có'} đ
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Giá (Thuê)/tháng:</Text>
                  <Text style={styles.infoValue}>
                    {productData.pricePerMonth || 'Không có'} đ
                  </Text>
                </View>
              </>
            )}
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
