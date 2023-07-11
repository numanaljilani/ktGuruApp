import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import imagePath from "../../../constant/imagePath";
import { ScrollView } from "react-native-gesture-handler";
import ChatComponent from "../../../components/chat/ChatComponent";
import { TextInput } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import analytics from "@react-native-firebase/analytics";
import {
  useAllmessageMutation,
  useMessageMutation,
} from "../../../redux/api/chatApi";
import {
  addMessage,
  addSingleMessage,
  clearMessage,
} from "../../../redux/slice/groupChat";
import { useSendNotificationMutation } from "../../../redux/api/api";

const SubChatScreen = () => {
  const items = useSelector((state) => state.reducer);
  const { messageStore } = useSelector((state) => state.reducer.groupChat);
  const { socket } = useSelector((state) => state.reducer.chat);
  const { access_token } = useSelector((state) => state.reducer.token.token);
  const { user } = useSelector((state) => state.reducer.user.user);
  const { _id, projectName } = useSelector(
    (state) => state.reducer.subProject.subProject
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [chatMessage, setChatMessage] = useState({
    content: "",
    projectId: items.project.project._id,
    chatId: items.groupChat.groupChat._id,
  });
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();
  const [getAllMesasges] = useAllmessageMutation();
  const [sendNotification] = useSendNotificationMutation();
  const [message, { data, error, isSuccess, isError }] = useMessageMutation();
  const scrollViewRef = useRef();

  const fetchData = () => {
    if (items.groupChat.groupChat._id) {
      socket.emit("join chat", items.groupChat.groupChat._id);
    }
  };

  useEffect(() => {
    fetchData();
  }, [items.groupChat.groupChat._id]);

  const getAllChat = async () => {
    const res = await getAllMesasges({
      id: items.groupChat.groupChat._id,
      token: items.token.token.access_token,
    });
    if (res.data) {
      dispatch(addMessage(res.data));
    }
  };
  useEffect(() => {
    getAllChat();
  }, [isFocused]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      dispatch(addSingleMessage(newMessageRecieved));
    });
    return () => {
      socket.off("message recieved");
    };
  }, []);

  // listning chat
  useEffect(() => {
    socket.on("typing", () => setTyping(true));
    socket.on("stop typing", () => setTyping(false));
  }, []);

  useEffect(() => {
    if (isTyping == true) {
      socket.emit("typing", items.chat.singleChat._id);
      let lastTypingTime = new Date().getTime();
      var timerLength = 3000;
      setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && isTyping) {
          socket.emit("stop typing", items.chat.singleChat._id);
          setIsTyping(false);
        }
      }, timerLength);
    }
  }, [isTyping]);

  const send = async () => {
    await analytics().logEvent("sendMessage", {
      Button: "send message in group",
    });
    if (items.chat.socket.connected) {
      message({
        body: chatMessage,
        token: access_token,
      });
      sendNotify();
    }

    setChatMessage({ ...chatMessage, content: "" });
  };

  // dispatch(clearMessage())
  const onChangeTextInput = async (text) => {
    setIsTyping(true);
    setChatMessage({ ...chatMessage, content: text });
  };

  useEffect(() => {
    if (isSuccess) {
      socket.emit("new message", data);
      dispatch(addSingleMessage(data));
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [isSuccess]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAllChat();
    setRefreshing(false);
  }, []);

  handleScroll = (event) => {
    const { contentOffset } = event?.nativeEvent;

    // console.log(contentOffset.y)
    if (contentOffset.y === 0) {
      if (count === 0) {
        dispatch(addCount(1));
      } else {
        dispatch(addCount(count + 1));
        fetchData();
      }
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
    dispatch(clearMessage());
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => backHandler.remove();
  }, []);

  const sendNotify = async () => {
    if (isSuccess) {
      await sendNotification({
        body: {
          projectId: _id,
          data: {
            title: `New messasge from ${
              user.firstName + " " + user.lastName
            } in ${projectName}`,
            body: `${chatMessage?.content}`,
          },
        },
        token: access_token,
      });
    }
  };

  const uniqueDates = [
    ...new Set(messageStore.map((item) => item?.createdAt?.split("T")[0])),
  ];

  const uniqueStoreData = [...new Set(messageStore.map((item) => item))];

  return (
    <View className=" flex-1">
      <View
        className=" flex-row py-3 px-4 items-center bg-white"
        style={{
          elevation: 15,
          shadowColor: "#0066A2",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className=" rounded-full p-1 mr-2 bg-[#0067a20e]"
        >
          <Image
            source={imagePath.icBack}
            className="w-7 h-7"
            style={{ tintColor: "#0066A2" }}
          />
          <Text></Text>
        </TouchableOpacity>
        <View className="w-16 h-16 border-2 border-[#0066A2] rounded-full ">
          <Image
            source={{ uri: items.groupChat.groupChat.avatar }}
            className="flex-1"
            resizeMode="cover"
          />
        </View>
        <View>
          <Text className="text-black font-semibold ml-4">
            {items.project.project.projectName}
          </Text>
          {typing && <Text className="  ml-4">typing...</Text>}
        </View>
      </View>

      <ScrollView
        className=" pt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        ref={scrollViewRef}
        contentOffset={{ x: 0, y: 1000 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
      >
        <ChatComponent
          data="sender"
          chat="hello evrey one i am hear to listen you hello evrey one i am hear to listen you"
        />
        {uniqueDates
          ?.map((dates, index) => {
            return (
              <View className=" " key={index}>
                <View className=" flex-row justify-center my-3">
                  <View className=" bg-white px-3 rounded-lg">
                    <Text className="font-semibold">{dates}</Text>
                  </View>
                </View>

                {uniqueStoreData
                  ?.map((item, index2) => {
                    if (item?.createdAt?.split("T")[0] === dates) {
                      return (
                        <ChatComponent
                          chatData={item}
                          id={items.user.user.user._id}
                          key={index2}
                          i={index2}
                        />
                      );
                    }
                    return null;
                  })
                  .reverse()}
              </View>
            );
          })
          .reverse()}
        {/* {messageStore &&
          messageStore
            .map((data, index) => (
              <ChatComponent
                chatData={data}
                key={index}
                id={items.user.user.user._id}
              />
            ))
            .reverse()} */}
      </ScrollView>
      <View className="px-3 flex-row items-center">
        <TextInput
          mode="outlined"
          outlineColor="#0066A2"
          activeOutlineColor="#0066A2"
          placeholder="Type a message"
          className="flex-1"
          value={chatMessage.content}
          onChangeText={(text) => onChangeTextInput(text)}
        />
        {chatMessage.content && (
          <TouchableOpacity
            onPress={send}
            className=" bg-[#0066A2] px-5 py-3 ml-2 rounded-md"
          >
            <Text className="font-semibold text-white my-auto ">Send</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SubChatScreen;
