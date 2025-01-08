import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon

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

const ReloadableScreen = (Component, reloadFunction) => (props) => {
  useFocusEffect(
    useCallback(() => {
      reloadFunction();
    }, [])
  );

  return <Component {...props} />;
};

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
      await AsyncStorage.multiRemove(['token', 'tempData', 'savedData', 'accountId']);
      setIsLoggedIn(false);
      Alert.alert('Đăng xuất thành công!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất do lỗi hệ thống.');
    }
  };

  const CustomDrawerContent = (props) => (
    <DrawerContentScrollView {...props}>
      <View style={styles.logoContainer}>
        <Image
          source={require('./src/images/image.png')}
          style={styles.logo}
        />
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Home"
          component={ReloadableScreen(HomeScreen, () => console.log('Reloading Home Data...'))}
          options={{
            headerShown: true,
            title: 'Trang chủ',
            drawerIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="Category"
          component={ReloadableScreen(Category, () => console.log('Reloading Category Data...'))}
          options={{
            headerShown: true,
            title: 'Danh mục',
            drawerIcon: ({ color, size }) => (
              <Icon name="format-list-bulleted" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="RentalProduct"
          component={ReloadableScreen(RentalProduct, () => console.log('Reloading Rental Product Data...'))}
          options={{
            headerShown: true,
            title: 'Sản phẩm thuê',
            drawerIcon: ({ color, size }) => (
              <Icon name="car-rental" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="ProductSale"
          component={ReloadableScreen(ProductSaleStack, () => console.log('Reloading Product Sale Data...'))}
          options={{
            headerShown: true,
            title: 'Sản phẩm bán',
            drawerIcon: ({ color, size }) => (
              <Icon name="cart" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="Policy"
          component={ReloadableScreen(Policy, () => console.log('Reloading Policy Data...'))}
          options={{
            headerShown: true,
            title: 'Chính sách',
            drawerIcon: ({ color, size }) => (
              <Icon name="file-document" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="Favorites"
          component={ReloadableScreen(SettingsScreen, () => console.log('Reloading Favorites Data...'))}
          options={{
            headerShown: true,
            title: 'Yêu thích',
            drawerIcon: ({ color, size }) => (
              <Icon name="heart" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="Contact"
          component={ReloadableScreen(Contact, () => console.log('Reloading Contact Data...'))}
          options={{
            headerShown: true,
            title: 'Liên hệ',
            drawerIcon: ({ color, size }) => (
              <Icon name="phone" color={color} size={size} />
            ),
          }}
        />
        {!isLoggedIn && (
          <>
            <Drawer.Screen
              name="Login"
              component={(props) => (
                <Login {...props} onLoginSuccess={checkLoginStatus} />
              )}
              options={{
                headerShown: true,
                title: 'Đăng nhập',
                drawerIcon: ({ color, size }) => (
                  <Icon name="login" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen
              name="SignUp"
              component={SignUp}
              options={{
                headerShown: true,
                title: 'Đăng ký',
                drawerIcon: ({ color, size }) => (
                  <Icon name="account-plus" color={color} size={size} />
                ),
              }}
            />
          </>
        )}
        {isLoggedIn && (
          <>
            <Drawer.Screen
              name="Tài khoản"
              component={ReloadableScreen(AccountStack, () => console.log('Reloading Account Data...'))}
              options={{
                headerShown: true,
                title: 'Tài khoản',
                drawerIcon: ({ color, size }) => (
                  <Icon name="account" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen
              name="Đăng xuất"
              component={({ navigation }) => {
                useEffect(() => {
                  handleLogout(navigation);
                }, []);
                return null;
              }}
              options={{
                headerShown: false,
                title: 'Đăng xuất',
                drawerIcon: ({ color, size }) => (
                  <Icon name="logout" color={color} size={size} />
                ),
              }}
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
