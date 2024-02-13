import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Image } from 'react-native'

const ActionCenter = ({stats,title_text}) => {
    return (
        <TouchableOpacity style={{flexDirection:'column',alignItems:'center'}} >
            <Text
            style={{fontFamily:'Roboto-Bold',color:'#030A26',fontSize:25,
            fontWeight:'bold'
            }}
            >{stats}</Text>
            <Text style={{fontSize:15,fontFamily:'Roboto-Bold',color:'#64748B'}} >{title_text}</Text>
        </TouchableOpacity>
    )
}

export default ActionCenter

const styles = StyleSheet.create({})