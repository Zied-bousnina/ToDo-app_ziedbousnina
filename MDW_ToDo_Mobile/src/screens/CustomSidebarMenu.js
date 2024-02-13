/* eslint-disable prettier/prettier */
// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import Fonts from '../assets/fonts';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
// import ProfileSection from './Components/ProfileSection';
import { Image, SocialIcon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon6 from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/auth.actions';
import Logo from '../components/svg/LOGO';
import ProfileSection from './ProfileSection';
// import { LogOut } from '../../redux/actions/authActions';
// import Logo from '../../components/svg/LOGO';
const CustomSidebarMenu = (props) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const handleLogOut= _ => {

    dispatch(
      logout(navigation)
    )


  }
  return (
    <SafeAreaView style={{flex: 1, top:20}}>
      {/*Top Large Image */}
      <ProfileSection/>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />


      </DrawerContentScrollView>
      <View style={styles.deviderCon}>
            <View style={styles.devider} />
            {/* <Text style={styles.or}>OR</Text> */}
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}>




              <>


 <TouchableOpacity
  onPress={()=>handleLogOut()}
  style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>

  <Text style={{ marginLeft: 10, fontSize: 16, color: 'red'  }}>
  Se déconnecter
  </Text>
</TouchableOpacity>

              </>

          </View>

      <View style={styles.loginCon}>
            {/* <ButtonCustom
              style={styles.LoginBtn}
              loginBtnLbl={styles.loginBtnLbl}
              btnName={isDriverMode ? "Passenger Mode" : "Driver Mode"}
          onPress={toggleMode}
              /> */}
<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
<Logo
                    width={Dimensions.get('window').width*0.4}
                    height={Dimensions.get('window').height*0.2}
                    />

        </View>

          </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignSelf: 'center',
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
    color:'red'
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  LoginBtn: {
    backgroundColor: "#2df793",
    borderRadius: 20,
    shadowColor: "black",
    borderColor: 'transparent',
  },
  loginBtnLbl: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Fonts.type.NotoSansBlack,
    color: "white",
    paddingVertical: 10,
  },
  devider: {
    borderBottomColor: "#ccc",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 20,
  },

  deviderCon: {
    paddingVertical: 10,
  },
  loginCon: {
    // paddingHorizontal: 20,
    paddingVertical: 10,
  // paddingBottom:100
  }

});

export default CustomSidebarMenu;