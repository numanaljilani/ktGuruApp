import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import QuestionList from "../../../components/subProjectQuestion/QuestionList";
import AskQuestionModal from "../../../components/subProjectQuestion/AskQuestionModal";
import { useAllquestionsMutation } from "../../../redux/api/discussion";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import imagePath from "../../../constant/imagePath";
import { useSendNotificationMutation } from "../../../redux/api/api";
import { setAllSubQuestion } from "../../../redux/slice/questionSlice";
import { FlatList } from "react-native-gesture-handler";
import { project, useActivityMutation } from "./../../../redux/api/projectApi";
import Indicator from "../../../components/common/Indicator";
import { setSubProjectActivity } from "../../../redux/slice/activitySlice";

const SubDiscussion = () => {
  // const items = useSelector((state) => state.reducer);
  const { access_token } = useSelector((state) => state.reducer.token.token);
  const { _id: projectId } = useSelector(
    (state) => state.reducer.subProject.subProject
  );
  const { allSubQuestions } = useSelector((state) => state.reducer.question);
  const [active, setActive] = useState("active");
  const [askQuestion, setAskQuestion] = useState(false);
  const [filterQuestion, setFilterQuiestion] = useState();
  const [allquestions] = useAllquestionsMutation();
  const [activity, { data, isSuccess, isError, error }] = useActivityMutation();
  const [loading,setLoading] = useState(false)
  const isFocused = useIsFocused();
  const dispatch = useDispatch();


  const getAllActivity = async () => {
    await activity({
      projectId,
      token: access_token,
    });
  };

  const getAllQuestion = async () => {
    setLoading(true)
    const res = await allquestions({
      body: { projectId },
      token: access_token,
    });
    if (res.data) {
      getAllActivity()
      setFilterQuiestion(res.data)
      dispatch(setAllSubQuestion(res.data));
    }
    setLoading(false)
  };

  const search = (text) => {
    if (text === "") {
      setFilterQuiestion(allSubQuestions);
    } else {
      let tempList = filterQuestion.filter((data) => {
        return data.title.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      setFilterQuiestion(tempList);
    }
  };

  useEffect(() => {
    if (!askQuestion) {
      getAllQuestion();
      getAllActivity()
    }
  }, [askQuestion]);
  useEffect(() => {
    if (isFocused) {
      getAllQuestion();
      getAllActivity()
    }
  }, [ isFocused]);

  useEffect(() => {
    if (data) {
      dispatch(setSubProjectActivity(data));
    }
  }, [isSuccess]);
  return (
    <View className="">
      <View className=" flex-row justify-between px-5 items-center py-1">
        <Text className="text-black font-semibold">All Questions</Text>
        <TouchableOpacity
          onPress={() => setAskQuestion(true)}
          className="bg-[#0066A2] px-8 rounded-lg py-3"
        >
          <Text className="text-white font-semibold">Ask Question</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row  my-3 justify-between px-5">
        <TouchableOpacity
          onPress={() => setActive("active")}
          className={`${
            active === "active" ? "bg-[#0066A2]" : "bg-white"
          } border-2 border-[#0066A2] flex-1 py-2 rounded-lg mr-4`}
        >
          <Text
            className={`${
              active === "active" ? "text-white" : "text-[#0066A2]"
            } font-semibold text-center`}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActive("close")}
          className={`${
            active === "close" ? "bg-[#0066A2]" : "bg-[#fff]"
          } border-2 border-[#0066A2] flex-1  py-2 rounded-lg`}
        >
          <Text
            className={`${
              active === "close" ? "text-[#ffff]" : "text-[#0066A2]"
            } font-semibold text-center`}
          >
            Closed
          </Text>
        </TouchableOpacity>
      </View>
      <View className="mx-2 mb-2">
        <TextInput
          mode="outlined"
          outlineColor="#0066A2"
          activeOutlineColor="#0066A2"
          placeholder="Search Question"
          left={<TextInput.Icon icon={imagePath.icSearch} />}
          onChangeText={(text) => {
            search(text);
          }}
        />
      </View>
      {/* <ScrollView>
        {allSubQuestions &&
          allSubQuestions?.map((data, index) => (
            <QuestionList data={data} key={index} active={active} />
          ))}
      </ScrollView> */}

      <FlatList
        data={filterQuestion}
        renderItem={({ item }) => <QuestionList data={item} active={active} />}
        keyExtractor={(item) => item.id}
        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      {askQuestion && (
        <AskQuestionModal
          setAskQuestion={setAskQuestion}
          getAllQuestion={getAllQuestion}
        />
      )}
      {loading &&  <Indicator/>}
    </View>
  );
};

export default SubDiscussion;
