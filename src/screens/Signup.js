import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isVerificationStep, setIsVerificationStep] = useState(false); // Bước xác thực
  const [verificationCode, setVerificationCode] = useState(''); // Mã xác thực dưới dạng string

  // Xử lý đăng ký
  const handleSignUp = async () => {
    const apiUrl = `http://14.225.220.108:2602/account/create-account?Email=${email}&FirstName=${firstName}&LastName=${lastName}&Password=${password}&PhoneNumber=${phoneNumber}`;
    
    try {
      const response = await fetch(apiUrl, { method: 'POST' });
      const data = await response.json();

      if (data.isSuccess) {
        Alert.alert('Đăng ký thành công!', 'Vui lòng nhập mã xác thực.');
        setIsVerificationStep(true); // Chuyển sang bước xác thực tài khoản
      } else {
        Alert.alert('Lỗi', data.messages?.join('\n') || 'Đăng ký thất bại.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
    }
  };

  // Xử lý xác thực tài khoản
  const handleVerifyAccount = async () => {
    const apiUrl = `http://14.225.220.108:2602/account/active-account/${email}/${verificationCode}`;
    try {
        const response = await fetch(apiUrl, { method: 'PUT' });
        if (!response.ok) {
            Alert.alert('Lỗi', `HTTP Error: ${response.status}`);
            return;
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug xem API trả về gì

        if (data.isSuccess) {
            Alert.alert('Xác thực thành công!', 'Tài khoản của bạn đã được kích hoạt.');
            navigation.navigate('Login'); // Điều hướng về trang đăng nhập
        } else {
            Alert.alert('Lỗi', data.messages?.join('\n') || 'Xác thực thất bại.');
        }
    } catch (error) {
        Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ hoặc phản hồi không hợp lệ.');
        console.error('Error during account verification:', error);
    }
};

  // Giao diện đăng ký
  const renderSignUpForm = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Họ và tên đệm"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Đăng ký" onPress={handleSignUp} />
    </View>
  );

  // Giao diện xác thực
  const renderVerificationForm = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực tài khoản</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mã xác thực (6 ký tự)"
        value={verificationCode}
        onChangeText={setVerificationCode} // Dữ liệu là string
      />
      <Button title="Xác thực" onPress={handleVerifyAccount} />
    </View>
  );

  return isVerificationStep ? renderVerificationForm() : renderSignUpForm();
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

export default SignUp;
