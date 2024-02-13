/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'

import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native';
// import { AcceptedMission, Findfactures, GetMissions } from '../../../redux/actions/demandesActions';
// import { GetProfile } from '../../../redux/actions/profile.actions';
// import { findBasicInfoByUserId } from '../../../redux/actions/userActions';
const ProfileSection = () => {
  const navigatin = useNavigation()
  const user= useSelector(state=>state?.auth?.user)
  const PAGE_LIMIT = 5;
  const profile = useSelector(state=>state?.profile?.profile)
  const currentUser2 = useSelector(state=>state?.auth)
  const item_list = useSelector((state) => state?.missions?.missions?.items);
  const dispatch = useDispatch()
  const missionTerminee = useSelector((state) => state?.AcceptedMissions?.mission?.missions);
  const navigation = useNavigation()
  const basicInfo = useSelector(state=>state?.BasicInfo?.basicInfo)



  return (
    <SafeAreaView>

    <View style={styles.userCard}>
        <View>
          <Image source={{ uri: profile?.avatar ?
          basicInfo?.avatar : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
           }} style={styles.userPhoto} />

        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userFollowers}>{user?.email}</Text>
        </View>
        <TouchableOpacity
        onPress={()=>{}
          // () => {navigatin}
        }
        >
        <Icon2 name="arrow-forward-ios" size={30} color="#999" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ProfileSection

const styles = StyleSheet.create({
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
      },
      userPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
      },
      userInfo: {
        flex: 1,
        marginLeft: 10,
      },
      userName: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
        color:'#989'
      },
      userFollowers: {
        color: '#999',
      },
      editButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#008B8B',
      },
      editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
})