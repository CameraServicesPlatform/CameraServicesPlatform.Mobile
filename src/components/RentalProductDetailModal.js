import React from 'react';
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

const RentalProductDetailModal = ({ visible, item, onClose }) => {
  const navigation = useNavigation(); // Lấy navigation từ context

  if (!item) return null;

  const handleRentProduct = async () => {
    try {
      const accountID = await AsyncStorage.getItem('accountId');
      const token = await AsyncStorage.getItem('token');

      if (!accountID || !token) {
        Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để thuê sản phẩm.');
        return;
      }

      onClose(); // Đóng modal trước khi chuyển trang
      navigation.navigate('OrderProductRental', { productID: item.productID });
    } catch (error) {
      console.error('Error checking login status:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

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
            <Image source={{ uri: item.listImage[0]?.image }} style={styles.productImage} />

            {/* Tên sản phẩm */}
            <Text style={styles.productName}>{item.productName}</Text>

            {/* Thông tin chi tiết */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Serial Number:</Text>
              <Text style={styles.infoValue}>{item.serialNumber || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mô tả:</Text>
              <Text style={styles.infoValue}>{item.productDescription || 'Không có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cọc sản phẩm:</Text>
              <Text style={styles.infoValue}>{item.depositProduct.toLocaleString() || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/giờ:</Text>
              <Text style={styles.infoValue}>{item.pricePerHour.toLocaleString() || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/ngày:</Text>
              <Text style={styles.infoValue}>{item.pricePerDay.toLocaleString() || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/tuần:</Text>
              <Text style={styles.infoValue}>{item.pricePerWeek.toLocaleString() || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/tháng:</Text>
              <Text style={styles.infoValue}>{item.pricePerMonth.toLocaleString() || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thương hiệu:</Text>
              <Text style={styles.infoValue}>{item.brand || 'Không có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Đánh giá:</Text>
              <Text style={styles.infoValue}>{item.rating || 0} ⭐</Text>
            </View>
          </ScrollView>

          {/* Nút Thuê sản phẩm */}
          <Button title="Thuê sản phẩm" onPress={handleRentProduct} />
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

export default RentalProductDetailModal;
