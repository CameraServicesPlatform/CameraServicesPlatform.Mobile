import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

      // Parse JSON từ response (đoạn này có thể giữ nguyên vì API login chắc chắn trả về JSON)
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
      const response = await fetch(apiSendEmail, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      // Tuỳ backend, API này có thể trả về JSON hoặc không.
      // Nếu bạn cần parse:
      // const data = await response.json();
      // console.log('SendActiveCode response data:', data);

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

      // Thay vì gọi thẳng response.json(), ta log trước, rồi parse trong try/catch
      const rawText = await response.text();
      console.log('Raw response from server (active-account):', rawText);

      let data;
      try {
        data = JSON.parse(rawText);
        console.log('Parsed JSON (active-account):', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        Alert.alert('Lỗi', 'Server không trả về JSON hợp lệ.');
        return; // Dừng tại đây
      }

      // Nếu parse thành công => kiểm tra isSuccess
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
            <Text>
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
            <TextInput
              style={[styles.input, { backgroundColor: '#fff' }]}
              placeholder="Nhập mã xác thực"
              value={verifyCode}
              onChangeText={setVerifyCode}
            />
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
  },
});

export default Login;
