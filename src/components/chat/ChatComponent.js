import { View, Text, Image } from "react-native";
import React, { memo } from "react";

const ChatComponent = ({ chatData, id ,i}) => {

  // if(chatData.createdAt.split("T")[0] == "2023-06-07"){
  //   console.log(chatData)
  // }
  return (
    <View>
      <View>
        {chatData !== undefined && (
          <View
            className={`flex-row my-1   ${
              chatData?.sender?._id === id ? "justify-end " : " ml-2 mr-3"
            }`}
          >
            {chatData?.sender?._id !== id && (
              <View className="border-2 border-[#0066A2] rounded-full overflow-hidden h-14 w-14 ">
                <Image
                  source={{
                    uri: chatData?.sender?.avatar,
                  }}
                  style={{
                    flex: 1,
                  }}
                  resizeMode="cover"
                />
              </View>
            )}
            <View
              className={`"my-1 py-1 px-3  ${
                chatData?.sender?._id === id
                  ? "bg-[#4c7cff] items-end mr-3  rounded-l-lg rounded-tr-lg"
                  : "bg-white rounded-r-lg   rounded-tl-lg ml-1 mr-14 "
              } ml-2"`}
              style={{
                elevation: 3,
                shadowColor: "#0066A2",
              }}
            >
              {chatData?.sender?._id !== id && (
                <Text className="text-xs font-semibold">
                  {chatData?.sender?.firstName +
                    " " +
                    chatData?.sender?.lastName}
                </Text>
              )}
              <Text
                className={`my-1  ${
                  chatData?.sender?._id === id ? "text-white" : "text-black"
                } font-semibold`}
              >
                {chatData?.content}
              </Text>
              <Text className="text-xs ">
                {new Date(chatData?.createdAt).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(ChatComponent);
