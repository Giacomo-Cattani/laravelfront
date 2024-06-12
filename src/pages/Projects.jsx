import { useContext, useEffect, useState } from 'react';
import { Box, Unstable_Grid2 as Grid, IconButton } from '@mui/material';
import confAxios from '../axios/confAxios';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import { ThemeContext } from '../context/ThemeContext';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale'
import duration from 'dayjs/plugin/duration'
import { CustomAlert } from '../components/CustomAlert';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
                            <IconButton sx={{ p: 0 }}>
                                <InfoIcon sx={{ fontSize: 20, color: 'white' }} />
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
                            <IconButton sx={{ p: 0 }}>
                                <InfoIcon sx={{ fontSize: 20, color: 'white' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )
            }
        }
    ];

    const navigate = useNavigate()

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
                <IconButton sx={{ ml: 2, width: 51, display: 'flex', justifyContent: 'left' }} onClick={() => navigate('/')}>
                    <ArrowBackIcon sx={{ color: theme === 'dark' ? null : '#001e3c' }} fontSize="large" />
                </IconButton>

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
                            border: 0,
                            borderRadius: 3,
                            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;',
                            p: 1,
                            [`& .${gridClasses.columnHeader}`]: {
                                backgroundColor: theme === 'dark' ? null : '#001e3c',
                            },
                            [`& .${gridClasses.footerContainer}`]: {
                                color: 'white', // Change this to your desired color
                            },
                            [`& .MuiCheckbox-root`]: {
                                color: 'white', // Change this to your desired color
                            },
                            ['& .MuiDataGrid-toolbarContainer']: {
                                ['& .MuiButton-root']: {
                                    backgroundColor: 'transparent',
                                }
                            },
                            ['& .MuiToolbar-root']: {
                                color: 'white'
                            }
                        }
                        }
                        columnVisibilityModel={{
                            id: false,
                        }}
                    />
                </Grid>
            </Grid>
        </ Grid>
    );
}