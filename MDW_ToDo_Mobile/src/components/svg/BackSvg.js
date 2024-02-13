import { View, Text } from 'react-native'
import React from 'react'
import Svg, { Path , Circle, G} from "react-native-svg";

const BackSvg = (props) => (
    <Svg
        {...props}
     fill="#000000"  version="1.1" id="lni_lni-chevron-left-circle"
	 xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 64 64"
	 style="enable-background:new 0 0 64 64;" >
<G>

	<Path d="M28.6,32l10.1-14.9c0.5-0.8,0.3-1.9-0.5-2.4c-0.8-0.5-1.9-0.3-2.4,0.5L25.4,30.6c-0.6,0.8-0.6,2.1,0,2.9l10.4,15.3
		c0.3,0.5,0.9,0.8,1.4,0.8c0.3,0,0.7-0.1,1-0.3c0.8-0.5,1-1.6,0.5-2.4L28.6,32z"/>
	<Path d="M32,1.3C15,1.3,1.3,15,1.3,32C1.3,49,15,62.8,32,62.8C49,62.8,62.8,49,62.8,32C62.8,15,49,1.3,32,1.3z M32,59.3
		C17,59.3,4.8,47,4.8,32C4.8,17,17,4.8,32,4.8C47,4.8,59.3,17,59.3,32C59.3,47,47,59.3,32,59.3z"/>
        </G>

</Svg>

)

export default BackSvg