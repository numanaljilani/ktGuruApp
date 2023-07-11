import {
  TouchableOpacity,
  Text,
  View,
  Image,
  Platform,
  PermissionsAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useCommentMutation } from "../../redux/api/discussion";
import Comment from "./Comment";
import { showMessage } from "react-native-flash-message";
import imagePath from "../../constant/imagePath";
import RNFetchBlob from "rn-fetch-blob";
import analytics from "@react-native-firebase/analytics";
import { useSendNotificationMutation } from "../../redux/api/api";
import { useActivityMutation } from "../../redux/api/projectApi";
import { setProjectActivity } from "../../redux/slice/activitySlice";

const Answer = ({
  data,
  setData,
  setLoading,
  setCommentFocus,
  getAllAnswerData,
}) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.reducer);
  const { access_token } = useSelector((state) => state.reducer.token.token);
  const { _id: projectId } = useSelector(
    (state) => state.reducer.project.project
  );
  const { projectName } = useSelector((state) => state.reducer.project.project);
  const { user } = useSelector((state) => state.reducer.user.user);
  const [comment] = useCommentMutation();
  const [sendNotification] = useSendNotificationMutation();
  const [commentData, setCommentData] = useState({
    question: items.question.question._id,
    answerId: data._id,
    comment: "",
  });

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
      dispatch(setProjectActivity(activityData));
    }
  }, [activityIsSuccess]);

  const pressComment = async () => {
    if (!commentData.comment) {
      console.log("returning");
      return;
    }
    await analytics().logEvent("commented", {
      Button: "Commented",
    });
    setLoading(true);
    setCommentData({ ...commentData, comment: "" });
    const res = await comment({
      body: commentData,
      token:access_token,
    });
    // console.log(res,">>>>>>>>>>>>>")
    if (res.data) {
      // setData(res.data);
      getAllAnswerData();
      const response = await sendNotification({
        body: {
          projectId,
          data: {
            title: `New comment from ${
              user.firstName + "" + user.lastName
            } on ${items.question.question.title}`,
            body: `${commentData.comment}`,
          },
        },
        token: items.token.token.access_token,
      });
    }
    if (res.error) {
      showMessage({ message: res.error.data.message, type: "danger" });
    }
    setCommentFocus(true);
    setLoading(false);
    getAllActivity();
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

  // console.log(data.file?.split(".")?.slice(-1)[0] === 'jpg')
  return (
    <View className="px-4 py-2">
      <View>
        <Text className="text-black">{data.answerData}</Text>
        {data.file &&
          (data.file?.split(".")?.slice(-1)[0] !== "jpg" ? (
            <TouchableOpacity
              onPress={checkPermission}
              className="border-2  border-[#0066A2] rounded-lg mt-3 py-2 mx-8  items-center flex-row justify-center"
            >
              <Image
                source={imagePath.icDocs}
                className="h-10 w-10 "
                style={{ tintColor: "#0066A2" }}
              />
              {
                <Text className="font-semibold text-[#0066A2] pl-4">
                  {getFileExtention(data.file)}
                </Text>
              }
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={checkPermission}
              style={{ elevation: 10, shadowColor: "black" }}
              className="border border-[#0066A2] overflow-hidden rounded-lg w-[90%] h-[30vh] mt-3 mx-auto items-center flex-row justify-center"
            >
              <Image
                source={{ uri: data?.file }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
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
              <Text className="text-xs">
                {" "}
                {new Date(data.createdAt).toLocaleDateString()}
              </Text>
              <Text className="text-xs">
                {" "}
                {new Date(data.createdAt).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </Text>
              <Text className="text-xs">
                {data.userId.firstName + "" + data.userId.lastName}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View>
        <Text className="font-semibold">Comments</Text>
        {data.comments &&
          data.comments.map((data, index) => (
            <Comment key={index} data={data} />
          ))}
      </View>

      <View>
        {!items.question.question.isSummary && (
          <View className=" mb-4">
            <Text className="font-semibold">Your Comment</Text>
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 "
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                placeholder="Mention people using '@'"
                onFocus={() => setCommentFocus(false)}
                value={commentData.comment}
                onChangeText={(text) =>
                  setCommentData({ ...commentData, comment: text })
                }
              />
              <TouchableOpacity
                onPress={pressComment}
                className=" bg-[#0066A2] px-3 py-3 mt-1 ml-2 rounded-lg items-center"
              >
                <Text className="font-semibold text-white my-auto">Post</Text>
              </TouchableOpacity>
            </View>
            {/* <View className="flex-row justify-between mt-3">
            <View></View>
            <TouchableOpacity
              onPress={pressComment}
              className=" bg-[#0066A2] px-6 py-2 rounded-lg items-center"
            >
              <Text className="font-semibold text-white my-auto">
                Add comment
              </Text>
            </TouchableOpacity>
          </View> */}
          </View>
        )}
      </View>
    </View>
  );
};

export default Answer;
