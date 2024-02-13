/* eslint-disable prettier/prettier */
import { View, Text, ScrollView, Dimensions, Pressable, StyleSheet } from 'react-native'
import React, { memo, useEffect, useRef } from 'react'
import { Button, Icon, Image } from 'react-native-elements'
import { ListItem } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { AccepteMission, ConfirmeeMissionByDriver, DeleteDEmande, TermineeMission } from '../../../redux/actions/demandesActions';
import BottomSheet, { BottomSheetMethods } from '@devvie/bottom-sheet';
import haversine from 'haversine'; // You may need to install this library using `npm install haversine`

import { uniqueId } from "lodash";
import { useNavigation } from '@react-navigation/native';
import { Avatar, Button as BTNPaper, Card, MD3Colors } from 'react-native-paper';
import { SET_REQUEST } from '../../../redux/types';
const ListRequest = memo((data, key) => {
    const isLOad = useSelector(state=>state?.isLoading?.isLoading)
    const truncateText = (text, maxLength) => {
      return text?.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
    };
    const navigateDetails= ()=> {
    }
    return (
        <>


<Pressable style={[styles.taskContainer, {borderColor: '#2089dc',}]}
     onPress={
        () => {


        }
     }
     >

     <View
             style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',  // Align items to the right
        alignItems: 'flex-end',

        // marginBottom: 16,
        // paddingRight: 16,  // Add some padding to the right if needed
    }}
     >
         <Card.Title
    title="Service"
    // subtitle="Prix proposé"
    left={(props) => <Avatar.Icon {...props}
    style={{backgroundColor:"#F6FCE7",


    }}
     icon="currency-eur"
        color="#A7D32E"
      />}
    // right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
    right={()=><Text
    style={{
        color: "black",
        fontFamily:"Roboto-Bold",
        fontSize:16
    }}
    >
        12:00
    </Text>}

    subtitleStyle={{ color: "black",
    fontFamily:"Roboto-Bold",
    fontSize:12
     }}


  />

     </View>


        </Pressable>
        {/* <Text>hets</Text> */}

        </>
    );
  })


export default ListRequest
const styles = StyleSheet.create({

  taskContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 8,
    margin: 5,
    shadowColor: '#000',
    borderLeftWidth: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

});