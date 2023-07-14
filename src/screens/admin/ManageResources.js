import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect } from "react";
import imagePath from "../../constant/imagePath";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import navigationString from "../../constant/navigationString";
import {
  useAddsubprojectresourceMutation,
  useGetresourcesMutation,
  useRemoveresourcesMutation,
} from "../../redux/api/projectApi";
import { showMessage } from "react-native-flash-message";
import { setResource } from "../../redux/slice/prjectSlice";

const ManageResources = () => {
  const { access_token } = useSelector((state) => state.reducer.token.token);
  const { projectResources, resourceUserInfo } = useSelector(
    (state) => state.reducer.project
  );

  const dispatch = useDispatch();
  // console.log(projectResources.notMatchingSubProjects);
  const [getresource] = useGetresourcesMutation();
  const [removeresource] = useRemoveresourcesMutation();
  const [addresourceinsubproject] = useAddsubprojectresourceMutation();

  const removeProject = async (data, project) => {
    const res = await removeresource({
      token: access_token,
      body: {
        projectId: data?._id,
        userId: resourceUserInfo?.userId?.id,
        removedFromAllProject: project, //boolean value if yes send main project projectId otherwise subProject projectId.
      },
    });
    if (res.data) {
      showMessage({ message: res.data.message, type: "success" });
      getResources();
      // navigation.navigate(navigationString.PROJECTS);
    }
  };

  const getResources = async () => {
    const res = await getresource({
      body: {
        projectId: projectResources._id,
        userId: resourceUserInfo?.userId?.id,
      },
      token: access_token,
    });

    if (res.data) {
      dispatch(setResource(res.data));
    }
  };

  const addresource = async (data) => {
    const res = await addresourceinsubproject({
      token: access_token,
      body: {
        projectId: data?.id,
        userId: resourceUserInfo?.userId?.id,
        projectRole: projectResources.matchedResourcesProject.userRole, //boolean value if yes send main project projectId otherwise subProject projectId.
      },
    });
    if (res.data) {
      showMessage({ message: res.data.message, type: "success" });
      getResources();
      // navigation.navigate(navigationString.PROJECTS);
    }
  };
  // console.log(projectResources._id);
  const navigation = useNavigation();
  //   console.log(projectResources.matchingSubProjects);
  //   console.log(resourceUserInfo);
  return (
    <View className="flex-1 py-3">
      <ScrollView>
        <View className="border my-auto  mx-2 rounded-lg m">
          <View className="  mt-2 ">
            <View className="border-2 mt-2  border-[#0066A2] w-24 h-24 rounded-full my-auto mx-auto overflow-hidden">
              <Image
                source={
                  resourceUserInfo.userId.avatar
                    ? { uri: resourceUserInfo.userId.avatar }
                    : imagePath.icProfile
                }
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="mt-3">
              <Text className="text-center">
                {resourceUserInfo.userId.firstName +
                  " " +
                  resourceUserInfo.userId.lastName}
              </Text>
              <Text className="text-center">
                {resourceUserInfo.userId.email}
              </Text>
            </View>
          </View>
          <View className=" ">
            <Text className="text-center mt-3">
              In{" "}
              <Text className="font-semibold text-black">
                {projectResources.projectName}
              </Text>{" "}
              Added as a{" "}
              <Text className="text-blue-500">
                {projectResources.matchedResourcesProject.userRole ===
                  "companyManager" ||
                projectResources.matchedResourcesProject.userRole ===
                  "projectAdmin"
                  ? "Admin"
                  : "Consaltant"}
              </Text>
            </Text>
          </View>
          <View className="mx-4 mt-4">
            <Text className="font-semibold text-gray-800">
              In Sub Sections:
            </Text>
            <View>
              <View>
                {projectResources.matchingSubProjects.map((data, index) => (
                  <View key={index} className="  py-2 flex-row justify-between">
                    <Text>
                      {data.projectName} :{" "}
                      <Text className="text-blue-500">
                        {data.userRole === "companyManager" ||
                        data.userRole === "projectAdmin"
                          ? "Admin"
                          : "Consaltant"}
                      </Text>
                    </Text>
                    <TouchableOpacity
                      className="bg-red-100 px-2 py-1"
                      onPress={() => removeProject(data, false)}
                    >
                      <Text className="text-red-500 font-semibold">Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View>
                {projectResources.notMatchingSubProjects.map((data, index) => (
                  <View key={index} className="  py-2 flex-row justify-between">
                    <Text>
                      {data.projectName} :{" "}
                      <Text className="text-blue-500">
                        {data.userRole === "companyManager" ||
                        data.userRole === "projectAdmin"
                          ? "Admin"
                          : "Admin"}
                      </Text>
                    </Text>
                    <TouchableOpacity
                      className="bg-green-100  px-2 py-1"
                      onPress={() => addresource(data)}
                    >
                      <Text className="text-green-500 font-semibold px-4">
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                className="bg-red-200 py-2 rounded-lg mb-3"
                onPress={() => removeProject(projectResources, true)}
              >
                <Text className="text-red-500  text-center font-semibold">
                  Remove from all projects
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="bg-[#0066A2] py-2 rounded-lg mb-3"
              onPress={() => navigation.navigate(navigationString.PROJECTS)}
            >
              <Text className="text-white  text-center font-semibold">
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ManageResources;
