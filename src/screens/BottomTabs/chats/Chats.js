import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PersonalChatList from "../../../components/chat/PersonalChatList";
import { TextInput } from "react-native-paper";
import navigationString from "../../../constant/navigationString";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  useAllSingleChatMutation,
  useAllmessageMutation,
  useGroupchatMutation,
  useSingleChatMutation,
} from "../../../redux/api/chatApi";
import {
  addMessage,
  clearMessage,
  setGroupChat,
} from "../../../redux/slice/groupChat";
import { setChatUsers, setSingleChat } from "../../../redux/slice/chatSlice";
import imagePath from "../../../constant/imagePath";
import { Dropdown } from "react-native-element-dropdown";
import SearchChat from "../../../components/common/SearchChat";

const Chats = () => {
  const items = useSelector((state) => state.reducer);
  const { access_token } = useSelector((state) => state.reducer.token.token);
  const { groupChat } = useSelector((state) => state.reducer.groupChat);
  const { users } = useSelector((state) => state.reducer.chat);
  const { project } = useSelector((state) => state.reducer.project);
  const { messageStore, count } = useSelector(
    (state) => state.reducer.groupChat
  );
  console.log(groupChat.avatar);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [getAllMesasges] = useAllmessageMutation();
  const [search, setSearch] = useState(false);

  const getAllChat = async () => {
    const res = await getAllMesasges({
      id: items.groupChat.groupChat._id,
      token: items.token.token.access_token,
      skip: count,
    });
    if (res.data) {
      dispatch(addMessage(res.data));
    }
  };

  const navigateToChatScreen = async () => {
    getAllChat();
    navigation.navigate(navigationString.CHATS_SCREEN);
  };

  return (
    <View className="px-4 py-2">
      <View>
        <Text className="font-semibold text-black">
          Project Message Channel
        </Text>
        <TouchableOpacity
          onPress={navigateToChatScreen}
          className=" bg-white flex-row px-2  py-2 overflow-hidden border-t-2 rounded-lg border-[#0066A2] mt-2"
        >
          <View
            className={`border-2 overflow-hidden border-[#0066A2] w-16 h-16  rounded-full my-auto ${
              !groupChat?.avatar && "justify-center items-center"
            }`}
          >
            {groupChat?.avatar && (
              <Image
                source={
                  groupChat?.avatar
                    ? // ? { uri: groupChat.avatar }
                      {
                        uri: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006_edit_1.jpg",
                      }
                    : imagePath.icProfile
                }
                style={{ flex: 1 }}
                resizeMode={"cover"}
              />
            )}
          </View>
          <View className="px-2  py-2 ">
            <Text className="font-semibold text-black">
              {items.project.project.projectName}
            </Text>
            {items.groupChat.groupChat?.latestMessage && (
              <View className="flex-row ">
                <Text>
                  {items.groupChat.groupChat?.latestMessage &&
                    items.groupChat.groupChat.latestMessage.sender.firstName}
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
        <TouchableOpacity
          onPress={() => setSearch(true)}
          className="px-5 bg-white rounded-lg border border-[#0066A2] mt-3  py-2 "
        >
          <Text className=" text-[#0066A2]">| Search by name </Text>
        </TouchableOpacity>

        <View className=" mb-20">
          <ScrollView className=" ">
            {users !== undefined &&
              users.length > 0 &&
              users?.map((data, index) => (
                <PersonalChatList data={data} key={index} />
              ))}
          </ScrollView>
        </View>
      </View>
      {search ? <SearchChat setSearch={setSearch} /> : null}
    </View>
  );
};

export default memo(Chats);
