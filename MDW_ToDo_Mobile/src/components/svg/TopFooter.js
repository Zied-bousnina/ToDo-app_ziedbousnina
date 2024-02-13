import { View, Text } from 'react-native'
import React from 'react'
import { Defs, G, Mask, Path, Svg, Use } from 'react-native-svg'

const TopFooter = () => (
  <Svg 
  style={{
    top:-60,
    zIndex:100,
    position:'absolute',
  }}
  width="1440" 
  height="140" 
  xmlns="http://www.w3.org/2000/svg"
  xlinkHref='http://www.w3.org/1999/xlink' 
  
  // xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <Defs>
      <Path 
      id="a" 
      d="M0 0h1440v139H0z"
      />
      </Defs>
      <G 
      fill="none" 
      fill-rule="evenodd"
      ><Mask 
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
        >
          <Path 
          d="M0-574.4c152.937-85.68 298.933-101.818 437.988-48.413 208.583 80.107 457.536 53.405 594.167 0 136.63-53.405 140.541-118.522 407.845-48.963 267.304 69.56 0 698.192 0 698.192s-211.887 128.179-591.858 64.09C594.828 47.779 312.114 63.996 0 139.156V-574.4z"
           fill="#4c1541"
           />
           <Path 
           d="M750-537h560V23H750z"
           />
           </G>
           </G>
           </Svg>
)

export default TopFooter