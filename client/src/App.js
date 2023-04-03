import './App.css';
import { UserStateProvider } from './StateProvider'
import userReducer, { userInitialState } from './reducer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Route from './Route'
const theme = createTheme();

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <UserStateProvider initialState={userInitialState} reducer={userReducer}>
        <Route />
      </UserStateProvider>
      </ThemeProvider>
      
    </div>
  );
}

export default App;
