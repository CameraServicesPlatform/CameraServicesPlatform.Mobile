import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import các màn hình
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import Supplier from './src/screens/Supplier';
import Category from './src/screens/Category';
import RentalProduct from './src/stacks/ProductRentalStack';
import Policy from './src/screens/Policy';
import Contact from './src/screens/Contact';
import Login from './src/screens/Login';
import SignUp from './src/screens/Signup';
import AccountStack from './src/stacks/AccountStack';
import ProductSaleStack from './src/stacks/ProductSaleStack';

const Drawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogout = async (navigation) => {
    try {
      await AsyncStorage.multiRemove(['token', 'tempData', 'savedData']);
      setIsLoggedIn(false);
      Alert.alert('Đăng xuất thành công!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất do lỗi hệ thống.');
    }
  };

  // Tùy chỉnh nội dung Drawer
  const CustomDrawerContent = (props) => (
    <DrawerContentScrollView {...props}>
      {/* Thêm logo vào đầu Drawer */}
      <View style={styles.logoContainer}>
        <Image
          source={require('./src/images/image.png')} // Thay bằng URL hoặc require ảnh
          style={styles.logo}
        />
      </View>
      {/* Danh sách các mục Drawer */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: true, title: 'Trang chủ' }} />
        <Drawer.Screen name="Category" component={Category} options={{ headerShown: true, title: 'Danh mục' }} />
        <Drawer.Screen name="RentalProduct" component={RentalProduct} options={{ headerShown: true, title: 'Sản phẩm thuê' }} />
        <Drawer.Screen name="ProductSale" component={ProductSaleStack} options={{ headerShown: true, title: 'Sản phẩm bán' }} />
        <Drawer.Screen name="Policy" component={Policy} options={{ headerShown: true, title: 'Chính sách' }} />
        <Drawer.Screen name="Favorites" component={SettingsScreen} options={{ headerShown: true, title: 'Yêu thích' }} />
        <Drawer.Screen name="Contact" component={Contact} options={{ headerShown: true, title: 'Liên hệ' }} />

        {!isLoggedIn && (
          <>
            <Drawer.Screen name="Login" component={(props) => <Login {...props} onLoginSuccess={checkLoginStatus} />} options={{ headerShown: true, title: 'Đăng nhập' }} />
            <Drawer.Screen name="SignUp" component={SignUp} options={{ headerShown: true, title: 'Đăng kí' }} />
          </>
        )}

        {isLoggedIn && (
          <>
            <Drawer.Screen name="Tài khoản" component={AccountStack} options={{ headerShown: true }} />
            <Drawer.Screen
              name="Đăng xuất"
              component={({ navigation }) => {
                useEffect(() => {
                  handleLogout(navigation);
                }, []);
                return null;
              }}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  logo: {
    width: 300,
    height: 100,

  },
});
