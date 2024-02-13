/* eslint-disable prettier/prettier */
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function authHeader(): Promise<{
  "Authorization"?: any;
  "X-Requested-With": string;
  "Content-Language": string;
}> {
  try {
    let userJSON = await AsyncStorage.getItem("user").then((value) => {
      return value;
    }).catch((error) => {
      console.log('error', error);

    }
    );
    console.log("userJSON-------------ss", userJSON);

    if (userJSON) {
      // let user: any = JSON.parse(userJSON);
      let language = await AsyncStorage.getItem("Language");

      if (userJSON) {
        return {
          "Authorization": `Bearer ${userJSON}`,
          "X-Requested-With": "XMLHttpRequest",
          "Content-Language": language ?? "en",

        };
      }
    }
  } catch (error) {
    console.error("Error retrieving data from AsyncStorage:", error);
  }

  return {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Language": "en", // Default language if not available
  };
}


export function guestHeader() {
  let language = AsyncStorage.getItem("Language");
  return {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Language": language ?? "en",
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'false',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',

  };
}
