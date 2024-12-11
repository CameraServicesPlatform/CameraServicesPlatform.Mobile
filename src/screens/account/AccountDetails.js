import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountDetails = ({ navigation }) => {
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountID, setAccountID] = useState(null);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const storedAccountID = await AsyncStorage.getItem('accountId');
        if (!storedAccountID) {
          console.error('Không tìm thấy accountID');
          setLoading(false);
          return;
        }
        setAccountID(storedAccountID);

        const response = await fetch(
          `http://14.225.220.108:2602/account/get-account-by-userId/${storedAccountID}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

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

  const {
    phoneNumber = 'Trống',
    firstName = 'Trống',
    lastName = 'Trống',
    job = '',
    hobby = '',
    gender = 0,
    address = 'Trống',
    bankName = 'Trống',
    accountNumber = 'Trống',
    accountHolder = 'Trống',
    frontOfCitizenIdentificationCard = null,
    backOfCitizenIdentificationCard = null,
    img = null,
  } = accountDetails;

  const genderDisplay =
    gender === 0 ? 'Nam' : gender === 1 ? 'Nữ' : 'Không muốn đề cập';

  const jobOptions = [
    'Học sinh',
    'Nhiếp ảnh chuyên nghiệp',
    'Nhiếp ảnh tự do',
    'Người sáng tạo nội dung',
    'Người mới bắt đầu',
    'Sinh viên nhiếp ảnh',
    'Người yêu thích du lịch',
    'Người dùng thông thường',
  ];

  const hobbyOptions = [
    'Chụp ảnh phong cảnh',
    'Chụp ảnh chân dung',
    'Chụp ảnh động vật hoang dã',
    'Chụp ảnh đường phố',
    'Chụp ảnh cận cảnh',
    'Chụp ảnh thể thao',
  ];

  const navigateToUpdateAccount = () => {
    if (accountID) {
      navigation.navigate('UpdateAccount', { accountID });
    }
  };

  return (
    <View style={styles.container}>
      {img && <Image source={{ uri: img }} style={styles.profileImage} />}
      <ScrollView style={styles.scrollContainer}>
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
          {job !== null && job >= 0 && job < jobOptions.length ? jobOptions[job] : 'Trống'}
        </Text>
        <Text style={styles.item}>
          <Text style={styles.label}>Sở thích: </Text>
          {hobby !== null && hobby >= 0 && hobby < hobbyOptions.length ? hobbyOptions[hobby] : 'Trống'}
        </Text>
        <Text style={styles.item}>
          <Text style={styles.label}>Giới tính: </Text>
          {genderDisplay}
        </Text>
        <Text style={styles.item}>
          <Text style={styles.label}>Địa chỉ: </Text>
          {address}
        </Text>
        <Text style={styles.label}>Ảnh CMND mặt trước:</Text>
        {frontOfCitizenIdentificationCard ? (
          <Image source={{ uri: frontOfCitizenIdentificationCard }} style={styles.image} />
        ) : (
          <Text style={styles.item}>Trống</Text>
        )}
        <Text style={styles.label}>Ảnh CMND mặt sau:</Text>
        {backOfCitizenIdentificationCard ? (
          <Image source={{ uri: backOfCitizenIdentificationCard }} style={styles.image} />
        ) : (
          <Text style={styles.item}>Trống</Text>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Cập nhật thông tin" onPress={navigateToUpdateAccount} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
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
    marginTop: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default AccountDetails;
