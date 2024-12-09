import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode'; // Đảm bảo import đúng

const Login = ({ navigation, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const apiUrl = 'http://14.225.220.108:2602/account/login';
    const payload = { email, password };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.isSuccess && data.result?.token) {
        const token = data.result.token;

        // Lưu token vào AsyncStorage
        await AsyncStorage.setItem('token', token);

        // Tách AccountId từ token
        try {
          const decodeJWT = (token) => {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            return JSON.parse(jsonPayload);
          };
          
          const decodedToken = decodeJWT(token);
          console.log('Decoded Token:', decodedToken);
          
          const accountId = decodedToken["AccountId"]; 
          if (accountId) {
            // Lưu AccountId vào AsyncStorage
            await AsyncStorage.setItem('accountId', accountId);
            console.log('AccountId đã lưu:', accountId);
          } else {
            console.error('Không tìm thấy AccountId trong token.');
          }
        } catch (error) {
          console.error('Lỗi khi decode token:', error);
        }
        

        Alert.alert('Đăng nhập thành công!');

        // Điều hướng
        onLoginSuccess();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        navigation.navigate('Account'); // Điều hướng đến màn hình Account
      } else {
        Alert.alert('Đăng nhập thất bại', data.messages?.join('\n') || 'Lỗi không xác định.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
      console.error('Error during login:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
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
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default Login;
