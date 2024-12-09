import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountDetails = () => {
  const [accountDetails, setAccountDetails] = useState(null); // Lưu thông tin tài khoản
  const [loading, setLoading] = useState(true); // Trạng thái loading

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        // Lấy accountID từ AsyncStorage
        const accountID = await AsyncStorage.getItem('accountId');
        if (!accountID) {
          console.error('Không tìm thấy accountID');
          setLoading(false);
          return;
        }

        // Gọi API lấy thông tin tài khoản
        const response = await fetch(`http://14.225.220.108:2602/account/get-account-by-userId/${accountID}`, {
            method: 'POST', // Thay vì 'GET'
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
        
        // Kiểm tra phản hồi HTTP
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON từ phản hồi

        // Kiểm tra dữ liệu trả về
        if (data.isSuccess && data.result) {
          setAccountDetails(data.result);
        } else {
          console.error('Lỗi khi lấy thông tin tài khoản:', data.messages);
          setAccountDetails(null);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setAccountDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải thông tin tài khoản...</Text>
      </View>
    );
  }

  if (!accountDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không thể tải thông tin tài khoản.</Text>
      </View>
    );
  }

  // Xử lý giá trị null
  const {
    phoneNumber = 'Trống',
    firstName = 'Trống',
    lastName = 'Trống',
    job = 'Trống',
    hobby = 'Trống',
    gender = 0,
    address = 'Trống',
  } = accountDetails;

  const genderDisplay = gender === 1 ? 'Nam' : gender === 2 ? 'Nữ' : 'Không muốn đề cập';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin Tài khoản</Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Số điện thoại: </Text>
        {phoneNumber}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Họ: </Text>
        {firstName}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Tên: </Text>
        {lastName}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Nghề nghiệp: </Text>
        {job}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Sở thích: </Text>
        {hobby}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Giới tính: </Text>
        {genderDisplay}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Địa chỉ: </Text>
        {address}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default AccountDetails;
