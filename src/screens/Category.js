import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// Import component mới
import CategoryProduct from '../components/CategoryProduct';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

      {/* Danh sách sản phẩm -> Gọi component CategoryProduct */}
      <View style={styles.listContainer}>
        <CategoryProduct products={products} />
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
    height: 60,
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
    flex: 1,
  },
});

export default Category;
