import {  Text, View } from 'react-native'
import React from 'react'

const Comment = ({data}) => {
    // console.log(data,">>>>>>>>>>>>>>>>>")
  return (
    <View className="my-2 ">
      <Text className="text-black">{data.comment}</Text>
      <Text className="text-xs">{data.userId.firstName + data.userId.lastName +" "+new Date(data.createdAt).toLocaleDateString() +" " +new Date(data.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
    </View>
  )
}

export default Comment

