import {
  RefreshControl,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { TextInput } from "react-native-paper";
import { showMessage, hideMessage } from "react-native-flash-message";
import ItemsList from "../../../components/projects/ItemsList";
import { useDispatch, useSelector } from "react-redux";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import analytics from "@react-native-firebase/analytics";

// components
import imagePath from "../../../constant/imagePath";
import UpdateModal from "../../../components/projects/UpdateModal";
import DeleteModal from "../../../components/projects/DeleteModal";
import { useGetallprojectMutation } from "../../../redux/api/projectApi";
import CreateProject from "../../../components/projects/CreateProject";
import Indicator from "../../../components/common/Indicator";
import AddResourcesModal from "../../../components/projects/AddResourcesModal";
import NoDataFound from "../../../components/common/NoDataFound";
import { setSocket } from "../../../redux/slice/chatSlice";
import address from "../../../config/address";
import { setNavigation } from "../../../redux/slice/navigationSlice";
import ManageResources from "../../../components/projects/ManageResources";

const ENDPOINT = address.PORT;
var socket;
socket = io(ENDPOINT);

export default React.memo(function Projects() {
  const isFocused = useIsFocused();

  // const items = useSelector((state) => state.reducer);
  const { access_token } = useSelector((state) => state.reducer.token.token);
  const { user } = useSelector((state) => state.reducer.user);
  const { loading } = useSelector((state) => state.reducer.navigation);
  const dispatch = useDispatch();
  const [updateMod, setUpdateMod] = useState(false);
  const [deleteMod, setDeleteMod] = useState(false);
  const [resourceMod, setResourceMod] = useState(false);
  const [createProject, setCreateProject] = useState(false);
  const [addResourcesMod, setAddResourcesMod] = useState(false);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [subProject, setSubProject] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const [opration, setOperation] = useState({});
  const listRef = useRef();

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Do something when the screen is focused

  //     return () => {
  //       // Do something when the screen is unfocused
  //       // Useful for cleanup functions
  //     };
  //   }, [])
  // );

  // console.log("component is rerendering",isFocused)
  const [getallproject] = useGetallprojectMutation();

  // get all project data
  const getProject = async () => {
    // const fcm = await await AsyncStorage.getItem('fcmToken')
    // console.log(fcm , "fcm Token getiing inside the project")
    // setRefreshing(true);
    // setLoading(true)
    dispatch(setNavigation(false));
    const project = await getallproject(access_token);
    if (project.data) {
      setProjectList(project.data);
      listRef.current = project.data;
    }
    if (project.error) {
      showMessage({ message: project.error.data.message, type: "danger" });
      // await crashlytics.setAttributes({
      //   responseError : project.error.data
      // })
    }

    // setRefreshing(false);
    // setLoading(false)
  };
  useEffect(() => {
    if (isFocused) {
      getProject();
    }
  }, [isFocused]);

  //  scroll down to refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getProject();
    setRefreshing(false);
  }, []);

  // SetUp the connection for chat or socket io
  useEffect(() => {
    if (user !== undefined) {
      socket.emit("setup", user.user);
    }
  }, []);

  //  initialize sockets connection
  useEffect(() => {
    if (!socketInitialized) {
      socket.on("connected", () => {
        setSocketInitialized(true);
        dispatch(setSocket(socket));
      });
    }
  }, [socketInitialized]);

  // search filter
  const search = (text) => {
    if (text === "") {
      setProjectList(listRef.current);
    } else {
      let tempList = projectList.filter((data) => {
        return data.projectName.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      setProjectList(tempList);
    }
  };
  // console.log(items.user.user.role1.teams)

  return isFocused ? (
    <View>
      <View
        style={{
          backgroundColor: "#E0DFE6",
          width: "100%",
          height: "100%",
        }}
      >
        <TextInput
          placeholder="Jump to Project"
          mode="outlined"
          outlineColor="#0066A2"
          activeOutlineColor="#0066A2"
          placeholderTextColor="#C0C0C0"
          onChangeText={(text) => {
            search(text);
          }}
          className="rounded-lg bg-white mx-2 my-1"
          left={<TextInput.Icon icon={imagePath.icSearch} style={{}} />}
        />

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {projectList.length > 0 ? (
            projectList.map((data, index) => (
              <ItemsList
                key={index}
                setDeleteMod={setDeleteMod}
                setUpdateMod={setUpdateMod}
                data={data}
                setResourceMod={setResourceMod}
                setOperation={setOperation}
                setAddResourcesMod={setAddResourcesMod}
                setSubProject={setSubProject}
                // setLoading = {setLoading}
              />
            ))
          ) : (
            <NoDataFound data="Looks like you don't have any project" />
          )}
        </ScrollView>
      </View>

      {updateMod && (
        <UpdateModal
          // setLoading={setLoading}
          setUpdateMod={setUpdateMod}
          opration={opration}
          getProject={getProject}
        />
      )}
      {deleteMod && (
        <DeleteModal
          // setLoading={setLoading}
          setDeleteMod={setDeleteMod}
          opration={opration}
        />
      )}
      {resourceMod && (
        <ManageResources
          // setLoading={setLoading}
          setResourceMod={setResourceMod}
          opration={opration}
        />
      )}
      {createProject && (
        <CreateProject
          // setLoading={setLoading}
          setCreateProject={setCreateProject}
          getProject={getProject}
        />
      )}
      {addResourcesMod && (
        <AddResourcesModal
          // setLoading={setLoading}
          setAddResourcesMod={setAddResourcesMod}
          subProject={subProject}
        />
      )}
      {/* {loading && <Indicator />} */}
      {/* {<Drawer/>} */}

      {user.role1 && (
        <TouchableOpacity
          style={{ elevation: 20 }}
          onPress={async () => {
            setCreateProject(true);
            await analytics().logEvent("new_Project", {
              item: "Create new project",
            });
          }}
          className=" absolute bottom-10 right-8 rounded-xl p-4 bg-[#0066A2] shadow-2xl shadow-gray-50"
        >
          <Image
            source={imagePath.icPlus}
            className="w-6 h-6"
            style={{ tintColor: "#ffff" }}
          />
        </TouchableOpacity>
      )}
    </View>
  ) : null;
});

// export default React.memo(Projects);
