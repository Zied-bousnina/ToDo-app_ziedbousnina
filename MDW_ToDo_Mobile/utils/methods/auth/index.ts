/* eslint-disable prettier/prettier */
import { useDispatch } from 'react-redux';
// import { authActions } from '@/store/auth/authSlice';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiConfigs } from '../../../_helpers';
import axios from 'axios';
import { SET_USER } from '../../../src/redux/types';

export const refreshAuthentication = async(dispatch, navigation) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const dispatch = useDispatch();
  // const navigation = useNavigation();

  let userJSON;
  try {
    AsyncStorage.getItem('user').then(async (value) => {
      userJSON = value;
      console.log('userJSON', userJSON);
      if (userJSON) {
        // let user = JSON.parse(userJSON);
        console.log('user', userJSON);
        // dispatch({ type: SET_USER, payload: user });
        const response = await axios.get(`${ApiConfigs.base_url}${ApiConfigs.apis.auth.currentUserLogin}`, {
          headers: {
            'Authorization': `Bearer ${userJSON}`
          }
        });
        console.log('response', response.data);
        if (response.data) {
          dispatch({ type: SET_USER, payload: response.data });
          navigation.navigate('Dashboard');
        }else{
          navigation.navigate('Login');
        }
      }
    }
    ).catch((error) => {
      console.log('error', error);
    }
    );



  } catch (error) {
    console.error('Error retrieving user data from AsyncStorage:', error);
    return;
  }
  let user;

  // try {
  //   user = JSON.parse(userJSON);
  // } catch (error) {
  //   console.error('Error parsing user JSON:', error);
  //   return;
  // }

  // if (user && user.token) {
  //   dispatch(authActions.login(user.token));
  // } else {
  //   // Assuming pathname is obtained from the navigation state
  //   const pathname = navigation.getCurrentRoute()?.name || '';

  //   if (pathname.includes('dashboard')) {
  //     dispatch(authActions.logout());
  //     navigation.navigate('Login'); // Assuming 'Login' is the name of the login screen
  //   }
  // }
};


