import { TouchableOpacity, Text, View, Image, ScrollView ,  Platform,
  PermissionsAndroid,} from "react-native";
import React, { useRef ,useEffect ,useState} from "react";
import imagePath from "../../../constant/imagePath";
import { useNavigation } from "@react-navigation/native";
import Answer from "../../../components/question/Answer";
import { TextInput } from "react-native-paper";
import { useAnswerMutation, useSinglequestionsMutation } from "../../../redux/api/discussion";
import DocumentPicker from "react-native-document-picker";
import { useSelector } from "react-redux";
import Indicator from "../../../components/common/Indicator";
import RNFetchBlob from "rn-fetch-blob";
import { useSendNotificationMutation } from "../../../redux/api/api";
import { useActivityMutation } from "../../../redux/api/projectApi";
import { setSubProjectActivity } from "../../../redux/slice/activitySlice";
import CloseDiscussion from "../../../components/question/CloseDiscussion";

const SubQuestionDetails = ({}) => {
  const navigation = useNavigation();
  const [answer] = useAnswerMutation();
  const [allquestions] = useSinglequestionsMutation()
  const [sendNotification] = useSendNotificationMutation()
  const items = useSelector((state) => state.reducer);
  const {access_token} = useSelector((state) => state.reducer.token.token);
  const {user} = useSelector((state) => state.reducer.user.user);
  const {_id : projectId , projectName} = useSelector((state) => state.reducer.subProject.subProject);
  const {_id : questionId , isSummary} = useSelector((state) => state.reducer.question.question);
  const [data,setData] = useState([])
  const [loading ,setLoading] = useState(false)
  const [commentFocus, setCommentFocus] = useState(true);
  const [buttonText , setButtonText] = useState("Select A File")
  const [discussionModal, setDiscussionModal] = useState(false);
  const [urAnswer , setUrAnswer] = useState({
    answerData: "",
    file: "",
    projectId ,
  })

  const [
    activity,
    {
      data: activityData,
      isSuccess: activityIsSuccess,
      isError: activityIsError,
      error: activityError,
    },
  ] = useActivityMutation();

  const getAllActivity = async () => {
    await activity({
      projectId: projectId,
      token: access_token,
    });
  };

  useEffect(() => {
    if (activityData) {
      dispatch(setSubProjectActivity(activityData));
    }
  }, [activityIsSuccess]);

  const postAnswer = async () => {
    const formData = new FormData()
    setLoading(true)
    formData.append("answerData",urAnswer.answerData)
    formData.append("projectId", urAnswer.projectId);

    if(urAnswer.file){
      formData.append("file", urAnswer.file)
    }
    const res = await answer({
      id:questionId,
      body:formData,
      token:access_token
    });
    console.log(res,"<<<<<<<<<<<<<")

if(res.data){
  setData(res.data)
  getAllAnswerData()
  getAllActivity()
  const response =  await sendNotification({
    body:{
      projectId ,
      data:{
        title : `New answer from ${user.firstName + "" + user.lastName} on ${items.question.question.title}`,
        body : `${urAnswer.answerData}`
      }
    },
    token : access_token
  })


}
 setUrAnswer({
  answerData: "",
  file: "",
})
setLoading(false)

  };
  

  const uploadDoc = async () => {

    try {
      const doc = await DocumentPicker.pickSingle();
      setUrAnswer({...urAnswer , file : doc})
     setButtonText(" Selected") 

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log(err);
      } else {
        console.log(err);
      }
    }
  };

  const getAllAnswerData = async () =>{
    setLoading(true)
    const res = await allquestions({id : questionId, token :access_token})
if(res.data){
  setData(res.data)
}

  setLoading(false)
  }

useEffect(() => {
  getAllAnswerData()
}, [])

const checkPermission = async () => {
  if (Platform.OS === "ios") {
    downloadFile();
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission Required",
          message:
            "Application needs access to your storage to download File",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Start downloading
        downloadFile();
        console.log("Storage Permission Granted.");
      } else {
        // If permission denied then show alert
        Alert.alert("Error", "Storage Permission Not Granted");
      }
    } catch (err) {
      // To handle permission related exception
      console.log("++++" + err);
    }
  }
};

const downloadFile = async () => {
  if (items.question.question.file) {
    let date = new Date();
    // get File extension
    let file_ext = getFileExtention(items.question.question.file);
    const { config, fs } = RNFetchBlob;
    const fileDir = fs.dirs.DownloadDir;
    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          fileDir +
          "/download_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
      },
    })
      .fetch("GET", items.question.question.file, {
        //some headers ..
      })
      .then((res) => {
        // the temp file path with file extension `png`
        console.log("The file saved to ", res.path());
        // Beware that when using a file path as Image source on Android,
        // you must prepend "file://"" before the file path
        imageView = (
          <Image
            source={{
              uri:
                Platform.OS === "android"
                  ? "file://" + res.path()
                  : "" + res.path(),
            }}
          />
        );
      });
  }
};

const getFileExtention = (fileUrl) => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
};
// console.log(items.question.question.file)

  return (
    <View className="s bg-white flex-1 m-2 rounded-lg">
      <View className="flex-row justify-between items-center px-4 pt-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className=" rounded-full bg-[#0067a215] items-center justify-center"
        >
          <Image
            source={imagePath.icBack}
            className="w-7 h-7 ml-2 my-1 "
            style={{ tintColor: "#0066A2" }}
          />
        </TouchableOpacity>
       { !isSummary &&  <TouchableOpacity className="bg-[#0066A2] px-6 py-2 rounded-lg" onPress={()=>setDiscussionModal(true)}>
          <Text className="font-semibold text-white">Close Discussion</Text>
        </TouchableOpacity>}
      </View>

      <View className="mx-4 mt-4 pb-2 border-b-2">
        <Text className="text-black font-semibold">
         {items.question.question.title}
        </Text>
        <Text className=" text-xs mt-2">
          Asked by {items.question.question?.userId?.firstName} {new Date(items.question.question.createdAt).toLocaleDateString() +" "+ new Date(items.question.question.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })  }
        </Text>
      </View>

      <ScrollView className=" flex-1">
        <View className="mx-4 mt-2">
          <Text className="font-semibold">Description</Text>
          <Text>
           {items.question.question?.desc}
          </Text>
          { items.question.question?.file && <TouchableOpacity
            onPress={checkPermission}
            className="border-2  border-[#0066A2] rounded-lg mt-3 py-2 mx-8  items-center flex-row justify-center"
          >
            <Image
              source={ imagePath.icDocs}
              className="h-10 w-10 "
              style={{tintColor:"#0066A2"}}
            />
            <Text className="font-semibold text-[#0066A2] pl-4">{getFileExtention(items.question.question.file)}</Text>
          </TouchableOpacity>}
          <Text className="font-semibold">{data && data.length} Answer</Text>
        </View>
{
       data && data.map((data,index) => ( <Answer setCommentFocus={setCommentFocus} setLoading={setLoading} data={data} key={index} setData={setData} getAllAnswerData={getAllAnswerData} />))
} 
      </ScrollView>
     { commentFocus && !isSummary &&  <View className="border-t border-[#0066A2] mb-4  px-4">
        <Text className="font-semibold mt-2">Your Answer</Text>
        <TextInput
          multiline={true}
          numberOfLines={2}
          mode="outlined"
          outlineColor="#0066A2"
          activeOutlineColor="#0066A2"
          placeholder="Mention people using '@'"
          onChangeText={(text) => setUrAnswer({...urAnswer , answerData : text})}
          value={urAnswer.answerData}
        />
        <View className="flex-row justify-between mt-3">
        <TouchableOpacity
            onPress={uploadDoc}
            className="flex-row bg-[#fff] border-[#0066A2] px-4 border-2 rounded-lg items-center"
          >
            <Image
              className="h-10 w-10 mr-2"
              source={imagePath.icUpload}
              style={{ tintColor: "#0066A2" }}
            />
            <Text className="font-semibold text-[#0066A2]">{buttonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={postAnswer}
            // disabled={true}
            className=" bg-[#0066A2] px-4 rounded-lg items-center"
          >
            <Text className="font-semibold text-white my-auto">
              Post your answer
            </Text>
          </TouchableOpacity>
          
        </View>
      {loading &&  <Indicator/>}
      {discussionModal &&(
        <CloseDiscussion
          setDiscussionModal={setDiscussionModal}
          setLoading={setLoading}
          getAllAnswerData={getAllAnswerData}
          navigation={navigation}
        />
      )}
      </View>}
    </View>
  );
};

export default SubQuestionDetails;
