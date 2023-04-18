/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState, type PropsWithChildren} from 'react';
import DocumentPicker, {types} from 'react-native-document-picker';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Extractor} from 'react-native-pdf-extractor';
import {TextResult} from 'react-native-pdf-extractor/src/types';
import {extractDataFromCsfText} from './src/helpers';

const App = () => {
  const [file, setFile] = useState<string>('');

  useEffect(() => {
    if (!file) return;
    console.log('file on use effect: ', file);
    const extractTextFromPdf = async () => {
      const {text} = await Extractor.extract(file);
      // console.log({extracted: text});
      if (text) {
        console.log(JSON.stringify(extractDataFromCsfText(text), null, 3));
      }
    };
    extractTextFromPdf();
  }, [file]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          backgroundColor: 'steelblue',
          width: '80%',
          marginHorizontal: 'auto',
          alignSelf: 'center',
          padding: 10,
          // marginVertical: 'auto',
          marginTop: 20,
          borderRadius: 5,
        }}
        onPress={() => {
          DocumentPicker.pick({
            allowMultiSelection: false,
            type: [types.pdf],
          })
            .then(file => {
              console.log(file);
              if (!file || file.length === 0) return;
              setFile(file[0].uri);
            })
            .catch(error => console.log(error));
        }}>
        <Text style={{textAlign: 'center', fontSize: 25, color: '#fff'}}>
          Subir
        </Text>
      </TouchableOpacity>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 200,
            borderRightWidth: 5,
            borderRightColor: 'steelblue',
          }}></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
