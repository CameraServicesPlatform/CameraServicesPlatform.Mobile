import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Xử lý đăng ký
  const handleSignUp = async () => {
    const apiUrl = `http://14.225.220.108:2602/account/create-account?Email=${email}&FirstName=${firstName}&LastName=${lastName}&Password=${password}&PhoneNumber=${phoneNumber}`;

    setLoading(true);
    try {
      const response = await fetch(apiUrl, { method: 'POST' });
      const data = await response.json();

      if (data.isSuccess) {
        setShowVerificationModal(true); // Hiển thị modal xác thực
      } else if (data.messages?.includes('Email hoặc username không tồn tại!')) {
        Alert.alert('Đăng ký thất bại!', 'Tài khoản đã được đăng ký.');
      } else {
        Alert.alert('Lỗi', data.messages?.join('\n') || 'Đăng ký thất bại.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xác thực tài khoản
  const handleVerifyAccount = async () => {
    const apiUrl = `http://14.225.220.108:2602/account/active-account/${email}/${verificationCode}`;

    setLoading(true);
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
        setShowVerificationModal(false);
        navigation.navigate('Login'); // Điều hướng về trang đăng nhập
      } else {
        Alert.alert('Lỗi', data.messages?.join('\n') || 'Xác thực thất bại.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ hoặc phản hồi không hợp lệ.');
      console.error('Error during account verification:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../images/image.png')}
          style={styles.logo}
        />
      </View>
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
      <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
              <Text style={styles.registerButtonText}>Đăng kýký</Text>
            </TouchableOpacity>
      <Text style={styles.loginPrompt}>
                    Đã có có tài khoản?{' '}
                    <Text
                      style={styles.loginLink}
                      onPress={() => navigation.navigate('Login')}
                    >
                      Đăng nhập.
                    </Text>
                  </Text>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      )}

      {/* Modal xác thực */}
      <Modal
        visible={showVerificationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác thực tài khoản</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mã xác thực (6 ký tự)"
              value={verificationCode}
              onChangeText={setVerificationCode}
            />
            <View style={styles.buttonContainer}>
              <Button title="Xác thực" onPress={handleVerifyAccount} />
              <Button
                title="Hủy"
                color="red"
                onPress={() => setShowVerificationModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  loadingIndicator: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  loginPrompt: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  loginLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  logo: {
    width: 300,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default SignUp;
