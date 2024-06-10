import { useContext, useEffect, useState, useMemo } from 'react';
import { Box, Unstable_Grid2 as Grid, IconButton } from '@mui/material';
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
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';

export default function Tasks() {
    dayjs.extend(updateLocale)
    dayjs.extend(duration)
    dayjs.updateLocale('en', {
        weekStart: 1,
    })

    const { theme } = useContext(ThemeContext);

    const [projects, setProjects] = useState([])
    const [clients, setClients] = useState([])
    const [rows, setRows] = useState([])
    const [tasks, setTasks] = useState([])

    const [alert, setAlert] = useState({ message: null, severity: null, handleClose: () => { } })

    function convertM2H(timeInMinute) {
        const hours = Math.floor(timeInMinute / 60);
        const minutes = timeInMinute % 60;
        return `${hours}.${minutes}`;
    }
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 150,
            type: 'number',
            flex: 1
        },
        {
            field: 'cod_project',
            headerName: 'Codice',
            width: 150,
            flex: 1
        },
        {
            field: 'name',
            headerName: 'Nome',
            width: 150,
            flex: 1
        },
        {
            field: 'cod_cliente',
            headerName: 'Cliente',
            width: 150,
            flex: 1,
        },
        {
            field: 'dataI',
            headerName: 'Data Prima Attività',
            width: 150,
            type: 'date',
            flex: 1,
            valueGetter: (params, row) => {
                return new Date(row.dataI)
            },
            renderCell: (params) => {
                const filteredTasks = tasks.filter(task => task.project_id === params.row.id && task.data === params.row.dataI);

                return (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        {dayjs(params.value).format('DD/MM/YYYY')}
                        <Tooltip
                            title={
                                <Box sx={{ p: 2 }}>
                                    {filteredTasks.map(task => (
                                        <Box key={task.id}>
                                            <p><b>Cod:</b> {task.cod_task}</p>
                                            <p><b>Locazione:</b> {task.location_name}</p>
                                            <p><b>Ore:</b> {convertM2H(task.work_time)}h</p>
                                            <p><b>Nome Utente:</b> {task.user_name} {task.user_surname}</p>
                                        </Box>
                                    ))}
                                </Box>
                            }
                            placement="top"
                            id={String(params.row.id)} // Ensure id is a string
                        >
                            <IconButton sx={{ p: 0 }} onClick={() => console.log(params)}>
                                <InfoIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )
            }
        },
        {
            field: 'dataF',
            headerName: 'Data Ultima Attività',
            type: 'date',
            width: 150,
            flex: 1,
            valueGetter: (params, row) => {
                return new Date(row.dataF)
            },
            renderCell: (params) => {
                const filteredTasks = tasks.filter(task => task.project_id === params.row.id && task.data === params.row.dataF);

                return (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        {dayjs(params.value).format('DD/MM/YYYY')}
                        <Tooltip
                            title={
                                <Box sx={{ p: 2 }}>
                                    {filteredTasks.map(task => (
                                        <Box key={task.id}>
                                            <p><b>Cod:</b> {task.cod_task}</p>
                                            <p><b>Locazione:</b> {task.location_name}</p>
                                            <p><b>Ore:</b> {convertM2H(task.work_time)}h</p>
                                            <p><b>Nome Utente:</b> {task.user_name} {task.user_surname}</p>
                                        </Box>
                                    ))}
                                </Box>
                            }
                            placement="top"
                            id={String(params.row.id)} // Ensure id is a string
                        >
                            <IconButton sx={{ p: 0 }} onClick={() => console.log(params)}>
                                <InfoIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )
            }
        }
    ];

    useEffect(() => {
        console.log("task")
        console.log(tasks)
    }, [tasks])

    useEffect(() => {
        const fetchProjects = async () => {
            await confAxios.get('/project/projectsdata')
                .then(res => {
                    setProjects([])
                    res.data.forEach(element => {
                        setProjects(prev => [...prev, element])
                    });
                }).catch(err => {
                    console.log(err)
                })
        }

        const fetchTask = async () => {
            await confAxios.get('/activity/tasksdata')
                .then(res => {
                    setTasks(res.data)
                }).catch(err => {
                    console.log(err)
                })
        }

        async function fetchAll() {

            await Promise.all([
                fetchProjects(),
                fetchTask()
            ]).then(() => { })
        }

        fetchAll()
    }, [])

    useEffect(() => {
        setRows(prev => {
            let temp = []
            projects.forEach(project => {
                temp.push({
                    id: project.id,
                    cod_project: project.cod_project,
                    name: project.name,
                    cod_cliente: project.cod_client,
                    dataI: project.first_task,
                    dataF: project.last_task
                })
            })
            // console.log(temp)
            return temp
        })
    }, [clients && projects])

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

                <Grid xs='auto'>
                    <DataGrid
                        back
                        disableRowSelectionOnClick
                        slots={{ toolbar: GridToolbar }}
                        rows={rows}
                        columns={columns}
                        // autoPageSize={true}
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
                            id: false,
                        }}
                    />
                </Grid>
            </Grid>
        </ Grid>
    );
}