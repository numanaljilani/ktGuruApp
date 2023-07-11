import { TouchableOpacity, Text, View, Modal } from "react-native";
import React, {  useRef } from "react";
import { TextInput } from "react-native-paper";
import { useCreateprojectAPIMutation } from "../../redux/api/projectApi";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import analytics from '@react-native-firebase/analytics';
import { setLoading } from "../../redux/slice/navigationSlice";

const CreateProject = ({ setCreateProject ,getProject  }) => {
  const {loading} = useSelector((state) => state.reducer.navigation);
  const items = useSelector((state) => state.reducer);
  const dispatch = useDispatch()
  // console.log(items.user.user.role1._id)
  const [createProject] = useCreateprojectAPIMutation();
  const createRef = useRef({
    projectName: "",
    projectDesc: "",
    technology: "",
    companyId: items.user.user.role1._id,
  });


  const create = async () => {
    setCreateProject(false);
    await analytics().logEvent('Create_Project', {
      Button: 'New project is created',
    })
    dispatch(setLoading(true))
    const res = await createProject({
      body: createRef.current,
      token: items.token.token.access_token,
    });
  
      if (res.data) {
        getProject()
        showMessage({
          message: "Project created",
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
            Create a Project
          </Text>
          <View className="px-2 ">
            <View className="mt-2">
              <Text>Name this project</Text>
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
              <Text>Technology</Text>
              <TextInput
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                placeholder="Mention project technology"
                onChangeText={(text) => (createRef.current.technology = text)}
              />
            </View>

            <View className=" flex-row justify-between py-4 ">
              <TouchableOpacity
                onPress={create}
                className={`bg-[#0066A2] flex-row items-center justify-center px-10 py-3 rounded-lg `}
              >
                <Text className="text-white text-center font-semibold">
                  Create Project
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCreateProject(false)}
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

export default CreateProject;
