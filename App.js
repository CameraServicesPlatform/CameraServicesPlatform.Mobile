import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Import các màn hình
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import Supplier from './src/screens/Supplier';
import Category from './src/screens/Category';
import RentalProduct from './src/screens/RentalProducts';
import Policy from './src/screens/Policy';
import Contact from './src/screens/Contact';
import Login from './src/screens/Login';
import SignUp from './src/screens/Signup';
import AccountStack from './src/stacks/AccountStack'; // AccountStack quản lý các màn hình thuộc Account
import ProductSaleStack from './src/stacks/ProductSaleStack'; // ProductSaleStack quản lý SaleProduct và OrderProductSale

const Drawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Kiểm tra token khi khởi chạy ứng dụng
  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    setIsLoggedIn(!!token); // Nếu có token => Đã đăng nhập
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Xử lý chức năng logout
  const handleLogout = async (navigation) => {
    setIsLoggingOut(true); // Bắt đầu trạng thái đăng xuất
    try {
      // Lấy dữ liệu trước khi xóa
      const savedDataBeforeClear = await AsyncStorage.getItem('savedData');
      console.log('Dữ liệu savedData trước khi xóa:', savedDataBeforeClear);
  
      // Xóa token và các dữ liệu tạm thời
      await AsyncStorage.multiRemove(['token', 'tempData', 'savedData']);
  
      // Kiểm tra lại sau khi xóa
      const savedDataAfterClear = await AsyncStorage.getItem('savedData');
      console.log('Dữ liệu savedData sau khi xóa:', savedDataAfterClear);
  
      setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
      Alert.alert('Đăng xuất thành công!');
      navigation.navigate('Home'); // Điều hướng về màn hình Home
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất do lỗi hệ thống.');
    } finally {
      setIsLoggingOut(false); // Kết thúc trạng thái đăng xuất
    }
  };
  

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        {/* Các màn hình công khai */}
        <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: true }} />
        <Drawer.Screen name="Supplier" component={Supplier} options={{ headerShown: true }} />
        <Drawer.Screen name="Category" component={Category} options={{ headerShown: true }} />
        <Drawer.Screen name="RentalProduct" component={RentalProduct} options={{ headerShown: true }} />
        {/* Thêm ProductSaleStack */}
        <Drawer.Screen
          name="ProductSale"
          component={ProductSaleStack}
          options={{ headerShown: true }}
        />
        <Drawer.Screen name="Policy" component={Policy} options={{ headerShown: true }} />
        <Drawer.Screen name="Favorites" component={SettingsScreen} options={{ headerShown: true }} />
        <Drawer.Screen name="Contact" component={Contact} options={{ headerShown: true }} />

        {/* Hiển thị Login và SignUp khi chưa đăng nhập */}
        {!isLoggedIn && (
          <>
            <Drawer.Screen
              name="Login"
              component={(props) => (
                <Login {...props} onLoginSuccess={checkLoginStatus} />
              )}
              options={{ headerShown: true }}
            />
            <Drawer.Screen name="SignUp" component={SignUp} options={{ headerShown: true }} />
          </>
        )}

        {/* Hiển thị AccountStack khi đã đăng nhập */}
        {isLoggedIn && (
          <>
            <Drawer.Screen
              name="Account"
              component={AccountStack} // Sử dụng AccountStack để quản lý các màn hình con của Account
              options={{ headerShown: true }}
            />
            <Drawer.Screen
              name="Logout"
              component={({ navigation }) => {
                useEffect(() => {
                  handleLogout(navigation);
                }, []);
                return null; // Không cần giao diện, chỉ cần thực thi logout
              }}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
