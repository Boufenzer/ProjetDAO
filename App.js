import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Grid from './components/Grid'; 

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Grid />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
