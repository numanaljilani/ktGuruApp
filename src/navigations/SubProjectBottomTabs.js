import { Image, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import navigationString from "../constant/navigationString";
import Chats from "../screens/subProjectScreens/chats/Chats";
import imagePath from "../constant/imagePath";
import SubDiscussion from "../screens/subProjectScreens/discussion/SubDiscussion";
import SubSectionActivity from "../screens/subProjectScreens/subSectionActivity/SubSectionActivity";
import { useAllquestionsMutation } from "../redux/api/discussion";
import { setAllSubQuestion } from "../redux/slice/questionSlice";
import { useActivityMutation } from "../redux/api/projectApi";
import { setSubProjectActivity } from "../redux/slice/activitySlice";

const Tab = createBottomTabNavigator();
const SubProjectBottomTabs = ({ route }) => {
  const items = useSelector((state) => state.reducer);
  const { access_token } = useSelector((state) => state.reducer.token.token);
  const { projectName } = useSelector((state) => state.reducer.subProject.subProject);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [
    allquestions,
    { data: allQuestion, isSuccess: success, error: qError, isError: qIsError },
  ] = useAllquestionsMutation();
  const [activity, { data, isSuccess, isError, error }] = useActivityMutation();

  const getAllQuestion = async () => {
    await allquestions({
      body: { projectId: items.subProject.subProject._id },
      token: access_token,
    });
  };

  const getAllActivity = async () => {
    await activity({
      projectId: items.subProject.subProject._id,
      token: access_token,
    });
  };

  useEffect(() => {
    getAllQuestion();
    getAllActivity();
  }, [isFocused]);

  useEffect(() => {
    if (allQuestion) {
      dispatch(setAllSubQuestion(allQuestion));
    }
  }, [success]);
  useEffect(() => {
    if (data) {
      dispatch(setSubProjectActivity(data));
    }
  }, [isSuccess]);
  

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
          tabBarLabel:"Discussion"
        }}
        name={navigationString.SUBDISCUSSION}
        component={SubDiscussion}
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
          tabBarLabel:"Chats"
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
        name={navigationString.SUB_TIME_LINE}
        component={SubSectionActivity}
      />
    </Tab.Navigator>
  );
};

export default SubProjectBottomTabs;
