import { TouchableOpacity, Text, View, Modal, Image } from "react-native";
import React, { useRef, useState } from "react";
import { TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import imagePath from "../constant/imagePath";

const Drawer = () => {

  const items = useSelector((state) => state.reducer);







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
            Ask a Question
          </Text>
          <View className="px-2 ">
            <View className="mt-2">
              <Text className="font-semibold text-black">Title</Text>
              <Text className="text-xs my-1">
                Be specific and imagine you are asking a question to another
                person.
              </Text>
              <TextInput
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                placeholder="Mention people using '@'"
              />
            </View>
            <View className="mt-2">
              <Text className="font-semibold text-black">
                What are the details of your problem?
              </Text>
              <Text className="text-xs my-1">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </Text>
              <TextInput
                multiline={true}
                numberOfLines={3}
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                placeholder="Mention people using '@'"
                //   value={data.projectDesc}
              />
            </View>
            <View className=" flex-row justify-center mt-3">
              <TouchableOpacity
                className="flex-row items-center border-2 border-[#0066A2] px-5 py-1 rounded-lg "
              >
                <Image
                  source={imagePath.icUpload}
                  className="w-10 h-10 mr-3 "
                  style={{ tintColor: "#0066A2" }}
                />
                <Text className="font-semibold text-[#0066A2]">
                  Select A File
                </Text>
              </TouchableOpacity>
            </View>

            <View className=" flex-row justify-between py-4 ">
              <TouchableOpacity

                className={`bg-[#0066A2] flex-row items-center justify-center px-7 py-3 rounded-lg`}
              >
                <Text className="text-white text-center font-semibold">
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

export default Drawer;
