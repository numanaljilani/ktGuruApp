import { Text, View, Image } from "react-native";
import React from "react";

const BigUserIcons = ({ data }) => {
  return data.isApproved && data?.userId?.avatar ? (
    <View
      className=" bg-white w-12 h-12 mr-1 t.shadowLg rounded-full overflow-hidden"
      style={{ elevation: 5 }}
    >
      {data.userId.avatar && (
        <Image
          source={{ uri: data.userId.avatar }}
          className="flex-1"
          resizeMode="cover"
        />
      )}
    </View>
  ) : null;
};

export default BigUserIcons;
