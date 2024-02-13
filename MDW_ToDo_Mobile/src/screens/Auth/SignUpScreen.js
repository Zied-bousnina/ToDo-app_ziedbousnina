/* eslint-disable prettier/prettier */
import React, {Component, useState, useRef, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  Pressable,
  Dimensions,
  useColorScheme,
  StyleSheet,
  ToastAndroid,

} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { get, save } from '../../utils/Storage';
import { Colors } from '../../theme';
import CostomFormik from '../../components/costomFormik/CostomFormik';
import AppInput from '../../components/Inputs/AppInput';
import * as yup from 'yup'
import { Animated } from 'react-native';
import AtSVG from '../../components/svg/AtSVG';
import UserSVg from '../../components/svg/UserSVg';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../assets/fonts';
import AppLoader from '../../components/Animations/AppLoader';


const screenHeight = Dimensions.get('window').height;
const initialValues = {
    email: '',
    password: '',
    confirm: '',
    name:'',
    first_name:'',
    phone:''
  };
  const validationSchema = yup.object({

    name: yup
      .string()
      .trim()
      .required('Name is required'),
    first_name: yup
      .string()
      .trim()
      .required('First name is required'),
    email: yup
      .string()
      .trim()
      .email('Please enter a valid email address')
      .required('Email address is required'),
    phone: yup
      .string()
      .trim()
      .min(8, 'Phone number is too short!')
      .max(11, 'Phone number is too long!')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .required('Phone number is required'),
    password: yup.string().trim().min(6, 'password is too short!').required('Password is required'),
    confirm: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
  });
const AnimatedLine = Animated.createAnimatedComponent(View);

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Logo from '../../components/svg/LOGO';
import LockIcon from '../../components/svg/LockIcon';
import ShowIcon from '../../components/svg/ShowIcon';
import LoginButton from '../../components/Buttons/LoginButton';
// import { registerUser } from '../../redux/actions/authActions';
import { Button, IconButton } from 'react-native-paper';
import { ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LOGOwhite from '../../components/svg/LOGOwhite';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import SignUpButton from '../../components/Buttons/SignUpButton';
import { AuthService } from '../../../_services/auth.service';
const SignUpScreen = () => {

    const [show, setshow] = useState(false);
    const lineAnimation = useRef(new Animated.Value(0)).current;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isLoad = useSelector(state=>state?.isLoading?.isLoading)

    const [isLoading, setisLoading] = useState(false)

    const showPasswordHandler = navigation => {
      setshow(!show);
      Animated.timing(lineAnimation, {
        toValue: show ? 0 : 20,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };


      // ------------------ Theme ------------------
  const [themeValue, setThemeValue] = useState('');
  const [initialValue, setInitialValue] = useState(0);
  const themes = useColorScheme();


  const themeOperations = theme => {
    switch (theme) {
      case 'dark':
        setTheme(theme, false);
        // setInitialValue(2);
        return;
      case 'theme1':
        setTheme(theme, false);
        // setInitialValue(2);
        return;
      case 'theme2':
        setTheme(theme, false);
        // setInitialValue(2);
        return;
      case 'theme3':
        setTheme(theme, false);
        // setInitialValue(2);
        return;
      case 'theme4':
        setTheme(theme, false);
        // setInitialValue(2);
        return;
      case 'light':
        setTheme(theme, false);
        // setInitialValue(1);
        return;
      case 'default':
        setTheme(themes, true);
        // setInitialValue(3);
        return;
    }
  };

  const getAppTheme = useCallback(async () => {
    const theme = await get('Theme');
    const isDefault = await get('IsDefault');
    isDefault ? themeOperations('default') : themeOperations(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback(async (theme, isDefault) => {
    save('Theme', theme);
    save('IsDefault', isDefault);
    setThemeValue(theme);
    console.log('storage', theme)
  }, []);

  useEffect(() => {
    getAppTheme();
  }, [getAppTheme]);

  const SignUpStyle = styling(themeValue);

  // ------------------End theme-----------------------

  const [Errors, setErrors] = useState('')
  const handleSignUp = async (values, formikActions)=> {

    const { email, password, confirm, name } = values;

 setisLoading(true)
    AuthService.regiterUser(values)
    .then(res=>{
      console.log(res)
      setisLoading(false)
      if(res.success){
        ToastAndroid
        .showWithGravityAndOffset(
          "User Registered Successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        navigation.navigate('Login')
      }else {
        setErrors(res.errors?.email)
        ToastAndroid
        .showWithGravityAndOffset(
          "User Registration Failed",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }

    })
    .catch(err=>{
      console.log(err)
      setisLoading(false)
      ToastAndroid
      .showWithGravityAndOffset(
        "User Registration Failed",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    })
    .finally(()=>{
      setisLoading(false)
      formikActions.setSubmitting(false)
    })


    setTimeout(() => {


     setisLoading(false)

    }, 10000);

    // formikActions.resetForm()
      formikActions.setSubmitting(false);

      // console.log(errors)
      console.log(isLoading)



  }

  return (
    <ImageBackground

    source={
        require('../../assets/images1/pattern-randomized.png')
    }
        // require('../../assets')
    style={{
      flex: 1,
      // backgroundColor: '#B52424', // Fallback color in case the image fails to load
    }}
    resizeMode="cover"
  >


<>
    {isLoad? <AppLoader/> : null }
     {isLoading? <AppLoader /> : null}
     {/* <AppLoader /> */}
     {/* <GestureHandlerRootView
     style={{
       backgroundColor: "#fff"
     }}
     > */}
     {/* <ActivityIndicator size="large" color="#00ff00" /> */}


     <KeyboardAwareScrollView behavior="position" style={SignUpStyle.mainCon}>

     <LinearGradient
  start={{x: 0.0, y: 0.4}}
  end={{x: 0.5, y: 1.0}}
  location={[0, 1]}
  colors={['#2D97DA', '#2249D6']}
  style={{
    flex: 0.8,
    flexDirection: 'column',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  }}
>
  <ImageBackground
    source={require('../../assets/images/image3background_register.png')}
    style={{
      flex: 1,
      flexDirection: 'column',
      paddingHorizontal: '2%',
    }}
  >
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      {/* Your content here */}
    </View>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    // marginTop: hp('7%'),
    marginBottom: hp('5%'),
     }}>

      <View style={{ flexDirection: 'column' }}>
        <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'Roboto-Bold' }}>
          <IconButton icon="sort-variant" iconColor={"transparent"} size={30} onPress={() => {}} />
        </Text>
        {/* <Text style={{color:'rgba(255,255,255,0.3)',fontFamily:'Roboto-Regular-Italic',fontSize:14}} >Updated 2 mins ago</Text> */}
      </View>

      {/* profit loss indicator */}
      <LOGOwhite
        width={Dimensions.get('window').width * 0.15}
        height={Dimensions.get('window').height * 0.15}
      />
      <IconButton
        icon="arrow-left"
        iconColor={"white"}
        size={30}
        onPress={() => {
          // setwhoIsClicked("add")
          // sheetRef.current.open()
          navigation.navigate('Login')
        }}
      />
    </View>
  </ImageBackground>
</LinearGradient>

         <CostomFormik
           initialValues={initialValues}
           validationSchema={validationSchema}
           onSubmit={handleSignUp}
             >

         <View style={[SignUpStyle.container ]}>
           <View style={SignUpStyle.loginLblCon}>
             <Text style={SignUpStyle.loginLbl}>CREATE AN ACCOUNT</Text>
           </View>
           <View style={[SignUpStyle.formCon,{marginTop:2}]}>

{/* Name */}
             <View style={[SignUpStyle.textBoxCon, ]}>

               <View style={SignUpStyle.textCon}>
               <Text
style={{
 color: "#1E293B",
 fontFamily: Fonts.type.NotoSansMedium,
 fontSize: 18,
 marginLeft:8,

}}
>
  Name
</Text>
                 <AppInput
                   name="name"
                   placeholder="Full Name"
                   style={SignUpStyle.textInput}
                   placeholderTextColor={'#aaa'}
                 />
               </View>
             </View>
             <View style={[SignUpStyle.textBoxCon,{marginTop: 10} ]}>

<View style={SignUpStyle.textCon}>
<Text
style={{
color: "#1E293B",
fontFamily: Fonts.type.NotoSansMedium,
fontSize: 18,
marginLeft:8,

}}
>
First name
</Text>
  <AppInput
    name="first_name"
    placeholder="first name"
    style={SignUpStyle.textInput}
    placeholderTextColor={'#aaa'}
  />
</View>
</View>
             <View style={[SignUpStyle.textBoxCon, {marginTop: 10}]}>

<View style={SignUpStyle.textCon}>
<Text
style={{
 color: "#1E293B",
 fontFamily: Fonts.type.NotoSansMedium,
 fontSize: 18,
 marginLeft:8,

}}
>
  E-mail
</Text>
  <AppInput
    name="email"
    placeholder="Email ID"
    style={SignUpStyle.textInput}
    placeholderTextColor={'#aaa'}
  />
</View>
</View>
           <View style={[SignUpStyle.textBoxCon, {marginTop: 10}]}>

<View style={SignUpStyle.textCon}>
<Text
style={{
 color: "#1E293B",
 fontFamily: Fonts.type.NotoSansMedium,
 fontSize: 18,
 marginLeft:8,

}}
>
  Phonet
</Text>
  <AppInput
    name="phone"
    placeholder="phone"
    style={SignUpStyle.textInput}
    placeholderTextColor={'#aaa'}
    type="number"
  />
</View>
</View>

             <View style={[SignUpStyle.textBoxCon, {marginTop: 10}]}>

               <View style={[SignUpStyle.passCon]}>
                 <View style={SignUpStyle.textCon}>
                 <Text
style={{
 color: "#1E293B",
 fontFamily: Fonts.type.NotoSansMedium,
 fontSize: 18,
 marginLeft:8,

}}
>
 Password
</Text>
                   <AppInput
                     name="password"
                     placeholder="Password"
                     secureTextEntry={!show}
                     style={SignUpStyle.textInput}
                     placeholderTextColor={'#aaa'}
                   />
                 </View>
                 <View style={SignUpStyle.show}>
                   <Pressable
                    onPress={showPasswordHandler}
                   >
                     <ShowIcon width={20} height={20} />
                     <AnimatedLine
                       style={{
                         height: 2,
                         width: lineAnimation,
                         backgroundColor: 'black',
                         position: 'absolute',
                         bottom: 10,
                         left: 0,
                         transform: [{rotate: '150deg'}],
                       }}
                     />
                   </Pressable>
                 </View>
               </View>
             </View>
             <View style={[SignUpStyle.textBoxCon, {marginTop: 10}]}>

               <View style={[SignUpStyle.passCon]}>
                 <View style={SignUpStyle.textCon}>
                 <Text
style={{
 color: "#1E293B",
 fontFamily: Fonts.type.NotoSansMedium,
 fontSize: 18,
 marginLeft:8,

}}
>
  Confirm password
</Text>
                   <AppInput
                     name="confirm"
                     placeholder="Confirm Password"
                     secureTextEntry={!show}
                     style={SignUpStyle.textInput}
                     placeholderTextColor={'#aaa'}
                   />
                 </View>
                 <View style={SignUpStyle.show}>
                   <Pressable
                   onPress={showPasswordHandler}
                >
                     <ShowIcon width={20} height={20} />
                     <AnimatedLine
                       style={{
                         height: 2,
                         width: lineAnimation,
                         backgroundColor: 'black',
                         position: 'absolute',
                         bottom: 10,
                         left: 0,
                         transform: [{rotate: '150deg'}],
                       }}
                     />
                   </Pressable>
                 </View>
               </View>
             </View>
             <View style={SignUpStyle.termsCon}>

             </View>
           </View>
           {
              Errors? <Text style={{color:"red"}}>{Errors}</Text> : null
           }

           {/* <View style={SignUpStyle.loginCon}> */}
             {/* <LoginButton
               style={SignUpStyle.LoginBtn}
               loginBtnLbl={SignUpStyle.loginBtnLbl}
               btnName={"Register"}
             /> */}
             <View style={SignUpStyle.socialButtonsContainer}>
  <View style={[SignUpStyle.socialButton, {marginRight:25, marginLeft:-20}]}>
    {/* <GoogleSvg width={20} height={20} /> */}
    <Pressable
    onPress={()=>navigation.navigate('Login')}
    >
      <Text style={SignUpStyle.socialButtonLabel}> Cancel</Text>
    </Pressable>
  </View>
  <View style={SignUpStyle.socialButtonsContainer}>

    <View style={[SignUpStyle.socialButton, {
       backgroundColor:"#023AE9",
       marginRight:0,
       marginTop:-10,
        marginLeft:-10,
    }]}>

<SignUpButton

btnName={"Create"}
style={{
  backgroundColor:"#023AE9",


}}

/>
    </View>
    </View>

</View>
           {/* </View> */}

           {/* <View style={SignUpStyle.registerCon}>
             <Text style={SignUpStyle.registerNew}>Joined us before? </Text>
             <Pressable
               onPress={() => navigation.navigate('Login')}
               >
               <Text style={SignUpStyle.registerLbl}>Login</Text>
             </Pressable>

           </View> */}
         </View>
         </CostomFormik>
       </KeyboardAwareScrollView>
       {/* </GestureHandlerRootView> */}
       </>
       </ImageBackground>
  )
}

export default SignUpScreen

const styling = theme=>StyleSheet.create({
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20, // Add some margin if needed
    marginTop: 10, // Adjust as needed,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    backgroundColor: "white",
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 40, // Adjust the padding as needed
    borderWidth:0.5,
    borderColor: "#708090",
    height: 45,
  },

  socialButtonLabel: {
    color: "black",
    textAlign: 'center',
    paddingHorizontal: 10, // Adjust the padding as needed
    // fontFamily: Fonts.type.NotoSansBlack,
  },
    mainCon: {
      // backgroundColor:  Colors[theme]?.backgroundColor,
      flex: 1,
      height:screenHeight

    },
    loginIcon: {
      alignSelf: 'center',
      top:-70,
      // left:-0
    },
    formCon: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      marginTop: -30,
    },
    container: {
      paddingHorizontal: 20,
      marginTop: -20,
    },
    loginLblCon: {
      position: 'relative',
      bottom: 40,
    },
    loginLbl: {
      color: "white" ,
      fontSize: 20,
      fontFamily: Fonts.type.NotoSansExtraBold,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop:5,
      marginBottom:10
    },
    at: {
      alignSelf: 'center',
      width: '10%',
    },
    show: {
      alignSelf: 'center',
      width: '10%',
      position: 'relative',
      right: 30,
      zIndex: 10,
      top:17,
    },
    textBoxCon: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textCon: {
      width: Dimensions.get("screen").width*0.9,
    },
    passCon: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textInput: {
      borderBottomColor: Colors["light"]?.gray,
      borderWidth: 0.5,
      // borderTopWidth: 0,
      // borderLeftWidth: 0,
      // borderRightWidth: 0,
      color: Colors["light"]?.black,
      fontSize: 16,
      fontFamily: Fonts.type.NotoSansMedium,
      height: 40,
      borderRadius: 8,
      backgroundColor:"#ffffff",
      paddingHorizontal: 10,
      marginTop:10

      // backgroundColor: "#ffffff",
    },
    forgotAction: {
      paddingVertical: 20,
    },
    registerCon: {flexDirection: 'row', justifyContent: 'center', paddingTop: 10},
    registerLbl: {color:  "#26cbfc",
       fontFamily: Fonts.type.NotoSansSemiBold,
      },
    registerNew: {
      color:  "#022d26",
      fontFamily: Fonts.type.NotoSansSemiBold,
    },

    LoginBtn: {
      backgroundColor:  "#1b394a",
      borderRadius: 20,
      marginTop:20
    },
    loginBtnLbl: {
      textAlign: 'center',
      fontSize: 16,
      fontFamily: Fonts.type.NotoSansBlack,
      color:  Colors[theme]?.white,
      paddingVertical: 10,
    },
    devider: {
      borderBottomColor:  Colors[theme]?.gray,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginTop: 20,
    },

    deviderCon: {
      paddingVertical: 10,
    },




  });