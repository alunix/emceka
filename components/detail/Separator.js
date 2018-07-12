import React from 'react'
import { View } from 'react-native'

const Separator = (props) => {
  return (
    <View style={{ borderTopWidth: 1, borderColor: props.color, paddingBottom: 10 }} />
  )
}


export default Separator
