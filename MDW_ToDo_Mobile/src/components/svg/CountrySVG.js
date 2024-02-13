import { View, Text } from 'react-native'
import React from 'react'
import Svg, { Path , Circle, G} from "react-native-svg";

const CountrySvg = (props) => (
  <Svg
    {...props}
   xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <Path d="M22.23,13l4.58-6.42A1,1,0,0,0,26,5H7V4A1,1,0,0,0,5,4V28a1,1,0,0,0,2,0V21H26a1,1,0,0,0,.81-1.58ZM7,19V7H24.06l-3.87,5.42a1,1,0,0,0,0,1.16L24.06,19Z" data-name="flag"/>
    </Svg>

)

export default CountrySvg