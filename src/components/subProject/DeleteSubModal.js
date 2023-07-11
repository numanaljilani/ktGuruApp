import { TouchableOpacity, Text, View, Modal ,Image } from "react-native";
import React , {memo }from "react";
import imagePath from "../../constant/imagePath";
import { useSelector } from "react-redux";
import { useDeleteSubProjectMutation } from "../../redux/api/subProjectApi";
import { showMessage } from "react-native-flash-message";

const DeleteSubModal = ({setDeleteMod , opration ,setLoading}) => {
  const items = useSelector((state) => state.reducer);
  const {access_token} = useSelector((state) => state.reducer.token.token);
  const [deleteSubProject] = useDeleteSubProjectMutation();

  const deleteProjectFunction = async () =>{
    setLoading(true)
    setDeleteMod(false)
    const res = await deleteSubProject({token : access_token , id:opration._id})
//  console.log(res,"deleted SUB  project")
if(res.data){
  showMessage({message : "Sub Project Deleted" , type :"warning"})
}
 setLoading(false)
//  if()
  }
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
            <Image source={imagePath.icDelete} className="mx-auto my-2" style={{tintColor:"#0066A2"}}/>
          <Text className="font-semibold text-black mx-auto">
            Delete Project
          </Text>
          <View className="px-2 ">
            <Text className="text-center my-2">
              Are you sure you want to delete this Project ?
            </Text>
            <View className=" flex-row justify-between py-4 ">
              <TouchableOpacity
              onPress={deleteProjectFunction}
                className={`bg-[#0066A2] flex-row items-center justify-center px-10 py-3 rounded-lg `}
              >
                <Text className="text-white text-center font-semibold">
                  Delete Project
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={()=> setDeleteMod(false)}
                className={` border-2 border-[#0066A2] flex-row items-center justify-center px-10 py-3 rounded-lg`}
              >
                <Text className="text-[#0066A2] text-center font-semibold">
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

export default memo(DeleteSubModal);
