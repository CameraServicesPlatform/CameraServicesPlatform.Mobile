import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

const RentalProductDetailModal = ({ visible, item, onClose }) => {
  if (!item) return null;

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
              <Text style={styles.infoValue}>{item.depositProduct || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/giờ:</Text>
              <Text style={styles.infoValue}>{item.pricePerHour || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/ngày:</Text>
              <Text style={styles.infoValue}>{item.pricePerDay || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/tuần:</Text>
              <Text style={styles.infoValue}>{item.pricePerWeek || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá (Thuê)/tháng:</Text>
              <Text style={styles.infoValue}>{item.pricePerMonth || 'Không có'} đ</Text>
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
    fontSize: 18,
    color: '#ff0000',
  },
  productImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
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
