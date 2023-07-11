import {Text, View ,Image, TouchableOpacity } from 'react-native'
import React , { memo }  from 'react'
import navigationString from '../../constant/navigationString'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import imagePath from '../../constant/imagePath'
import { setSubSingleChat } from '../../redux/slice/subProjectChatSlice'


const PersonalChatList = ({data}) => {
  // console.log(data.latestMessage.content)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const passData = async () =>{
    dispatch(setSubSingleChat(data))
    navigation.navigate(navigationString.SUB_PRO_SINGLE_CHAT)
  }
  return (
    <View>
      <TouchableOpacity onPress={passData} className=" bg-white flex-row px-2 border-t-2 rounded-lg border-[#0066A2] mt-2 py-2">
          <View className="border-2 border-[#0066A2] w-16 h-16 rounded-full my-auto overflow-hidden">
            <Image source={data.users[0].userId?.avatar ? {uri:data.users[0].userId?.avatar} : imagePath.icProfile} className="flex-1" resizeMode='cover'/>
          </View>
          <View className="px-3 pt-1">
            <Text className="font-semibold">
              {data.users[0].userId.firstName +" "+ data.users[0].userId.lastName}
            </Text>
            <Text>{data?.latestMessage?.content}</Text>
          </View>
        </TouchableOpacity>
    </View>
  )
}

export default memo(PersonalChatList)

