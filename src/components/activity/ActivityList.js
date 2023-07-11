import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

const ActivityList = ({ data }) => {
  const {
    userId,
    desc,
    title,
    comment,
    answerData,
    answerId,
    questionId,
    createdAt,
  } = data;
  
  return (
    <TouchableOpacity className="flex-1 flex-row  px-2">
      <View className="border border-[#0066A2] mx-2 rounded-full overflow-hidden h-14 w-14 ">
        <Image
          source={{
            uri: userId?.avatar,
          }}
          style={{
            flex: 1,
          }}
          resizeMode="cover"
        />
      </View>
      <View
        className=" my-2 p-2 rounded-lg bg-white flex-1"
        style={{ elevation: 10 }}
      >
        <Text className="text-[#0066A2]">
          <Text className="text-gray-600 font-semibold">
            {userId?.firstName + " " + userId?.lastName}
            {comment
              ? " Commented on "
              : answerData
              ? " Answerd on "
              : " asked a Question "}
          </Text>
          {title
            ? title
            : answerId
            ? answerId.answerData
            : questionId
            ? questionId.title
            : null}
          <Text className="text-black">
            {desc ? desc : comment ? comment : answerData}
          </Text>
        </Text>
        <Text className="self-end text-xs">
          {new Date(createdAt).toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ActivityList;
