import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import ProgressCircle from 'react-native-progress-circle'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default class App extends Component {
  state = { progress: 0 }

  progressCircle = (progress) => (
    <ProgressCircle
      percent={progress}
      radius={47}
      borderWidth={8}
      color="#3399FF"
      shadowColor="#999"
      bgColor="#fff"
      >
          <Text style={{ fontSize: 18 }}>{`${this.state.progress}%`}</Text>
      </ProgressCircle>
  )
  
  onPress = () => {
    const url = 'https://developer.apple.com/arkit/gallery/models/cupandsaucer/cupandsaucer.usdz';
    const localFile = `${RNFS.DocumentDirectoryPath}/${url.split('/').pop()}`;

    const options = {
      fromUrl: url,
      toFile: localFile,
      background: true, // Continue the download in the background after the app terminates (iOS only)
      discretionary: true, // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)
      cacheable: true, // Whether the download can be stored in the shared NSURLCache (iOS only, defaults to true)
      begin: (res) => {},
      progress: ({ bytesWritten, contentLength }) => {
        this.setState({ progress: Math.floor((bytesWritten / contentLength)*100) });
      }
   }

    RNFS.downloadFile(options).promise
    .then(() => FileViewer.open(localFile))
    .then(() => {})
    .catch(error => {});
  }
  render() {
    const { progress } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.title}>React-Native AR Quicklook</Text>
        <Text style={styles.instructions}>Press the AR icon to load a USDZ file.</Text>
        {progress > 0 && progress < 100 ? ( this.progressCircle(progress)): (
          <TouchableOpacity onPress={this.onPress}>
            <Image
              style={{width: 151, height: 151 }}
              source={require('./resources/usdzicon.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
