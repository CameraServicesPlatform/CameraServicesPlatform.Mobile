import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';

const Policy = () => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [activeFilter, setActiveFilter] = useState(0);

  const fetchPolicies = async () => {
    const apiUrl = 'http://14.225.220.108:2602/policy/get-all-policy';
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.isSuccess) {
        setPolicies(data.result || []);
        filterPolicies(data.result, 0);
      } else {
        console.error('Error fetching policies:', data.messages);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  };

  const filterPolicies = (data, type) => {
    const filtered = data.filter((policy) => policy.policyType === type);
    setFilteredPolicies(filtered);
  };

  const handleFilterChange = (type) => {
    setActiveFilter(type);
    filterPolicies(policies, type);
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const renderPolicy = ({ item }) => (
    <View style={styles.policyCard}>
      <Text style={styles.policyContent}>{item.policyContent}</Text>
      <Text style={styles.policyDate}>Ngày hiệu lực: {item.effectiveDate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chính Sách</Text>

      {/* Thanh nút lọc */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 0 && styles.activeFilterButton]}
            onPress={() => handleFilterChange(0)}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === 0 && styles.activeFilterButtonText,
              ]}
            >
              Hệ Thống
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 1 && styles.activeFilterButton]}
            onPress={() => handleFilterChange(1)}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === 1 && styles.activeFilterButtonText,
              ]}
            >
              Nhà Cung Cấp
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 2 && styles.activeFilterButton]}
            onPress={() => handleFilterChange(2)}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === 2 && styles.activeFilterButtonText,
              ]}
            >
              Thành Viên
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Danh sách chính sách */}
      <View style={styles.listContainer}>
        <FlatList
          data={filteredPolicies}
          keyExtractor={(item) => item.policyID.toString()}
          renderItem={renderPolicy}
          contentContainerStyle={styles.policyList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không có chính sách nào để hiển thị.</Text>
          }
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#0056b3',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activeFilterButtonText: {
    color: '#f1f1f1',
  },
  listContainer: {
    flex: 1, // Đảm bảo FlatList chiếm toàn bộ chiều cao còn lại
  },
  policyList: {
    paddingBottom: 10, // Tạo khoảng trống bên dưới danh sách
  },
  policyCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  policyContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  policyDate: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});

export default Policy;
