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
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Cần cài đặt react-native-vector-icons

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Xử lý đăng ký
  const handleSignUp = async () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}$/;

    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Mật khẩu không hợp lệ',
        'Mật khẩu phải có ít nhất 6 ký tự, 1 ký tự viết hoa (A) và 1 ký tự đặc biệt (!@#$%^&*).'
      );
      return;
    }

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
      <Text style={styles.title}>Đăng ký tài khoản</Text>

      {/* Ô nhập Email */}
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

      {/* Ô nhập Tên */}
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="Tên"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      {/* Ô nhập Họ và tên đệm */}
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="Họ và tên đệm"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      {/* Ô nhập Số điện thoại */}
      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="Số điện thoại"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      {/* Ô nhập Mật khẩu + icon hiển thị/ẩn mật khẩu */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={[styles.inputField, { flex: 1 }]}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Ẩn/Hiển mật khẩu
        />
        <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
          <Icon
            name={showPassword ? 'eye' : 'eye-slash'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Nút Đăng ký */}
      <Button title="Đăng ký" onPress={handleSignUp} />

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      )}

      {/* Modal xác thực tài khoản */}
      <Modal
        visible={showVerificationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác thực tài khoản</Text>

            {/* Ô nhập Mã xác thực */}
            <View style={styles.inputContainer}>
              <Icon name="key" size={20} color="gray" style={styles.inputIcon} />
              <TextInput
                style={styles.inputField}
                placeholder="Nhập mã xác thực (6 ký tự)"
                value={verificationCode}
                onChangeText={setVerificationCode}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button title="Xác thực" onPress={handleVerifyAccount} />
              <Button
                title="Hủy"
                color="grey"
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
  // Container chung cho các ô input kèm icon bên trái
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  // Ô nhập liệu
  inputField: {
    flex: 1,
    height: 40,
  },
  // Icon ở đầu ô nhập
  inputIcon: {
    marginRight: 10,
  },
  // Icon hiển thị/ẩn mật khẩu
  eyeIcon: {
    padding: 5,
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
});

export default SignUp;
