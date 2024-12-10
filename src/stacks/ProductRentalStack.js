import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReantalProduct from '../screens/order product rental/RentalProducts';
import OrderProductRental from '../screens/order product rental/OrderProductRental';
import ShippingMethod from '../screens/order product rental/ShippingMethod';
import Voucher from '../screens/order product rental/Voucher';
import ReviewOrder from '../screens/order product rental/ReviewOrder'; // Thêm màn hình mới
import OrderConfirmation from '../screens/order product rental/OrderConfirmation';
const Stack = createStackNavigator();

const ProductReantalStack = () => {
  return (
    <Stack.Navigator initialRouteName="ReantalProduct">
      <Stack.Screen name="ReantalProduct" component={ReantalProduct} options={{ headerShown: true }} />
      <Stack.Screen name="OrderProductRental" component={OrderProductRental} options={{ headerShown: true }} />
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
