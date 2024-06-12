import { useState, useEffect, useMemo } from 'react';
import confAxios from '../axios/confAxios';
import { Card, Button, CardActions, Typography, CardContent, Unstable_Grid2 as Grid } from '@mui/material';

import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from '@mui/material/TextField';
import { ThemeContext } from '../context/ThemeContext';

import { LineChart } from '@mui/x-charts/LineChart';

import InfoIcon from '@mui/icons-material/Info';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale'
import Autocomplete from '@mui/material/Autocomplete';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
import { useContext } from 'react';

function EmployeeView({ handleAlert }) {
    dayjs.extend(updateLocale)
    dayjs.updateLocale('en', {
        weekStart: 1,
    })

    const [data, setData] = useState('');
    const [hour, setHour] = useState('');

    const [project, setProject] = useState(null);
    const [client, setClient] = useState(null);
    const [location, setLocation] = useState(null);

    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [locations, setLocations] = useState([]);

    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [filteredClients, setFilteredClients] = useState(clients);
    const [datas, setDatas] = useState([])

    const [activity, setActivity] = useState([]);

    const [loading, setLoading] = useState(true);
    const { theme } = useContext(ThemeContext);

    const transformDataHours = (input) => {
        const result = [];
        const dataMap = {};
        const allUsers = new Set();

        // Find the current date
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();

        var curr = new Date; // get current date
        var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6

        // Calculate the start and end dates of the week
        const firstDayOfWeek = new Date(curr.setDate(first));
        const lastDayOfWeek = new Date(curr.setDate(last));

        // Generate all dates of the current week
        const allDates = [];
        for (let d = firstDayOfWeek; d <= lastDayOfWeek; d.setDate(d.getDate() + 1)) {
            const dateString = d.toISOString().split('T')[0];
            allDates.push(dateString);
            dataMap[dateString] = 0;
        }

        // First pass: Build dataMap and gather all unique id_user values
        input.forEach(item => {
            if (!dataMap[item.data]) {
                dataMap[item.data] = 0;
            }
            dataMap[item.data] = item.work_time;
            allUsers.add(item.id_user);
        });

        // Second pass: Ensure all id_user entries are present in each date with default value 0
        Object.keys(dataMap).forEach(date => {
            allUsers.forEach(user => {
                if (!dataMap[date]) {
                    dataMap[date] = 0;
                }
            });
        });

        // Build the final result array
        for (const [date, workTimes] of Object.entries(dataMap)) {
            result.push({
                data: date,
                work_time: workTimes
            });
        }

        return result;
    };

    const fetchLastProjects = async () => {
        await confAxios.get('/activity/proj')
            .then(res => {
                setActivity([])
                res.data.forEach(element => {
                    setActivity(prev => [...prev, element])
                });
            }).catch(err => {
                console.log(err)
            })
    }


    useEffect(() => {
        const fetchProjects = async () => {
            await confAxios.get('/project/projects')
                .then(res => {
                    res.data.forEach(element => {
                        const string = element.name + " (" + element.cod_project + ")"
                        setProjects(prev => [...prev, { label: string, id: element.id, id_client: element.id_client }])
                    });
                }).catch(err => {
                    console.log(err)
                })
        }

        const fetchClients = async () => {
            await confAxios.get('/client/clients')
                .then(res => {
                    res.data.forEach(element => {
                        const string = element.name + " (" + element.cod_client + ")"
                        setClients(prev => [...prev, { label: string, id: element.id }])
                    });
                }).catch(err => {
                    console.log(err)
                })
        }

        const fetchLocations = async () => {
            await confAxios.get('/location/locations')
                .then(res => {
                    res.data.forEach(element => {
                        const string = element.name + " (" + element.cod_location + ")"
                        setLocations(prev => [...prev, { label: string, id: element.id }])
                    });
                }).catch(err => {
                    console.log(err)
                })
        }

        const fetchHours = async () => {
            await confAxios.get('/activity/hours')
                .then(res => {
                    setDatas([])
                    const result = transformDataHours(res.data)
                    result.forEach(element => {
                        const workTime = Number(element.work_time);
                        setDatas(prev => [...prev, workTime.toFixed(2)]);
                    })

                    if (result.length < 7) {
                        const length = res.data.length
                        for (let i = 0; i < 7 - length; i++) {
                            setDatas(prev => [...prev, 0])
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
        }

        async function fetchAll() {
            setDatas([]),
                setProjects([]),
                setClients([]),
                setLocations([]),
                setActivity([]),

                await Promise.all([fetchHours(), fetchProjects(), fetchClients(), fetchLocations(), fetchLastProjects()]).then(() => {
                    setLoading(false)
                })
        }
        fetchAll()
    }, [])

    const [note, setNote] = useState('');
    function convertH2M(timeInHour) {
        var timeParts = timeInHour.split(":");
        return Number(timeParts[0]) * 60 + Number(timeParts[1]);
    }

    function convertM2H(timeInMinute) {
        const hours = Math.floor(timeInMinute / 60);
        const minutes = timeInMinute % 60;
        return `${hours}.${minutes}`;
    }

    const handleInsert = (e) => {

        if (data && hour && location && project && client) {
            const convertedHour = convertH2M(hour.format('HH:mm'))
            confAxios.post('/activity/insert', {
                'cod_task': project.label.split(' ')[1].slice(1, -1),
                'id_user': 1,
                'data': data.format('YYYY-MM-DD'),
                'work_time': convertedHour,
                'id_location': location.id,
                'id_project': project.id,
                'id_client': client.id,
                'note': note
            }).then(res => {
                handleAlert('Attività inserita con successo', 'success')
                setDatas(prev => {
                    let index = data.get('d') - 1
                    if (data.get('d') === 0)
                        index = 6

                    prev[index] = (Number(prev[index]) + convertedHour).toFixed(2)
                    return [...prev]
                });
                fetchLastProjects()
                setData('')
                setHour('')
                setLocation(null)
                setProject(null)
                setClient(null)
                setNote('')
            }).catch(err => {
                console.log(err)
                handleAlert('Errore durante l\'inserimento', 'error')
            })
        } else {
            handleAlert('Compila tutti i campi', 'error')
        }
    }

    const screenTheme = useTheme();
    const isSmallScreen = useMediaQuery(screenTheme.breakpoints.down('md'));

    const handleClientChange = (event, newValue) => {
        setClient(newValue);
        if (newValue) {
            const newFilteredProjects = projects.filter(project => project.id_client === newValue.id);
            setFilteredProjects(newFilteredProjects);
        } else {
            setFilteredProjects(projects);
        }
    };

    const handleProjectChange = (event, newValue) => {
        setProject(newValue);
        if (newValue) {
            const newFilteredClients = clients.filter(client => client.id === newValue.id_client);
            setFilteredClients(newFilteredClients);
            setClient(newFilteredClients[0]);
        } else {
            setFilteredClients(clients);
        }
    };


    useEffect(() => {
        setFilteredProjects(projects);
        setFilteredClients(clients);
    }, [projects, clients]);



    return (
        <>
            <Grid xs={isSmallScreen ? 12 : 5} sx={{ pb: isSmallScreen ? 3 : 0 }}>
                <Card sx={{ p: 2, minWidth: '380px' }}>
                    <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                        <Typography variant="h5" component="div" fontWeight={700} fontFamily={'Cascadia Code'}>
                            Form Attività
                        </Typography>
                        <Button sx={{
                            fontFamily: 'Cascadia Code', textTransform: 'none', backgroundColor: theme === 'dark' ? '#003892' : '#001e3c',
                            color: 'white', '&:hover': { backgroundColor: '#00ab66' }
                        }} size="medium" onClick={handleInsert}>Save</Button>
                    </CardActions>
                    <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Grid container columnSpacing={4} rowSpacing={1.5}>
                            <Grid xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoItem label={"Data"}>
                                        <DatePicker
                                            maxDate={dayjs(new Date())}
                                            format="DD/MM/YYYY"
                                            value={data ? dayjs(data) : null}
                                            onChange={(e) => {
                                                setData(e)
                                            }} />
                                    </DemoItem>
                                </LocalizationProvider>
                            </Grid>
                            <Grid xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoItem label={"Ore Lavorate"}>
                                        <TimePicker
                                            clearable
                                            value={hour ? hour : null}
                                            onChange={(e) => {
                                                setHour(e)
                                            }}
                                            ampm={false}
                                            views={['hours', 'minutes']}
                                            format="HH:mm" />
                                    </DemoItem>
                                </LocalizationProvider>
                            </Grid>
                            <Grid xs={12} >
                                <DemoItem label={"Locazione"}>
                                    <Autocomplete
                                        value={location}
                                        onChange={(event, newValue) => {
                                            setLocation(newValue);
                                        }}
                                        disablePortal
                                        id="locazione"
                                        options={locations}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </DemoItem>
                            </Grid>
                            <Grid xs={6}>
                                <DemoItem label={"Progetto"}>
                                    <Autocomplete
                                        value={project}
                                        onChange={handleProjectChange}
                                        disablePortal
                                        id="proiezione"
                                        options={filteredProjects}
                                        getOptionLabel={(option) => option.label || null}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </DemoItem>
                            </Grid>
                            <Grid xs={6}>
                                <DemoItem label={"Cliente"}>
                                    <Autocomplete
                                        value={client}
                                        onChange={handleClientChange}
                                        disablePortal
                                        id="cliente"
                                        options={filteredClients}
                                        getOptionLabel={(option) => option.label || null}
                                        renderInput={(params) => useMemo(() => <TextField {...params} />)}
                                    />
                                </DemoItem>
                            </Grid>
                            <Grid xs={12}>
                                <DemoItem label={"Note"}>
                                    <TextField
                                        value={note}
                                        fullWidth
                                        placeholder="Note aggiuntive (facoltative)"
                                        multiline
                                        rows={4}
                                        onInput={(e) => {
                                            setNote(e.target.value)
                                        }}
                                    />
                                </DemoItem>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid xs={isSmallScreen ? 12 : 7} container direction={'column'} alignItems={'center'} spacing={3}>
                <Grid xs={12} flexGrow={1}>
                    <Card sx={{ minWidth: '380px' }}>
                        <CardActions sx={{ px: 2, pt: 2, justifyContent: 'space-between' }}>
                            <Typography variant="h5" component="div" fontWeight={700} fontFamily={'Cascadia Code'}>
                                Ore Ultima Settimana
                            </Typography>
                            <Button sx={{
                                fontFamily: 'Cascadia Code', textTransform: 'none', backgroundColor: theme === 'dark' ? '#003892' : '#001e3c',
                                color: 'white', '&:hover': { backgroundColor: '#ffa500 ' }
                            }} size="medium"
                                onClick={() => handleAlert('Grafico rappresentante le ore lavorate durante la settimana', 'info')}
                            >
                                <InfoIcon /></Button>
                        </CardActions>
                        <CardContent sx={{ pb: '0px' }}>
                            <LineChart
                                sx={{
                                    '& .MuiLineElement-root': {
                                        strokeWidth: 5,
                                    },
                                }}
                                yAxis={[{ valueFormatter: (value) => `${convertM2H(value)}h`, scaleType: 'linear', tickCount: 5 }]}
                                xAxis={[{
                                    dataKey: 'data',
                                    scaleType: 'point',
                                    valueFormatter: (value, context) => value,
                                    data: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
                                }]}
                                series={[
                                    {
                                        data: datas ? datas : [],
                                        label: 'Ore',
                                        valueFormatter: (value) => `${convertM2H(value)}h`,
                                    },
                                ]}
                                height={200}
                                margin={{ top: 20, right: 20, bottom: 20, left: 50 }}
                                grid={{ vertical: true, horizontal: true }}
                                colors={[theme === 'dark' ? '#d3a121' : '#c90076']}
                                loading={loading}
                                slotProps={{
                                    // Custom loading message
                                    loadingOverlay: { message: 'Dati in caricamento...' },
                                    // Custom message for empty chart
                                    noDataOverlay: { message: 'Nessun valore disponibile' },
                                    legend: {
                                        hidden: true,
                                    }
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} flexGrow={1} sx={{ pt: 1.5 }}>
                    <Card sx={{ minWidth: '380px' }}>
                        <CardActions sx={{ px: 2, pt: 2, justifyContent: 'space-between' }}>
                            <Typography variant="h5" component="div" fontWeight={700} fontFamily={'Cascadia Code'}>
                                Attività Recenti
                            </Typography>
                            <Button sx={{
                                fontFamily: 'Cascadia Code', textTransform: 'none', backgroundColor: theme === 'dark' ? '#003892' : '#001e3c',
                                color: 'white', '&:hover': { backgroundColor: '#ffa500 ' }
                            }} size="medium" onClick={() => handleAlert('Lista delle attività recenti', 'info')}>
                                <InfoIcon /></Button>
                        </CardActions>
                        <CardContent sx={{ pb: '0px' }}>
                            <List sx={{ width: '100%', pb: '0px' }}>
                                {loading ?
                                    <ListItem sx={{ textAlign: 'center', pb: '0px' }}>
                                        <ListItemText
                                            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                                            primary={
                                                <Typography
                                                    component="span"
                                                    sx={{ textAlign: 'start' }}
                                                >
                                                    Caricamento...
                                                </Typography>
                                            }
                                        />
                                    </ListItem >
                                    : activity.length === 0 ?
                                        <ListItem sx={{ textAlign: 'center', pb: '0px' }}>
                                            <ListItemText
                                                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                                                primary={
                                                    <Typography
                                                        component="span"
                                                        sx={{ textAlign: 'start' }}
                                                    >
                                                        Nessuna attività recente
                                                    </Typography>
                                                }
                                            />
                                        </ListItem >
                                        : activity.map((item, index) => {

                                            return (
                                                <>
                                                    {index !== 0 &&
                                                        <Divider key={index} variant="inset" component="li" sx={{ margin: 'auto' }} />
                                                    }
                                                    <ListItem key={index} sx={{ textAlign: 'center', pb: '0px' }}>
                                                        <ListItemText
                                                            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                                                            primary={
                                                                <Typography
                                                                    component="span"
                                                                    sx={{ textAlign: 'start' }}
                                                                >
                                                                    {item.name}[{item.cod_project}] ({item.client_name})
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    sx={{ textAlign: 'end' }}
                                                                    color="text.primary"
                                                                >
                                                                    {convertM2H(item.total_work_time)} Ore
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem >
                                                </>
                                            )
                                        })}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

export default EmployeeView;