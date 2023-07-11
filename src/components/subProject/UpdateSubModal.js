import {
  TouchableOpacity,
  Text,
  View,
  Modal,
} from "react-native";
import React, { useState ,memo} from "react";
import { TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import analytics from '@react-native-firebase/analytics';
import { useUpdateSubProjectMutation } from "../../redux/api/subProjectApi";

const UpdateSubModal = ({ setUpdateMod, opration,setLoading ,getProject}) => {
  const items = useSelector((state) => state.reducer);
  const { access_token } = useSelector((state) => state.reducer.token.token );
  const [updateSubProject] = useUpdateSubProjectMutation();
  const [data, setData] = useState({
    projectName: opration.projectName,
    projectDesc: opration.projectDesc,
    technology: opration.technology,
  });

  // console.log(token.access_token)

  const Update = async () => {
    await analytics().logEvent('update_sub_project', {
      Button: 'Update sub project',
    })
    setLoading(true)
    setUpdateMod(false);
    const res = await updateSubProject({
      body: data,
      token: access_token,
      id: opration._id,
    });
    
    if (res.data) {
      getProject()
      showMessage({
        message: "Project Update Successfull",
        type: "success",
      });
    }
    setLoading(false)
    // console.log(res, "project updated");
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
          Edit Sub Section detail
          </Text>
          <View className="px-2 ">
            <View className="mt-2">
              <Text>Edit Sub Section Name</Text>
              <TextInput
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                value={data.projectName}
                onChangeText={(text) => setData({ ...data, projectName: text })}
              />
            </View>
            <View className="mt-2">
              <Text>Edit Sub Section Description</Text>
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
              <Text>Edit Sub Section Technology</Text>
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
                className={`bg-[#0066A2] flex-row items-center justify-center px-8 py-3 rounded-lg `}
              >
                <Text className="text-white text-center font-semibold">
                  Edit Sub Section
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUpdateMod(false)}
                className={`bg-[#0066A2] flex-row items-center justify-center px-8 py-3 rounded-lg`}
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

export default memo(UpdateSubModal);
