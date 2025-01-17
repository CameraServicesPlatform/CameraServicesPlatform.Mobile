import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !phone || !message) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }
    // Xử lý gửi form
    Alert.alert('Thành công', 'Thông tin của bạn đã được gửi.');
  };

  return (
    <View style={styles.container}>
      {/* Liên hệ qua điện thoại */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Liên hệ qua số điện thoại</Text>
        <Text style={styles.infoText}>
          Chúng tôi luôn sẵn sàng 24/7, 7 ngày một tuần.
        </Text>
        <Text style={styles.infoText}>Số điện thoại: +8801611112222</Text>
        <Text style={styles.infoTitle}>Gửi email về chúng tôi</Text>
        <Text style={styles.infoText}>
          Điền vào biểu mẫu của chúng tôi và chúng tôi sẽ liên hệ với bạn trong
          vòng 24 giờ.
        </Text>
        <Text style={styles.infoText}>Emails: customer@exclusive.com</Text>
        <Text style={styles.infoText}>Emails: support@exclusive.com</Text>
      </View>

      {/* Form liên hệ */}
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên của bạn"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email của bạn"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại của bạn"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Lời nhắn *</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Nhập lời nhắn của bạn"
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  infoContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Contact;
