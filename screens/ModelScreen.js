import React, {useState, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/core';
import {View, Image, FlatList} from 'react-native';
import tw from 'tailwind-rn';
import {TouchableOpacity} from 'react-native';
import {DATA_URL} from '@env';
import {prevScreensCon} from '../globalState/PrevScreenContext';

const ModelScreen = ({route}) => {
  const [models, setModels] = useState([]);
  const {setPrevScreens} = useContext(prevScreensCon);
  useEffect(() => {
    setModels(() => {
      if (route.params) {
        return route.params.models.sort((a, b) => {
          if (a.year < b.year) return -1;
          if (a.year > b.year) return 1;
          return 0;
        });
      }
    });
  }, [route]);
  const navigation = useNavigation();

  const goToIndex = id => {
    navigation.navigate('ShowTab', {
      screen: 'Index',
      params: {
        id: id,
        type: 'machines',
      },
    });
  };

  const hanldeModelClicked = item => {
    //onPress on model i want :
    //1 empty prevScreen context
    setPrevScreens(() => []);
    //2 go to index screen
    goToIndex(item.id);
  };
  return (
    <View style={tw('flex-1')}>
      <FlatList
        style={tw('pl-1 mt-1')}
        numColumns={2}
        data={models}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={tw('w-1/2 h-60 pr-1 mb-1')}
              onPress={() => hanldeModelClicked(item)}>
              <Image
                style={tw('w-full h-full rounded')}
                resizeMode="contain"
                source={{uri: `${DATA_URL}/${item.url}`}}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default ModelScreen;
