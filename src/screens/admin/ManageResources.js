import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import imagePath from "../../constant/imagePath";
import { useSelector } from "react-redux";

const ManageResources = () => {
  const { access_token } = useSelector((state) => state.reducer.token.token);
  const { projectResources, resourceUserInfo } = useSelector(
    (state) => state.reducer.project
  );
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
                    ? { uri: resourceUserInfo.userId.firstName }
                    : imagePath.icProfile
                }
                className="flex-1 self-center"
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
                "companyManager"
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
                        {data.userRole === "companyManager"
                          ? "Admin"
                          : "Consaltant"}
                      </Text>
                    </Text>
                    <TouchableOpacity className="bg-red-100 px-2 py-1">
                      <Text className="text-red-500">Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <TouchableOpacity className="bg-red-200 py-2 rounded-lg mb-3">
                <Text className="text-red-500  text-center font-semibold">
                  Remove from all projects
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="bg-[#0066A2] py-2 rounded-lg mb-3">
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
