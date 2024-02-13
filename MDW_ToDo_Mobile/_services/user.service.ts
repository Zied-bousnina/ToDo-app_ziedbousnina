/* eslint-disable prettier/prettier */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authHeader, ApiConfigs } from "../_helpers";
import { date } from "yup";

export const UserService = {
    getTaskList,
    AddTask,
    updateTask,
    deleteTask,
    getStatistique,
    getTaskListSorted
};

async function getTaskList (data) {
    const requestOptions = {
        method: "GET",
        headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'false',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',

        },
    };

    try {
        let userJSON = await AsyncStorage.getItem("user").then((value) => {
            return value;
          }).catch((error) => {
            console.log('error', error);

          }
          );
        const response = await fetch(
        `${ApiConfigs.base_url}${"read"}`,
        {
            headers: {
                'Authorization': `Bearer ${userJSON}`,
                'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'false',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',

            },
            method: "GET",
            body: JSON.stringify(data)
        }
        );
        const data = await handleResponse(response);
        console.log('data++++++++++++++++', JSON.stringify(data));
        return data;
    } catch (error) {
        // Handle error appropriately
        console.error("Login error:", error);
        throw error;
    }
    }

    async function getTaskListSorted () {
        const requestOptions = {
            method: "GET",
            headers: {
            ...authHeader(),
            'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'false',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',

            },
        };

        try {
            let userJSON = await AsyncStorage.getItem("user").then((value) => {
                return value;
              }).catch((error) => {
                console.log('error', error);

              }
              );
            const response = await fetch(
            `${ApiConfigs.base_url}${"readWithSortBy"}`,
            {
                headers: {
                    'Authorization': `Bearer ${userJSON}`,
                    'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'false',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',

                }
            }
            );
            const data = await handleResponse(response);
            console.log('data++++++++++++++++', JSON.stringify(data));
            return data;
        } catch (error) {
            // Handle error appropriately
            console.error("Login error:", error);
            throw error;
        }
        }
async function AddTask (data) {
let data2= data

        try {
            let userJSON = await AsyncStorage.getItem("user").then((value) => {
                return value;
              }).catch((error) => {
                console.log('error', error);

              }
              );
            const response = await fetch(
            `${ApiConfigs.base_url}${"task"}`,




            {
                method: "POST",
                body: JSON.stringify(data2),
                headers: {
                    'Authorization': `Bearer ${userJSON}`,
                    'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'false',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',

                }
            }
            );
            const data = await handleResponse(response);
            console.log('data++++++++++++++++', JSON.stringify(data));
            return data;
        } catch (error) {
            // Handle error appropriately
            console.error("task error:", error);
            throw error;
        }
        }


async function deleteTask (id) {


            try {
                let userJSON = await AsyncStorage.getItem("user").then((value) => {
                    return value;
                  }).catch((error) => {
                    console.log('error', error);

                  }
                  );
                const response = await fetch(
                `${ApiConfigs.base_url}${"delete"}/${id}`,
                {
                    method: "DELETE",
                    // body: JSON.stringify(data2),
                    headers: {
                        'Authorization': `Bearer ${userJSON}`,
                        'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'false',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',

                    }
                }
                );
                const data = await handleResponse(response);
                console.log('data++++++++++++++++', JSON.stringify(data));
                return data;
            }
            catch (error) {
                // Handle error appropriately
                console.error("task error:", error);
                throw error;
            }
            }

async function updateTask (data, id) {
    let data2= data

            try {
                let userJSON = await AsyncStorage.getItem("user").then((value) => {
                    return value;
                  }).catch((error) => {
                    console.log('error', error);

                  }
                  );
                const response = await fetch(
                `${ApiConfigs.base_url}${"update"}/${id}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(data2),
                    headers: {
                        'Authorization': `Bearer ${userJSON}`,
                        'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'false',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',

                    }
                }
                );
                const data = await handleResponse(response);
                console.log('data++++++++++++++++', JSON.stringify(data));
                return data;
            }
            catch (error) {
                // Handle error appropriately
                console.error("task error:", error);
                throw error;
            }
            }

async function getStatistique () {


    try {
        let userJSON = await AsyncStorage.getItem("user").then((value) => {
            return value;
          }).catch((error) => {
            console.log('error', error);

          }
          );
        const response = await fetch(
        `${ApiConfigs.base_url}${"getStatistiqueByUser"}`,
        {
            headers: {
                'Authorization': `Bearer ${userJSON}`,
                'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'false',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',

            }
        }
        );
        const data = await handleResponse(response);
        console.log('data++++++++++++++++', JSON.stringify(data));
        return data;
    } catch (error) {
        // Handle error appropriately
        console.error("Login error:", error);
        throw error;
    }
    }
//
// async function getStatistique () {



async function handleResponse(response) {
    try {
        const text = await response.text();
        const data = text ;
        // console.log('data++++++++++++++++', data);
        return data;
    } catch (error) {
        // Handle error appropriately
        console.error("Response error:", error);
        throw error;
    }
}
// }