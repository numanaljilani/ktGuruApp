import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useSelector } from "react-redux";

import ActivityList from "../../../components/activity/ActivityList";


const TimeLine = () => {
  const {projectActivity} = useSelector((state) => state.reducer.activity);
  const uniqueDates = [
    ...new Set(projectActivity?.map((item) => item.createdAt.split("T")[0])),
  ];
  return (
    <View className=" flex-1 rounded-lg px-2   bg-slate-100 ">
      <ScrollView>
        {uniqueDates.map((date, index) => (
          <View key={index} className="mt-3">
            <View className=" flex-row justify-center items-center">
              <Text className="bg-[#0066A2] text-white px-2 py-1 rounded-lg">
                {date}
              </Text>
            </View>
            {projectActivity
              ? projectActivity.map((data, index) => {
                  if (data.createdAt.split("T")[0] === date) {
                    return <ActivityList data={data} key={index} />;
                  }
                })
              : null}
          </View>
        ))}
      </ScrollView>
     {/* {loading && <Indicator/>} */}
    </View>
  );
};

export default TimeLine;
