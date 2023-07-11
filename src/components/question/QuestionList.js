import { Text, View, TouchableOpacity, Image } from "react-native";
import React, { memo } from "react";
import imagePath from "../../constant/imagePath";
import navigationString from "../../constant/navigationString";
import { useNavigation } from "@react-navigation/native";
import { setQuestion } from "../../redux/slice/questionSlice";
import { useDispatch } from "react-redux";
import analytics from '@react-native-firebase/analytics';
import { stringManupuation } from "../../utils/stringManupulation";

const QuestionList = ({ data ,active }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const navigateFunction = async() => {
    await analytics().logEvent('navigate_question_page', {
      List: 'navigate to question page',
    })
    dispatch(setQuestion(data));
    navigation.navigate(navigationString.QUESTION_DETAILS);
  };

  return (
    active === "active" ? !data.isSummary &&
    <TouchableOpacity
      onPress={navigateFunction}
      className="border border-[#0066A2] flex-row py-2 mx-2 rounded-lg px-2 bg-white mt-1 h-32"
    >
      <View className="border-2 border-[#0066A2]  rounded-full overflow-hidden h-16 w-16 ">
        <Image
          source={{
            uri: data.userId.avatar,
          }}
          style={{
            flex: 1,
          }}
          resizeMode="cover"
        />
      </View>
      <View className=" flex-1 px-2  justify-between">
        <Text className="font-semibold text-black">{stringManupuation(data.title , 100)}</Text>
        <View>
          <Text className=" text-xs">Asked by : {data.userId.firstName}</Text>
          <View className="flex-row">
            <Text className=" text-xs">
              {new Date(data.createdAt).toLocaleDateString() + "   "}
            </Text>
            <Text className=" text-xs">
              {new Date(data.createdAt).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </Text>
          </View>
        </View>
      </View>

      
    </TouchableOpacity> :data.isSummary && <TouchableOpacity
      onPress={navigateFunction}
      className="border border-[#0066A2] flex-row py-2 mx-2 rounded-lg px-2 bg-white mt-1 h-32"
    >
      <View className="border-2 border-[#0066A2]  rounded-full overflow-hidden h-16 w-16 ">
        <Image
          source={{
            uri: data.userId.avatar,
          }}
          style={{
            flex: 1,
          }}
          resizeMode="cover"
        />
      </View>
      <View className=" flex-1 px-2  justify-between">
        <Text className="font-semibold text-black">{stringManupuation(data.title , 100)}</Text>
        <View>
          <Text className=" text-xs">Asked by : {data.userId.firstName}</Text>
          <View className="flex-row">
            <Text className=" text-xs">
              {new Date(data.createdAt).toLocaleDateString() + "   "}
            </Text>
            <Text className=" text-xs">
              {new Date(data.createdAt).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </Text>
          </View>
        </View>
      </View>  
    </TouchableOpacity>
  );
};

export default memo(QuestionList);
