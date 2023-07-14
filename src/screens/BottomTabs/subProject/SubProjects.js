import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { useGetAllProjectMutation } from "../../../redux/api/subProjectApi";
import SubList from "../../../components/subProject/SubList";
import CreateSubProject from "../../../components/subProject/CreateSubProject";
import DeleteSubModal from "../../../components/subProject/DeleteSubModal";
import UpdateSubModal from "../../../components/subProject/UpdateSubModal";
import Indicator from "../../../components/common/Indicator";
import BigUserIcons from "../../../components/userComponent/BigUserIcons";
import analytics from "@react-native-firebase/analytics";
import { useNotificationMutation } from "../../../redux/api/projectApi";
import { AddProjectNotificationFromApi } from "../../../redux/slice/cahtNotificationSlice";
import { setSubProjectList } from "../../../redux/slice/subProject";
import UserList from "../../../components/userComponent/UserList";

const SubProjects = ({ route }) => {
  // const items = useSelector((state) => state.reducer);
  const { _id: projectId, resources } = useSelector(
    (state) => state.reducer.project.project
  );
  const { user } = useSelector((state) => state.reducer.user);
  const { access_token } = useSelector((state) => state.reducer.token.token);
  // const { subProjectList } = useSelector((state) => state.reducer.subProject);

  const [updateMod, setUpdateMod] = useState(false);
  const [deleteMod, setDeleteMod] = useState(false);
  const [createProject, setCreateProject] = useState(false);
  const [subProjectState, setProjectState] = useState();
  const [showResourceList, setShowResourceLis] = useState(false);
  const [showSubResourceList, setShowSubResourceLis] = useState(false);
  const [subUserData, setSubUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [opration, setOperation] = useState({});

  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const [getallsubproject] = useGetAllProjectMutation();
  const [notification, { data, isSuccess, isError, error }] =
    useNotificationMutation();

  const getProject = async () => {
    setLoading(true);
    const project = await getallsubproject({
      token: access_token,
      body: { projectId },
    });

    if (project.data && project.data.length > 0) {
      setProjectState(project.data);
      dispatch(setSubProjectList(project.data));
    }
    setLoading(false);
  };
  // useEffect(() => {
  //     getProject()
  // }, [isFocus]);
  useEffect(() => {
    if (isFocus) {
      getProject();
    }
  }, [isFocus]);
  useEffect(() => {
    if (!createProject) {
      getProject();
    }
  }, [createProject]);
  useEffect(() => {
    notification({ body: { projectId }, token: access_token });
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(AddProjectNotificationFromApi(data));
    }
  }, [isSuccess]);

  // useEffect(()=>{
  //   setTimeout()
  // },[])

  return (
    <View>
      <View
        style={{
          backgroundColor: "#E0DFE6",
          width: "100%",
          height: "100%",
        }}
      >
        <View className="mt-2 flex-row justify-center">
          {resources?.length > 0
            ? resources?.map((data, index) =>
                index < 4 ? (
                  <BigUserIcons
                    data={data}
                    key={index}
                    setShowResourceLis={setShowResourceLis}
                  />
                ) : null
              )
            : null}

          {resources?.length > 4 ? (
            <TouchableOpacity
              className=" bg-white w-12 h-12 mr-1  flex-row justify-center items-center rounded-full overflow-hidden"
              style={{ elevation: 5 }}
            >
              <Text className="font-semibold">+{resources?.length - 4}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View className="flex-row px-5 justify-between items-center my-3">
          <Text className="font-semibold">All Sub Sections</Text>
          {user.role1 && (
            <TouchableOpacity
              onPress={async () => {
                await analytics().logEvent("create_Sub_Project", {
                  Button: "Create new sub project",
                });
                setCreateProject(true);
              }}
              className="bg-[#0066A2] px-6 py-2 rounded-lg"
            >
              <Text className="font-semibold text-white ">
                Create Sub Section
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView>
          {subProjectState &&
            subProjectState.length > 0 &&
            subProjectState.map((data, index) => (
              <SubList
                key={index}
                setDeleteMod={setDeleteMod}
                setUpdateMod={setUpdateMod}
                data={data}
                setOperation={setOperation}
                setShowResourceLis={setShowResourceLis}
                setSubUserData={setSubUserData}
                setShowSubResourceLis={setShowSubResourceLis}
              />
            ))}
        </ScrollView>
      </View>

      {updateMod && (
        <UpdateSubModal
          setLoading={setLoading}
          setUpdateMod={setUpdateMod}
          opration={opration}
          getProject={getProject}
        />
      )}
      {/* {deleteMod && (
        <DeleteSubModal
          setLoading={setLoading}
          setDeleteMod={setDeleteMod}
          opration={opration}
        />
      )} */}
      {createProject && (
        <CreateSubProject
          setLoading={setLoading}
          setCreateProject={setCreateProject}
          getProject={getProject}
        />
      )}
      {loading && <Indicator />}
      {showResourceList && (
        <UserList
          setShowResourceLis={setShowResourceLis}
          resources={resources}
          subResources={subUserData}
          showSubResourceList={showSubResourceList}
          setShowSubResourceLis={setShowSubResourceLis}
        />
      )}
      {/* {showSubResourceList && (
        <UserList
          setShowResourceLis={setShowSubResourceLis}
          resources={subUserData}
        />
      )} */}
    </View>
  );
};

export default memo(SubProjects);
