import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SaleProduct from '../screens/order product sale/SaleProduct';
import OrderProductSale from '../screens/order product sale/OrderProductSale';
import ShippingMethod from '../screens/order product sale/ShippingMethod';
import Voucher from '../screens/order product sale/Voucher';
import ReviewOrder from '../screens/order product sale/ReviewOrder'; // Thêm màn hình mới
import OrderConfirmation from '../screens/order product sale/OrderConfirmation';
const Stack = createStackNavigator();

const ProductSaleStack = () => {
  return (
    <Stack.Navigator initialRouteName="SaleProduct">
      <Stack.Screen name="SaleProduct" component={SaleProduct} options={{ headerShown: true }} />
      <Stack.Screen name="OrderProductSale" component={OrderProductSale} options={{ headerShown: true }} />
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

export default ProductSaleStack;
