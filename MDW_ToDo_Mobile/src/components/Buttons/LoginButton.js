/* eslint-disable prettier/prettier */
import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useFormikContext } from 'formik'
import { Button } from 'react-native-paper'

const LoginButton = ({ name, placeholder,style,errorStyle,loginBtnLbl,btnName, ...rest}) => {
    const { handleSubmit, touched, values, isSubmitting } = useFormikContext()
    // console.log(isSubmitting)

  return (
    <Button
    // style={style}
    onPress={ isSubmitting? null : handleSubmit}
    // onPress={()=>console.log(props.values)}
    // backgroundColor={ isSubmitting ? '#6bc7ab' : '#6bc7ab'}
    style={{
        // backgroundColor: isSubmitting ? '#6bc7ab' : '#6bc7ab',
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        backgroundColor:"#023AE9",
        ...style

    }}

    // disabled={
    //   values.email   === '' || values.password === ''
    // isSubmitting
    //     ? true
    //     : false

    // }
    mode='contained'
    >
     {btnName}
    </Button>
  )
}

export default LoginButton