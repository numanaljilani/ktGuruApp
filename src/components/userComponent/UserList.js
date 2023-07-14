import {
  TouchableOpacity,
  Text,
  View,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import imagePath from "../../constant/imagePath";

const UserList = ({
  resources,
  setShowResourceLis,
  subResources,
  showSubResourceList,
  setShowSubResourceLis,
}) => {
  return (
    <Modal
      transparent={true}
      animationType={"none"}
      visible={true}
      style={{ zIndex: 1100 }}
    >
      <View
        style={{ backgroundColor: "#rgba(0, 0, 0, 0.5)" }}
        className="flex-1 flex-col  justify-center px-4"
      >
        <View className="bg-white  px-2 rounded-lg py-4">
          <Text className="font-semibold text-black mx-auto">
            {" "}
            Available users
          </Text>
          <View className="px-2 ">
            <View className="my-3">
              <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
                {!showSubResourceList
                  ? resources?.map((data, index) => {
                      console.log(data.isApproved);
                      return (
                        <View
                          className=" rounded-lg bg-blue-50 mt-2"
                          style={{ elevation: 6 }}
                          key={index}
                        >
                          <View className="mx-2 py-2  flex-row">
                            <View className="border-2 bg-[#0066A2] border-[#0066A2] w-16 h-16 rounded-full my-auto overflow-hidden">
                              <Image
                                source={
                                  data.userId.avatar
                                    ? { uri: data.userId.avatar }
                                    : imagePath.icProfile
                                }
                                className="w-full h-full"
                                resizeMode="cover"
                              />
                            </View>
                            <View className="ml-2 my-auto">
                              <Text className="text-black font-semibold">
                                {data.userId.firstName +
                                  " " +
                                  data.userId.lastName}
                              </Text>
                              <Text>{data.userId.email}</Text>
                            </View>
                          </View>
                        </View>
                      );
                    })
                  : subResources?.map(
                      (data, index) =>
                        data.isApproved && (
                          <View
                            className=" rounded-lg bg-blue-50 mt-2"
                            style={{ elevation: 6 }}
                            key={index}
                          >
                            <View className="mx-2 py-2  flex-row">
                              <View className="border-2 bg-[#0066A2] border-[#0066A2] w-16 h-16 rounded-full my-auto overflow-hidden">
                                <Image
                                  source={
                                    data.userId.avatar
                                      ? { uri: data.userId.avatar }
                                      : imagePath.icProfile
                                  }
                                  className="w-full h-full"
                                  resizeMode="cover"
                                />
                              </View>
                              <View className="ml-2 my-auto">
                                <Text className="text-black font-semibold">
                                  {data.userId.firstName +
                                    " " +
                                    data.userId.lastName}
                                </Text>
                                <Text>{data.userId.email}</Text>
                              </View>
                            </View>
                          </View>
                        )
                    )}
              </ScrollView>
            </View>
            <View className=" flex-row justify-between py-4 ">
              <TouchableOpacity
                onPress={() => {
                  setShowResourceLis(false);
                  setShowSubResourceLis(false);
                }}
                className={` border-2 flex-1 border-[#0066A2] flex-row items-center justify-center px-10 py-3 rounded-lg`}
              >
                <Text className="text-[#0066A2] text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserList;
