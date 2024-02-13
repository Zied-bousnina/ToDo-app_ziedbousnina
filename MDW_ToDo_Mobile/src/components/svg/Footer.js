import { View, Text } from 'react-native'
import React from 'react'
import { Defs, G, Mask, Path, Svg, Use } from 'react-native-svg'


const Footer = ({props}) => (
  <Svg 
  style={{
    // top:20,
    
  }}
  width="10000" 
  height="100" 
  xmlns="http://www.w3.org/2000/svg" 
  xlinkHref='http://www.w3.org/1999/xlink'
  // xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <Defs>
      <Path 
      id="a" 
      d="M0 0h1440v158H0z"
      />
      </Defs>
      <G 
      fill="none" 
      fill-rule="evenodd"
      >
        <Mask 
        id="b" 
        fill="#fff"
        >
          <Use 
          xlinkHref='#a'
          // xlink:href="#a"
          />
          </Mask>
          <G 
          mask="url(#b)" 
          fill="#4c1541"
          >
            <Path 
            d="M0 99.424C249.852-14.173 492.347-30.427 727.484 50.661c352.706 121.632 501.421 140.534 727.484 0 150.71-93.69 150.71 129.423 0 669.339H0V99.424z"
            />
            </G>
            </G>
            </Svg>
  
)

export default Footer