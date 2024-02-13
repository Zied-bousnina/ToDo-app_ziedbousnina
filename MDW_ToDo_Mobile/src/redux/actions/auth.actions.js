/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */

// import jwt_decode from "jwt-decode";
import { jwt_decode } from 'jwt-decode';
import { guestHeader, ApiConfigs, authHeader } from "../../../_helpers";
import axios from 'axios';
import { SET_USER } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = (user) => async (dispatch) => {
    console.log("action : ", user);

    const requestOptions = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${user.token}`,
        "Access-Control-Allow-Origin": "*",
      },
    };

    try {
      const userResponse = await axios.get(
        `${ApiConfigs.base_url}${"user"}`,
        {
          headers: {
            "Authorization": `Bearer ${user.token}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      console.log("user : ", JSON.stringify(userResponse.data));

      dispatch({
        type: SET_USER,
        payload: userResponse.data,
      });


      // Dispatch an action or perform other operations with the user data if needed
    } catch (error) {
      console.error("Error fetching user data:", error);

      // Handle the error, dispatch an error action, or perform other error-related operations
    }
  };


  export const logout = (navigation) => async (dispatch) => {
    // Remove user from local storage to log user out
    await AsyncStorage.removeItem("user");
    dispatch({
      type: SET_USER,
      payload: {},
    });
    navigation.navigate('Login')
  }

