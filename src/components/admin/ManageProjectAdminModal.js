import {
  StyleSheet,
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {memo} from 'react';
import imagePath from '../../constant/imagePath';
import {useReomoveComponyUserMutation} from '../../redux/api/api';
import {showMessage} from 'react-native-flash-message';

const ManageAdminModal = ({
  admin,
  setAdminModal,
  access_token,
  user,
  setLoading,
}) => {
  const [modalVal, setModalVal] = useState(true);
  const [conform, setConform] = useState(false);

  const [reomoveComponyUser, {data, error, isSuccess, isError}] =
    useReomoveComponyUserMutation();

  const conformed = async () => {
    setAdminModal(false);
    setLoading(true);
    const res = await reomoveComponyUser({
      token: access_token,
      body: {userId: admin.id, companyId: user.role1._id},
    });
    // console.log(access_token);
    console.log(res);
    if (res.data) {
      setLoading(false);
      showMessage({message: 'user removed successfully', type: 'success'});
    }
    if (res.error) {
      setLoading(false);
      showMessage({message: res?.error?.data?.message, type: 'danger'});
    }
  };

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={modalVal}
      style={{zIndex: 1100}}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground} className="px-4">
        <View className=" w-full py-3 bg-white h-1/2 rounded-lg">
          <View className=" my-auto">
            <View className="items-center">
              <View className="border-2 overflow-hidden border-[#0066A2] w-28 h-28 rounded-full">
                <Image
                  source={
                    admin?.avatar ? {uri: admin?.avatar} : imagePath.icProfile
                  }
                  className="flex-1"
                  resizeMode="cover"
                />
              </View>
              <Text className="font-bold mt-4 text-base">
                {admin.firstName + ' ' + admin.lastName}
              </Text>
              <Text className="mt-1">{admin.email}</Text>
            </View>
            <View className=" px-4 ">
              {!conform ? (
                <TouchableOpacity
                  onPress={() => setConform(true)}
                  className=" rounded-lg py-3 bg-red-100 text-center mt-2">
                  <Text className="text-center font-semibold text-red-600 ">
                    Remove From Compony
                  </Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <Text className="text-center my-4 text-black font-semibold">
                    Are you sure you want to remove{' '}
                    {admin.firstName + ' ' + admin.lastName}
                  </Text>
                  <View className="flex-row">
                    <TouchableOpacity
                      onPress={() => conformed()}
                      className="mr-3 flex-1 rounded-lg py-3 bg-red-100 text-center">
                      <Text className="text-center font-semibold text-red-600 ">
                        Remove
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setConform(false)}
                      className="flex-1 rounded-lg py-3 bg-green-100 text-center">
                      <Text className="text-center font-semibold text-green-600 ">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <TouchableOpacity
                onPress={() => setAdminModal(false)}
                className="bg-[#0066A2] py-3 rounded-lg mt-4 ">
                <Text className="text-white text-center font-semibold  ">
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(ManageAdminModal);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
});
