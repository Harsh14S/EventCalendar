import React, {useState, useReducer, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
  Text,
  ScrollView,
  View,
} from 'react-native';

import moment from 'moment';
import CalendarDirection from './src/CalendarDirection';
import EventCalendar from './src/EventCalendar';
import CalendarContextProvider from './global/CalendarContext';

const App = ({}) => {
  // Display Location Name

  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      <CalendarContextProvider>
        <SafeAreaView style={styles.container}>
          <CalendarDirection />
          <EventCalendar />
        </SafeAreaView>
      </CalendarContextProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#4286f4',
    borderColor: '#fff',
  },
  headerText: {
    color: 'white',
  },
  hourText: {
    color: 'black',
  },
  eventContainer: {
    borderWidth: 1,
    borderColor: 'black',
  },
  gridRow: {
    borderTopWidth: 1,
    borderColor: '#E9EDF0',
  },
  gridColumn: {
    borderLeftWidth: 1,
    borderColor: '#E9EDF0',
  },
});

export default App;
