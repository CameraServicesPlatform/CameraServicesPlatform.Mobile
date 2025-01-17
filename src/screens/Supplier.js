import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import SupplierDetailModal from '../components/SupplierDetailModal';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState(null); // Nhà cung cấp được chọn
  const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị modal

  // Gọi API để lấy danh sách nhà cung cấp
  const fetchSuppliers = async () => {
    const apiUrl = `http://14.225.220.108:2602/supplier/get-all-supplier?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.isSuccess) {
        setSuppliers(data.result.items || []);
        setTotalPages(data.result.totalPages || 1);
      } else {
        console.error('Error fetching suppliers:', data.messages);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [pageIndex]);

  // Hiển thị thanh phân trang
  const renderPagination = () => {
    const pages = [];
    const maxPageButtons = 3;
    const startPage = Math.max(1, pageIndex - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          title={String(i)}
          onPress={() => setPageIndex(i)}
          color={i === pageIndex ? 'blue' : 'gray'}
        />
      );
    }

    return (
      <View style={styles.pagination}>
        <Button title="First" onPress={() => setPageIndex(1)} disabled={pageIndex === 1} />
        <Button title="Back" onPress={() => setPageIndex(pageIndex - 1)} disabled={pageIndex === 1} />
        {pages}
        <Button title="Next" onPress={() => setPageIndex(pageIndex + 1)} disabled={pageIndex === totalPages} />
        <Button title="Last" onPress={() => setPageIndex(totalPages)} disabled={pageIndex === totalPages} />
      </View>
    );
  };

  // Hiển thị chi tiết nhà cung cấp khi nhấn
  const showSupplierDetail = (supplier) => {
    setSelectedSupplier(supplier);
    setIsModalVisible(true);
  };

  // Render từng nhà cung cấp
  const renderSupplier = ({ item }) => (
    <TouchableOpacity onPress={() => showSupplierDetail(item)}>
      <View style={styles.card}>
        <Text style={styles.name}>{item.supplierName}</Text>
        <Text style={styles.details}>Mô tả: {item.supplierDescription}</Text>
        <Text style={styles.details}>Địa chỉ: {item.supplierAddress}</Text>
        <Text style={styles.details}>Liên hệ: {item.contactNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={suppliers}
        keyExtractor={(item) => item.supplierID}
        renderItem={renderSupplier}
      />

      {/* Modal hiển thị thông tin chi tiết */}
      <SupplierDetailModal
        visible={isModalVisible}
        supplier={selectedSupplier}
        onClose={() => setIsModalVisible(false)}
      />

      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default Supplier;
