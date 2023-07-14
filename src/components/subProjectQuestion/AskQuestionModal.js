import { TouchableOpacity, Text, View, Modal, Image } from "react-native";
import React, { useRef, useState } from "react";
import { TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { useUpdateSubProjectMutation } from "../../redux/api/subProjectApi";
import imagePath from "../../constant/imagePath";
import DocumentPicker from "react-native-document-picker";
import { useQuestionMutation } from "../../redux/api/discussion";
import analytics from "@react-native-firebase/analytics";
import { useSendNotificationMutation } from "../../redux/api/api";

const AskQuestionModal = ({ setAskQuestion, getAllQuestion }) => {
  // console.log(opration)
  // const items = useSelector((state) => state.reducer);
  const { access_token } = useSelector((state) => state.reducer.token.token);
  const { _id: projectId } = useSelector(
    (state) => state.reducer.subProject.subProject
  );
  const { user } = useSelector((state) => state.reducer.user.user);
  const { _id, projectName } = useSelector(
    (state) => state.reducer.subProject.subProject
  );

  const [question] = useQuestionMutation();
  const [sendNotification] = useSendNotificationMutation();
  const askQuestionRef = useRef({
    title: "",
    desc: "",
    projectId: projectId,
    file: "",
  });

  const ask = async () => {
    await analytics().logEvent("Ask_Question_In_Sub_Project", {
      Button: "question is asked",
    });
    setAskQuestion(false);
    const formData = new FormData();
    formData.append("title", askQuestionRef.current.title);
    formData.append("desc", askQuestionRef.current.desc);
    formData.append("projectId", askQuestionRef.current.projectId);
    formData.append("SubProjects", "SubProjects");
    if (askQuestionRef.current.file) {
      formData.append("file", askQuestionRef.current.file);
    }

    const res = await question({
      formData,
      token: access_token,
    });

    if (res.data) {
      getAllQuestion();
      showMessage({
        message: "Project Update Successfull",
        type: "success",
      });

      const res = await sendNotification({
        body: {
          subProjectId: _id,
          data: {
            title: `New Question from ${
              user.firstName + "" + user.lastName
            } in ${projectName}`,
            body: `${askQuestionRef.current.title}`,
          },
        },
        token: access_token,
      });
    }
  };

  const uploadDocument = async () => {
    console.log("upload document");
    try {
      const doc = await DocumentPicker.pickSingle();
      askQuestionRef.current.file = doc;
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log(err);
      } else {
        console.log(err);
      }
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
            Ask a Question
          </Text>
          <View className="px-2 ">
            <View className="mt-2">
              <Text className="font-semibold text-black">Title</Text>
              <Text className="text-xs my-1">
                Be specific and imagine you are asking a question to another
                person.
              </Text>
              <TextInput
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                placeholder="Mention people using '@'"
                onChangeText={(text) => (askQuestionRef.current.title = text)}
              />
            </View>
            <View className="mt-2">
              <Text className="font-semibold text-black">
                What are the details of your problem?
              </Text>
              <Text className="text-xs my-1">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </Text>
              <TextInput
                multiline={true}
                numberOfLines={3}
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                placeholder="Mention people using '@'"
                //   value={data.projectDesc}
                onChangeText={(text) => (askQuestionRef.current.desc = text)}
              />
            </View>
            <View className=" flex-row justify-center mt-3">
              <TouchableOpacity
                onPress={uploadDocument}
                className="flex-row items-center border-2 border-[#0066A2] px-5 py-1 rounded-lg "
              >
                <Image
                  source={imagePath.icUpload}
                  className="w-10 h-10 mr-3 "
                  style={{ tintColor: "#0066A2" }}
                />
                <Text className="font-semibold text-[#0066A2]">
                  Select A File
                </Text>
              </TouchableOpacity>
            </View>

            <View className=" flex-row justify-between py-4 ">
              <TouchableOpacity
                onPress={ask}
                className={`bg-[#0066A2] flex-row items-center justify-center px-7 py-3 rounded-lg `}
              >
                <Text className="text-white text-center font-semibold">
                  Aske Your Question
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAskQuestion(false)}
                className={`bg-[#0066A2] flex-row items-center justify-center px-7 py-3 rounded-lg`}
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

export default AskQuestionModal;
