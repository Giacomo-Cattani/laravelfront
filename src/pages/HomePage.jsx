import EmployeeView from '../components/EmployeeView';
import ManagerView from '../components/ManagerView';
import { useEffect, useState } from 'react';
import { Unstable_Grid2 as Grid } from '@mui/material';
import { CustomAlert } from '../components/CustomAlert';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

function HomePage() {
  const { data } = useContext(AuthContext);

  const [alert, setAlert] = useState({ message: null, severity: null, handleClose: () => { } })

  const handleAlert = (message, severity) => {
    setAlert({ message: message, severity: severity, handleClose: () => setAlert({ message: null, severity: null, handleClose: () => { } }) })
  }

  return (
    <Grid container direction={'row'} sx={{ width: '100%', margin: 'auto', px: 3, pt: 9, justifyContent: 'space-between' }} columnSpacing={5} >
      <CustomAlert
        message={alert.message}
        severity={alert.severity}
        handleClose={alert.handleClose}
      />
      {data.decodedToken?.role ? data.decodedToken.role === 'dipe' ? <EmployeeView handleAlert={handleAlert} /> : <ManagerView handleAlert={handleAlert} /> : null}
    </Grid >
  );
}

export default HomePage;

