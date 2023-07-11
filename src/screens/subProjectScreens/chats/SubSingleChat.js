import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  BackHandler
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import analytics from '@react-native-firebase/analytics';
import imagePath from "../../../constant/imagePath";
import ChatComponent from "../../../components/subProjectChats/ChatComponent";
import { TextInput } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  useAllmessageMutation,
  useMessageMutation,
} from "../../../redux/api/chatApi";
import { addMessage, addSingleMessage, clearMessage } from "../../../redux/slice/groupChat";
import { TypingAnimation } from "react-native-typing-animation";
import { useSendNotificationMutation } from "../../../redux/api/api";

const SubSingleChat = () => {
  const items = useSelector((state) => state.reducer);
  const {access_token} = useSelector((state) => state.reducer.token.token);
  const {user} = useSelector((state) => state.reducer.user.user);
  const {_id ,projectName} = useSelector((state) => state.reducer.subProject.subProject);
  const {subSingleChat} = useSelector((state) => state.reducer.subChat);
  const userId = subSingleChat?.users[0]?.userId?._id
  const { messageStore } = useSelector(
    (state) => state.reducer.groupChat
  );
  const { socket } = useSelector((state) => state.reducer.chat);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [chatMessage, setChatMessage] = useState({
    content: "",
    projectId:_id,
    chatId: subSingleChat._id,
  });
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [getAllMesasges] = useAllmessageMutation();
  const [sendNotification] = useSendNotificationMutation()
  const isFocused = useIsFocused();
  const [message ,{
    data,
    error,
    isSuccess,
    isError,
  }] = useMessageMutation();
  const scrollViewRef = useRef();
  const getAllSingleChat = async () => {
    const res = await getAllMesasges({
      id: subSingleChat._id,
      token: access_token,
    });

    if (res.data) {
      dispatch(addMessage(res.data));
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
    }
  };

  const fetchData = () => {
    if (items.chat.singleChat._id) {
      socket.emit("join chat", items.chat.singleChat._id);
    }
  };

  useEffect(() => {
    fetchData();
    // dispatch(AddSelectedChatCompare(chat));
  }, [subSingleChat._id]);
  
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

  const send = async () => {
    await analytics().logEvent('sendMessage', {
      item: 'sub project personal message ',
    })
    socket.emit("stop typing", items.chat.singleChat._id);    
    if (items.chat.socket.connected) {
       message({
        body: chatMessage,
        token: items.token.token.access_token,
      });
      setChatMessage({ ...chatMessage, content: "" })
    } else {
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

  useEffect(()=>{
    if(isSuccess){
      socket.emit("new message", data);
      dispatch(addSingleMessage(data));
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  },[isSuccess])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAllSingleChat();
    setRefreshing(false);
  }, []);

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
            navigation.goBack()}}
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
            source={{ uri: subSingleChat.users[0]?.userId?.avatar }}
            className="flex-1"
            resizeMode="cover"
          />
        </View>
        <View>
          <Text className="text-black font-semibold ml-4">
            {subSingleChat.users[0]?.userId?.firstName +
              " " +
              subSingleChat.users[0]?.userId?.lastName}
          </Text>
          {typing && (
              <TypingAnimation
                dotColor="#0066A2"
                dotMargin={5}
                dotAmplitude={5}
                dotSpeed={0.30}
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {messageStore &&
          messageStore
            .map((data, index) => (
              <ChatComponent
                chatData={data}
                key={index}
                id={items.user.user.user._id}
              />
            ))
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

export default SubSingleChat;

// useEffect(() => {
//   if (typing == true) {
//     socket.emit("typing", chat);
//     let lastTypingTime = new Date().getTime();
//     var timerLength = 3000;
//     setTimeout(() => {
//       var timeNow = new Date().getTime();
//       var timeDiff = timeNow - lastTypingTime;
//       if (timeDiff >= timerLength && typing) {
//         socket.emit("stop typing", chat);
//         setTyping(false);
//       }
//     }, timerLength);
//   }
// }, [typing]);

// const handleSend = async () => {
//   socket.emit("stop typing", chat);
//     token: accessToken,
//   });
// };
