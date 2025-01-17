import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const SupplierDetailModal = ({ visible, supplier, onClose }) => {
  if (!supplier) return null;
  
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

          <ScrollView>
            {/* Tên nhà cung cấp */}
            <Text style={styles.title}>{supplier.supplierName}</Text>

            {/* Thông tin chi tiết */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mô tả:</Text>
              <Text style={styles.infoValue}>
                {supplier.supplierDescription || 'Đang cập nhật'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Địa chỉ:</Text>
              <Text style={styles.infoValue}>
                {supplier.supplierAddress || 'Đang cập nhật'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Liên hệ:</Text>
              <Text style={styles.infoValue}>
                {supplier.contactNumber || 'Đang cập nhật'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày tạo:</Text>
              <Text style={styles.infoValue}>
                {supplier.createdAt || 'Đang cập nhật'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày cập nhật:</Text>
              <Text style={styles.infoValue}>
                {supplier.updatedAt || 'Đang cập nhật'}
              </Text>
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
    flex: 1,
  },
  infoValue: {
    flex: 2,
  },
});

export default SupplierDetailModal;
