import {Text, TouchableOpacity, View, Image} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import React, {memo, useRef} from 'react';
import imagePath from '../../constant/imagePath';
import navigationString from '../../constant/navigationString';
import {useNavigation} from '@react-navigation/native';
import {stringManupuation} from '../../utils/stringManupulation';
import {useDispatch, useSelector} from 'react-redux';
import {setSubProject} from '../../redux/slice/subProject';
import UserIcons from '../userComponent/UserIcons';
import analytics from '@react-native-firebase/analytics';

const SubList = ({
  setDeleteMod,
  setUpdateMod,
  data,
  setOperation,
  setShowResourceLis,
  setSubUserData,
  setShowSubResourceLis,
}) => {
  const {user} = useSelector(state => state.reducer.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const swipeableRef = useRef(null);

  // console.log(data.resources)

  const deleteFunction = () => {
    setDeleteMod(true);
    setOperation(data);
  };
  const updateFunction = () => {
    swipeableRef.current.close();
    setUpdateMod(true);
    setOperation(data);
  };

  const DeleteSwipe = () => {
    return (
      user.role1 ||
      (!user?.role2?.role === 'consultant' && (
        <TouchableOpacity
          onPress={deleteFunction}
          className="my-1 rounded-r-lg bg-red-600 items-center justify-center">
          <Image
            source={imagePath.icDelete}
            className="mx-3"
            style={{tintColor: 'white'}}
          />
        </TouchableOpacity>
      ))
    );
  };
  const UpdateSwipe = () => {
    return (
      <TouchableOpacity
        onPress={updateFunction}
        className="my-1 rounded-l-lg bg-green-600 items-center justify-center">
        <Image
          source={imagePath.icEdit}
          style={{tintColor: 'white'}}
          className="w-10 h-10 mx-3"
        />
      </TouchableOpacity>
    );
  };

  const navigateFunction = async () => {
    await analytics().logEvent('navigate_to_Sub_project', {
      list: 'navigate to sub project',
      subProjectName: data?.projectName,
    });
    dispatch(setSubProject(data));
    navigation.navigate(navigationString.SUBPROJECT);
  };
  return (
    <Swipeable
      ref={swipeableRef}
      overshootLeft={false}
      overshootRight={false}
      renderRightActions={user?.role1 && UpdateSwipe}
      onSwipeableOpen={() => {
        console.log('open');
      }}>
      <TouchableOpacity
        onPress={navigateFunction}
        className=" justify-between py-2  mx-2 rounded-lg border-t-2 border-[#0066a2] px-3 bg-white my-1 h-40 overflow-hidden"
        style={{elevation: 15}}>
        <View>
          <Text className="text-[#0066a2] my-1 font-semibold">
            {data.projectName}
          </Text>
          <Text>{stringManupuation(data.projectDesc, 100)}</Text>
        </View>
        <View className="flex-row self-baseline">
          {data.resources &&
            data.resources.map(
              (mapData, index) =>
                index < 4 && (
                  <UserIcons
                    data={mapData}
                    resource={data.resources}
                    key={index}
                    setSubUserData={setSubUserData}
                    setShowResourceLis={setShowResourceLis}
                    setShowSubResourceLis={setShowSubResourceLis}
                  />
                ),
            )}
          {data.resources.length > 4 ? (
            <TouchableOpacity
              onPress={() => {
                setShowResourceLis(true);
                setSubUserData(data.resources);
                setShowSubResourceLis(true);
              }}
              className=" mr-1  flex-row justify-center items-center w-9  h-9 rounded-full overflow-hidden bg-blue-50 shadow-2xl"
              style={{elevation: 2}}>
              <Text className="font-semibold text-black">
                +{data.resources.length - 4}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default memo(SubList);
