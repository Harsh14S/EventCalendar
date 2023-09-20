import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {
  useCallback,
  useContext,
  useReducer,
  useRef,
  useState,
} from 'react';
import WeekView, {createFixedWeekDate} from 'react-native-week-view';
import {buildDateCycler, makeBuilder, eventsWithUpdate} from './debug-utils';
import {CalendarContext} from '../global/CalendarContext';
import moment from 'moment';

const buildEvent = makeBuilder();
const date = new Date();

const createDummyEvent = ({startDate, duration}) => {
  const endDate = new Date(startDate.getTime());
  endDate.setHours(startDate.getHours() + duration);
  return {
    description: 'New Event',
    color: 'lightblue',
    startDate,
    endDate,
  };
};

const eventsWithAddingNew = (prevEvents, payload) => {
  // Just an example reducer, you'll probably use your own
  const maxId = Math.max(...prevEvents.map(e => e.id));
  return [
    ...prevEvents,
    {
      ...payload,
      id: maxId + 1,
    },
  ];
};

// const sampleEvents = [
//   // Previous week
//   buildEvent(-24 * 7 - 5, 2, 'pink'),
//   buildEvent(-24 * 7 - 14, 3, 'lightblue'),

//   // This week
//   buildEvent(0, 2, 'blue'),
//   buildEvent(1, 3, 'red', {resolveOverlap: 'lane'}),
//   buildEvent(-18, 48 + 5, 'green', {eventKind: 'block'}),

//   buildEvent(0 - 24, 2, 'blue', {
//     allDay: true,
//     description: 'Long description is wrapped',
//   }),
//   buildEvent(1, 3, 'red', {allDay: true}),
//   buildEvent(-18, 48 + 5, 'green', {allDay: true}),

//   // Next week
//   buildEvent(24 * 7, 2, 'magenta'),
//   buildEvent(24 * 7 - 48, 3, 'green', {
//     style: {
//       borderWidth: 5,
//     },
//     disableDrag: true,
//     disablePress: true,
//     disableLongPress: true,
//   }),
//   buildEvent(24 * 7 + 6, 6, 'brown', {resolveOverlap: 'ignore'}),
//   buildEvent(24 * 7 + 13, 2, 'lightgreen', {
//     allDay: true,
//     description: 'Long description is wrapped',
//   }),
//   buildEvent(24 * 7 - 18, 48 + 5, 'lightgreen', {allDay: true}),

//   // Two more weeks
//   buildEvent(48 * 7, 2, 'pink'),
//   buildEvent(48 * 7 - 54, 4, 'green'),
//   buildEvent(48 * 7 + 1, 3, 'lightgreen', {allDay: true}),

//   // Many events
//   // ...Array.from({length: 1000}, (_, i) =>
//   //   buildEvent(24 + i * 5, 2, 'lightblue'),
//   // ),
// ];

// const sampleFixedEvents = [
//   {
//     id: 1,
//     title: 'Event 1',
//     startDate: createFixedWeekDate('Monday', 12),
//     endDate: createFixedWeekDate(1, 14),
//     color: 'blue',
//     description: 'This is a test description',
//   },
//   {
//     id: 2,
//     title: 'Event 2',
//     startDate: createFixedWeekDate('wed', 16),
//     endDate: createFixedWeekDate(3, 17, 30),
//     description: 'This is a test description',
//     color: 'red',
//   },
// ];

// const INITIAL_EVENTS = showFixedComponent ? sampleFixedEvents : sampleEvents;
const countries = [
  'USA',
  'Canada',
  'India',
  'Australia',
  'Germany',
  'France',
  'Japan',
];
const location = [
  'Loc 1',
  'Loc 2',
  'Loc 3',
  'Loc 4',
  'Loc 5',
  'Loc 6',
  'Loc 7',
];

// For debugging purposes
const showFixedComponent = false;

const MyRefreshComponent = ({style}) => (
  // eslint-disable-next-line react-native/no-inline-styles
  <Text style={[style, {fontSize: 20, color: 'black'}]}>Loading...</Text>
);

const DRAG_EVENT_CONFIG = null;

const EDIT_EVENT_CONFIG = {
  top: true,
  bottom: true,
  left: true,
  right: true,
};

const PAGE_START_AT = {
  weekday: 1,
};

const onDayPress = (date, formattedDate) => {
  console.log('Day: ', date, formattedDate);
};

const onSwipeNext = d => console.log('Swipe next', d.toDateString());
const onSwipePrev = d => console.log('Swipe prev', d.toDateString());
const onTimeScrolled = d => console.log('Time scrolled', d.toTimeString());

// Use this to manually debug navigate through dates
// eslint-disable-next-line no-unused-vars
const dateCycler = buildDateCycler([
  // Example:
  // selectedDate={new Date(2022, 7, 14)}
  // new Date(2022, 7, 20),
  // new Date(2022, 7, 18),
  // new Date(2022, 7, 2),
]);

export default EventCalendar = () => {
  const {title, setTitle, time, setTime} = useContext(CalendarContext);
  const componentRef = useRef(null);
  const [events, updateEvent] = useReducer(eventsWithAddingNew, []);
  const [editingEvent, setEditEvent] = useState(null);

  const onDragEvent = useCallback(
    (event, newStartDate, newEndDate) => {
      updateEvent({event, newStartDate, newEndDate});
    },
    [updateEvent],
  );

  const onEditEvent = useCallback(
    (event, newStartDate, newEndDate) => {
      // console.log('Editing: ', event.id, newStartDate, newEndDate);
      updateEvent({event, newStartDate, newEndDate});
    },
    [updateEvent],
  );

  const handleLongPressEvent = event => {
    if (editingEvent == null) {
      setEditEvent(event.id);
    } else {
      setEditEvent(null);
    }
  };

  const handlePressEvent = event => {
    if (editingEvent != null) {
      setEditEvent(null);
      return;
    }

    const {id, color, startDate, endDate, description} = event;
    // const country = getNext(startDate);
    Alert.alert(
      `Event press ${color} - ${id}`,
      `start: ${startDate}\nend: ${endDate}\nDescription: ${description}`,
      // `start: ${startDate}\nend: ${endDate}\nLocation: ${location}\nDescription: ${description}`,
    );
  };

  const handleGridLongPress = (event, startHour, date) => {
    if (editingEvent != null) {
      setEditEvent(null);
      return;
    }

    updateEvent(createDummyEvent({startDate: date, duration: 2}));
    Alert.alert(moment(date).format('HH:mm A DD, MMM-YYYY'));
  };

  const handlePressGrid = () => {
    if (editingEvent != null) {
      setEditEvent(null);
      return;
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // zero-based
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    // buildEvent(0, hour, 'yellow', {resolveOverlap: 'lane'});
    // buildEvent(1, 2, 'blue', {resolveOverlap: 'lane'});
    Alert.alert(`${year}-${month}-${day} ${hour}:${minutes}:${seconds}`);
  };

  const onMonthPress = useCallback((date, formattedDate) => {
    // // Debug navigating through dates:
    // if (componentRef && componentRef.current) {
    //   componentRef.current.goToDate(dateCycler.next());
    // }
    // console.log('Month: ', date, formattedDate);
  }, []);
  return (
    <View style={{flex: 1}}>
      <WeekView
        ref={componentRef}
        events={events}
        selectedDate={new Date()}
        numberOfDays={7}
        pageStartAt={PAGE_START_AT}
        onEventPress={handlePressEvent}
        onEventLongPress={handleLongPressEvent}
        onGridClick={handlePressGrid}
        onGridLongPress={handleGridLongPress}
        headerStyle={styles.header}
        headerTextStyle={styles.headerText}
        hourTextStyle={styles.hourText}
        eventContainerStyle={styles.eventContainer}
        gridColumnStyle={styles.gridColumn}
        gridRowStyle={styles.gridRow}
        // formatDateHeader=""
        // formatTimeLabel={''}
        hoursInDisplay={4}
        timeStep={60}
        // DayHeaderComponent={CustomeHeaderComponts}
        startHour={15}
        fixedHorizontally={showFixedComponent}
        showTitle={!showFixedComponent}
        // timesColumnWidth={0.2}
        showNowLine
        onDragEvent={onDragEvent}
        isRefreshing={false}
        RefreshComponent={MyRefreshComponent}
        onDayPress={onDayPress}
        allowScrollByDay={false}
        onMonthPress={onMonthPress}
        onTimeScrolled={onTimeScrolled}
        onSwipeNext={onSwipeNext}
        onSwipePrev={onSwipePrev}
        editingEvent={editingEvent}
        onEditEvent={onEditEvent}
        editEventConfig={EDIT_EVENT_CONFIG}
        dragEventConfig={DRAG_EVENT_CONFIG}
        runOnJS={false}
        //custom added
        customHeaderData={location}
        horizontalScrollEnabled={false}
        customDate={time}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
