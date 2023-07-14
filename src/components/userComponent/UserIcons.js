import { View, Image, TouchableOpacity } from "react-native";
import React, { memo } from "react";

const UserIcons = ({
  data,
  setShowResourceLis,
  setSubUserData,
  resource,
  setShowSubResourceLis,
}) => {
  // console.log(data.userId.avatar)
  const press = () => {
    setSubUserData(resource);
    setShowResourceLis(true);
    setShowSubResourceLis(true);
  };

  return data.userId !== null &&
    data.isApproved &&
    data.userId.avatar !== undefined ? (
    <TouchableOpacity
      onPress={press}
      className=" mr-1 w-9  h-9 rounded-full overflow-hidden bg-while shadow-2xl"
      style={{ elevation: 2 }}
    >
      {data.userId !== null && (
        <Image
          source={{ uri: data.userId.avatar }}
          className="flex-1"
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  ) : null;
};

export default memo(UserIcons);
