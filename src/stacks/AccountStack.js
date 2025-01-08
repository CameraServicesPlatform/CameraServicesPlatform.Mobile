import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../screens/account/Account';
import AccountDetails from '../screens/account/AccountDetails';
import Reviews from '../screens/account/Reviews';
import OrderHistory from '../screens/account/OrderHistory';
import Reports from '../screens/account/Reports';
import SavedDataScreen from '../screens/account/SavedDataScreen';
import UpdateAccount from '../screens/account/UpdateAccount';
import OrderDetail from '../screens/account/OrderDetail';
import OrderExtend from '../screens/account/OrderExtend';
import ConfirmExtend from '../screens/account/ConfirmExtend';
import RatingProduct from '../screens/RatingProduct';

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
      <Stack.Screen name="UpdateAccount" component={UpdateAccount} options={{ title: 'Cập nhật thông tin tài khoản' }} />
      <Stack.Screen name="OrderDetail" component={OrderDetail} options={{ title: 'Thông tin đơn hang' }} />
      <Stack.Screen name="OrderExtend" component={OrderExtend} options={{ title: 'Gia hạn' }} />
      <Stack.Screen name="ConfirmExtend" component={ConfirmExtend} options={{ title: 'Xác nhận Gia hạn' }} />
      <Stack.Screen name="RatingProduct" component={RatingProduct} options={{ title: 'Đánh giá' }}/>
    </Stack.Navigator>
  );
};

export default AccountStack;
