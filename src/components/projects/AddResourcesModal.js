import { TouchableOpacity, Text, View, Modal } from "react-native";
import React, { useRef, useState , useEffect , memo} from "react";
import { RadioButton, TextInput } from "react-native-paper";
import analytics from '@react-native-firebase/analytics';
import { useAddMutation, useTeamsMutation } from "../../redux/api/projectApi";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import Checkbox from "react-native-check-box";
import { groupChat } from './../../../../server-ktguru/controllers/chat/chatController';
import { setGroupChatData } from "../../redux/slice/groupChat";
import { useGroupchatMutation } from "../../redux/api/chatApi";

const AddResourcesModal = ({ setLoading, setAddResourcesMod, subProject }) => {
  let obj = {};
  const {access_token} = useSelector((state) => state.reducer.token.token);
  const {_id} = useSelector((state) => state.reducer.project.project);
  const items = useSelector((state) => state.reducer);
  const {groupChatData} = useSelector((state) => state.reducer.groupChat);

  const dispatch = useDispatch()
  const [getGroupeChat,{data : resData ,isSuccess,error,isError}] = useGroupchatMutation();

// console.log(items.project.project._id)

  const [checked, setChecked] = React.useState("Admin");
  const [checkedBox, setCheckedBox] = useState();
  const [array, setArray] = useState([]);
  const [checkedProject, setCheckedProject] = React.useState({
    name: items.user.user.user && items.user.user.user.firstName,
    projectId: _id,
    projectRole: "Consultant",
    email: "",
    chatId:"",
    subProjects: [],
    message: "welcome",
  });
// console.log(items.project.project)
  const [teams] = useTeamsMutation();
  const [add] = useAddMutation()
  // console.log(checkedProject.subProjects)

  const adminRef = useRef({
    projectId: _id,
    email: "",
    name: items.user.user.user && items.user.user.user.firstName,
    message: "",
    projectRole:"Admin",
    chatId :""
  });


  const checkeBox = (data, id, index) => {
    if (!checkedBox) {
      setCheckedBox(obj);
    }
    const body = { subProjectId: data._id, SubProjectRole: "Consultant" };
    if (checkedBox) {
      if (checkedBox[index]) {
        setCheckedBox({ ...checkedBox, [index]: false });
        for (let i = 0; i < array.length; i++) {
          if (array[i].subProjectId === id) {
            setArray(array.filter((data) => data.subProjectId !== id));
          }
        }
      } else {
        setCheckedBox({ ...checkedBox, [index]: true });
        setArray([...array, body]);
        setCheckedProject({ ...checkedProject, subProjects: array });
        
      }
    }
  };
  // console.log(array)
  // console.log(groupChatData._id)

  const invite = async () => {
setLoading(true);
    await analytics().logEvent('Add_Resources', {
      Button: 'Invite consaltant or project head',
    })

    const response = await getGroupeChat(
      {
        token: access_token,
        body: { projectId:items.project.project._id},
    })


    if (checked === "Admin") {
      // console.log(adminRef.current)
      adminRef.current.chatId = response.data._id
      const res = await add({
        body: adminRef.current,
        token:access_token,
      });


      if(res.data){
        showMessage({ message :res.data.message , type : "success"})
        setLoading(false)
        setAddResourcesMod(false)
      }else{
        if(res.error){
          showMessage({ message : res.error.data.message , type : "danger"})
          setAddResourcesMod(false)
        }
      }
    } else {
      


    if(response.data){
      dispatch(setGroupChatData(response.data))
      setCheckedProject({ ...checkedProject, chatId:response.data._id });
    }
    if(checkedProject.subProjects.length > 0 ){
      const res = await add({
        body:checkedProject,
        token: access_token,
      })
      if(res.data){
        showMessage({message:res.data.message , type :"success"})
        setLoading(false)
        setAddResourcesMod(false)
      }
      if(res.error){

        showMessage({message:res.error.data.message , type :'danger'})
        setLoading(false)
      }
    }

    }
  };
  // console.log(checkedProject.subProjects);
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
            Invite people to this project
          </Text>
          <View className="px-2 ">
            <View className="mt-2">
              <Text>Who do you want to invite to this project?</Text>
              <TextInput
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                placeholder="Enter email address"
                onChangeText={(text) =>
                  checked === "Admin"
                    ? (adminRef.current.email = text)
                    : setCheckedProject({ ...checkedProject, email: text })
                }
              />
            </View>
            <View className="">
              <View className="flex-row items-center ">
                <RadioButton
                  value="first"
                  status={checked === "Admin" ? "checked" : "unchecked"}
                  onPress={() => setChecked("Admin")}
                  color="#0066A2"
                />
                <Text>As an Admin</Text>
              </View>
              <View className="flex-row items-center ">
                <RadioButton
                  value="second"
                  status={checked === "consaltant" ? "checked" : "unchecked"}
                  onPress={() => setChecked("consaltant")}
                  color="#0066A2"
                />
                <Text>As a Consultant</Text>
              </View>
              <View className=" mt-2 ml-4">
                {checked !== "Admin" && (
                  <Text className="text-black font-semibold my-2">
                    Sub Project
                  </Text>
                )}
                {checked !== "Admin" &&
                  subProject &&
                  subProject.length >= 0 &&
                  subProject.map((data, index) => {
                    obj[index] = false;
                    // console.log(checkedBox)
                    if (checkedBox === undefined) {
                      setCheckedBox(obj);
                    }
                    return (
                      <Checkbox
                        rightText={data.projectName}
                        isChecked={checkedBox ? checkedBox[index] : false}
                        onClick={() => checkeBox(data, data._id, index)}
                        key={index}
                        color="#0066A2"
                      />
                    );
                  })}
              </View>
            </View>
            <View className="mt-2">
              <Text>Write Personalised text</Text>
              <TextInput
                multiline={true}
                numberOfLines={3}
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                onChangeText={(text) =>
                  checked === "Admin"
                    ? (adminRef.current.message = text)
                    : setCheckedProject({ ...checkedProject, message: text })
                }
              />
            </View>

            <View className=" flex-row justify-between py-4 ">
              <TouchableOpacity
                onPress={invite}
                className={`bg-[#0066A2] flex-row items-center justify-center px-8 py-3 rounded-lg `}
              >
                <Text className="text-white text-center font-semibold">
                  Invite into Project
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAddResourcesMod(false)}
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

export default memo(AddResourcesModal);
