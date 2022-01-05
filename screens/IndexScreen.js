import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import tw from 'tailwind-rn';
import {useNavigation} from '@react-navigation/core';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {API_URL} from '@env';
import { prevScreensCon } from '../globalState/PrevScreenContext';

const IndexScreen = ({route}) => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [type, setType] = useState('');
  const {prevScreens, setPrevScreens} = useContext(prevScreensCon);
  const getMachines = async () => {
    try {
      const req = await axios.get(`${API_URL}/modele/${route.params.id}`);
      const res = await req.data;
      setData(() => res[0].machines);
      // console.log(res[0].machines);
    } catch (error) {
      console.log(error);
    } finally {
      // setClear(() => true);
      navigation.setParams({type: null});
    }
  };
  const getMachineDossiers = async () => {
    try {
      const req = await axios.get(
        `${API_URL}/machine/${route.params.id}/dossiers`,
      );
      const res = await req.data;
      setData(() => res);
      // console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      navigation.setParams({type: null});
    }
  };
  const getDossiers = async () => {
    try {
      const req = await axios.get(
        `${API_URL}/dossiers?parent=${route.params.idParent}`,
      );
      const res = await req.data;
      setData(() => res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (route.params && route.params.type != null) {
      setData(() => {});
      setType(() => route.params.type);
      if (route.params.type === 'machines') {
        getMachines();
      } else if (route.params.type === 'machine_dossiers') {
        getMachineDossiers();
      } else if (route.params.type === 'dossiers') {
        getDossiers();
      }
    }
    console.log(route.params);
  }, [route]);

  const handlePrevScreens = () => {
    // const removeLS = removeLastScreen();
    // removeLS.then(res => console.log(res));
    navigation.navigate('ShowTab', {
      screen: 'Index',
      params: {...prevScreens[prevScreens.length - 2], goBack: true},
    });
    setPrevScreens(prev => prev.filter((e, i) => i != prev.length - 1));
  };
  useEffect(() => {
    if (route.params && !route.params.goBack) {
      console.log('no goBack triggerd');
      if (route.params.type != null) {
        setPrevScreens(prev => [...prev, route.params]);
      }
    }
  }, [route]);

  return (
    <>
      <View>
        <FlatList
          style={tw('px-1 mt-1')}
          data={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={tw(
                  'flex-row items-end pl-1 pb-1 mb-2 border-b border-gray-200',
                )}
                onPress={() =>
                  type === 'machines'
                    ? navigation.navigate('ShowTab', {
                        screen: 'Index',
                        params: {
                          // id: item.modele_id,
                          id: item.id,
                          type: 'machine_dossiers',
                        },
                      })
                    : type === 'machine_dossiers'
                    ? item.dossier.hasChild === '1'
                      ? navigation.navigate('ShowTab', {
                          screen: 'Index',
                          params: {
                            idParent: item.dossier_id,
                            type: 'dossiers',
                          },
                        })
                      : navigation.navigate('ShowTab', {
                          screen: 'List',
                          params: {
                            idFolder: item.dossier_id,
                          },
                        })
                    : type === 'dossiers' && item.hasChild === '1'
                    ? navigation.navigate('ShowTab', {
                        screen: 'Index',
                        params: {
                          idParent: item.id,
                          type: 'dossiers',
                        },
                      })
                    : navigation.navigate('ShowTab', {
                        screen: 'List',
                        params: {
                          idFolder: item.id,
                        },
                      })
                }>
                <Image
                  style={tw('w-10 h-10')}
                  source={
                    type === 'machines'
                      ? require('../data/img/folder.png')
                      : type === 'dossiers'
                      ? item.hasChild === '1'
                        ? require('../data/img/folder.png')
                        : require('../data/img/pdf-folder.jpg')
                      : item.dossier.hasChild === '1'
                      ? require('../data/img/folder.png')
                      : require('../data/img/pdf-folder.jpg')
                  }
                />
                <Text style={tw('flex-1 pl-2 pb-2')}>
                  {type === 'machine_dossiers' ? item.dossier.name : item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      {prevScreens.length > 1 && (
        <Icon
          onPress={handlePrevScreens}
          style={tw('absolute bottom-10 right-10')}
          size={25}
          color="#06b6d4"
          name="backward"
        />
      )}
    </>
  );
};

export default IndexScreen;
