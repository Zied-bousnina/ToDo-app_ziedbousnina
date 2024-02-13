/* eslint-disable prettier/prettier */
import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { useFormikContext } from 'formik'
import { Button } from 'react-native-paper'

const SignUpButton = ({ name, placeholder,style,errorStyle,loginBtnLbl,btnName, ...rest}) => {
    const { handleSubmit, touched, values, isSubmitting } = useFormikContext()
    // console.log(isSubmitting)

  return (


      <Pressable
    //   onPress={()=>handleSignUp()}
    onPress={ isSubmitting? null : handleSubmit}

      >
        <Text style={[SignUpStyle.socialButtonLabel, {
            ...style,

  color:"#ffffff"
        }]}>{btnName}</Text>
      </Pressable>



  )
}

export default SignUpButton

const SignUpStyle = StyleSheet.create({



      socialButtonLabel: {
        color: "black",
        textAlign: 'center',
        paddingHorizontal: 10, // Adjust the padding as needed
        // fontFamily: Fonts.type.NotoSansBlack,
      },
})
