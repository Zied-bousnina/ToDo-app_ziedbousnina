/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect } from 'react';
import type {PropsWithChildren} from 'react';
import SplashScreen from 'react-native-splash-screen'
import {

  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/Auth/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
import { LogBox } from 'react-native';
import SignUpScreen from './src/screens/Auth/SignUpScreen';
import VerifyEmailScreen from './src/screens/Auth/VerifyEmailScreen';
import ForgotPasswordScreen from './src/screens/Auth/ForgotPasswordScreen';
import Dashboard from './src/screens/dashboard/Dashboard';
import { refreshAuthentication } from './utils/methods/auth';
import { useDispatch, useSelector } from 'react-redux';
import CustomSidebarMenu from './src/screens/CustomSidebarMenu';
import ResetPasswordScreen from './src/screens/Auth/ResetPasswordScreen';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications


type SectionProps = PropsWithChildren<{
  title: string;
}>;


function App(): React.JSX.Element {
  const dipatch = useDispatch();
  const navigation = useNavigation();
const auth = useSelector(state => state?.auth);
console.log('auth', auth);
  // useEffect(() => {
  //   SplashScreen.hide();
  // }, [])
  useLayoutEffect(() => {
    //custom middleware function
    // refreshAuthentication(dispatch,router,pathname);
    refreshAuthentication(dipatch, navigation)
  }, []);

  return (
    <SafeAreaProvider>

      {/* <InternetDisconnected /> */}
{
  auth?.isConnected ?
  <Drawer.Navigator
  screenOptions={{
   headerShown: false,
   activeTintColor: '#e91e63',
 }}
 //  initialRouteName="Login"
  drawerContent={props => <CustomSidebarMenu {...props} />}
  >


     <Drawer.Screen name="Dashboard"   options={{
   drawerLabel: () => null, // Hide the label
   drawerItemStyle: { display: 'none' }, // Hide the item
   // header:"  Header",
 }} component={Dashboard} />
   {/* Add other screens here if needed */}
 </Drawer.Navigator>
 :
 <Stack.Navigator
 screenOptions={{
  headerShown: false,
  // activeTintColor: '#e91e63',

}}
// initialRouteName='ResetPasswordScreen'

 >

  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen}/>
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />

    <Drawer.Screen name="Dashboard"   options={{
  drawerLabel: () => null, // Hide the label
  drawerItemStyle: { display: 'none' }, // Hide the item
  // header:"  Header",
}} component={Dashboard} />
  {/* Add other screens here if needed */}
</Stack.Navigator>
}


     </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },

});

export default App;
