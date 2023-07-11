import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useActivityMutation } from '../../../redux/api/projectApi';
import { useIsFocused } from '@react-navigation/native';
import ActivityList from '../../../components/activity/ActivityList';
import Indicator from '../../../components/common/Indicator';

export default function SubSectionActivity() {
  const {SubProjectActivity} = useSelector((state) => state.reducer.activity);
      const uniqueDates = [
        ...new Set(SubProjectActivity?.map((item) => item.createdAt.split("T")[0])),
      ];
  return (
    <View className=" flex-1 rounded-lg px-2   bg-white">
    <ScrollView>
      {uniqueDates.map((date, index) => (
        <View key={index}>
          <View className=" flex-row justify-center items-center">
            <Text className="bg-[#0066A2] text-white px-2 py-1 rounded-lg">
              {date}
            </Text>
          </View>
          {SubProjectActivity
            ? SubProjectActivity.map((data, index) => {
                if (data.createdAt.split("T")[0] === date) {
                  return <ActivityList data={data} key={index} />;
                }
              })
            : null}
        </View>
      ))}
    </ScrollView>
  </View>
  )
}

const styles = StyleSheet.create({})