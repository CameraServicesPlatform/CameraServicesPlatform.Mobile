import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedDataScreen = () => {
  const [savedData, setSavedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const data = JSON.parse(await AsyncStorage.getItem('savedData')) || [];
        setSavedData(data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedData();
  }, []);

  const handleOpenLink = (link) => {
    Linking.openURL(link).catch((err) =>
      Alert.alert('Lỗi', 'Không thể mở đường dẫn thanh toán: ' + err)
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!savedData.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Không có dữ liệu tạm thời.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử Thanh toán</Text>
      <FlatList
        data={savedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.text}>Tên sản phẩm: {item.productName}</Text>
            <TouchableOpacity style={styles.linkButton} onPress={() => handleOpenLink(item.paymentLink)}>
              <Text style={styles.linkButtonText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  linkButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SavedDataScreen;
