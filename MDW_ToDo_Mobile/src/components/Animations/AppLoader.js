import { StyleSheet, Text, View ,ActivityIndicator} from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
const AppLoader = () => {
  return (
    <View
        style={[StyleSheet.absoluteFillObject, styles.container]}
    >
       <LottieView
        // source={{
        //     uri: 'https://assets7.lottiefiles.com/packages/lf20_rb0swn6j.json'
        //     // uri: 'https://assets7.lottiefiles.com/packages/lf20_RGVbkI.json'
        // }}
        source={{
            uri: 'https://assets7.lottiefiles.com/private_files/lf30_l8csvun7.json'
        }}
        colorFilters={[
        {
          keypath: "button",
          color: "#F00000",
        },
        {
          keypath: "Sending Loader",
          color: "#F00000",
        },
      ]}
      style={{width: "100%", height: "100%"}}
      autoPlay
      loop
        />

    </View>
  )
}

export default AppLoader

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1000,
    },
})