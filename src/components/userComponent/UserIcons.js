import { View ,Image} from 'react-native'
import React ,{memo} from 'react'

const UserIcons = ({data}) => {
// console.log(data.userId.avatar)
 
  return (
    data.userId !== null && data.isApproved && data.userId.avatar !== undefined ?
    <View className=" mr-1 w-9  h-9 rounded-full overflow-hidden bg-while shadow-2xl" style={{elevation : 2}}>
        {data.userId !== null && <Image source={{uri : data.userId.avatar}} className="flex-1" resizeMode='cover'/>}
    </View> : null
  )
}

export default memo(UserIcons)