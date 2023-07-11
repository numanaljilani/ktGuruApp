import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef } from "react";
import imagePath from "../../constant/imagePath";
import { TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
import { useInviteAdminMutation } from "../../redux/api/api";
import { showMessage } from "react-native-flash-message";

const InviteAdmin = ({ navigation }) => {
  const { user } = useSelector((state) => state.reducer.user);
  const { access_token } = useSelector((state) => state.reducer.token.token);
  // console.log(access_token)
  const inviteRef = useRef({
    companyId: user?.role1?._id,
    email: "",
    name: user?.user?.firstName +" "+ user?.user?.lastName,
    message: "",
  });
  const [invite,{data,error,isSuccess,isError}] = useInviteAdminMutation();

  useEffect(()=>{
    if(data){
      showMessage({message : data.message , type : "success"})
      navigation.goBack()
    }
  },[isSuccess])


  useEffect(()=>{
    if(error){
      showMessage({message : error.data?.message , type : "danger"})
    }
  },[isError])
 


  const inviteNow = async () => {
    invite({
      body:inviteRef.current,
      token : access_token
    });
  };
  return (
    <View className="border h-full">
      <Image
        source={imagePath.imgKt_Logo2}
        className="h-24 w-24 mx-auto mt-4"
      />
      <View className="flex-row items-center justify-center">
        <Text className=" text-lg font-semibold">Invite Admin for </Text>
        <Text className="text-lg font-semibold text-[#20b5b3]">
          {user?.role1.companyName}
        </Text>
      </View>
      <View
        className="mx-3 mt-3 rounded-lg px-2 py-4 pb-8  bg-white"
        style={{ elevation: 20 }}
      >
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
              onChangeText={(text) => inviteRef.current.email = text}
            />
            <TouchableOpacity className="bg-[#0066A2] px-2">
              <Text className="text-white font-semibold my-auto ">Search</Text>
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
              onChangeText={(text) => inviteRef.current.message = text}
            />
          </View>
          <View className="flex-row justify-between mt-3">
            <TouchableOpacity
              onPress={inviteNow}
              className="bg-[#0066A2] rounded-md px-10 py-2"
            >
              <Text className="text-white font-semibold my-auto ">
                Invite into Project
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-[#0066A2] rounded-md px-10 py-2"
            >
              <Text className="text-white font-semibold my-auto ">Canel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InviteAdmin;
