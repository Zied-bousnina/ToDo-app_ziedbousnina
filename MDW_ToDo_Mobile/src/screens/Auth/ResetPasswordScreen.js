/* eslint-disable prettier/prettier */
import React, {Component, useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  Pressable,
  stylesheet,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  useColorScheme,
  Alert,
  TouchableWithoutFeedback,
  Touchable,
  ImageBackground,
  ToastAndroid,
  Animated,
  Dimensions,
} from 'react-native';
import Fonts from '../../assets/fonts';
// import SvgIcon from '../../assets/images/SvgIcon';
import ForgotSVG from '../../components/svg/ForgotSVG';
import BackSvg from '../../components/svg/BackSvg';
import AtSVG from '../../components/svg/AtSVG';
import {useNavigation, useRoute} from '@react-navigation/native'
import CostomFormik from '../../components/costomFormik/CostomFormik';
import AppInput from '../../components/Inputs/AppInput';
import * as yup from 'yup';
import LoginButton from '../../components/Buttons/LoginButton';
// import styles from '../../assets/styles/styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { get, save } from '../../utils/Storage';
import { Colors } from '../../theme';
import { useDispatch, useSelector } from 'react-redux';
// import { forgotPassword } from '../../redux/actions/authActions';
import DropdownAlert from 'react-native-dropdownalert';
import AppLoader from '../../components/Animations/AppLoader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { AuthService } from '../../../_services/auth.service';
import ShowIcon from '../../components/svg/ShowIcon';
const validationSchema = yup.object({
    password: yup.string().required('Password is required')
        .min(8, 'Password must be at least 8 characters')
    ,
    confirm: yup.string().required('Confirm Password is required').oneOf([yup.ref('password'), null], 'Passwords must match')
  });

  const initialValues = {
    email: '',
  }
  const AnimatedLine = Animated.createAnimatedComponent(View);
const ResetPasswordScreen = () => {
    const isLoad = false
    // useSelector(state=>state?.isLoading?.isLoading)
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [error, seterror] = useState("")
    const [Isloading, setIsloading] = useState(false)
    const state = {}

    // useSelector(state=>state)
    // console.log("---------------------------------------------------------------------",state.mail.emailSent)
    const dropdown = useRef(null);
    const showAlert = () => {
        dropdown.current.alertWithType('success', 'Title', 'Message');
      };

      const [mail, setmail] = useState("")
      const route = useRoute();
      const { code } = route.params;
  const handleForgot = (values, formikActions) => {
    // Alert.alert("email was sent")
    const data= {
        // email: mail,
        password: values.password,
        code: code
    }
    console.log(data);
    // console.log(formikActions);


    setIsloading(true)
AuthService.ResetPassword(data).then((res)=>{
  console.log("res",res)
  if(res.message =="password has been successfully reset"){
    setIsloading(false)
    navigation.navigate('Login')
    ToastAndroid.show("password has been successfully reset", ToastAndroid.SHORT);
  }
  else{
    setIsloading(false)

    // seterror(res.data.message)
  }
}).catch((err)=>{
    setIsloading(false)
    ToastAndroid.show("there is a probleme please try again ", ToastAndroid.SHORT);
    navigation.navigate('ForgotPassword')
  seterror(err)
  console.log("errrrrrrrrrrrrrrr",err)
})
  .finally(()=>{
    setIsloading(false)
    formikActions.resetForm()
    formikActions.setSubmitting(false);
  })


      console.log(values, formikActions);
      formikActions.resetForm()
      formikActions.setSubmitting(false);
      // console.log("Email has been sent :", state.mail.emailSent)
      // state.mail.emailSent ? showAlert() : null


  };
  const [show, setshow] = useState(false);
  const lineAnimation = useRef(new Animated.Value(0)).current;
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
    //  console.log('storage', theme)
   }, []);

   useEffect(() => {
     getAppTheme();
   }, [getAppTheme]);



   const styles = styling(themeValue);


   // ------------------End theme-----------------------

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
         {Isloading? <AppLoader/> : null }

    <KeyboardAwareScrollView behavior="position" style={styles.mainCon}>
    {/* {isLoad? <AppLoader/> : null } */}

        <View style={{padding: 20}}>


          <Button
          mode='contained'
          onPress={()=>navigation.goBack()}
          icon="keyboard-return"
          style={{ borderRadius: 20, width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}

          >
            {/* <SvgIcon icon={'back'} width={30} height={30} /> */}

          </Button>
        </View>
        <View style={{position: 'relative', bottom: 30}}>
          <View style={styles.loginIcon}>

            <ForgotSVG
              width={250}
              height={250}
            />
          </View>
          <CostomFormik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleForgot}
            >
          <View style={styles.container}>

            <View style={styles.loginLblCon}>
              <Text style={styles.loginLbl}>Reset Password</Text>
            </View>
            <View style={styles.forgotDes}>


              {
                error ? <Text style={{color:'red'}}>{error}</Text> : null
              }
                {/* <DropdownAlert ref={dropdown} /> */}
                {/* <Text style={{color:'red'}}>hhhh</Text> */}
            </View>
            <View style={styles.formCon}>
            <View style={[styles.textBoxCon, {marginTop: 30}]}>

<View style={[styles.passCon]}>
  <View style={styles.textCon}>
  <Text
  style={{
  color: "#1E293B",
  fontFamily: Fonts.type.NotoSansMedium,
  fontSize: 18,
  marginLeft:8,

}}
>
  New Password
</Text>
    <AppInput
      name="password"
      placeholder="Password"
      secureTextEntry={!show}
      style={styles.textInput}
      placeholderTextColor={'#aaa'}
      />
  </View>
  <View style={styles.show}>
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
            <View style={[styles.textBoxCon, {marginTop: 30}]}>

<View style={[styles.passCon]}>
  <View style={styles.textCon}>
  <Text
  style={{
  color: "#1E293B",
  fontFamily: Fonts.type.NotoSansMedium,
  fontSize: 18,
  marginLeft:8,

}}
>
 Confirm Password
</Text>
    <AppInput
      name="confirm"
      placeholder="Password"
      secureTextEntry={!show}
      style={styles.textInput}
      placeholderTextColor={'#aaa'}
      />
  </View>
  <View style={styles.show}>
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
            </View>

            <View style={[styles.loginCon, {marginTop: 40}]}>
              {/* <Pressable
                style={styles.LoginBtn}
                onPress={() => navigation.navigate('EnterOTPResetPassword')}>
                <Text style={styles.loginBtnLbl}>Submit</Text>
              </Pressable> */}

              <LoginButton
                style={[styles.LoginBtn, {
                backgroundColor: "#023AE9",
                borderColor: Colors["light"]?.primary,
                borderRadius: 8,


              }]}
                loginBtnLbl={styles.loginBtnLbl}
                btnName={"update"}
              />


            </View>
          </View>
          </CostomFormik>
        </View>
      </KeyboardAwareScrollView>
      </>
      </ImageBackground>
  )
}

export default ResetPasswordScreen

const styling = theme=>
StyleSheet.create({
  mainCon: {
    // backgroundColor: Colors["light"]?.backgroundColor,
    flex: 1,
  },
  loginIcon: {
    alignSelf: 'center',
  },
    passCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formCon: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  container: {
    paddingHorizontal: 20,
  },
  loginLblCon: {
    position: 'relative',
    bottom: 40,
  },
    show: {
    alignSelf: 'center',
    width: '10%',
    position: 'relative',
    right: 30,
    zIndex: 10,
    top:17,
    // color:"#f1f1ec"

  },
  loginLbl: {
    color: Colors["light"]?.black,
    fontSize: 40,
    fontFamily: Fonts.type.NotoSansExtraBold,
  },
  at: {
    alignSelf: 'center',
    width: '10%',
  },

  textBoxCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
   textCon: {
    width: Dimensions.get("screen").width*0.9,
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

  LoginBtn: {
    backgroundColor: "#023AE9",
    borderRadius: 20,
    shadowColor: Colors["light"]?.black,
    borderColor: 'transparent',
  },
  loginBtnLbl: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Fonts.type.NotoSansBlack,
    color: Colors["light"]?.white,
    paddingVertical: 10,
  },

  forgotDes: {
    position: 'relative',
    bottom: 35,
  },
  forgotDesLbl: {
    color: Colors["light"]?.black,
    fontFamily: Fonts.type.NotoSansRegular,
  },
});