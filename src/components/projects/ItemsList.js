import { Text, TouchableOpacity, View, Image } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import React, { memo, useEffect, useRef } from "react";
import imagePath from "../../constant/imagePath";
import navigationString from "../../constant/navigationString";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setProject } from "../../redux/slice/prjectSlice";
import { useGetAllProjectMutation } from "../../redux/api/subProjectApi";
import { stringManupuation } from "../../utils/stringManupulation";
import UserIcons from "../userComponent/UserIcons";
import {
  useAllSingleChatMutation,
  useGroupchatMutation,
} from "../../redux/api/chatApi";
import { setGroupChat, setGroupChatData } from "../../redux/slice/groupChat";
import analytics from "@react-native-firebase/analytics";
import { useAllquestionsMutation } from "../../redux/api/discussion";
import { useActivityMutation } from "../../redux/api/projectApi";
import { setUsers } from "../../redux/slice/chatSlice";
import { setSubProjectList } from "../../redux/slice/subProject";
import { setAllQuestion } from "../../redux/slice/questionSlice";
import { setProjectActivity } from "../../redux/slice/activitySlice";
import { setLoading } from "../../redux/slice/navigationSlice";

const ItemsList = ({
  setDeleteMod,
  setUpdateMod,
  data,
  setSubProject,
  setOperation,
  setAddResourcesMod,
}) => {
  const { _id: id } = data;
 
  const { user } = useSelector((state) => state.reducer.user);
  const { access_token } = useSelector((state) => state.reducer.token.token);
  // const { _id: projectId } = useSelector(
  //   (state) => state.reducer.project.project
  // );
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const swipeableRef = useRef(null);
  const [
    getallsubproject,
    { data: allSubProjectData, isSuccess, error, isError },
  ] = useGetAllProjectMutation();
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
  const getSubProject = async () => {

    const allProj =  await getallsubproject({
       token: access_token,
       body: { projectId: id },
     });
     if(allProj.data){
       dispatch(setSubProjectList(allProj.data));
     }
   };
 
   const getAllQuestion = async () => {
 
    const allQ =  await allquestions({
       token: access_token,
       body: { projectId: id },
     });
     // console.log(allQ,">>>>>>>>>>>")
 
     if(allQ.data){
       dispatch(setAllQuestion(allQ.data));
     }
 
   };
 
   const getAllActivity = async () => {
 
    const activeData =  await activity({
       projectId: id,
       token: access_token,
     });
     if(activeData.data){
       dispatch(setProjectActivity(activeData.data));
     }
   };
 
   const singleChat = async () => {
 
     const response = await allSingleChat({
       token:access_token,
       body: { projectId : id },
     });
     if (response.data) {
       dispatch(setUsers(response.data));
     }
     const res = await getGroupeChat({
       token: access_token,
       body: { projectId : id },
     });
 
     if (res.data !== null) {
       dispatch(setGroupChat(res.data));
     }
   };

  // const getSubProject = async () => {
  //  const subPro =  await getallsubproject({
  //     token: access_token,
  //     body: { projectId : id },
  //   });
  //   console.log(subPro)
  // };

  // const getAllQuestion = async () => {
  //   await allquestions({
  //     token: access_token,
  //     body: { projectId : id },
  //   });
  // };

  // const getAllActivity = async () => {
  //   await activity({
  //     projectId : id,
  //     token: access_token,
  //   });
  // };

  // const singleChat = async () => {
  //   const response = await allSingleChat({
  //     token:access_token,
  //     body: { projectId : id },
  //   });
  //   if (response.data) {
  //     dispatch(setUsers(response.data));
  //   }
  //   const res = await getGroupeChat({
  //     token:access_token,
  //     body: { projectId  : id },
  //   });

  //   if (res.data !== null) {
  //     dispatch(setGroupChat(res.data));
  //   }
  // };

  const deleteFunction = () => {
    setDeleteMod(true);
    setOperation(data);
  };
  const updateFunction = () => {
    swipeableRef.current.close();
    setUpdateMod(true);
    setOperation(data);
  };
  const addResources = async () => {
    setSubProject([]);
    swipeableRef.current.close();
    setAddResourcesMod(true);
    dispatch(setProject(data));
    const res = await getallsubproject({
      body: { projectId: id },
      token: access_token,
    });
    if (res.data && res.data.length > 0) {
      setSubProject(res.data);
    }

    setOperation(data);
  };

  const DeleteSwipe = () => {
    return (
      <TouchableOpacity
        onPress={deleteFunction}
        className="my-1 rounded-r-lg bg-red-600 items-center justify-center"
      >
        <Image
          source={imagePath.icDelete}
          className="mx-3"
          style={{ tintColor: "white" }}
        />
      </TouchableOpacity>
    );
  };

  const UpdateSwipe = () => {
    return (
      <View className="my-1 rounded-l-xl overflow-hidden">
        <TouchableOpacity
          onPress={addResources}
          className="flex-1 px-2  bg-blue-600  items-center justify-center"
        >
          <Image
            source={imagePath.icAdd}
            style={{ tintColor: "white" }}
            className="w-10 h-10 mx-3"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={updateFunction}
          className="flex-1 px-2  bg-green-600 items-center justify-center"
        >
          <Image
            source={imagePath.icEdit}
            style={{ tintColor: "white" }}
            className="w-10 h-10 mx-3"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const navigateProject = async () => {
    dispatch(setLoading(true));
    await analytics().logEvent("Project", {
      List: "Navigate to selected project",
      Project_name: data.projectName,
    });
    // getSubProject();
    getAllQuestion();
    getAllActivity();
    singleChat()
    dispatch(setProject(data));
    navigation.navigate(navigationString.BOTTOM_TABS);
    // dispatch(setLoading(false));
  };
  // useEffect(() => {
  //   if (allSubProjectData) {
  //     dispatch(setSubProjectList(allSubProjectData));
  //   }
  // }, [isSuccess]);

  // useEffect(() => {
  //   if (allQuestion) {
  //     dispatch(setAllQuestion(allQuestion));
  //   }
  // }, [success]);
  // useEffect(() => {
  //   if (activityData) {
  //     dispatch(setProjectActivity(activityData));
  //   }
  // }, [activityIsSuccess]);

  const getData = async () => {
    dispatch(setProject(data));
  };
  return (
    <Swipeable
      ref={swipeableRef}
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={user?.role1 && DeleteSwipe}
      renderRightActions={user?.role1 && UpdateSwipe}
      onSwipeableOpen={getData}
    >
      <TouchableOpacity
        onPress={navigateProject}
        style={{ elevation: 5 }}
        className="py-2  mx-2 justify-between rounded-lg border-t-2 h-40 border-[#0066a2] px-3 bg-white my-1"
      >
        <View>
          <Text className="text-[#35aca8] font-semibold">
            {data.companyId.companyName}
          </Text>
          <Text className="text-[#0066a2] font-semibold">
            {data.projectName}
          </Text>
          <Text>{stringManupuation(data.projectDesc, 90)}</Text>
        </View>
        <View className="flex-row bg-white">
          {data.resources?.length > 0 &&
            data.resources.map((data, index) => {
              return <UserIcons key={index} data={data} />;
            })}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default memo(ItemsList);
