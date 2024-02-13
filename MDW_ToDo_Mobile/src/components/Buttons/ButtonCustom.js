import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useFormikContext } from 'formik'
import { Button } from 'react-native-paper'

const ButtonCustom = ({ name, placeholder,style,errorStyle,loginBtnLbl,btnName, onPress, ...rest}) => {
    // const { handleSubmit, touched, values, isSubmitting } = useFormikContext()
    // console.log(isSubmitting)

  return (
    <Button
    // style={style}
    // onPress={ isSubmitting? null : handleSubmit}
    onPress={()=>onPress()}
    // backgroundColor={  '#6bc7ab' }
    mode='outlined'

    // disabled={
    //   values.email   === '' || values.password === ''
    // isSubmitting
    //     ? true
    //     : false

    // }
    >
      {btnName}
    </Button>
  )
}

export default ButtonCustom