import { View, Text, Image } from "react-native";
import React from "react";
import imagePath from "../../constant/imagePath";

const NoDataFound = ({ data }) => {
  return (
    <View className="flex-1 mt-56 self-center">
      <View className="  py-5 mx-5  flex-1 justify-center items-center ">
        <Image source={imagePath.icNoData} className="w-24 h-24" />
        <Text className="text-[#0066A2]  font-semibold ">{data}</Text>
      </View>
    </View>
  );
};

export default NoDataFound;
