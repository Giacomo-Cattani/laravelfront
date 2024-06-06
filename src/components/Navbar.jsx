import { useContext, useEffect, useState } from 'react';
import { FormControlLabel, styled, Switch, Button, AppBar, Container, Grid, Toolbar, IconButton, Typography, Menu, Avatar, Tooltip, MenuItem } from '@mui/material';
import { Adb as AdbIcon, Menu as MenuIcon, Brightness7 as Brightness7Icon, Brightness4 as Brightness4Icon } from '@mui/icons-material';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import confAxiox from '../axios/confAxios';
import user from '../assets/user.svg';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import { CustomAlert } from './CustomAlert';

function Navbar() {
    const { theme, setTheme } = useContext(ThemeContext);
    const { token, setToken } = useContext(AuthContext);
    const location = useLocation();

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const [alert, setAlert] = useState({ message: null, severity: null, handleClose: () => { } })
    const handleAlert = (message, severity) => {
        setAlert({ message: message, severity: severity, handleClose: () => setAlert({ message: null, severity: null, handleClose: () => { } }) })
    }

    const navigate = useNavigate();
    const pages = ['Products', 'Pricing', 'Blog'];
    const settings = ['Storico', 'Logout'];

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const delay = ms => new Promise(res => setTimeout(res, ms));

    function removeLocalStorageItem(key) {
        return new Promise((resolve) => {
            localStorage.removeItem(key);
            resolve();
        });
    }

    const handleProfile = (e) => {
        if (e === 'Logout') {
            confAxiox.post('/auth/logout').
                then(async (response) => {
                    handleAlert("Logged out successfully!", "success");
                    await delay(1500);
                    await removeLocalStorageItem('token').then(() => {
                        setToken(null);
                        navigate('/', { replace: true });
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    const MaterialUISwitch = styled(Switch)(({ theme }) => ({
        width: 62,
        height: 34,
        padding: 7,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            paddingLeft: 1,
            transform: 'translateX(6px)',
            '&.Mui-checked': {
                color: '#fff',
                transform: 'translateX(22px)',
                '& .MuiSwitch-thumb:before': {
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                        '#fff',
                    )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
                },
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
                },
            },
        },
        '& .MuiSwitch-thumb': {
            backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
            width: 32,
            height: 32,
            '&::before': {
                content: "''",
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
            },
        },
        '& .MuiSwitch-track': {
            opacity: 1,
            backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            borderRadius: 20 / 2,
        },
    }));

    return (
        <>
            <CustomAlert
                message={alert.message}
                severity={alert.severity}
                handleClose={alert.handleClose}
            />
            <AppBar position="fixed" style={{
                width: '100%', backgroundColor: theme === 'dark' ? 'black' : 'white',
                color: theme === 'dark' ? 'white' : '#001e3c'
            }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Grid container alignItems="center" style={{ display: 'contents' }}>
                            <Grid item xs={6} sm={3} onClick={() => {
                                if (location.pathname !== '/user')
                                    navigate('/user');
                            }} sx={{
                                display: { xs: 'none', md: 'flex' },

                                alignItems: 'center',
                            }}>
                                <AdbIcon sx={{
                                    fontSize: '3rem', mr: 1,
                                    '&:hover': {
                                        cursor: 'pointer',
                                        textShadow: '5px 5px 5px darkslategray',
                                    }
                                }} />
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="a"
                                    sx={{
                                        fontFamily: 'Cascadia Code',
                                        fontSize: '2rem',
                                        fontWeight: 700,
                                        color: theme === 'dark' ? 'white' : '#001e3c',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            color: theme === 'dark' ? 'white' : '#001e3c',
                                            cursor: 'pointer',
                                            // textShadow: '5px 5px 5px darkslategray',
                                        },
                                    }}
                                >
                                    JOB TASK
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={3} sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'left' }}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color={theme === 'dark' ? 'white' : '#001e3c'}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{
                                        display: { xs: 'block', md: 'none' },
                                    }}
                                >
                                    {pages.map((page) => (
                                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                                            <Typography color={'white'} textAlign="center">{page}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Grid>

                            <Grid item sm={6} onClick={() => {
                                if (location.pathname !== '/user')
                                    navigate('/user');
                            }} sx={{
                                display: { xs: 'flex', md: 'none' },
                                pr: { xs: 3, sm: 10 },
                                justifyContent: 'center',
                                alignItems: 'center',
                                '&:hover': {
                                    cursor: 'pointer',
                                    // textShadow: '5px 5px 5px darkslategray',
                                }
                            }}>
                                <AdbIcon sx={{ fontSize: '3rem', mr: 1, }} />
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="a"
                                    sx={{
                                        fontFamily: 'Cascadia Code',
                                        fontSize: '2rem',
                                        fontWeight: 700,
                                        color: theme === 'dark' ? 'white' : '#001e3c',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            color: theme === 'dark' ? 'white' : '#001e3c',
                                        }
                                    }}
                                >
                                    JOB TASK
                                </Typography>
                            </Grid>

                            <Grid item sm={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'start' }}>
                                {pages.map((page) => (
                                    <Button
                                        key={page}
                                        onClick={handleCloseNavMenu}
                                        sx={{
                                            my: 2,
                                            color: theme === 'dark' ? 'white' : '#001e3c',
                                            display: 'block'
                                        }}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </Grid>

                            <Grid item xs={6} sm={3} sx={{ display: 'flex', justifyContent: 'end' }}>
                                <FormControlLabel sx={{ mr: token === null ? '0px' : '' }}
                                    control={<MaterialUISwitch sx={{ m: 1 }} checked={theme === 'dark' ? true : false} onChange={toggleTheme} />}
                                />

                                {token !== null ?
                                    <>
                                        <Tooltip title="Open settings">
                                            {/* <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt="Remy Sharp" src={user} />
                                        </IconButton> */}
                                            <Button onClick={handleOpenUserMenu} sx={{
                                                minWidth: '105px', px: 1.5, borderRadius: 5, fontFamily: 'Cascadia Code', backgroundColor: theme === 'dark' ? '#003892' : '#001e3c',
                                                color: 'white',
                                                fontSize: 15, textTransform: 'none'
                                            }} disableRipple variant="contained" startIcon={<Avatar alt="Remy Sharp" src={user} />}>
                                                Name
                                            </Button>
                                        </Tooltip>
                                        <Menu
                                            sx={{ mt: '47px', ml: '5px' }}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={handleCloseUserMenu}
                                        >
                                            {settings.map((setting) => (
                                                <MenuItem key={setting} onClick={() => { handleProfile(setting); handleCloseUserMenu(); }} sx={{ pr: 2 }}>
                                                    {setting === 'Logout' ? <LogoutIcon style={{ color: 'white' }} sx={{ pr: 1 }} /> : <HistoryIcon style={{ color: 'white' }} sx={{ pr: 1 }} />}
                                                    <Typography sx={{ fontFamily: 'Cascadia Code', fontSize: 15, color: 'white' }} textAlign="center" >{setting}</Typography>
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </> : null}
                            </Grid>
                        </Grid>
                    </Toolbar>
                </Container>
            </AppBar >
        </>
    );
}

export default Navbar;