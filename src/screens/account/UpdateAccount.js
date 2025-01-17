import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    Image,
    ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

const UpdateAccount = ({ route, navigation }) => {
    const { accountID, accountDetails } = route.params;

    const [email, setEmail] = useState(accountDetails?.email || '');
    const [firstName, setFirstName] = useState(accountDetails?.firstName || '');
    const [lastName, setLastName] = useState(accountDetails?.lastName || '');
    const [phoneNumber, setPhoneNumber] = useState(accountDetails?.phoneNumber || '');
    const [job, setJob] = useState(accountDetails?.job ?? null);
    const [hobby, setHobby] = useState(accountDetails?.hobby ?? null);
    const [gender, setGender] = useState(accountDetails?.gender ?? 0);
    const [bankName, setBankName] = useState(accountDetails?.bankName || '');
    const [accountNumber, setAccountNumber] = useState(accountDetails?.accountNumber || '');
    const [accountHolder, setAccountHolder] = useState(accountDetails?.accountHolder || '');

    const [frontImage, setFrontImage] = useState(accountDetails?.frontOfCitizenIdentificationCard || null);
    const [backImage, setBackImage] = useState(accountDetails?.backOfCitizenIdentificationCard || null);
    const [profileImage, setProfileImage] = useState(accountDetails?.img || null);

    const [loading, setLoading] = useState(false); // Thêm state loading
    // Hàm chọn ảnh
    const pickImage = async (setImage, alertMessage) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setUploadedState(true); // Đặt trạng thái thành công
            Alert.alert('Thành công', alertMessage); // Thông báo ảnh đã được chọn
        }
    };


    const handleUpdate = async () => {
        if (!email || !phoneNumber) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ Email và Số điện thoại.');
            return;
        }
        setLoading(true); // Bắt đầu hiệu ứng loading
        const formData = new FormData();
        formData.append('Email', email);
        formData.append('FirstName', firstName);
        formData.append('LastName', lastName);
        formData.append('PhoneNumber', phoneNumber);
        formData.append('Job', job === null ? null : job);
        formData.append('Hobby', hobby === null ? null : hobby);
        formData.append('Gender', gender === null ? null : gender);
        formData.append('BankName', bankName);
        formData.append('AccountNumber', accountNumber);
        formData.append('AccountHolder', accountHolder);

        if (frontImage) {
            formData.append('FrontOfCitizenIdentificationCard', {
                uri: frontImage,
                name: 'front_image.jpg',
                type: 'image/jpeg',
            });
        }

        if (backImage) {
            formData.append('BackOfCitizenIdentificationCard', {
                uri: backImage,
                name: 'back_image.jpg',
                type: 'image/jpeg',
            });
        }

        if (profileImage) {
            formData.append('Img', {
                uri: profileImage,
                name: 'profile_image.jpg',
                type: 'image/jpeg',
            });
        }

        try {
            const response = await fetch(
                `http://14.225.220.108:2602/account/update-account`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                }
            );

            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers);

            const text = await response.text();
            console.log('Response Text:', text);

            if (!text) {
                throw new Error('API không trả về dữ liệu');
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                throw new Error('Dữ liệu trả về không phải JSON hợp lệ');
            }

            if (data.isSuccess) {
                Alert.alert('Thành công', 'Cập nhật tài khoản thành công!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Reload trang trước và quay lại
                            setLoading(false); // Dừng hiệu ứng loading
                            navigation.goBack();
                            if (route.params?.onUpdateSuccess) {
                                route.params.onUpdateSuccess(); // Gọi hàm refresh từ trang trước
                            }
                        },
                    },
                ]);
            } else {
                setLoading(false); // Dừng hiệu ứng loading
                Alert.alert('Lỗi', 'Không thể cập nhật tài khoản.');
            }

        } catch (error) {
            console.error('Error updating account:', error.message);
            Alert.alert('Lỗi', `Đã xảy ra lỗi: ${error.message}`);
        }

    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Cập nhật thông tin tài khoản</Text>
            <Text style={styles.label}>Mail:</Text>
            <TextInput
                style={styles.inputMail}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                editable={false}
            />
            <Text style={styles.label}>Tên:</Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <Text style={styles.label}>Họ:</Text>
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <Text style={styles.label}>Sđt:</Text>
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />

            <Text style={styles.label}>Nghề nghiệp:</Text>
            <Picker
                selectedValue={job}
                style={styles.picker}
                onValueChange={(itemValue) => setJob(itemValue)}
            >

                <Picker.Item label="Học sinh" value={0} />
                <Picker.Item label="Nhiếp ảnh chuyên nghiệp" value={1} />
                <Picker.Item label="Nhiếp ảnh tự do" value={2} />
                <Picker.Item label="Người sáng tạo nội dung" value={3} />
                <Picker.Item label="Người mới bắt đầu" value={4} />
                <Picker.Item label="Sinh viên nhiếp ảnh" value={5} />
                <Picker.Item label="Người yêu thích du lịch" value={6} />
                <Picker.Item label="Người dùng thông thường" value={7} />
            </Picker>

            <Text style={styles.label}>Sở thích:</Text>
            <Picker
                selectedValue={hobby}
                style={styles.picker}
                onValueChange={(itemValue) => setHobby(itemValue)}
            >

                <Picker.Item label="Chụp ảnh phong cảnh" value={0} />
                <Picker.Item label="Chụp ảnh chân dung" value={1} />
                <Picker.Item label="Chụp ảnh động vật hoang dã" value={2} />
                <Picker.Item label="Chụp ảnh đường phố" value={3} />
                <Picker.Item label="Chụp ảnh cận cảnh" value={4} />
                <Picker.Item label="Chụp ảnh thể thao" value={5} />
            </Picker>

            <Text style={styles.label}>Giới tính:</Text>
            <Picker
                selectedValue={gender}
                style={styles.picker}
                onValueChange={(itemValue) => setGender(itemValue)}
            >
                <Picker.Item label="Không xác định" value={3} />
                <Picker.Item label="Nam" value={0} />
                <Picker.Item label="Nữ" value={1} />
                <Picker.Item label="Không muốn nói" value={2} />
            </Picker>
            <Text style={styles.label}>Tên ngân hàng:</Text>
            <TextInput
                style={styles.input}
                placeholder="Tên Ngân hàng"
                value={bankName}
                onChangeText={setBankName}
            />
            <Text style={styles.label}>Số tài khoản:</Text>
            <TextInput
                style={styles.input}
                placeholder="Số Tài khoản"
                value={accountNumber}
                onChangeText={setAccountNumber}
            />
            <Text style={styles.label}>Tên chủ tài khoản:</Text>
            <TextInput
                style={styles.input}
                placeholder="Tên Chủ tài khoản"
                value={accountHolder}
                onChangeText={setAccountHolder}
            />


            <TouchableOpacity
                style={styles.imagePicker}
                onPress={() => pickImage(setFrontImage, 'Ảnh CMND mặt trước đã được chọn.')}
            >
                <Text style={styles.imagePickerText}>
                    {frontImage ? 'Đã chọn ảnh CMND mặt trước' : 'Chọn ảnh CMND mặt trước'}
                </Text>
            </TouchableOpacity>
            {frontImage && (
                <Image source={{ uri: frontImage }} style={styles.previewImage} />
            )}

            <TouchableOpacity
                style={styles.imagePicker}
                onPress={() => pickImage(setBackImage, 'Ảnh CMND mặt sau đã được chọn.')}
            >
                <Text style={styles.imagePickerText}>
                    {backImage ? 'Đã chọn ảnh CMND mặt sau' : 'Chọn ảnh CMND mặt sau'}
                </Text>
            </TouchableOpacity>
            {backImage && (
                <Image source={{ uri: backImage }} style={styles.previewImage} />
            )}

            {profileImage && (
                <Image source={{ uri: profileImage }} style={styles.previewImage} />
            )}

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" /> // Hiển thị hiệu ứng loading
                ) : (
                    <Text style={styles.buttonText}>Cập nhật</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
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
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    inputMail: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#e0e0e0',
        color: '#888',
    },
    
    imagePicker: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    imagePickerText: {
        color: '#fff',
        fontSize: 16,
    },
    previewImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    successText: {
        color: 'green',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#33c4ff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'center',
        width: '90%',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UpdateAccount;