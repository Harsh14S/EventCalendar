import {StyleSheet, Text, TouchableOpacity, Image, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import moment from 'moment';
import {RFValue} from 'react-native-responsive-fontsize';
import * as Colors from './colors';
import {IconLinks} from './icons/IconLinks';
import {CalendarContext} from '../global/CalendarContext';

export default CalendarDirection = () => {
  const {title, setTitle, time, setTime} = useContext(CalendarContext);
  const [_time, set_time] = useState(new Date(time));

  useEffect(() => {
    set_time(new Date(time));
    setTitle(moment(time).format('DD MMMM, YYYY'));
  }, [time]);

  function backPress() {
    setTime(_time.setDate(_time.getDate() - 1));
    // console.log('Back');
  }

  function nextPress() {
    setTime(_time.setDate(_time.getDate() + 1));
    // console.log('Next');
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.calBackForwBtn}
        onPress={() => backPress()}>
        <Image
          style={styles.calBackForwIcon}
          source={IconLinks.cal_back}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.controlCenterContainer}>
        <Text style={styles.selectedTimeTxt}>{title}</Text>
      </View>
      <TouchableOpacity
        style={styles.calBackForwBtn}
        onPress={() => nextPress()}>
        <Image
          style={styles.calBackForwIcon}
          source={IconLinks.cal_forward}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: RFValue(5),
    marginVertical: RFValue(5),
    zIndex: 5,
  },
  calBackForwBtn: {
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(12),
    borderRadius: RFValue(5),
  },
  calBackForwIcon: {
    height: RFValue(18),
    width: RFValue(18),
    tintColor: Colors.yellow,
  },
  controlCenterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTimeTxt: {
    fontSize: RFValue(18),
    fontWeight: '700',
    color: Colors.black,
  },
});
