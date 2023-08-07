import {
  RefreshControl,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TextInput} from 'react-native-paper';
import analytics from '@react-native-firebase/analytics';

import QuestionList from '../../../components/question/QuestionList';
import AskQuestionModal from '../../../components/question/AskQuestionModal';
import Indicator from '../../../components/common/Indicator';
import imagePath from '../../../constant/imagePath';
import {useAllquestionsMutation} from '../../../redux/api/discussion';
import {useIsFocused} from '@react-navigation/native';
import {useActivityMutation} from '../../../redux/api/projectApi';
import {setProjectActivity} from '../../../redux/slice/activitySlice';

const Discussion = ({route}) => {
  const {_id: projectId} = useSelector(state => state.reducer.project.project);
  const {access_token} = useSelector(state => state.reducer.token.token);
  const {allQuestions} = useSelector(state => state.reducer.question);
  const [active, setActive] = useState('active');
  const [askQuestion, setAskQuestion] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [allQuestions, setAllQuestion] = useState([]);
  const [filterQuestion, setFilterQuiestion] = useState(allQuestions);
  const [refreshing, setRefreshing] = React.useState(false);
  const [allquestions] = useAllquestionsMutation();
  const focused = useIsFocused();
  const dispatch = useDispatch();

  const getAllQuestion = async () => {
    const res = await allquestions({
      body: {projectId},
      token: access_token,
    });
    if (res.data) {
      // setAllQuestion(res.data);
      setFilterQuiestion(res.data);
    }
  };

  // useEffect(() => {
  //   if(!askQuestion){
  //     getAllQuestion();
  //     getAllActivity()
  //   }
  // }, [askQuestion]);
  useEffect(() => {
    if (focused) {
      getAllQuestion();
    }
  }, [focused]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAllQuestion();
    setRefreshing(false);
  }, []);

  const search = text => {
    if (text === '') {
      setFilterQuiestion(allQuestions);
    } else {
      let tempList = allQuestions.filter(data => {
        return data?.title?.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      setFilterQuiestion(tempList);
    }
  };

  return (
    <View className="flex-1">
      <View className=" flex-row justify-between px-5 items-center py-1">
        <Text className="text-black font-semibold">All Questions</Text>
        <TouchableOpacity
          onPress={() => setAskQuestion(true)}
          className="bg-[#0066A2] px-8 rounded-lg py-3">
          <Text className="text-white font-semibold">Ask Question</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row  my-3 justify-between px-5">
        <TouchableOpacity
          onPress={async () => {
            await analytics().logEvent('active', {
              Button: 'show active question',
            });
            setActive('active');
          }}
          className={`${
            active === 'active' ? 'bg-[#0066A2]' : 'bg-white'
          } border-2 border-[#0066A2] flex-1 py-2 rounded-lg mr-4`}>
          <Text
            className={`${
              active === 'active' ? 'text-white' : 'text-[#0066A2]'
            } font-semibold text-center`}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            await analytics().logEvent('closed', {
              Button: 'show closed question',
            });
            setActive('close');
          }}
          className={`${
            active === 'close' ? 'bg-[#0066A2]' : 'bg-[#fff]'
          } border-2 border-[#0066A2] flex-1  py-2 rounded-lg`}>
          <Text
            className={`${
              active === 'close' ? 'text-[#ffff]' : 'text-[#0066A2]'
            } font-semibold text-center`}>
            Closed
          </Text>
        </TouchableOpacity>
      </View>
      <View className="mx-2 mb-2">
        <TextInput
          mode="outlined"
          outlineColor="#0066A2"
          activeOutlineColor="#0066A2"
          placeholder="Search Question"
          placeholderTextColor="#C0C0C0"
          left={<TextInput.Icon icon={imagePath.icSearch} />}
          onChangeText={text => {
            search(text);
          }}
        />
      </View>
      <FlatList
        data={filterQuestion}
        renderItem={({item}) => <QuestionList data={item} active={active} />}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {askQuestion && (
        <AskQuestionModal
          setLoading={setLoading}
          setAskQuestion={setAskQuestion}
          getAllQuestion={getAllQuestion}
        />
      )}
      {loading && <Indicator />}
    </View>
  );
};

export default Discussion;
