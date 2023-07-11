import {
  TouchableOpacity,
  Text,
  View,
  Image,
  Platform,
  PermissionsAndroid,
} from "react-native";
import React, { useRef } from "react";
import { TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
import { useCommentMutation } from "../../redux/api/discussion";
import Comment from "./Comment";
import { showMessage } from "react-native-flash-message";
import imagePath from "../../constant/imagePath";
import RNFetchBlob from "rn-fetch-blob";
import analytics from '@react-native-firebase/analytics';
import { useSendNotificationMutation } from "../../redux/api/api";

const Answer = ({ data, setData, setLoading }) => {
  const items = useSelector((state) => state.reducer);
  const {access_token} = useSelector((state) => state.reducer.token.token);
  const {user} = useSelector((state) => state.reducer.user.user);
  const {_id , projectName} = useSelector((state) => state.reducer.subProject.subProject);
  const [comment] = useCommentMutation();
  const [sendNotification] = useSendNotificationMutation()
  const commentRef = useRef({
    question: items.question.question._id,
    answerId: data._id,
    comment: "",
  });

  const pressComment = async () => {
    if (commentRef.current.comment) {
      return;
    }
    await analytics().logEvent('sub_project_comment', {
      Button: 'comment in sub project question',
    })
    setLoading(true);
    const res = await comment({
      body: commentRef.current,
      token: access_token,
    });
    if (res.data) {
      setData(res.data);
      const response =  await sendNotification({
        body:{
          subProjectId : _id,
          data:{
            title : `New comment from ${user.firstName + "" + user.lastName} on ${items.question.question.title}`,
            body : `${commentData.comment}`
          }
        },
        token : access_token
      })
    }
    if (res.error) {
      showMessage({ message: res.error.data.message, type: "danger" });
    }
    setLoading(false);
  };

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
    if (data.file) {
      let date = new Date();
      // get File extension
      let file_ext = getFileExtention(data.file);
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
        // appendExt: "png",
      })
        .fetch("GET", data.file, {
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
  return (
    <View className="px-4 py-2">
      <View>
        <Text>{data.answerData}</Text>
        {data.file && (
          <TouchableOpacity
            onPress={checkPermission}
            className="border-2  border-[#0066A2] rounded-lg mt-3 py-2 mx-8  items-center flex-row justify-center"
          >
            <Image
              source={ imagePath.icDocs}
              className="h-10 w-10 "
              style={{tintColor:"#0066A2"}}
            />
            <Text className="font-semibold text-[#0066A2] pl-4">{getFileExtention(data.file)}</Text>
          </TouchableOpacity>
        )}
        <View className="mt-2 self-end">
          <View className="flex-row  items-center">
            <View className="w-16 rounded-full h-16 border-2 border-[#0066A2] overflow-hidden">
              <Image
                source={{ uri: data.userId.avatar }}
                className="flex-1"
                resizeMode="cover"
              />
            </View>
            <View className="my-2 ml-2 ">
              <Text> {new Date(data.createdAt).toLocaleDateString() }</Text>
              <Text> {new Date(data.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
              <Text className="">
                {data.userId.firstName + "" + data.userId.lastName}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View>
        <Text className="font-semibold">Comments</Text>
        {data.comments &&
          data.comments.map((data, index) => <Comment data={data} />)}
      </View>

      <View>
        <View className=" mb-4">
          <Text className="font-semibold">Your Comment</Text>
          <TextInput
            mode="outlined"
            outlineColor="#0066A2"
            activeOutlineColor="#0066A2"
            placeholder="Mention people using '@'"
            onChangeText={(text) => (commentRef.current.comment = text)}
          />
          <View className="flex-row justify-between mt-3">
            <View></View>
            <TouchableOpacity
              onPress={pressComment}
              className=" bg-[#0066A2] px-6 py-2 rounded-lg items-center"
            >
              <Text className="font-semibold text-white my-auto">
                Add comment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Answer;
