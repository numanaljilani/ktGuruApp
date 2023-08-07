import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import imagePath from '../../constant/imagePath';
import {TextInput} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useInviteAdminMutation} from '../../redux/api/api';
import {showMessage} from 'react-native-flash-message';
import ManageProjectAdminModal from '../../components/admin/ManageProjectAdminModal';
import Indicator from '../../components/common/Indicator';

const InviteAdmin = ({navigation}) => {
  const items = useSelector(state => state.reducer);

  const {user} = useSelector(state => state.reducer.user);
  const {access_token} = useSelector(state => state.reducer.token.token);
  const inviteRef = useRef({
    companyId: user?.role1?._id,
    email: '',
    name: user?.user?.firstName + ' ' + user?.user?.lastName,
    message: '',
  });

  const [admin, setAdmin] = useState();
  const [loading, setLoading] = useState(false);
  const [adminModal, setAdminModal] = useState(false);
  const [invite, {data, error, isSuccess, isError}] = useInviteAdminMutation();

  useEffect(() => {
    if (data) {
      showMessage({message: data.message, type: 'success'});
      navigation.goBack();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      showMessage({message: error.data?.message, type: 'danger'});
    }
  }, [isError]);

  const inviteNow = async () => {
    invite({
      body: inviteRef.current,
      token: access_token,
    });
  };

  const manageAdmin = data => {
    setAdmin(data);
    setAdminModal(true);
  };
  return (
    <View className="h-full">
      <Image
        source={imagePath.imgKt_Logo2}
        className="h-24 w-24 mx-auto mt-4"
      />
      <View className="flex-row items-center justify-center">
        <Text className=" text-lg font-semibold">Manage Admin for </Text>
        <Text className="text-lg font-semibold text-[#20b5b3]">
          {user?.role1.companyName}
        </Text>
      </View>
      <ScrollView className=" flex-1 ">
        <View
          className="mx-3 mt-3 rounded-lg px-2 py-4 pb-8  bg-white"
          style={{elevation: 10}}>
          <View className="">
            <Text className="my-2 font-semibold text-black">
              Who do you want to invite to this Company?
            </Text>
            <View className="flex-row">
              <TextInput
                placeholder="Enter Email address"
                activeOutlineColor="#0066A2"
                activeUnderlineColor="#0066A2"
                className="flex-1 bg-[#0067a214]"
                onChangeText={text => (inviteRef.current.email = text)}
              />
              <TouchableOpacity className="bg-[#0066A2] px-2">
                <Text className="text-white font-semibold my-auto ">
                  Search
                </Text>
              </TouchableOpacity>
            </View>
            <View className="">
              <Text className="my-2 font-semibold text-black">
                Write Personalised text
              </Text>
              <TextInput
                multiline={true}
                numberOfLines={2}
                activeOutlineColor="#ecf4f3"
                className="bg-[#0067a214]"
                activeUnderlineColor="#0066A2"
                onChangeText={text => (inviteRef.current.message = text)}
              />
            </View>
            <View className=" mt-3 px-10">
              <TouchableOpacity
                onPress={inviteNow}
                style={{elevation: 5}}
                className="bg-[#0066A2] rounded-md px-10 py-2">
                <Text className="text-white font-semibold my-auto text-center ">
                  Invite into Project
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {user.role1.teams.map((data, index) =>
          data?.isApproved &&
          data?.userId?.firstName &&
          user.user.id !== data.userId.id ? (
            <TouchableOpacity
              onPress={() => manageAdmin(data.userId)}
              key={index}
              className="border border-slate-300 mx-3 mt-3 bg-white  flex-row py-2 px-4  rounded-lg items-center">
              <View className="border-2 border-[#0066A2] w-16 h-16 rounded-full my-auto overflow-hidden">
                {/* {console.log(data.isApproved, '>>>>>>>>>>>>>>>>>>')} */}
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
              <View className="ml-3">
                <Text className="font-semibold text-black">
                  {data.userId.firstName + ' ' + data.userId.lastName}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null,
        )}
      </ScrollView>
      {adminModal && (
        <ManageProjectAdminModal
          admin={admin}
          access_token={access_token}
          setAdminModal={setAdminModal}
          user={user}
          setLoading={setLoading}
        />
      )}
      {loading && <Indicator />}
      <View className=" mb-5 px-10">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{elevation: 5}}
          className="bg-[#0066A2] rounded-md px-10  py-2 m">
          <Text className="text-white font-semibold text-center my-auto ">
            Canel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InviteAdmin;
