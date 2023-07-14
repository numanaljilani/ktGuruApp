import { Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

const BigUserIcons = ({ data, setShowResourceLis }) => {
  return data.isApproved && data?.userId?.avatar ? (
    <TouchableOpacity
      className=" bg-white w-12 h-12 mr-1 t.shadowLg rounded-full overflow-hidden"
      style={{ elevation: 5 }}
      onPress={() => setShowResourceLis(true)}
    >
      {data.userId.avatar && (
        <Image
          source={{ uri: data.userId.avatar }}
          className="flex-1"
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  ) : null;
};

export default BigUserIcons;
