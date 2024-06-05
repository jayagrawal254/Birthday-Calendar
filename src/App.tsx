import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { useState } from 'react';
import { Box, Button } from '@mui/material';

interface Birthday {
  name: string;
  selectedDate: Dayjs | null;
}

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [favorites, setFavorites] = useState<Birthday[]>([]);

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setFavorites([])
    fetchBirthdays(date);
  };

  React.useEffect(() => {
    handleDateChange(selectedDate)
  }, [])

  React.useEffect(() => {
    handleDateChange(selectedDate)
  }, [selectedDate])

  const fetchBirthdays = async (date: Dayjs | null) => {
    if (date) {
      const response = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${date.month()}/${date.date()}`);
      const data = await response.json();
      const parsedBirthdays = data.births.map((birth: any) => ({
        name: birth.text,
        date: new Date(birth.year, date.month(), date.date()),
        selectedDate: date,
      }));
      setBirthdays(parsedBirthdays);
    }
  };

  const addToFavorites = (birthday: Birthday) => {
    const updatedBirthday = {
      name:birthday.name,
      selectedDate: selectedDate,
    };
    setFavorites([...favorites, updatedBirthday]);
  };
  

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: '70%',
          margin: 'auto',
          display: 'flex',
          justifyContent: 'center',
          height: '300px', // Adjust the height as needed
        }}
      >
        <div>
          <h1>Birthdays Calendar</h1>
          <DemoContainer
            components={[
              'StaticDatePicker'
            ]}
          >
            <DemoItem>
              <StaticDatePicker
                defaultValue={dayjs(selectedDate)}
                onChange={handleDateChange}
                displayStaticWrapperAs="desktop"
              />
            </DemoItem>
          </DemoContainer>
          <h2>Birthdays on </h2>
          <Box
            sx={{
              height: '300px',
              overflowY: 'auto',
            }}
          >
            <ul>
              {birthdays.map((birthday, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '16px',
                  }}
                >
                  <strong>{index+1}. {birthday.name}</strong>
                  <Button variant="contained" onClick={() => addToFavorites(birthday)}>
                    Add to Favorites
                  </Button>
                </li>
              ))}
            </ul>
          </Box>
          <h2>Favorite Birthdays</h2>
          <Box
            sx={{
              height: '300px',
              overflowY: 'auto',
            }}
          >
            <ul>
              {favorites.map((birthday, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '16px',
                  }}
                >
                  <strong>{index+1}. {birthday.name}</strong>
                </li>
              ))}
            </ul>
          </Box>
        </div>
      </Box>
    </LocalizationProvider>
  );
};

export default App;
