import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import tw from 'tailwind-rn';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import RNPrint from 'react-native-print';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DATA_URL} from '@env';

const PdfScreen = ({route}) => {
  const [alert, setAlert] = useState({state: false, text: ''});
  const [schemaLimit, setSchemaLimit] = useState(30);
  const [todayLimit, setTodayLimit] = useState(false);
  const [ids, setIds] = useState([]);
  const [lastPdf, setLastPdf] = useState(false);
  const [firstPdf, setFirstPdf] = useState(false);
  const [pdfScale, setPdfScale] = useState(12);
  const {config, fs} = RNFetchBlob;
  const [screenType, setScreenType] = useState(
    Orientation.getInitialOrientation(),
  );
  const [fullScreen, SetFullScreen] = useState(false);
  const [activePdf, setActivePdf] = useState(
    route.params.data.filter(pdf => pdf.id == route.params.active)[0],
  );
  const [pdfIndex, setPdfIndex] = useState(
    route.params.data.findIndex(pdf => pdf.id == route.params.active),
  );
  const [schemaExist, setSchemaExist] = useState(false);
  useEffect(() => {
    console.log(route.params);
  }, []);
  const checkShemaExist = async () => {
    const res = await AsyncStorage.getItem('ids');
    if (JSON.parse(res) !== null) {
      let favList = JSON.parse(res);
      console.log(activePdf.id);
      setSchemaExist(() => favList.includes(activePdf.id));
    }
  };
  //N.B the current value of useState is accessible in useEffect
  useEffect(() => {
    //check if the active schéma exist in favlist
    checkShemaExist();
  }, [activePdf]);
  useEffect(() => {
    setActivePdf(() => route.params.data[pdfIndex]);
    pdfIndex == route.params.data.length - 1
      ? setLastPdf(true)
      : setLastPdf(false);
    pdfIndex == 0 ? setFirstPdf(true) : setFirstPdf(false);

    console.log(activePdf);
    console.log(pdfIndex);
  }, [pdfIndex]);
  const handleActivePdf = next => {
    next ? setPdfIndex(prev => prev + 1) : setPdfIndex(prev => prev - 1);
  };
  const rotateScreen = () => {
    if (screenType === 'PORTRAIT') {
      Orientation.lockToLandscape();
      setScreenType('LANDSCAPE');
    } else {
      Orientation.lockToPortrait();
      setScreenType('PORTRAIT');
    }
  };
  const downloadFile = async dayFinish => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage permissin required',
          message: 'Storage permissin required',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let directory = fs.dirs.DCIMDir;
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            mime: 'application/pdf',
            path: `${directory}/Bimma EWD/${activePdf.name}.pdf`,
            description: 'Schema',
          },
        };
        config(options)
          .fetch('GET', `${DATA_URL}/${activePdf.url}`)
          .then(async res => {
            // decrement schemaLimit after successful download
            let numDown = await AsyncStorage.getItem('numDown');
            if (numDown != 'null') {
              numDown = parseInt(numDown) - 1;
            }
            let schemaLimit = dayFinish ? '34' : numDown.toString();
            await AsyncStorage.setItem('numDown', schemaLimit);
            let dateLastDown = Date.now().toString();
            await AsyncStorage.setItem('dateLastDown', dateLastDown);
            console.log('the file saved to', res.path());
          })
          .catch(err => console.log(err));
      }
    } catch (error) {
      executeAlert('error');
    }
  };
  const handleFileDownload = async () => {
    // await AsyncStorage.removeItem('dateLastDown');
    // await AsyncStorage.removeItem('numDown');
    // console.log(dateLastDown);
    let dateLastDown = await AsyncStorage.getItem('dateLastDown');
    let numDown = await AsyncStorage.getItem('numDown');

    if (
      dateLastDown != 'null' &&
      Date.now() < parseInt(dateLastDown) + 1440 * 60000
    ) {
      //under 24h! 1440
      if (parseInt(numDown) > 0) {
        console.log('numDown', numDown);
        await downloadFile(false);
      } else {
        executeAlert(
          'You got to the limit of downloading per day, try tomorrow.',
        );
      }
    } else {
      // 24h done!
      downloadFile(true);
    }
  };
  const printFile = dayFinish => {
    RNPrint.print({
      filePath: `${DATA_URL}/${activePdf.url}`,
    }).then(async res => {
      // decrement schemaLimit after successful print
      let numDown = await AsyncStorage.getItem('numDown');
      if (numDown != 'null') {
        numDown = parseInt(numDown) - 1;
      }
      let schemaLimit = dayFinish ? '34' : numDown.toString();
      await AsyncStorage.setItem('numDown', schemaLimit);
      let dateLastDown = Date.now().toString();
      await AsyncStorage.setItem('dateLastDown', dateLastDown);
      console.log(res);
    });
  };
  const handleFilePrint = async () => {
    // console.log(dateLastDown);
    let dateLastDown = await AsyncStorage.getItem('dateLastDown');
    let numDown = await AsyncStorage.getItem('numDown');

    if (
      dateLastDown != 'null' &&
      Date.now() < parseInt(dateLastDown) + 1440 * 60000
    ) {
      //under 24h! 1440
      if (parseInt(numDown) > 0) {
        console.log('numDown', numDown);
        await printFile(false);
      } else {
        executeAlert(
          'You got to the limit of printing per day, try tomorrow.',
        );
      }
    } else {
      // 24h done!
      printFile(true);
    }
  };
  const handleBookmark = async () => {
    try {
      let favList = [];
      const res = await AsyncStorage.getItem('ids');
      if (JSON.parse(res) === null) {
        console.log('if');
        await AsyncStorage.setItem('ids', JSON.stringify([activePdf.id]));
        executeAlert('Bookmark added!');
      } else {
        console.log('else');
        favList = [...JSON.parse(res)];
        let exist = await favList.includes(activePdf.id);
        if (exist) {
          console.log('exist');
          favList = favList.filter(e => e != activePdf.id);
          await AsyncStorage.setItem('ids', JSON.stringify(favList));
          executeAlert('Bookmark removed!');
        } else {
          console.log('not exist');
          favList = [...JSON.parse(res), activePdf.id];
          console.log(favList);
          await AsyncStorage.setItem('ids', JSON.stringify(favList));
          executeAlert('Bookmark added!');
        }
      }
      checkShemaExist();
      const res2 = await AsyncStorage.getItem('ids');
      console.log('res2', res2);
    } catch (error) {
      console.log(error);
    }
  };
  const executeAlert = text => {
    setAlert(() => ({
      state: true,
      text,
    }));

    setTimeout(() => {
      setAlert(() => ({
        state: false,
        text: '',
      }));
    }, 2000);
  };
  return (
    <View style={tw('flex-1 w-full relative flex justify-between')}>
      {!fullScreen && (
        <View
          style={tw(
            'bg-gray-200 rounded p-1 flex-row justify-center items-center',
          )}>
          <Text style={tw('text-gray-500')}>{activePdf.name}</Text>
        </View>
      )}
      <Pdf
        source={{uri: `${DATA_URL}/${activePdf.url}`}}
        onLoadComplete={(numberOfPages, path, {width, height}) => {
          if (height < 200) {
            setPdfScale(12);
          } else if (height < 400 && height > 200) {
            setPdfScale(6);
          } else {
            setPdfScale(3);
          }
        }}
        horizontal
        fitPolicy={0}
        maxScale={pdfScale}
        style={tw('w-full flex-1')}
        // spacing={0}
        // fitWidth={true}
      />
      {/* Pdf bar */}
      {!fullScreen && (
        <View style={tw('w-full flex-row items-start')}>
          <View
            style={tw(
              'py-2 bg-gray-300 rounded w-full flex-1 flex-row justify-between items-center px-4',
            )}>
            <TouchableOpacity
              onPress={() => !firstPdf && handleActivePdf(false)}>
              <Icon
                size={24}
                color={firstPdf ? 'gray' : '#1f2937'}
                name="navigate-before"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFileDownload}>
              <Icon size={24} color="#1f2937" name="file-download" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBookmark}>
              <Icon
                size={24}
                color={schemaExist ? '#38bdf8' : '#1f2937'}
                name={schemaExist ? 'bookmark' : 'bookmark-outline'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => SetFullScreen(prev => !prev)}>
              <Icon size={28} color="#1f2937" name="fullscreen" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => rotateScreen()}>
              <MCIcon size={20} color="#1f2937" name="phone-rotate-landscape" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFilePrint}>
              <Icon size={24} color="#1f2937" name="print" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => !lastPdf && handleActivePdf(true)}>
              <Icon
                size={24}
                color={lastPdf ? 'gray' : '#1f2937'}
                name="navigate-next"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {fullScreen && (
        <View style={tw('absolute bottom-2 right-2 bg-black rounded-full p-1')}>
          <TouchableOpacity onPress={() => SetFullScreen(prev => !prev)}>
            <Icon size={25} color="white" name="fullscreen-exit" />
          </TouchableOpacity>
        </View>
      )}
      {alert.state && (
        <View
          style={tw(
            'absolute bottom-16 w-full flex-row justify-center items-center',
          )}>
          <View style={[styles.maxWidth, tw('bg-gray-200 p-4 rounded-3xl')]}>
            <Text style={tw('text-gray-800 text-sm')}>{alert.text}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  maxWidth: {
    maxWidth: '70%',
  },
});

export default PdfScreen;
