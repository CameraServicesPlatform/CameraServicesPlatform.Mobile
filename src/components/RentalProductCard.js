import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Hàm tiện ích để chuyển định dạng chuỗi ISO (VD: "2024-12-17T14:44:13.9407487") 
// sang chuỗi "HH:mm DD/MM/YYYY"
const formatDateTime = (isoString) => {
  if (!isoString) return 'Không có';

  const dateObj = new Date(isoString);

  // Lấy ngày/tháng/năm
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString();

  // Lấy giờ/phút
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  // Format lại
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

const RentalProductCard = ({ item, isFavorite, onToggleFavorite }) => {
  return (
    <View style={styles.productContainer}>
      {/* Biểu tượng trái tim */}
      <TouchableOpacity
        style={styles.heartIcon}
        onPress={() => onToggleFavorite(item)}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color="red"
        />
      </TouchableOpacity>

      {/* Hình ảnh sản phẩm */}
      <Image source={{ uri: item.listImage[0]?.image }} style={styles.productImage} />

      {/* Thông tin sản phẩm */}
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.productName}</Text>
        
        {/* Sử dụng formatDateTime để hiển thị ngày sản xuất */}
        <Text style={styles.productText}>
          Ngày sản xuất:{' '}
          {item.dateOfManufacture ? formatDateTime(item.dateOfManufacture) : 'Không có'}
        </Text>

        <Text style={styles.productText}>
          Giá thuê giờ: {item.pricePerHour?.toLocaleString() || 'Không có'} vnđ
        </Text>
        <Text style={styles.productText}>
          Giá thuê ngày: {item.pricePerDay?.toLocaleString() || 'Không có'} vnđ
        </Text>
        <Text style={styles.productText}>
          Giá thuê tuần: {item.pricePerWeek?.toLocaleString() || 'Không có'} vnđ
        </Text>
        <Text style={styles.productText}>
          Giá thuê tháng: {item.pricePerMonth?.toLocaleString() || 'Không có'} vnđ
        </Text>
        <Text style={styles.productText}>
          Đánh giá: {item.rating || 0} ⭐
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    position: 'relative',
    padding: 10,
    alignItems: 'center',
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  productText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
});

export default RentalProductCard;
