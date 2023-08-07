import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import imagePath from '../constant/imagePath';
import navigationString from '../constant/navigationString';
import {useDispatch, useSelector} from 'react-redux';
import {setToken} from '../redux/slice/tokenSlice';
import {setUser} from '../redux/slice/userSlice';
import {setProject} from '../redux/slice/prjectSlice';
import {setQuestion} from '../redux/slice/questionSlice';
import {clearMessage, setGroupChat} from '../redux/slice/groupChat';
import {setSocket} from '../redux/slice/chatSlice';
import analytics from '@react-native-firebase/analytics';
import {useLogoutMutation} from '../redux/api/api';

const CustomDrawer = props => {
  const items = useSelector(state => state.reducer);

  const {navigation} = useSelector(state => state.reducer.navigation);
  const {access_token} = useSelector(state => state.reducer.token.token);
  const {user, role1} = useSelector(state => state.reducer.user.user);
  const [logout, {isSuccess}] = useLogoutMutation();

  const dispatch = useDispatch();

  const handleLogOut = async () => {
    props.navigation.replace(navigationString.AUTH);
    dispatch(setToken({}));
    dispatch(setUser({}));
    dispatch(setProject({}));
    dispatch(setQuestion({}));
    dispatch(clearMessage());
    dispatch(setGroupChat({}));
    dispatch(setSocket({}));
    await logout({body: {user}, token: access_token});
  };

  useEffect(() => {
    if (navigation) {
      handleLogOut();
    }
  }, [navigation]);
  return (
    <DrawerContentScrollView {...props}>
      <View className="border m-2 pt-4 rounded-xl border-[#0066A2] bg-[#0067a20a]">
        <View className="border-2 border-[#0066A2] self-center rounded-full overflow-hidden h-24 w-24 ">
          <Image
            source={{
              uri: user?.avatar,
            }}
            style={{
              flex: 1,
            }}
            resizeMode="cover"
          />
        </View>
        <View className="justify-center items-center my-4">
          <Text className="font-semibold text-black">
            {items.user.user?.user?.firstName +
              ' ' +
              items.user.user?.user?.lastName}{' '}
          </Text>
          <Text>{items.user.user?.user?.email}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.Touch}
        onPress={async () => {
          await analytics().logEvent('Project', {
            insideDrawer: 'navigate project',
          });
          props.navigation.navigate(navigationString.PROJECTS);
        }}>
        <Image source={imagePath.icProject} style={styles.img} />
        <Text style={styles.txt}>Project</Text>
      </TouchableOpacity>
      {role1 && (
        <TouchableOpacity
          style={styles.Touch}
          onPress={async () => {
            await analytics().logEvent('Invite_Admin', {
              insideDrawer: 'Invite admin inside drawer',
            });
            props.navigation.navigate(navigationString.INVITE_ADMIN);
          }}>
          <Image source={imagePath.icAdmin} style={styles.img} />
          <Text style={styles.txt}>Manage Admin</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.Touch}
        onPress={async () => {
          await analytics().logEvent('profile', {
            insideDrawer: 'navigate profile',
          });
          props.navigation.navigate(navigationString.PROFILE);
        }}>
        <Image source={imagePath.icProfile} style={styles.img} />
        <Text style={styles.txt}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleLogOut()}
        style={[
          styles.Touch,
          {
            backgroundColor: '#0066A2',
            color: 'white',
            paddingVertical: 7,
            paddingHorizontal: 10,
            marginHorizontal: 10,
            borderRadius: 10,
          },
        ]}>
        <Image source={imagePath.icLogout} style={{tintColor: 'white'}} />
        <Text style={{color: 'white', fontSize: 15, fontWeight: 500}}>
          Logout
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  Touch: {flexDirection: 'row', alignItems: 'center', marginVertical: 10},
  img: {width: 40, height: 40, tintColor: '#0066A2', marginHorizontal: 15},
  txt: {color: '#0066A2', fontSize: 15, fontWeight: 500},
});
