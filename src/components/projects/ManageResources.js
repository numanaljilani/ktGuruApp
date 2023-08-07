import {TouchableOpacity, Text, View, Modal, Image} from 'react-native';
import React from 'react';
import imagePath from '../../constant/imagePath';
import {useGetresourcesMutation} from '../../redux/api/projectApi';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import navigationString from '../../constant/navigationString';
import {setResource, setUserInfo} from '../../redux/slice/prjectSlice';

const ManageResources = ({setResourceMod, opration, setLoading}) => {
  const {user} = useSelector(state => state.reducer.user);
  const {access_token} = useSelector(state => state.reducer.token.token);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [getresource] = useGetresourcesMutation();

  const navigatetoManageResource = async data => {
    // console.log(data);
    setLoading(true);
    dispatch(setUserInfo(data));
    const res = await getresource({
      body: {
        projectId: opration._id,
        userId: data.userId.id,
      },
      token: access_token,
    });
    if (res.data) {
      dispatch(setResource(res.data));
      setResourceMod(false);
      setLoading(false);
      navigation.navigate(navigationString.MANAGERESOURCES);
    }
    setLoading(false);
  };
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={true}
      style={{zIndex: 1100}}>
      <View
        style={{backgroundColor: '#rgba(0, 0, 0, 0.5)'}}
        className="flex-1 flex-col  justify-center px-4">
        <View className="bg-white  px-2 rounded-lg py-4">
          <Text className="font-semibold text-black mx-auto">
            Manage Resources in this project
          </Text>
          <View className="px-2 ">
            <View>
              {opration?.resources?.map((data, index) =>
                data.isApproved &&
                data.userId._id != user.user.id &&
                data.userRole !== 'admin' &&
                data.userRole !== 'projectAdmin' ? (
                  <TouchableOpacity
                    onPress={() => navigatetoManageResource(data)}
                    key={index}
                    className=" bg-white flex-row px-2  rounded-lg  mt-2 py-2"
                    style={{elevation: 3}}>
                    <View className="border-2 border-[#0066A2] w-16 h-16 rounded-full my-auto overflow-hidden">
                      {console.log(data.isApproved)}
                      <Image
                        source={
                          data.userId?.avatar
                            ? {uri: data.userId?.avatar}
                            : imagePath.icProfile
                        }
                        className="flex-1"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="px-3 pt-1 overflow-hidden">
                      <Text className="font-semibold">
                        {data.userId?.firstName + ' ' + data.userId?.lastName}
                      </Text>
                      <Text className=" text-xs">{data.userId?.email}</Text>
                    </View>
                  </TouchableOpacity>
                ) : null,
              )}
            </View>

            <View className=" mx-auto py-4 ">
              <TouchableOpacity
                onPress={() => setResourceMod(false)}
                className={` border-2 border-[#0066A2] flex-row items-center justify-center px-10 py-3 rounded-lg`}>
                <Text className="text-[#0066A2] text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ManageResources;
