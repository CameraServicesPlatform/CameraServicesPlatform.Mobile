import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import ProductCard from '../components/ProductCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const SettingsScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const accountID = await AsyncStorage.getItem('accountId');
      console.log('accountID:', accountID);
  
      if (!accountID) {
        Alert.alert('Thông báo', 'Vui lòng đăng nhập');
        setFavorites([]); // Reset danh sách yêu thích
        setLoading(false);
        return;
      }
  
      const response = await fetch(
        `http://14.225.220.108:2602/wishlist/get-wish-list-by-member-id?AccountID=${accountID}`
      );
      const data = await response.json();
  
      console.log('Dữ liệu từ API:', data.result.items);
  
      if (data.isSuccess) {
        const favoritesWithDetails = await Promise.all(
          data.result.items.map(async (favorite) => {
            const productResponse = await fetch(
              `http://14.225.220.108:2602/product/get-product-by-id?id=${favorite.productID}`
            );
            const productData = await productResponse.json();
            return { ...favorite, ...productData.result }; // Kết hợp dữ liệu wishlist và sản phẩm
          })
        );
        setFavorites(favoritesWithDetails);
      } else {
        Alert.alert('Lỗi', 'Không thể lấy danh sách yêu thích.');
        setFavorites([]); // Reset nếu không thành công
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lấy danh sách yêu thích.');
      setFavorites([]); // Reset khi xảy ra lỗi
    } finally {
      setLoading(false);
    }
  };
  

  const removeFavorite = async (wishlistID) => {
    try {
      const response = await fetch(
        `http://14.225.220.108:2602/wishlist/delete-wish-list-detail-by-id?wishlistId=${wishlistID}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (data.isSuccess) {
        Alert.alert('Thành công', 'Đã xóa sản phẩm khỏi danh sách yêu thích.');
        fetchFavorites(); // Reload lại danh sách yêu thích
      } else {
        Alert.alert('Lỗi', 'Không thể xóa sản phẩm khỏi danh sách yêu thích.');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xóa sản phẩm khỏi danh sách yêu thích.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải danh sách yêu thích...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Không có sản phẩm yêu thích nào.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.productID}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onToggleFavorite={() => removeFavorite(item.wishlistID)} // Xóa sản phẩm khỏi danh sách yêu thích
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default SettingsScreen;
