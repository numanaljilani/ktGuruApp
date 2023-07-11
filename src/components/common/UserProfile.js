import {Image, Text, View ,TouchableOpacity} from 'react-native';
import React ,{useEffect} from 'react';
import Button from './Button';
import { useMeMutation } from '../../redux/api/api';
import { useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { setUser } from '../../redux/slice/userSlice';
import analytics from "@react-native-firebase/analytics";



const UserProfile = ({setEditProfile ,userProfile ,setUserProfile}) => {
  const items = useSelector((state) => state.reducer);
  const [me] = useMeMutation();
  const getProfile = async () =>{
    const res = await me(items.token.token.access_token);
    if(res.data){
      setUserProfile(res.data.user);

    }

  }
// console.log(userProfile)
  useEffect(() => {
    getProfile()
  }, [])
  return (
    <View
      style={{
        paddingVertical: 20,
        marginHorizontal: 20,
        backgroundColor: '#ffff',
        borderRadius: 20,
      }}>
      <View
        style={{
          borderWidth: 4,
          borderColor: '#0066A2',
          width: 125,
          height: 125,
          borderRadius: 100,
          alignSelf: 'center',
          overflow: 'hidden',
        }}>
        <Image
          source={{
            uri: userProfile && userProfile.avatar,
          }}
          style={{
            flex: 1,
          }}
        />
      </View>
      <View className="flex-row  justify-center">
      <Text style={{fontWeight: 800, alignSelf: 'center', paddingTop: 20 }} className="mr-2 text-black">
        {userProfile && userProfile.firstName}
      </Text>
      <Text style={{fontWeight: 800, alignSelf: 'center', paddingTop: 20}} className=" text-black">
        {userProfile && userProfile.lastName}
      </Text>
      </View>
      <Text
        style={{
          fontWeight: 500,
          alignSelf: 'center',
          paddingVertical: 5,
          fontSize: 12,
          marginBottom: 25,
        }}>
        {userProfile && userProfile.email}
      </Text>
      <Button title="Edit profile" onPress={setEditProfile} />
    </View>
  );
};

export default UserProfile;

