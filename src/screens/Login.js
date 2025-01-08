import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Nếu bạn cần icon FontAwesome
import Icon from 'react-native-vector-icons/FontAwesome'; // Cần cài đặt react-native-vector-icons

// Nếu chạy trên React Native, cần bảo đảm atob khả dụng.
// import { decode as atob } from 'base-64';

const Login = ({ navigation, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hai state để điều khiển hiển thị modal
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal hỏi "Bạn có muốn xác thực không?"
  const [showActiveModal, setShowActiveModal] = useState(false);   // Modal nhập mã xác thực

  // State để lưu code mà người dùng nhập
  const [verifyCode, setVerifyCode] = useState('');

  // Hàm decode JWT (nếu cần)
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

  // Hàm login
  const handleLogin = async () => {
    const apiUrl = 'http://14.225.220.108:2602/account/login';
    const payload = { email, password };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Parse JSON từ response
      const data = await response.json();
      console.log('Login response data:', data);

      if (data.isSuccess && data.result?.token) {
        // Đăng nhập thành công
        const token = data.result.token;

        // Lưu token
        await AsyncStorage.setItem('token', token);

        // Decode token để lấy accountId (nếu cần)
        try {
          const decodedToken = decodeJWT(token);
          const accountId = decodedToken['AccountId'];
          if (accountId) {
            await AsyncStorage.setItem('accountId', accountId);
          }
        } catch (error) {
          console.error('Lỗi khi decode token:', error);
        }

        Alert.alert('Đăng nhập thành công!');
        onLoginSuccess();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        // Đăng nhập thất bại
        const failMessages = data.messages?.join('\n') || 'Lỗi không xác định.';
        if (failMessages.includes('Tài khoản này chưa được xác thực')) {
          // Mở modal hỏi người dùng có muốn xác thực ngay không
          setShowConfirmModal(true);
        } else {
          Alert.alert('Đăng nhập thất bại', failMessages);
        }
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
      console.error('Error during login:', error);
    }
  };

  // Hàm gửi email xác thực
  const handleSendActiveCode = async () => {
    const apiSendEmail = `http://14.225.220.108:2602/account/send-email-for-activeCode/${email}`;
    try {
      await fetch(apiSendEmail, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      // Đóng modal "Xác thực"
      setShowConfirmModal(false);
      // Mở modal nhập mã
      setShowActiveModal(true);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi email xác thực.');
      console.error('Error sending active code:', error);
    }
  };

  // Hàm xác thực tài khoản bằng code
  const handleActiveAccount = async () => {
    const apiActive = `http://14.225.220.108:2602/account/active-account/${email}/${verifyCode}`;
    try {
      const response = await fetch(apiActive, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      const rawText = await response.text();
      console.log('Raw response from server (active-account):', rawText);

      let data;
      try {
        data = JSON.parse(rawText);
        console.log('Parsed JSON (active-account):', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        Alert.alert('Lỗi', 'Server không trả về JSON hợp lệ.');
        return;
      }

      if (data.isSuccess) {
        Alert.alert('Thông báo', 'Tài khoản đã được xác thực. Hãy đăng nhập lại.');
        setShowActiveModal(false); // đóng modal
      } else {
        const failMessages = data.messages?.join('\n') || 'Lỗi xác thực.';
        Alert.alert('Lỗi', failMessages);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xác thực tài khoản.');
      console.error('Error during account activation:', error);
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
      <Text style={styles.title}>Đăng nhập</Text>

<<<<<<< HEAD
      {/* Ô nhập Email + Icon */}
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Ô nhập Mật khẩu + Icon */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Nút Login */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
=======
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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>


      <Text style={styles.registerPrompt}>
        Nếu chưa có tài khoản?{' '}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate('SignUp')}
        >
          Đăng ký tại đây.
        </Text>
      </Text>
>>>>>>> 6f96476 (Duy_fix_bugbug)

      {/* Modal hỏi có muốn xác thực không */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tài khoản chưa xác thực</Text>
            <Text style={styles.modalMessage}>
              Tài khoản này chưa được xác thực. Bạn có muốn xác thực ngay không?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'gray' }]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.buttonText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'green' }]}
                onPress={handleSendActiveCode}
              >
                <Text style={styles.buttonText}>Xác thực</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal nhập mã xác thực */}
      <Modal
        visible={showActiveModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActiveModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập mã xác thực</Text>
            <View style={styles.inputContainer}>
              <Icon name="key" size={20} color="gray" style={styles.inputIcon} />
              <TextInput
                style={styles.inputField}
                placeholder="Nhập mã xác thực"
                value={verifyCode}
                onChangeText={setVerifyCode}
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'gray' }]}
                onPress={() => {
                  setShowActiveModal(false);
                  setVerifyCode('');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'blue' }]}
                onPress={handleActiveAccount}
              >
                <Text style={styles.buttonText}>Xác thực</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  // Container chung cho mỗi ô input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  // Icon trong ô input
  inputIcon: {
    marginRight: 8,
  },
  // Field nhập liệu
  inputField: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  // Nút login
  loginButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  button: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  logo: {
    width: 300,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginBottom: 20,
  },
  forgotPassword: {
    color: '#007BFF',
    textAlign: 'right',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#777',
  },
  googleButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  googleIcon: {
    width: 50,
    height: 50,
  },
  registerPrompt: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  registerLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
});

export default Login;
