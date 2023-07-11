import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
  BackHandler
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import imagePath from "../../../constant/imagePath";
import ChatComponent from "../../../components/chat/ChatComponent";
import { TextInput } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  useAllmessageMutation,
  useMessageMutation,
} from "../../../redux/api/chatApi";
import {
  addCount,
  addMessage,
  addSingleMessage,
  clearMessage,
} from "../../../redux/slice/groupChat";
import { TypingAnimation } from "react-native-typing-animation";
import analytics from "@react-native-firebase/analytics";
import { useSendNotificationMutation } from "../../../redux/api/api";

const SingleChat = () => {
  
  const items = useSelector((state) => state.reducer);
  const { messageStore, count } = useSelector(
    (state) => state.reducer.groupChat
  );
  // console.log(items.chat)
  const { user } = useSelector((state) => state.reducer.user.user);
  const { _id, users } = useSelector((state) => state.reducer.chat.singleChat);
  const item = useSelector((state) => state.reducer);
  const { socket } = useSelector((state) => state.reducer.chat);
  const { access_token } = useSelector((state) => state.reducer.token.token);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  const [chatMessage, setChatMessage] = useState({
    content: "",
    projectId: items.project.project._id,
    chatId: _id,
  });
  const [sendNotification] = useSendNotificationMutation()

  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const [
    getAllMesasges,
    {
      data: allData,
      error: allError,
      isSuccess: isAllSuccess,
      isError: isAllError,
    },
  ] = useAllmessageMutation();
  const [message, { data, error, isSuccess, isError }] = useMessageMutation();
  // console.log(" zvdfgvdfdfb ")

  useEffect(() => {
    if (allData) {
      dispatch(addMessage(allData));
    }
  }, [isAllSuccess]);
  useEffect(() => {
    // showMsessage
  }, [allError]);

  const getAllSingleChat = async () => {
    getAllMesasges({
      id: items.chat.singleChat._id,
      token: access_token,
      skip: count,
    });
  };
  // console.log(socket)
  const fetchData = () => {
    if (items.chat.singleChat._id) {
      socket.emit("join chat", items.chat.singleChat._id);

      getAllSingleChat();
    }
  };

  useEffect(() => {
    fetchData();
    // dispatch(AddSelectedChatCompare(chat));
  }, [items.chat.singleChat._id]);

  useEffect(() => {
    getAllSingleChat();
  }, [isFocused]);

  // message recived useEffect
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      scrollViewRef.current.scrollToEnd({ animated: true });
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

  // this use Effect is for showing typing animation in chat screen
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

  // dispatch(clearMessage())
  const onChangeTextInput = async (text) => {
    setIsTyping(true);
    setChatMessage({ ...chatMessage, content: text });
  };
  const userId = items.chat.singleChat?.users[0]?.userId?._id
  const send = async () => {
    await analytics().logEvent("send_in_single", {
      Button: "personal message",
    });

    socket.emit("stop typing", items.chat.singleChat._id);
    if (items.chat.socket.connected) {
      message({
        body: chatMessage,
        token: items.token.token.access_token,
      });

      const response =  await sendNotification({
        body:{
          userId,
          data:{
            title : `New messasge from ${user.firstName + " " + user.lastName}`,
            body : `${chatMessage.content}`
          }
        },
        token : access_token
      })
      console.log(response)
      setChatMessage({ ...chatMessage, content: "" });
    } else {
    }
  };
// console.log(items.chat.singleChat?.users[0]?.userId?._id)

  useEffect(() => {
    if (isSuccess) {
      socket.emit("new message", data);
      dispatch(addSingleMessage(data));
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [isSuccess]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAllSingleChat();
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
    navigation.goBack()
    dispatch(clearMessage())
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);
  


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
          onPress={() => {
            dispatch(clearMessage());
            navigation.goBack();
          }}
          className=" rounded-full p-1 mr-2 bg-[#0067a20e]"
        >
          <Image
            source={imagePath.icBack}
            className="w-7 h-7"
            style={{ tintColor: "#0066A2" }}
          />
        </TouchableOpacity>
        <View className="w-16 h-16 border-2 border-[#0066A2] rounded-full overflow-hidden ">
          <Image
            source={{
              uri:
               users !== undefined &&  users?.length > 1
                  ? users[1]?.userId?.avatar
                  : users[0]?.userId?.avatar,
            }}
            className="flex-1"
            resizeMode="cover"
          />
        </View>
        <View>
          <View className= " flex-row">
            <Text className="text-black font-semibold ml-4">
              { users !== undefined && users.length > 1
                ? users[1].userId.firstName
                : users[0].userId.firstName}
            </Text>
            <Text className="text-black font-semibold ml-1">
              {users !== undefined && users.length > 1
                ? users[1].userId.lastName
                : users[0].userId.lastName}
            </Text>
          </View>
          {typing && (
            <TypingAnimation
              dotColor="#0066A2"
              dotMargin={5}
              dotAmplitude={5}
              dotSpeed={0.3}
              dotRadius={3.5}
              dotX={30}
              dotY={10}
            />
          )}
        </View>
      </View>

      <ScrollView
        className=""
        contentContainerStyle={{ paddingBottom: 10, marginBottom: 60 }}
        ref={scrollViewRef}
        contentOffset={{ x: 0, y: 10000 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
      >
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
      </ScrollView>

      <View className="px-3 flex-row items-center">
        <TextInput
          mode="outlined"
          outlineColor="#0066A2"
          activeOutlineColor="#0066A2"
          placeholder="Type a message"
          className="flex-1"
          value={chatMessage.content}
          onChangeText={(text) => {
            onChangeTextInput(text);
          }}
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

export default SingleChat;
