import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

const Category = () => {
  const [categories, setCategories] = useState([]); // Danh sách category
  const [products, setProducts] = useState([]); // Danh sách sản phẩm theo category
  const [selectedCategory, setSelectedCategory] = useState(null); // Danh mục được chọn

  const fetchCategories = async () => {
    const apiUrl = 'http://14.225.220.108:2602/category/get-all-category';
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.isSuccess) {
        setCategories(data.result || []);
      } else {
        console.error('Error fetching categories:', data.messages);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProductsByCategory = async (categoryID) => {
    const apiUrl = `http://14.225.220.108:2602/product/get-product-by-category-id?filter=${categoryID}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.isSuccess) {
        setProducts(data.result || []);
      } else {
        console.error('Error fetching products:', data.messages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    fetchProductsByCategory(category.categoryID);
  };

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

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.listImage[0]?.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productStatus}>Trạng thái: {getStatusLabel(item.status)}</Text>
        <Text style={styles.productPrice}>
          Giá: {item.priceBuy ? `${item.priceBuy} đ` : 'Không có'}
        </Text>
        <Text style={styles.productRating}>Đánh giá: {item.rating || 0} ⭐</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách danh mục</Text>

      {/* Danh sách category (cuộn ngang) */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.categoryID}
              style={[
                styles.categoryButton,
                selectedCategory?.categoryID === category.categoryID && styles.activeCategoryButton,
              ]}
              onPress={() => handleCategoryPress(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory?.categoryID === category.categoryID && styles.activeCategoryButtonText,
                ]}
              >
                {category.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Danh sách sản phẩm */}
      <View style={styles.listContainer}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.productID}
          renderItem={renderProduct}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={<Text style={styles.emptyText}>Không có sản phẩm nào</Text>}
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  categoryContainer: {
    height: 60, // Cố định chiều cao của container danh mục
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCategoryButton: {
    backgroundColor: '#0056b3',
  },
  categoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  activeCategoryButtonText: {
    color: '#f1f1f1',
  },
  listContainer: {
    flex: 1, // Đảm bảo FlatList chiếm toàn bộ chiều cao còn lại
  },
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
    marginBottom: 5,
  },
  productRating: {
    fontSize: 14,
    color: '#555',
  },
});

export default Category;
