import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import { Unstable_Grid2 as Grid } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useState } from 'react'
import confAxios from '../axios/confAxios';

import { CustomAlert } from '../components/CustomAlert';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';


export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { token, setToken } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [alert, setAlert] = useState({ message: null, severity: null, handleClose: () => { } })
    const navigate = useNavigate();

    const handleAlert = (message, severity) => {
        setAlert({ message: message, severity: severity, handleClose: () => setAlert({ message: null, severity: null, handleClose: () => { } }) })
    }
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    const handleLogin = () => {
        if (email === '' || password === '') {
            handleAlert("Please fill in all fields!", "error");
        }
        else {
            confAxios.post('/auth/login', {
                email: email,
                password: password
            }).then(async (response) => {
                handleAlert("Logged in successfully!", "success");
                await delay(1500);
                const token = response.data.access_token;
                const user = response.data.user;
                await setLocalStorageItem('token', token).then(() => {
                    navigate('/user', { replace: true, state: { token: token, user: user } });
                });
            }).catch((error) => {
                handleAlert("Invalid email or password!", "error");
                console.log(error);
            });
        }
    };

    function setLocalStorageItem(key, value) {
        return new Promise((resolve) => {
            setToken(value);
            localStorage.setItem(key, value);
            resolve();
        });
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    return (
        <>
            <CustomAlert
                message={alert.message}
                severity={alert.severity}
                handleClose={alert.handleClose}
            />
            <Grid container direction={'column'} sx={{ width: '100%', margin: 'auto', p: 3, pt: 12, alignContent: 'center', justifyContent: 'space-around' }} >
                <Card sx={{ minWidth: '232px', maxWidth: '400px', width: '60%', textAlign: 'left', px: 2 }}>
                    <CardContent>
                        <Typography style={{ whiteSpace: 'nowrap' }} fontFamily={'Cascadia Code'} fontWeight={700} fontSize={'2.5rem'} gutterBottom>
                            Log in
                        </Typography>
                        <Typography fontFamily={'Cascadia Code'} fontWeight={200} variant='text' gutterBottom >
                            Email
                            <TextField sx={{ pb: 4 }} value={email} onChange={(e) => setEmail(e.target.value)} fullWidth id="email" type='email' variant="outlined" required />
                        </Typography>

                        <Typography fontFamily={'Cascadia Code'} fontWeight={200} variant='text' gutterBottom >
                            Password
                            <OutlinedInput onKeyDown={(e) => { if (e.key === 'Enter') { handleLogin() } }} value={password} onChange={(e) => setPassword(e.target.value)} fullWidth id="password" type={showPassword ? 'text' : 'password'} variant="outlined" required
                                endAdornment={
                                    <InputAdornment position="end" sx={{ pr: 1 }}>
                                        <IconButton onClick={handleTogglePassword} edge="end">
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </Typography>

                        <Box sx={{ pt: 4 }}>
                            <Button sx={{ height: 55, fontWeight: 600 }} size='large' fullWidth variant="contained"
                                onClick={handleLogin}>Log in</Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </>
    );
}