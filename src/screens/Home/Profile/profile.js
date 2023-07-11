import { View ,Image ,TouchableOpacity , Text} from 'react-native';
import React, {useState } from 'react';
import UserProfile from '../../../components/common/UserProfile';
import EditProfile from './EditProfile';
import { useSelector } from 'react-redux';
import imagePath from '../../../constant/imagePath';
import { useNavigation } from '@react-navigation/native';
import navigationString from '../../../constant/navigationString';
import analytics from "@react-native-firebase/analytics";

const Profile = () => {
  const {user} = useSelector((state) => state.reducer.user.user);
  const [editProfile, setEditProfile] = useState(false);
  const [userProfile , setUserProfile] = useState({avatar : user?.avatar ,firstName :user?.firstName, lastName :user?.lastName , email : user?.email});
const navigation = useNavigation()
 
  return (
    <View className=" ">
      <View className = "  flex-row justify-between px-5 py-3 bg-white" style={{elevation : 20}}>
      <TouchableOpacity
          onPress={() => navigation.goBack()}
          className=" rounded-full bg-[#0067a215] items-center justify-center"
        >
          <Image
            source={imagePath.icBack}
            className="w-7 h-7 ml-2 my-1 "
            style={{ tintColor: "#0066A2" }}
          />
        </TouchableOpacity>
        <View><Text className="text-[#0066A2] font-semibold text-lg">{navigationString.PROFILE}</Text></View>
      <View></View>
      </View>
  
    <View
      style={{height: '100%', paddingVertical: 20, backgroundColor: '#E5EFF5'}}>
      {editProfile ? (
        <EditProfile setEditProfile={setEditProfile} setUserProfile={setUserProfile} userProfile={userProfile}/>
      ) : (
        <UserProfile setEditProfile={setEditProfile} setUserProfile={setUserProfile} userProfile={userProfile}/>
      )}
    </View>
    </View>
  );
};

export default Profile;

