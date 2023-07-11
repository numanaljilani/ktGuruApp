import { TouchableOpacity, Text, View, Modal } from "react-native";
import React, { useState, useRef,memo } from "react";
import { TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { useCreatesubprojectMutation } from "../../redux/api/subProjectApi";
import analytics from '@react-native-firebase/analytics';

const CreateSubProject = ({ setCreateProject, setLoading ,getProject }) => {


  const { access_token } = useSelector((state) => state.reducer.token.token);
  const { _id : projectId } = useSelector((state) => state.reducer.project.project);
  const [createsubproject] = useCreatesubprojectMutation();

  const createRef = useRef({
    projectName: "",
    projectDesc: "",
    technology: "",
    projectId,
  });

  const create = async () => {
    await analytics().logEvent('create_sub_project', {
      item: 'Create sub project',
    })
    setLoading(true);
    setCreateProject(false);
    const res = await createsubproject({
      body: createRef.current,
      token: access_token,
    });
    setLoading(false);
    if (res.data) {
      getProject()
      showMessage({
        message: "Sub Section Created",
        type: "success",
      });
    }

    if (res.error) {
      showMessage({
        message: res.error.message,
        type: "danger",
      });
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
          <Text className="font-semibold text-black mx-auto">
            Add Sub Section for project
          </Text>
          <View className="px-2 ">
            <View className="mt-2">
              <Text>Sub Section Name</Text>
              <TextInput
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                onChangeText={(text) => (createRef.current.projectName = text)}
              />
            </View>
            <View className="mt-2">
              <Text>Add an optional description</Text>
              <TextInput
                multiline={true}
                numberOfLines={3}
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                onChangeText={(text) => (createRef.current.projectDesc = text)}
              />
            </View>
            <View className="mt-2">
              <Text>Section Technology</Text>
              <TextInput
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                placeholder="Mention Sub Section technology"
                onChangeText={(text) => (createRef.current.technology = text)}
              />
            </View>

            <View className=" flex-row justify-between  pt-4  ">
              <TouchableOpacity
                onPress={create}
                className={`bg-[#0066A2] flex-row items-center justify-center px-8 py-3 rounded-lg `}
              >
                <Text className="text-white text-center font-semibold">
                  Create Sub Section
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCreateProject(false)}
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

export default memo(CreateSubProject);
