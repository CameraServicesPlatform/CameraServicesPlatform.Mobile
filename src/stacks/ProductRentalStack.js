import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReantalProduct from '../screens/ReantalProduct';
import OrderProductReantal from '../screens/OrderProductReantal';
import ShippingMethod from '../screens/ShippingMethod';
import Voucher from '../screens/Voucher';
import ReviewOrder from '../screens/ReviewOrder'; // Thêm màn hình mới
import OrderConfirmation from '../screens/OrderConfirmation';
const Stack = createStackNavigator();

const ProductReantalStack = () => {
  return (
    <Stack.Navigator initialRouteName="ReantalProduct">
      <Stack.Screen name="ReantalProduct" component={ReantalProduct} options={{ headerShown: true }} />
      <Stack.Screen name="OrderProductReantal" component={OrderProductReantal} options={{ headerShown: true }} />
      <Stack.Screen name="ShippingMethod" component={ShippingMethod} options={{ headerShown: true }} />
      <Stack.Screen name="Voucher" component={Voucher} options={{ headerShown: true }} />
      <Stack.Screen name="ReviewOrder" component={ReviewOrder} options={{ headerShown: true }} />
      <Stack.Screen 
        name="OrderConfirmation" 
        component={OrderConfirmation} 
        options={{ headerShown: true, title: 'Xác nhận đơn hàng' }} 
      />
    </Stack.Navigator>
  );
};

export default ProductReantalStack;
