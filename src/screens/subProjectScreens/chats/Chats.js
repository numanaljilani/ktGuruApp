import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PersonalChatList from "../../../components/subProjectChats/PersonalChatList";
import { TextInput } from "react-native-paper";
import navigationString from "../../../constant/navigationString";
import { useNavigation } from "@react-navigation/native";
import {
  useAllSingleChatMutation,
  useGroupchatMutation,
} from "../../../redux/api/chatApi";
import { clearMessage, setGroupChat } from "../../../redux/slice/groupChat";
import imagePath from "../../../constant/imagePath";
import { setSubChatUsers } from "../../../redux/slice/subProjectChatSlice";
import SearchChat from "../../../components/common/SearchChat";
import SearchSubProjectChat from "../../../components/common/SearchSubProjectChat";

const Chats = () => {
  const items = useSelector((state) => state.reducer);
  const {subProject} = useSelector((state) => state.reducer.subProject);
  const {groupChat} = useSelector((state) => state.reducer.groupChat);
  const {subChatUsers} = useSelector((state) => state.reducer.subChat);
  // console.log(groupChat)

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [getGroupeChat] = useGroupchatMutation();
  const [allSingleChat] = useAllSingleChatMutation();
  const [users , setUsers] = useState()
  const [search, setSearch] = useState(false);

  // console.log(items.subProject.subProject)

  const singleChat = async () => {
    const response = await allSingleChat({
      token: items.token.token.access_token,
      body: { projectId:subProject._id },
    });
    if (response.data) {
      dispatch( setSubChatUsers(response.data))
     
    }
    const res = await getGroupeChat({
      token: items.token.token.access_token,
      body: { projectId: subProject._id },
    });

    if (res.data !== null) {
      dispatch(setGroupChat(res.data));
    }

  };

  useEffect(() => {
    // dispatch(clearMessage())
    singleChat();
  }, []);

  // console.log(items.groupChat.groupChat.users)
  return (
    <View className="px-4 py-2">
      <View>
        <Text className="font-semibold text-black">
          Project Message Channel
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(navigationString.SUB_PRO_CHAT)}
          className="bg-white flex-row px-2 py-2 overflow-hidden border-t-2 rounded-lg border-[#0066A2] mt-2"
        >
          <View className={`border-2 border-[#0066A2] w-16 h-16  rounded-full my-auto ${!groupChat?.avatar && "justify-center items-center"}`}>
            <Image
              source={groupChat?.avatar ? { uri:groupChat?.avatar } : imagePath.icProfile}
              className="flex-1"
              resizeMode="cover"
            />
          </View>
          <View className="px-2 pt-2">
            <Text className="font-semibold">
              {subProject?.projectName}
            </Text>
            {items.groupChat.groupChat?.latestMessage && (
              <View className="flex-row ">
                <Text>
                  {items.groupChat.groupChat?.latestMessage &&
                    items.groupChat.groupChat?.latestMessage?.sender.firstName}
                  :
                </Text>
                <Text>
                  {items.groupChat.groupChat?.latestMessage &&
                  items.groupChat.groupChat?.latestMessage.content.length > 20
                    ? items.groupChat.groupChat?.latestMessage.content.slice(
                        0,
                        20
                      ) + "...."
                    : items.groupChat.groupChat?.latestMessage.content}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View className="mt-2">
        <Text className="font-semibold text-black">
          Personal Message Channel
        </Text>
        <TouchableOpacity onPress={()=>setSearch(true)} className="px-5 bg-white rounded-lg border border-[#0066A2] mt-3  py-2 ">
          <Text className=" text-[#0066A2]">| Search by name </Text>
        </TouchableOpacity>
        <View className=" mb-20">
          <ScrollView className=" ">
            {subChatUsers !== undefined &&
              subChatUsers.length > 0 &&
              subChatUsers?.map((data , index) => <PersonalChatList data={data} key={index}/>)}
          </ScrollView>
        </View>
      </View>
      {search ? <SearchSubProjectChat setSearch={setSearch} /> : null}
    </View>
  );
};

export default memo(Chats);
