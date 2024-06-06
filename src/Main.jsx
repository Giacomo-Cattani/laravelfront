import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom' // Import the createBrowserRouter function from 'react-router-dom'
import { ThemeProvider, Container, createTheme, CssBaseline, Box } from '@mui/material';
import './index.css'
import { ThemeContext, ThemeContextProvider } from './context/ThemeContext';
import { AuthContext, AuthContextProvider } from './context/AuthContext';
import { useContext } from 'react';
import Navbar from './components/Navbar.jsx';
import NotFoundPage from './pages/NotFound.jsx';
import Login from './pages/Login.jsx';
import AuthMiddleware from './middleware/AuthMiddleware.jsx';
import LoginMiddleware from './middleware/LoginMiddleware.jsx';
import HomePage from './pages/HomePage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <LoginMiddleware>
        {/* <Container fixed sx={{ pt: 7, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}> */}
        <Navbar />
        <Login />
        {/* </Container> */}
      </LoginMiddleware>,
  },
  {
    path: "/user",
    element:
      <AuthMiddleware >
        {/* <Container fixed sx={{ pt: 7, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}> */}
        <Navbar />
        <HomePage />
        {/* </Container> */}
      </AuthMiddleware>,
  },
  {
    path: "*",
    element:
      <AuthMiddleware>
        {/* <Container fixed sx={{ pt: 7, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}> */}
        <Navbar />
        <NotFoundPage />
        {/* </Container> */}
      </AuthMiddleware>,
  }
]);

const ThemedApp = () => {
  const { theme } = useContext(ThemeContext);

  const muiTheme = createTheme({
    palette: {
      mode: theme,
      background: {
        default: theme === 'dark' ? '#121212' : 'lightcoral',
      }
    },
    components: {
      MuiMenu: {
        styleOverrides: {
          list: {
            '&[role="menu"]': {
              backgroundColor: theme === 'dark' ? '#003892' : '#001e3c',
              minWidth: '105px',
            },
          },
        },
      },
    },
    typography: {
      "fontFamily": "Cascadia Code",
    }
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </ThemeProvider>
  );
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeContextProvider>
    <ThemedApp />
  </ThemeContextProvider>,
)
