import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './tabs/home';
import Search from './tabs/search_result';
import Store from './tabs/store_detail';
import ListStores from './tabs/category_detail';
import FoodDetail from './tabs/food_detail';
import Order from './tabs/oder';
import { CartProvider } from './tabs/cartContext'; 
import  Delivery  from './tabs/delivery'; 
import  Address  from './tabs/address'; 
import  Success  from './tabs/success'; 
import  Login  from './tabs/login'; 
import Register from './tabs/register';
import ReSetPw from './tabs/resetPw';
import Account from './tabs/infoUser';
import MyOrder from './tabs/myOrder';

import { StyleSheet } from 'react-native';
import React from 'react';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Search' component={Search} />
          <Stack.Screen name='Store' component={Store} />
          <Stack.Screen name='ListStores' component={ListStores} />
          <Stack.Screen name='FoodDetail' component={FoodDetail} />
          <Stack.Screen name='Order' component={Order} />
          <Stack.Screen name='Delivery' component={Delivery} />
          <Stack.Screen name='Address' component={Address} />
          <Stack.Screen name='Success' component={Success} />
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='Register' component={Register}/>
          <Stack.Screen name='ReSetPw' component={ReSetPw}/>
          <Stack.Screen name='Account' component={Account}/>
          <Stack.Screen name='MyOrder' component={MyOrder}/>
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});