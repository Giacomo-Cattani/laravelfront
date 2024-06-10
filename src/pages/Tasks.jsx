import { useContext, useEffect, useState, useMemo } from 'react';
import { Unstable_Grid2 as Grid, IconButton } from '@mui/material';
import confAxios from '../axios/confAxios';
import { DataGrid, GridToolbar, gridClasses, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { AuthContext } from '../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ThemeContext } from '../context/ThemeContext';
import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import updateLocale from 'dayjs/plugin/updateLocale'
import duration from 'dayjs/plugin/duration'
import { CustomAlert } from '../components/CustomAlert';

export default function Tasks() {
    dayjs.extend(updateLocale)
    dayjs.extend(duration)
    dayjs.updateLocale('en', {
        weekStart: 1,
    })

    const [rows, setRows] = useState([]);
    const { token, setToken, data } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext)

    const [modify, setModify] = useState(false)
    const [deleteTask, setDelete] = useState(false)
    const [openDel, setOpenDel] = useState(false)
    const [openMod, setOpenMod] = useState(false)

    const [selected, setSelected] = useState([])


    const [data2, setData] = useState('');
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
    const [note, setNote] = useState('');
    const [id, setId] = useState(null)

    const [activity, setActivity] = useState([]);

    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ message: null, severity: null, handleClose: () => { } })

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 150,
            type: 'number',
        },
        {
            ...GRID_CHECKBOX_SELECTION_COL_DEF,
            hideable: false,
            headerName: 'Checkbox selection',
        },
        {
            field: 'user',
            headerName: 'Utente',
            width: 150,
            valueGetter: (params, row) => {
                return `${row.user_name} ${row.user_surname}`
            },

        },
        {
            field: 'project',
            headerName: 'Progetto',
            width: 150,
            valueGetter: (params, row) => {
                return `${row.project_name} (${row.cod_project})`
            }
        },
        {
            field: 'cliente',
            headerName: 'Cliente',
            width: 150,
            valueGetter: (params, row) => {
                return `${row.client_name} (${row.cod_client})`
            }
        },
        {
            field: 'data',
            headerName: 'Data',
            width: 150,
            type: 'date',
            valueFormatter: (params, row) => {
                return new Date(row.data).toLocaleDateString()
            },
        },
        {
            field: 'work_time',
            headerName: 'Ore lavorate',
            type: 'number',
            align: 'left',
            headerAlign: 'left',
            width: 150,
            valueGetter: (params, row) => {
                const h = convertM2H(row.work_time)
                const hm = h.split('.')
                return h + " Ore"
            }
        },
        {
            field: 'location_name',
            headerName: 'Locazione',
            width: 150,
        },
        {
            field: 'note',
            headerName: 'Note',
            width: 300,
            renderCell: (params) => {
                <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', width: '100%' }}>
                    {params.value}
                </div>
            },
            flex: 1
        },
    ];

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


    const handleClientChange = (event, newValue) => {
        setClient(newValue);
        if (newValue) {
            const newFilteredProjects = projects.filter(project => project.id_client === newValue.id);
            setFilteredProjects(newFilteredProjects);
        } else {
            setFilteredProjects(projects);
        }
    };

    function convertH2M(timeInHour) {
        var timeParts = timeInHour.split(":");
        return Number(timeParts[0]) * 60 + Number(timeParts[1]);
    }

    const handleInsert = (e) => {

        if (id && data2 && hour && location && project && client) {
            const convertedHour = convertH2M(hour.format('HH:mm'))
            confAxios.post(`/activity/modify/${id}`, {
                'data': data2,
                'work_time': convertedHour,
                'id_location': location.id,
                'id_project': project.id,
                'note': note
            }).then(res => {
                handleAlert('Attività modificata con successo', 'success')
                setRows(prevRows => {
                    const index = prevRows.findIndex(row => row.id === id)
                    prevRows[index].data = data2
                    prevRows[index].work_time = convertedHour
                    prevRows[index].location_id = location.id
                    prevRows[index].location_name = location.label
                    prevRows[index].project_id = project.id
                    const proj = projects.find(p => p.id === project.id)
                    const projSplit = proj.label.split(" ")
                    prevRows[index].project_name = projSplit[0]
                    prevRows[index].cod_project = projSplit[1].replace('(', '').replace(')', '')
                    prevRows[index].client_id = client.id
                    const cli = clients.find(c => c.id === client.id)
                    const cliSplit = cli.label.split(" ")
                    prevRows[index].client_name = cliSplit[0]
                    prevRows[index].cod_client = cliSplit[1].replace('(', '').replace(')', '')
                    prevRows[index].note = note
                    return prevRows
                })
                setData('')
                setHour('')
                setLocation(null)
                setProject(null)
                setClient(null)
                setNote('')
                setId(null)
                setOpenMod(false)
            }).catch(err => {
                setOpenMod(false)
                handleAlert('Non puoi modificare questa Task', 'error')
            })
        } else {
            handleAlert('Compila tutti i campi', 'error')
        }
    }

    const remove = async (selected) => {
        selected.forEach(async (element) => {
            await confAxios.post(`/activity/delete/${element}`,)
                .then(res => {
                    setRows(prevRows => prevRows.filter(row => row.id !== element));
                    setSelected([])
                }).catch(err => {
                    handleAlert('Non puoi eliminare questa Task', 'error')
                    console.log(err)
                })
        })

    }

    const handleClose = () => {
        setOpenMod(!openMod)

    }

    useEffect(() => {
        const fetchTask = async () => {
            await confAxios.get('/activity/tasks')
                .then(res => {
                    setRows(res.data)
                }).catch(err => {
                    console.log(err)
                })
        }

        const fetchLocations = async () => {
            await confAxios.get('/location/locations')
                .then(res => {
                    setLocations([])
                    res.data.forEach(element => {
                        const string = element.name + " (" + element.cod_location + ")"
                        setLocations(prev => [...prev, { label: string, id: element.id }])
                    });
                }).catch(err => {
                    console.log(err)
                })
        }

        const fetchProjects = async () => {
            await confAxios.get('/project/projects')
                .then(res => {
                    setProjects([])
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
                    setClients([])
                    res.data.forEach(element => {
                        const string = element.name + " (" + element.cod_client + ")"
                        setClients(prev => [...prev, { label: string, id: element.id }])
                    });
                }).catch(err => {
                    console.log(err)
                })
        }

        async function fetchAll() {
            setProjects([]),
                setClients([]),
                setLocations([]),

                await Promise.all([fetchTask(), fetchLocations(), fetchProjects(), fetchClients()]).then(() => { })
        }

        fetchAll()
    }, [])


    useEffect(() => {
        setFilteredProjects(projects);
        setFilteredClients(clients);
    }, [projects, clients]);


    function convertM2H(timeInMinute) {
        const hours = Math.floor(timeInMinute / 60);
        const minutes = timeInMinute % 60;
        return `${hours}.${minutes}`;
    }

    const handleAlert = (message, severity) => {
        setAlert({ message: message, severity: severity, handleClose: () => setAlert({ message: null, severity: null, handleClose: () => { } }) })
    }

    return (
        <Grid container direction={'row'} sx={{
            width: '100%', height: '100%', margin: 'auto', px: 3, pt: 9,
        }} columnSpacing={5} >

            <Grid container direction={'column'} xs={12}>
                <CustomAlert
                    message={alert.message}
                    severity={alert.severity}
                    handleClose={alert.handleClose}
                />
                <Grid xsOffset='auto'>
                    <IconButton

                        onClick={() => {
                            const row = rows.filter(row => row.id === selected[0])
                            setId(row[0].id)
                            setData(dayjs(row[0].data).format('YYYY-MM-DD'))
                            const h = convertM2H(row[0].work_time)
                            const hm = h.split('.')
                            const h2 = dayjs.duration({ hours: hm[0], minutes: hm[1] })
                            setHour(dayjs(h2).subtract(1, 'h'))
                            setLocation({ label: row[0].location_name, id: row[0].location_id })
                            handleProjectChange(null, { label: `${row[0].project_name} (${row[0].cod_project})`, id: row[0].project_id })
                            handleClientChange(null, { label: `${row[0].client_name} (${row[0].cod_client})`, id: row[0].client_id })
                            setNote(row[0].note)
                            setOpenMod(true)
                        }}
                        disabled={!modify}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton

                        onClick={() => {
                            setOpenDel(true)
                        }}
                        disabled={!deleteTask}
                    >
                        <DeleteIcon sx={{ color: '#D71A1A' }} />
                    </IconButton>
                </Grid>

                <Dialog
                    maxWidth="md"
                    open={openDel}
                >
                    <DialogTitle>Sei sicuro?</DialogTitle>
                    <DialogContent dividers>
                        {`Premere 'Si' eliminerà le task selezionate.`}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDel(false)}
                        >
                            No
                        </Button>
                        <Button onClick={() => {
                            setOpenDel(false)
                            remove(selected)
                        }}
                        >Si</Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openMod}
                >
                    <Card sx={{ p: 2, minWidth: '380px' }}>
                        <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                            <Typography variant="h5" component="div" fontWeight={700} fontFamily={'Cascadia Code'}>
                                Form Modifica Attività
                            </Typography>
                            <Button sx={{
                                mr: -5,
                                fontFamily: 'Cascadia Code', textTransform: 'none', backgroundColor: theme === 'dark' ? '#003892' : '#001e3c',
                                color: 'white', '&:hover': { backgroundColor: '#00ab66' }
                            }} size="medium" onClick={handleInsert}>Save</Button>
                            <Button sx={{
                                fontFamily: 'Cascadia Code', textTransform: 'none', backgroundColor: theme === 'dark' ? '#003892' : '#001e3c',
                                color: 'white', '&:hover': { backgroundColor: '#e33838' }
                            }} size="medium" onClick={handleClose}>Close</Button>
                        </CardActions>
                        <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <Grid container columnSpacing={4} rowSpacing={1.5}>
                                <Grid xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoItem label={"Data"}>
                                            <DatePicker
                                                maxDate={dayjs(new Date())}
                                                format="DD/MM/YYYY"
                                                value={data2 ? dayjs(data2) : null}
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
                </Dialog>
                <Grid xs='auto'>
                    {
                        data.decodedToken ?
                            <DataGrid
                                back
                                slots={{ toolbar: GridToolbar }}
                                rows={rows}
                                columns={columns}
                                checkboxSelection
                                autoPageSize={true}
                                autoHeight={true}
                                getRowHeight={() => 'auto'}
                                sx={{
                                    [`& .${gridClasses.cell}`]: {
                                        py: 1,
                                    },
                                    backgroundColor: theme === 'dark' ? null : 'white',
                                    [`& .${gridClasses.columnHeader}`]: {
                                        backgroundColor: theme === 'dark' ? null : '#00A4DE',
                                    }
                                }}
                                columnVisibilityModel={{
                                    user: data.decodedToken.role === 'dipe' ? false : true,
                                    id: false,
                                }}
                                onRowSelectionModelChange={
                                    (newSelection) => {
                                        setSelected(newSelection)
                                        if (newSelection.length === 1) {
                                            setModify(true)
                                            setDelete(true)
                                        } else if (newSelection.length > 1) {
                                            setDelete(true)
                                            setModify(false)
                                        } else {
                                            setModify(false)
                                            setDelete(false)
                                        }
                                    }
                                }
                            /> : null
                    }
                </Grid>
            </Grid>
        </ Grid>
    );
}