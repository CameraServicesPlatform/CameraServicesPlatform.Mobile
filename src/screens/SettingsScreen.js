import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ProductCard from '../components/ProductCard';

const SettingsScreen = ({ route }) => {
  // Lấy `favorites` từ route.params và kiểm tra null
  const { favorites } = route.params || {}; 

  // Kiểm tra nếu không có sản phẩm yêu thích
  if (!favorites || favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Không có sản phẩm yêu thích nào.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Danh sách sản phẩm yêu thích */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.productID}
        renderItem={({ item }) => (
          <ProductCard item={item} isFavorite={true} onToggleFavorite={() => {}} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default SettingsScreen;
