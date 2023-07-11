import { TouchableOpacity, Text, View, Modal, Image } from "react-native";
import React, { useRef, useState } from "react";
import { TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { useUpdateSubProjectMutation } from "../../redux/api/subProjectApi";
import imagePath from "../../constant/imagePath";
import DocumentPicker from "react-native-document-picker";
import { useSummaryquestionMutation } from "../../redux/api/discussion";
import analytics from '@react-native-firebase/analytics';
import { useSendNotificationMutation } from "../../redux/api/api";


const CloseDiscussion = ({ setDiscussionModal, setLoading ,getAllAnswerData ,navigation}) => {
  const items = useSelector((state) => state.reducer);
  const {projectName} = useSelector((state) => state.reducer.project.project);
  const {user} = useSelector((state) => state.reducer.user.user);
  const [summery] = useSummaryquestionMutation();
  const [sendNotification] = useSendNotificationMutation()
  const closeDiscussionRef = useRef({
    text : " ",
    file: "",
  });

  const close = async () => {
    await analytics().logEvent('Close_discussion', {
      Button: 'close discussion',
    })
    setDiscussionModal(false);
    setLoading(true)
    const formData = new FormData();
    formData.append("text", closeDiscussionRef.current.text);
    if (closeDiscussionRef.current.file) {
      formData.append("file", closeDiscussionRef.current.file);
    }
    const res = await summery({
      formData,
      token: items.token.token.access_token,
      id :items.question.question._id
    });
    closeDiscussionRef.current.file = ""
    if (res.data) {
      showMessage({
        message: "Discussion Closed Successfully",
        type: "success",
      });
      const response =  await sendNotification({
        body:{
          projectId : items.project.project._id,
          data:{
            title : `  ${user.firstName + "" + user.lastName} is closing ${items.question.question.title} discussion `,
            body : `${closeDiscussionRef.current.text}`
          }
        },
        token : items.token.token.access_token
      })
    }
    getAllAnswerData()
    navigation.goBack()
    setLoading(false)
    // console.log(res, "project updated");
  };

  const uploadDocument = async () => {
    try {
      const doc = await DocumentPicker.pickSingle();
      closeDiscussionRef.current.file = doc;
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
            Close Discussion
          </Text>
          <View className="px-2 ">
            <View className="mt-2">
              <Text className="text-xs my-1">
              No one will be allowed to participate in further discussion Once you closed discussion!
              </Text>
            </View>
            <View className="mt-2">
              <Text className="font-semibold text-black">
              Summarize the key findings in clear and concise language
              </Text>
              <TextInput
                multiline={true}
                numberOfLines={3}
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
             
            
                onChangeText={(text) => (closeDiscussionRef.current.text = text)}
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
                onPress={close}
                className={`bg-[#0066A2] flex-row items-center justify-center px-7 py-3 rounded-lg flex-1 `}
              >
                <Text className="text-white text-center font-semibold">
                  Add Summery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDiscussionModal(false)}
                className={`bg-[#0066A2] ml-4 flex-row items-center justify-center px-7 py-3 rounded-lg`}
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

export default CloseDiscussion;
