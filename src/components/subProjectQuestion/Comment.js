import {  Text, View } from 'react-native'
import React from 'react'

const Comment = ({data}) => {
    // console.log(data,">>>>>>>>>>>>>>>>>")
  return (
    <View className="my-2 ">
      <Text>{data.comment}</Text>
    </View>
  )
}

export default Comment

