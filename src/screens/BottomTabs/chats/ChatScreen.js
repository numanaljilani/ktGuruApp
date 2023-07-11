import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  BackHandler 
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import imagePath from "../../../constant/imagePath";
import ChatComponent from "../../../components/chat/ChatComponent";
import { TextInput } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import analytics from "@react-native-firebase/analytics";
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
import { useSendNotificationMutation } from "../../../redux/api/api";

const ChatScreen = () => {
  const items = useSelector((state) => state.reducer);

  const { _id: projectId, projectName } = useSelector(
    (state) => state.reducer.project.project
  );
  const { messageStore, count } = useSelector(
    (state) => state.reducer.groupChat
  );
  const { socket } = useSelector((state) => state.reducer.chat);
  const {user} = useSelector((state) => state.reducer.user.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [chatMessage, setChatMessage] = useState({
    content: "",
    projectId: projectId,
    chatId: items.groupChat.groupChat?._id,
  });
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();
  const [getAllMesasges] = useAllmessageMutation();
  const [sendNotification] = useSendNotificationMutation()
  const [message, { data, error, isSuccess, isError }] = useMessageMutation();
  const scrollViewRef = useRef();

  const fetchData = () => {
    if (items.groupChat.groupChat._id) {
      socket.emit("join chat", items.groupChat.groupChat._id);
      // getAllChat()
    }
  };

  useEffect(() => {
    fetchData();
  }, [items.groupChat.groupChat._id , isFocused]);

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



  //  message recive socket
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      dispatch(addSingleMessage(newMessageRecieved));
      scrollViewRef.current.scrollToEnd({ animated: true });
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


  //  is Typing condition
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


  // send message
  const send = async () => {
    await analytics().logEvent("send", {
      Button: "send message",
    });
    if (items.chat.socket.connected) {
      message({
        body: chatMessage,
        token: items.token.token.access_token,
      });
    }
    setChatMessage({ ...chatMessage, content: "" });
  };

  // dispatch(clearMessage())
  const onChangeTextInput = async (text) => {
    setIsTyping(true);
    setChatMessage({ ...chatMessage, content: text });
  };

  // storeing message which we are send 
  useEffect(() => {
    if (isSuccess) {
      socket.emit("new message", data);
      dispatch(addSingleMessage(data));
      sendNotify()
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
    if (contentOffset.y === 0) {
      if (count === 0) {
        dispatch(addCount(1));
      } else {
        dispatch(addCount(count + 1));
        fetchData();
      }
    }
  };

 const  sendNotify = async () =>{
  if(isSuccess){
    const response =  await sendNotification({
      body:{
        projectId : items.project.project._id,
        data:{
          title : `New messasge from ${user.firstName + " " + user.lastName} in ${projectName}`,
          body : `${data?.content}`
        }
      },
      token : items.token.token.access_token
    })
  }

 }

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

  return ( uniqueStoreData ?
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
            navigation.goBack()}}
          className=" rounded-full p-1 mr-2 bg-[#0067a20e]"
        >
          <Image
            source={imagePath.icBack}
            className="w-7 h-7"
            style={{ tintColor: "#0066A2" }}
          />
        </TouchableOpacity>
        <View className="w-16 h-16 border-2 border-[#0066A2] rounded-full ">
          <Image
            source={{ uri: items.groupChat.groupChat?.avatar }}
            className="flex-1"
            resizeMode="cover"
          />
        </View>
        <View>
          <Text className="text-black font-semibold ml-4">{projectName}</Text>
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
        className=" pt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        ref={scrollViewRef}
        contentOffset={{ x: 0, y: 1000 }}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        onScroll={handleScroll}
      >
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

        {uniqueDates?.map((dates, index) => {
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
        }).reverse()}
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
    </View> : null
  );
};

export default ChatScreen;
