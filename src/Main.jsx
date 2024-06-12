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
import Tasks from './pages/Tasks.jsx';
import Projects from './pages/Projects.jsx';
import { itIT } from '@mui/x-date-pickers/locales';

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <LoginMiddleware>
        <Navbar />
        <Login />
      </LoginMiddleware>,
  },
  {
    path: "/user",
    element:
      <AuthMiddleware >
        <Navbar />
        <HomePage />
      </AuthMiddleware>
  },
  {
    path: "/task",
    element:
      <AuthMiddleware >
        <Navbar />
        <Tasks />
      </AuthMiddleware>
  },
  {
    path: "/projects",
    element:
      <AuthMiddleware >
        <Navbar />
        <Projects />
      </AuthMiddleware>
  },
  {
    path: "*",

    element:
      <AuthMiddleware>
        <Navbar />
        <NotFoundPage />
      </AuthMiddleware>,
  }
]);


const ThemedApp = () => {
  const { theme } = useContext(ThemeContext);

  const muiTheme = createTheme(
    {
      palette: {
        mode: theme,
        background: {
          default: theme === 'dark' ? '#121212' : '#d3d3d3',
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
            }
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              backgroundColor: theme === 'dark' ? '#003892' : '#001e3c',
              color: 'white'
            }
          }
        },
        MuiDataGrid: {
          styleOverrides: {
            root: {
              backgroundColor: theme === 'dark' ? null : '#001e3c',
              color: 'white'
            },
          }
        }
      },
      typography: {
        "fontFamily": "Cascadia Code",
      }
    },
    itIT
  );

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
