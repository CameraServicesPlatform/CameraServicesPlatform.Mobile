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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SaleProductDetailModal = ({ visible, item, onClose }) => {
  const navigation = useNavigation(); // Lấy navigation từ context

  if (!item) return null;

  const handleBuyProduct = async () => {
    const accountID = await AsyncStorage.getItem('accountId');
    const token = await AsyncStorage.getItem('token');

    if (!accountID || !token) {
      Alert.alert('Thông báo', 'Bạn cần đăng nhập để mua sản phẩm.');
      return;
    }

    onClose(); // Đóng modal trước khi chuyển trang
    navigation.navigate('OrderProductSale', { productID: item.productID });
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
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Image source={{ uri: item.listImage[0]?.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.productName}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mô tả:</Text>
              <Text style={styles.infoValue}>{item.productDescription || 'Không có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá mua:</Text>
              <Text style={styles.infoValue}>{item.priceBuy || 'Không có'} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Đánh giá:</Text>
              <Text style={styles.infoValue}>{item.rating || 0} ⭐</Text>
            </View>
          </ScrollView>

          <Button title="Mua sản phẩm" onPress={handleBuyProduct} />
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

export default SaleProductDetailModal;
