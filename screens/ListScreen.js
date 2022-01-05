import React, {useEffect, useState} from 'react';
import {View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import tw from 'tailwind-rn';
import {useNavigation} from '@react-navigation/core';
import axios from 'axios';
import {API_URL} from '@env';

const ListScreen = ({route}) => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  const getSchemas = async () => {
    if (route.params && route.params.idFolder) {
      console.log('if');
      const idFolder = route.params.idFolder;
      try {
        const req = await axios.get(`${API_URL}/${idFolder}/schemas`);
        const res = await req.data;
        setData(() => res);
      } catch (error) {
        console.log(error);
      }
    } else {
      // console.log("else");
      console.log('route.params', route.params);
      if (route.params != undefined) {
        setData(() => route.params.data);
      }
    }
  };

  useEffect(() => {
    getSchemas();
  }, [route]);

  return (
    <View style={tw('flex-1 w-full relative')}>
      <FlatList
        style={tw('px-1 mt-1')}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Pdf', {active: item.id, data})
              }
              style={tw(
                'flex-row items-end pl-1 pb-1 mb-2 border-b border-gray-200',
              )}>
              <Image
                style={tw('w-10 h-10')}
                source={require('../data/img/pdf.png')}
              />
              <Text style={tw('flex-1 pl-2 pb-2')}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default ListScreen;
