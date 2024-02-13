/* eslint-disable prettier/prettier */
import React, {Component, useCallback, useEffect} from 'react';
import {
  Text,
  View,
  Pressable,
  stylesheet,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
  StyleSheet,
  useColorScheme,
  ImageBackground,
  ToastAndroid
} from 'react-native';
import Fonts from '../../assets/fonts';
// import SvgIcon from '../common/assets/images/SvgIcon';
// import SvgIcon from '../../assets/images/SvgIcon';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import BackSvg from '../../components/svg/BackSvg';
import EnterOtp from '../../components/svg/EnterOtp';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
// import styles from '../../assets/styles/styles';zs
import { get, save } from '../../utils/Storage';
import { Colors } from '../../theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppLoader from '../../components/Animations/AppLoader';
// import { verifyEmail } from '../../redux/actions/authActions';
import { OtpInput } from "react-native-otp-entry";
import { AuthService } from '../../../_services/auth.service';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const screenHeight = Dimensions.get('window').height;

const VerifyEmailScreen = () => {

  const route = useRoute();
  const { userId, email } = route.params;

  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const state = useSelector(state=>state)
  const isLoad = useSelector((state) => state?.isLoading?.isLoading);
  const isSuccess = useSelector(state=>state?.success?.success)
  // const NotSuccess = useSelector(state=>state?.NotSuccess?.NotSuccess)
  const MailSent = useSelector(state=>state?.mailSent?.MailSent)
  const [error, seterror] = useState("")
    const [Isloading, setIsloading] = useState(false)
    const [OtpSent, setOtpSent] = useState(false)
  const hanndleVerifyEmail = (code) => {
    const userData = {
      userId,
      otp: code,
    };
    setOtpSent(false)
    setIsloading(true)
    seterror("")
    AuthService.CheckOtp({
      email: email,
      code: code
    })
    .then((res) => {
      setIsloading(false)
      console.log('res', res)
      if(res.message=="passwords.code_is_valid"){
        navigation.navigate('ResetPasswordScreen', {code})
      }
    })
    .catch((err) => {
      setIsloading(false)
      console.log('err', err)
      seterror(err)
    })
    .finally(() => {
      setIsloading(false)
    })



    // dispatch(verifyEmail(userData, navigation));


  };
  const handleGoBack = ()=>{
    // dispatch(LogOut())
    // setTimeout(() => {
      navigation.navigate('Login')

    // }, 100);


  }

  const resendOTP = () => {
    const userData = {
      userId,
      email,
    };
    setIsloading(true)
    setOtpSent(false)
    seterror("")
    AuthService.SendOtpResetPasswordCode({
      email: email
    })
    .then((res) => {
      setIsloading(false)
      setOtpSent(true)
      console.log('res', res)
      seterror("")
      if(res.status === 200){
        ToastAndroid
        .showWithGravityAndOffset(
          "OTP Sent",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    })
    .catch((err) => {
      setIsloading(false)
      console.log('err', err)
      seterror(err)
    })
    .finally(() => {
      setIsloading(false)
    })
    // dispatch(resendOtp(userData, navigation));
  };

  // ------------------ Theme ------------------
  const [themeValue, setThemeValue] = useState('');
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
    {Isloading ? <AppLoader /> : null}
 {/* {isLoad ? <AppLoader /> : null}
 {MailSent ? <AppLoader /> : null} */}
      {/* {isSuccess? <RequestSent /> : null}
      {MailSent? <EmailSent /> : null} */}

      {/* {NotSuccess ? <OtpFailure /> : null} */}
    <KeyboardAwareScrollView behavior="position" style={styles.mainCon}>
        <View style={{padding: 20}}>
          <Pressable
          onPress={handleGoBack}
          >
            {/* <SvgIcon icon={'back'} width={30} height={30} /> */}
            <BackSvg

              width={30}
              height={30}
              />
          </Pressable>
        </View>
        <View style={{position: 'relative', bottom: 30}}>
          <View style={styles.loginIcon}>
            {/* <SvgIcon icon={'enterOtp'} width={280} height={280} /> */}
            <EnterOtp
              width={windowWidth * 0.8} height={windowHeight * 0.2}
              />
          </View>
          <View style={styles.container}>
            <View style={styles.loginLblCon}>
              <Text style={styles.loginLbl}>Enter OTP?</Text>
            </View>
            <View style={styles.forgotDes}>
              <Text style={styles.forgotDesLbl}>
                An 6 digit code has been sent to
              </Text>
              <Text style={styles.forgotDesLbl}> {email}</Text>
              {
                OtpSent ? <Text style={{color:'green'}}>
                  OTP Sent Successfully
                </Text> : null
              }
              {
                error ? <Text style={{color:'red'}}>
                  Wrong OTP Entered
                </Text> : null
              }

                {/* { !state?.errors?.errors?.success
                  ? (
                    <Text style={{color:'red'}}>
                      {state?.errors?.errors?.error}
                    </Text>
                  )
                  : null
                } */}

            </View>
            <View style={styles.formCon}>
              {/* <OTPInputView
                pinCount={4}
                autoFocusOnLoad
                style={{width: '80%', height: 70}}
                codeInputFieldStyle={styles.codeInputFieldStyle}
                onCodeFilled={code =>{

                  hanndleVerifyEmail(code)
                  console.log('Code Filled:', code)
                }
                }
                // clearInputs


              /> */}
              <OtpInput
  numberOfDigits={6}
  focusColor="green"
  focusStickBlinkingDuration={500}
  onTextChange={(text) => console.log(text)}
  onFilled={(code) => hanndleVerifyEmail(code)}
  theme={{
   containerStyle: styles.container,
   inputsContainerStyle: styles.inputsContainer,
   pinCodeContainerStyle: styles.pinCodeContainer,
   pinCodeTextStyle:{
    color:"#000000",
   },
   focusStickStyle: styles.focusStick,
   focusedPinCodeContainerStyle: styles.activePinCodeContainer
  }}
/>
              <Pressable
              onPress={ resendOTP}
              >
                <Text style={styles.registerLbl}>Resend OTP</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView></>
      </ImageBackground>
  )
}

export default VerifyEmailScreen

const styling = theme=>StyleSheet.create({
  mainCon: {
    // backgroundColor: Colors[theme]?.backgroundColor,
    flex: 1,
    height:screenHeight
  },
  codeInputFieldStyle: {
    color: Colors[theme]?.black
  },
  loginIcon: {
    alignSelf: 'center',
  },
  formCon: {
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  loginLblCon: {
    position: 'relative',
    bottom: 40,
  },
  loginLbl: {
    color: "#022d26",
    fontSize: 40,
    fontFamily: Fonts.type.NotoSansExtraBold,
  },
  forgotDes: {
    position: 'relative',
    bottom: 35,
  },
  forgotDesLbl: {
    color: "#022d26" ,
    fontFamily: Fonts.type.NotoSansRegular,
  },
  registerLbl: {color:  "#26cbfc", fontFamily: Fonts.type.NotoSansSemiBold},
});