import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, SafeAreaView, Image} from 'react-native';
import Navbar from '../components/Navbar';
import SerieData from '../data/SerieData';
import tw from 'tailwind-rn';

const YearScreen = (props) => {
  // const [data, setData] = useState([]);
  // // let url = data[0].url;
  useEffect(() => {
    console.log(props.route.param);
  //   setData([...modelData]);
  //   console.log(data);
  //   //fetch the data first
  }, []);
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        numColumns={3}
        renderItem={({item}) => {
          return (
            <View style={tw('w-1/3 h-24 border')}>
              <Image style={tw('w-full h-24 border')} source={item.url} />
            </View>
          );
        }}
      />
    </View>
  );
};

export default YearScreen;
