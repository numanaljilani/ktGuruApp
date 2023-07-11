import { View, Text } from "react-native";
import React from "react";

const ChatComponent = ({ chatData ,id}) => {
  return (
    <View>
      {chatData !== undefined &&
        <View className={`flex-row  ${chatData.sender._id === id ? "justify-end" : ""}`}>
        <View
          className={`" my-1 py-3 px-3 ${
            chatData.sender._id === id
              ? "bg-[#4c7cff] items-end mr-3  rounded-l-lg rounded-tr-lg"
              : "bg-white rounded-r-lg  rounded-tl-lg ml-3"
          } ml-2"`}
        >
          <Text
            className={`${chatData.sender._id === id ? "text-white" : ""} font-semibold`}
          >
            {chatData.content}
          </Text>
          <Text className="text-xs font-semibold">{new Date(chatData.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
        </View>
      </View>}
    </View>
  );
};

export default ChatComponent;
