import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import {View, Image, FlatList, StyleSheet} from 'react-native';
import tw from 'tailwind-rn';
import {TouchableOpacity} from 'react-native';
import axios from 'axios';
import {API_URL,DATA_URL} from '@env';
const SerieScreen = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  const getSeries = async () => {
    try {
      const req = await axios.get(`${API_URL}/series`);
      const series = await req.data;
      setData(() => [
        ...series
        // .sort((a, b) => {
        //   if (a.created_at < b.created_at) return -1;
        //   if (a.created_at > b.created_at) return 1;
        //   return 0;
        // }),
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSeries();
  }, []);
  return (
    <View style={tw('flex-1')}>
      <FlatList
        style={tw('pl-1 mt-1')}
        numColumns={3}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={tw('w-1/3 h-36 pr-1 mb-1')}
              onPress={() =>
                navigation.navigate('ShowTab', {
                  screen: 'Model',
                  params: {
                    id: item.id,
                    models: item.modeles,
                  },
                })
              }>
              <Image
              //h-3/4
                style={[tw('w-full h-full rounded'), styles.serieImg]}
                source={{uri: `${DATA_URL}/${item.url}`}}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  serieImg: {
    flex: 1,
    resizeMode: 'contain',
  },
});

export default SerieScreen;
