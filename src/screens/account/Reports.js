import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Reports = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Báo cáo</Text>
      <Text style={styles.content}>
        Tại đây bạn có thể xem và quản lý các báo cáo liên quan đến hoạt động tài khoản của bạn.
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

export default Reports;
