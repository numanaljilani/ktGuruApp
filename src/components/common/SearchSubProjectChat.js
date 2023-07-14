import {
  TouchableOpacity,
  Text,
  View,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import analytics from "@react-native-firebase/analytics";
import imagePath from "../../constant/imagePath";
import { useNavigation } from "@react-navigation/native";
import navigationString from "../../constant/navigationString";
import { setSingleChat } from "../../redux/slice/chatSlice";
import { useSingleChatMutation } from "../../redux/api/chatApi";

const SearchSubProjectChat = ({ setSearch }) => {
  const { _id, resources } = useSelector(
    (state) => state.reducer.project.project
  );
  const { subProject } = useSelector((state) => state.reducer.subProject);
  // console.log(subProject._id)
  const { access_token } = useSelector((state) => state.reducer.token.token);
  const { user } = useSelector((state) => state.reducer.user.user);
  const [users, setUsers] = useState();
  const [searchUser, setSearchUser] = useState(resources);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [singlechat] = useSingleChatMutation();

  const navigateToChat = async (item) => {
    const res = await singlechat({
      body: {
        projectId: subProject._id,
        userId: item?.userId?._id,
      },
      token: access_token,
    });
    // console.log(res.data)
    if (res.data) {
      dispatch(setSingleChat(res.data));
      navigation.navigate(navigationString.SINGLE_CHAT);
    }
  };
  console.log(resources);

  const search = (text) => {
    if (text === "") {
      setSearchUser(resources);
    } else {
      let tempList = resources.filter((data) => {
        if (data.isApproved && data.userId._id !== user._id) {
          return (
            data.userId.firstName?.toLowerCase().indexOf(text.toLowerCase()) >
              -1 ||
            data.userId.lastName?.toLowerCase().indexOf(text.toLowerCase()) > -1
          );
        }
        return null;
      });
      setSearchUser(tempList);
    }
  };

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
          <View className="flex-row mb-3">
            <Text className="font-semibold text-black mx-auto">
              Available users
            </Text>
            <TouchableOpacity
              onPress={() => setSearch(false)}
              className=" w-7 h-7 mr-3"
            >
              <Image
                source={imagePath.icCancel}
                style={{ tintColor: "#0066A2" }}
                className="flex-1 w-7 h-7"
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
          <View>
            <TextInput
              placeholder="Search by name"
              mode="outlined"
              outlineColor="#0066A2"
              activeOutlineColor="#0066A2"
              placeholderTextColor="#C0C0C0"
              onChangeText={(text) => {
                search(text);
              }}
              className="rounded-lg bg-white mx-3"
              left={<TextInput.Icon icon={imagePath.icSearch} style={{}} />}
            />
            <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
              {searchUser?.map((data, index) => {
                return data.userId.firstName !== undefined &&
                  data.isApproved &&
                  data.userId._id !== user._id ? (
                  <TouchableOpacity
                    onPress={() => navigateToChat(data)}
                    key={index}
                    className="flex-row bg-blue-50 mt-2 shadow-xl  py-2 px-3 rounded-lg"
                    style={{
                      elevation: 5,
                      shadowColor: "black",
                      shadowRadius: 40,
                      borderRadius: 30,
                      shadowOffset: { width: 0, height: 2 },
                    }}
                  >
                    <View className="border-2 border-[#0066A2] w-16 h-16 rounded-full my-auto overflow-hidden">
                      <Image
                        source={
                          data.userId?.avatar
                            ? { uri: data.userId?.avatar }
                            : imagePath.icProfile
                        }
                        className="flex-1"
                        resizeMode="cover"
                      />
                    </View>
                    <View>
                      <Text className="ml-3 mt-2 font-semibold">
                        {data.userId?.firstName + " " + data.userId?.lastName}
                      </Text>
                      <Text className="ml-3 mt-1 text-xs">
                        {data.userId?.email}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null;
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SearchSubProjectChat;
