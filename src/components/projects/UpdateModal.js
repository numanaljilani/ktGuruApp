import {
  TouchableOpacity,
  Text,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { useUpdateprojectAPIMutation } from "../../redux/api/projectApi";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import analytics from '@react-native-firebase/analytics';
import { setLoading } from "../../redux/slice/navigationSlice";

const UpdateModal = ({ setUpdateMod, opration  ,getProject}) => {
  const {loading} = useSelector((state) => state.reducer.navigation);
  const items = useSelector((state) => state.reducer);
  const [updateproject] = useUpdateprojectAPIMutation();
  const [data, setData] = useState({
    projectName: opration.projectName,
    projectDesc: opration.projectDesc,
    technology: opration.technology,
  });

  const Update = async () => {
    await analytics().logEvent('update_Project', {
      Button: 'Update project',
    })
    dispatch(setLoading(true))
    const res = await updateproject({
      body: data,
      token: items.token.token.access_token,
      id: opration._id,
    });
    setUpdateMod(false);
    if (res.data) {
      getProject()
      showMessage({
        message: "Project Update Successfull",
        type: "success",
      });
    }

    dispatch(setLoading(false))
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
          <Text className="font-semibold text-black mx-auto">
            Edit Project detail
          </Text>
          <View className="px-2 ">
            <View className="mt-2">
              <Text>Edit project Name</Text>
              <TextInput
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                value={data.projectName}
                onChangeText={(text) => setData({ ...data, projectName: text })}
              />
            </View>
            <View className="mt-2">
              <Text>Edit Description</Text>
              <TextInput
                multiline={true}
                numberOfLines={3}
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                value={data.projectDesc}
                onChangeText={(text) => setData({ ...data, projectDesc: text })}
              />
            </View>
            <View className="mt-2">
              <Text>Edit Technology</Text>
              <TextInput
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                value={data.technology}
                onChangeText={(text) => setData({ ...data, technology: text })}
              />
            </View>

            <View className=" flex-row justify-between py-4 ">
              <TouchableOpacity
                onPress={Update}
                className={`bg-[#0066A2] flex-row items-center justify-center px-10 py-3 rounded-lg `}
              >
                <Text className="text-white text-center font-semibold">
                  Edit Project
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUpdateMod(false)}
                className={`bg-[#0066A2] flex-row items-center justify-center px-10 py-3 rounded-lg`}
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

export default UpdateModal;
