import moment from 'moment';
import React, {useState, createContext} from 'react';

export const CalendarContext = createContext();

const currentDate = new Date();

const CalendarContextProvider = ({children}) => {
  const [title, setTitle] = useState(moment().format('MMMM, YYYY'));
  const [time, setTime] = useState(currentDate.getTime());
  const value = {
    title,
    setTitle,
    time,
    setTime,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContextProvider;
