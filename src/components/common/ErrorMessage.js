import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ErrorMessage = ({title}) => {
  return (
    <View style={{}}>
      <Text style={{color: 'red', marginTop: 3, fontSize: 10}}>{title}</Text>
    </View>
  );
};

export default ErrorMessage;

const styles = StyleSheet.create({});
