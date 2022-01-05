import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  Modal,
  Pressable,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import tw from 'tailwind-rn';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/core';
import {ScrollView} from 'react-native-gesture-handler';
import VersionInfo from 'react-native-version-info';
import {API_URL} from '@env';

const Navbar = () => {
  const navigation = useNavigation();
  const bookmarkImg = require('../data/img/bookmark.png');
  const heartImg = require('../data/img/heart.png');
  const infoImg = require('../data/img/info.png');
  const [modalVisible, setModalVisible] = useState(false);
  // const appVersion =
  //   VersionInfo.appVersion == null ? '1.1.0.0' : VersionInfo.appVersion;
  const [about, setAbout] = useState({
    version: '',
    email: '',
    date: '',
    info: '',
  });
  const getAbout = () => {
    try {
      axios.get(`${API_URL}/about`).then(res => setAbout(() => res.data[0]));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAbout();
  }, []);
  const fetchFavSchemas = schemas => {
    return schemas.map(e => {
      try {
        return axios
          .get(`https://bimmapro.online/api/schema?id=${e}`)
          .then(res => {
            return res.data[0];
          });
      } catch (error) {
        console.log(error);
      }
    });
  };
  const getFavoritSchemas = async () => {
    const res = await AsyncStorage.getItem('ids');
    if (JSON.stringify(res) !== 'null') {
      let ids = await JSON.parse(res);
      const promises = fetchFavSchemas(ids);
      Promise.all(promises).then(res => {
        navigation.navigate('ShowTab', {
          screen: 'List',
          params: {
            data: res,
          },
        });
      });
    }
  };
  const toggelModal = () => {
    setModalVisible(() => true);
  };
  return (
    <>
      <View style={tw('bg-blue-100 h-16 pt-2 z-0')}>
        <View style={tw('flex-row justify-end')}>
          <TouchableOpacity style={tw('px-2')} onPress={getFavoritSchemas}>
            <Image style={tw('w-8 h-8')} source={heartImg} />
          </TouchableOpacity>
          <TouchableOpacity style={tw('px-2')} onPress={toggelModal}>
            <Image style={tw('w-8 h-8')} source={infoImg} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(() => false);
        }}>
        <View
          style={[
            tw('flex-1 items-center justify-center'),
            styles.modelContainer,
          ]}>
          <View style={[styles.modalView, tw('w-4/5 rounded bg-white p-4')]}>
            <Text style={tw('text-center font-bold text-base pb-1')}>
              About
            </Text>
            <View style={tw('w-full border-b border-gray-400 pb-2')}>
              <View style={tw('flex-row')}>
                <Text style={tw('w-1/2')}>Application</Text>
                <View style={tw('w-1/2 flex-row items-start')}>
                  <Text>Bimma EWD </Text>
                  <Text>({about.version})</Text>
                </View>
              </View>
              <View style={tw('flex-row')}>
                <Text style={tw('w-1/2')}>Released in</Text>
                <Text style={tw('w-1/2')}>{about.date}</Text>
              </View>
              <View style={tw('flex-row')}>
                <Text style={tw('w-1/2')}>Email</Text>
                <Text style={tw('w-1/2')}>{about.email}</Text>
              </View>
              <View style={tw('flex-row')}>
                <Text style={tw('w-1/2')}>Developer</Text>
                <Text style={tw('w-1/2')}>Imad elcass</Text>
              </View>
            </View>
            <View style={tw('w-full border-b border-gray-400 pb-2 pt-2')}>
              <Text style={tw('')}>{about.info}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  modelContainer: {
    backgroundColor: '#0000009a',
  },
  modalView: {
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Navbar;
