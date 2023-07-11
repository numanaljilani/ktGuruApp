import { Image, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import navigationString from "../constant/navigationString";
import SubProjects from "../screens/BottomTabs/subProject/SubProjects";
import Discussion from "../screens/BottomTabs/discussion/Discussion";
import Chats from "../screens/BottomTabs/chats/Chats";
import imagePath from "../constant/imagePath";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import TimeLine from "../screens/BottomTabs/tiemLine/TimeLine";
import { useGetAllProjectMutation } from "../redux/api/subProjectApi";
import { useAllquestionsMutation } from "../redux/api/discussion";
import { useDispatch, useSelector } from "react-redux";
import { setSubProjectList } from "../redux/slice/subProject";
import { setAllQuestion } from "../redux/slice/questionSlice";
import { useActivityMutation } from "../redux/api/projectApi";
import { setProjectActivity } from "../redux/slice/activitySlice";
import { showMessage } from "react-native-flash-message";
import { setUsers } from "../redux/slice/chatSlice";
import { setGroupChat } from "../redux/slice/groupChat";
import { useAllSingleChatMutation, useGroupchatMutation } from "../redux/api/chatApi";
import { disconnect } from "mongoose";

const Tab = createBottomTabNavigator();


const BottomTabNavigation = ({ route }) => {
  // const items = useSelector((state) => state.reducer);
  const { access_token } = useSelector((state) => state.reducer.token.token);
  const { projectName } = useSelector(
    (state) => state.reducer.project.project
  );


  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [getallsubproject, { data, isSuccess, error, isError }] =
    useGetAllProjectMutation();
  const [
    allquestions,
    { data: allQuestion, isSuccess: success, error: qError, isError: qIsError },
  ] = useAllquestionsMutation();
  const [
    activity,
    {
      data: activityData,
      isSuccess: activityIsSuccess,
      isError: activityIsError,
      error: activityError,
    },
  ] = useActivityMutation();

  const [getGroupeChat] = useGroupchatMutation();
  const [allSingleChat] = useAllSingleChatMutation();

  // const getSubProject = async () => {

  //  const allProj =  await getallsubproject({
  //     token: access_token,
  //     body: { projectId: projectId },
  //   });
  //   if(allProj.data){
  //     dispatch(setSubProjectList(allProj.data));
  //   }
  // };

  // const getAllQuestion = async () => {

  //  const allQ =  await allquestions({
  //     token: access_token,
  //     body: { projectId: projectId },
  //   });
  //   // console.log(allQ,">>>>>>>>>>>")

  //   if(allQ.data){
  //     dispatch(setAllQuestion(allQ.data));
  //   }

  // };

  // const getAllActivity = async () => {

  //  const activeData =  await activity({
  //     projectId: projectId,
  //     token: access_token,
  //   });
  //   if(activeData.data){
  //     dispatch(setProjectActivity(activeData.data));
  //   }
  // };

  // const singleChat = async () => {

  //   const response = await allSingleChat({
  //     token:access_token,
  //     body: { projectId },
  //   });
  //   if (response.data) {
  //     dispatch(setUsers(response.data));
  //   }
  //   const res = await getGroupeChat({
  //     token: access_token,
  //     body: { projectId },
  //   });

  //   if (res.data !== null) {
  //     dispatch(setGroupChat(res.data));
  //   }
  // };

  useEffect(() => {
    if(isFocused){
      // getSubProject();
      // getAllQuestion();
      // getAllActivity();
      // singleChat()
    }
  }, [isFocused]);

  // useEffect(() => {
  //   if (data) {
  //     console.log(data ,"subProject")
  //     dispatch(setSubProjectList(data));
  //   }
  // }, [isSuccess]);

  // useEffect(() => {
  //   if (allQuestion) {
  //     console.log(allQuestion,"all qqqqqq")
  //     dispatch(setAllQuestion(allQuestion));
  //   }
  // }, [success]);

  // useEffect(() => {
  //   if (activityData) {
  //     console.log(activityData , "Activity data")
  //     dispatch(setProjectActivity(activityData));
  //   }
  // }, [activityIsSuccess]);


  return ( 
    <Tab.Navigator
    
      screenOptions={({ navigation }) => ({
        headerTintColor: "#0066A2",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarStyle: {
          paddingVertical: 5,
          backgroundColor: "white",
          height: 60,
        },
        headerTitleAlign: "center",
        headerStyle: {
          height: 70,
        },
        tabBarActiveTintColor: "#0066A2",
        tabBarInactiveTintColor: "black",
        title :projectName,

        headerLeft: () => (
          <TouchableOpacity onPress={() =>{
             navigation.goBack()
            //  dispatch(setSubProjectList([]))
             }}>
            <Image
              source={imagePath.icBack}
              className="w-6 h-6 ml-5"
              style={{ tintColor: "#0066a2" }}
            />
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen

        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={imagePath.icSub}
                  resizeMode="contain"
                  style={{
                    width: 28,
                    tintColor: focused ? "#0066A2" : "black",
                  }}
                />
              </View>
            );
          },
          tabBarLabel : "Sub Section"
        }}
        name={navigationString.SUBPROJECTS}
        component={SubProjects}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={imagePath.icDiscussion}
                  resizeMode="contain"
                  style={{
                    width: 28,
                    tintColor: focused ? "#0066A2" : "black",
                  }}
                />
              </View>
            );
          },
          tabBarLabel :"Discussion"
        }}
        name={navigationString.DISCUSSION}
        component={Discussion}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View className="">
                <Image
                  source={imagePath.icChat}
                  resizeMode="contain"
                  style={{
                    width: 28,
                    tintColor: focused ? "#0066A2" : "black",
                  }}
                />
              </View>
            );
          },
          tabBarLabel : "Chat"
        }}
        name={navigationString.CHATS}
        component={Chats}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View className="">
                <Image
                  source={imagePath.icTime}
                  resizeMode="contain"
                  style={{
                    width: 28,
                    tintColor: focused ? "#0066A2" : "black",
                  }}
                />
              </View>
            );
          },
          tabBarLabel:"Activity"
        }}
        name={navigationString.TIME_LINE}
        component={TimeLine}
      />
    </Tab.Navigator>
  );
};

export default React.memo(BottomTabNavigation);
