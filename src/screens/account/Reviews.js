import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Reviews = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đánh giá của bạn</Text>
      <Text style={styles.content}>
        Đây là nơi hiển thị và quản lý các đánh giá bạn đã viết. Bạn có thể sửa hoặc xóa các đánh giá tại đây.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Reviews;
