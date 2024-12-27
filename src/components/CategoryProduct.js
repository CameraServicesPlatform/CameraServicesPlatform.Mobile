import React, { useState } from 'react';
import { 
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet 
} from 'react-native';

// Import modal hiển thị chi tiết (đã có sẵn)
import ProductDetailModal from './ProductDetailModal';

const CategoryProduct = ({ products }) => {
  // State để quản lý modal
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Khi bấm vào một sản phẩm => mở modal
  const handlePressProduct = (productId) => {
    setSelectedProductId(productId);
    setModalVisible(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProductId(null);
  };

  // Hàm lấy label cho status (nếu cần)
  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return 'Còn hàng';
      case 1:
        return 'Cho thuê';
      case 2:
        return 'Đã thuê';
      case 3:
        return 'Đã bán';
      default:
        return 'Không xác định';
    }
  };

  // Render cho từng sản phẩm
  const renderProductItem = ({ item }) => {
    // Kiểm tra priceBuy (mua) hay không => nếu null/0 thì hiển thị giá thuê
    const hasPriceBuy = item.priceBuy !== null && item.priceBuy !== '' && item.priceBuy !== 0;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => handlePressProduct(item.productID)}
      >
        {/* Ảnh sản phẩm */}
        <Image
          source={{ uri: item.listImage?.[0]?.image }}
          style={styles.productImage}
        />

        {/* Thông tin cơ bản */}
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.productStatus}>
            Trạng thái: {getStatusLabel(item.status)}
          </Text>

          {/* Hiển thị giá tùy theo priceBuy hay không */}
          {hasPriceBuy ? (
            // Nếu có priceBuy => giá mua
            <Text style={styles.productPrice}>
              Giá mua: {item.priceBuy.toLocaleString()} đ
            </Text>
          ) : (
            // Ngược lại => giá thuê
            <>
              <Text style={styles.productPrice}>
                Cọc: {item.depositProduct?.toLocaleString() || 'Không có'} đ
              </Text>
              <Text style={styles.productPrice}>
                Giá (Thuê)/giờ: {item.pricePerHour?.toLocaleString() || 'Không có'} đ
              </Text>
              <Text style={styles.productPrice}>
                Giá (Thuê)/ngày: {item.pricePerDay?.toLocaleString() || 'Không có'} đ
              </Text>
              <Text style={styles.productPrice}>
                Giá (Thuê)/tuần: {item.pricePerWeek?.toLocaleString() || 'Không có'} đ
              </Text>
              <Text style={styles.productPrice}>
                Giá (Thuê)/tháng: {item.pricePerMonth?.toLocaleString() || 'Không có'} đ
              </Text>
            </>
          )}

          {/* Đánh giá */}
          <Text style={styles.productRating}>Đánh giá: {item.rating || 0} ⭐</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Danh sách sản phẩm */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.productID}
        renderItem={renderProductItem}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có sản phẩm nào</Text>}
        keyboardShouldPersistTaps="handled"
      />

      {/* Modal chi tiết sản phẩm (tự fetch dựa trên productId) */}
      <ProductDetailModal
        visible={modalVisible}
        productId={selectedProductId}
        onClose={handleCloseModal}
      />
    </View>
  );
};

export default CategoryProduct;

// Styles
const styles = StyleSheet.create({
  productList: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productStatus: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  productRating: {
    fontSize: 14,
    color: '#555',
  },
});
