import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../screens/Account';
import AccountDetails from '../screens/AccountDetails';
import Reviews from '../screens/Reviews';
import OrderHistory from '../screens/OrderHistory';
import Reports from '../screens/Reports';
import SavedDataScreen from '../screens/SavedDataScreen';
const Stack = createStackNavigator();

const AccountStack = () => {
  return (
    <Stack.Navigator initialRouteName="Account">
      <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
      <Stack.Screen name="AccountDetails" component={AccountDetails} options={{ title: 'Thông tin Tài khoản' }} />
      <Stack.Screen name="Reviews" component={Reviews} options={{ title: 'Đánh giá' }} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} options={{ title: 'Lịch sử các đơn hàng' }} />
      <Stack.Screen name="SavedDataScreen" component={SavedDataScreen} options={{ title: 'Các đơn hàng giao đang giao dịch' }} />
      <Stack.Screen name="Reports" component={Reports} options={{ title: 'Báo cáo' }} />
    </Stack.Navigator>
  );
};

export default AccountStack;
