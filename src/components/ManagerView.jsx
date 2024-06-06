import {
    Card, Button, CardActions, Typography, CardContent, Unstable_Grid2 as Grid, useTheme, useMediaQuery, Tab, ToggleButton, ToggleButtonGroup
} from "@mui/material";

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { ThemeContext } from '../context/ThemeContext';
import { useContext, useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import confAxios from '../axios/confAxios';

function ManagerView({ handleAlert }) {
    const screenTheme = useTheme();
    const isSmallScreen = useMediaQuery(screenTheme.breakpoints.down('md'));

    const colorsArr = [
        "#63b598", "#ce7d78", "#ea9e70", "#a48a9e", "#c6e1e8", "#648177", "#0d5ac1",
        "#f205e6", "#1c0365", "#14a9ad", "#4ca2f9", "#a4e43f", "#d298e2", "#6119d0",
        "#d2737d", "#c0a43c", "#f2510e", "#651be6", "#79806e", "#61da5e", "#cd2f00",
        "#9348af", "#01ac53", "#c5a4fb", "#996635", "#b11573", "#4bb473", "#75d89e",
        "#2f3f94", "#2f7b99", "#da967d", "#34891f", "#b0d87b", "#ca4751", "#7e50a8",
        "#c4d647", "#e0eeb8", "#11dec1", "#289812", "#566ca0", "#ffdbe1", "#2f1179",
        "#935b6d", "#916988", "#513d98", "#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
        "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977",
        "#f697c1", "#ba96ce", "#679c9d", "#c6c42c", "#5d2c52", "#48b41b", "#e1cf3b",
        "#5be4f0", "#57c4d8", "#a4d17a", "#225b8", "#be608b", "#96b00c", "#088baf",
        "#f158bf", "#e145ba", "#ee91e3", "#05d371", "#5426e0", "#4834d0", "#802234",
        "#6749e8", "#0971f0", "#8fb413", "#b2b4f0", "#c3c89d", "#c9a941", "#41d158",
        "#fb21a3", "#51aed9", "#5bb32d", "#807fb", "#21538e", "#89d534", "#d36647",
        "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
        "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
        "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#21538e", "#89d534", "#d36647",
        "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
        "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
        "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#9cb64a", "#996c48", "#9ab9b7",
        "#06e052", "#e3a481", "#0eb621", "#fc458e", "#b2db15", "#aa226d", "#792ed8",
        "#73872a", "#520d3a", "#cefcb8", "#a5b3d9", "#7d1d85", "#c4fd57", "#f1ae16",
        "#8fe22a", "#ef6e3c", "#243eeb", "#1dc18", "#dd93fd", "#3f8473", "#e7dbce",
        "#421f79", "#7a3d93", "#635f6d", "#93f2d7", "#9b5c2a", "#15b9ee", "#0f5997",
        "#409188", "#911e20", "#1350ce", "#10e5b1", "#fff4d7", "#cb2582", "#ce00be",
        "#32d5d6", "#17232", "#608572", "#c79bc2", "#00f87c", "#77772a", "#6995ba",
        "#fc6b57", "#f07815", "#8fd883", "#060e27", "#96e591", "#21d52e", "#d00043",
        "#b47162", "#1ec227", "#4f0f6f", "#1d1d58", "#947002", "#bde052", "#e08c56",
        "#28fcfd", "#bb09b", "#36486a", "#d02e29", "#1ae6db", "#3e464c", "#a84a8f",
        "#911e7e", "#3f16d9", "#0f525f", "#ac7c0a", "#b4c086", "#c9d730", "#30cc49",
        "#3d6751", "#fb4c03", "#640fc1", "#62c03e", "#d3493a", "#88aa0b", "#406df9",
        "#615af0", "#4be47", "#2a3434", "#4a543f", "#79bca0", "#a8b8d4", "#00efd4",
        "#7ad236", "#7260d8", "#1deaa7", "#06f43a", "#823c59", "#e3d94c", "#dc1c06",
        "#f53b2a", "#b46238", "#2dfff6", "#a82b89", "#1a8011", "#436a9f", "#1a806a",
        "#4cf09d", "#c188a2", "#67eb4b", "#b308d3", "#fc7e41", "#af3101", "#ff065",
        "#71b1f4", "#a2f8a5", "#e23dd0", "#d3486d", "#00f7f9", "#474893", "#3cec35",
        "#1c65cb", "#5d1d0c", "#2d7d2a", "#ff3420", "#5cdd87", "#a259a4", "#e4ac44",
        "#1bede6", "#8798a4", "#d7790f", "#b2c24f", "#de73c2", "#d70a9c", "#25b67",
        "#88e9b8", "#c2b0e2", "#86e98f", "#ae90e2", "#1a806b", "#436a9e", "#0ec0ff",
        "#f812b3", "#b17fc9", "#8d6c2f", "#d3277a", "#2ca1ae", "#9685eb", "#8a96c6",
        "#dba2e6", "#76fc1b", "#608fa4", "#20f6ba", "#07d7f6", "#dce77a", "#77ecca"
    ]



    const { theme } = useContext(ThemeContext);

    const [value, setValue] = useState('1');
    const [format, setFormat] = useState('m');
    const [data, setData] = useState([]);
    const [dataClient, setDataClient] = useState([]);
    const [client, setClient] = useState([]);
    const [dataProj, setDataProj] = useState([]);
    const [countClient, setCountClient] = useState(0);
    const [countProg, setCountProg] = useState(0);
    const [countDip, setCountDip] = useState(0);
    const [loading, setLoading] = useState(true);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeFormat = (event, newValue) => {
        setFormat(newValue);
    };

    function convertM2H(timeInMinute) {
        const hours = Math.floor(timeInMinute / 60);
        const minutes = timeInMinute % 60;
        return `${hours}.${minutes}`;
    }

    function parseDate(dateString) {
        return new Date(dateString);
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getWeekRange(dates) {
        const sortedDates = [...dates].sort((a, b) => a - b);
        const startDate = sortedDates[0];
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return [startDate, endDate];
    }

    function generateWeekDates(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    function completeAndSortDates(inputData) {
        const parsedDates = inputData.map(item => ({ ...item, date: parseDate(item.data) }));
        const dateObjects = parsedDates.map(item => item.date);
        const [startDate, endDate] = getWeekRange(dateObjects);
        const fullWeekDates = generateWeekDates(startDate, endDate);

        const inputDateMap = new Map(parsedDates.map(item => [formatDate(item.date), item.work_time]));

        const completeDates = fullWeekDates.map(date => {
            const formattedDate = formatDate(date);
            return {
                data: formattedDate,
                work_time: inputDateMap.get(formattedDate) || 0
            };
        });

        return completeDates;
    }

    useEffect(() => {
        console.log(dataClient)
        console.log(client)
        console.log(colorsArr[10])
    }, [dataClient, client]);

    useEffect(() => {
        const fetchHours = async () => {
            await confAxios.get('/activity/hours')
                .then(res => {
                    if (!res) {
                        return
                    }
                    const result = completeAndSortDates(res.data)
                    result.forEach(element => {
                        const workTime = Number(element.work_time);
                        setData(prev => [...prev, workTime.toFixed(2)]);
                    })

                    if (result.length < 7) {
                        const length = result.length
                        for (let i = 0; i < 7 - length; i++) {
                            setData(prev => [...prev, 0])
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
        }

        const fetchCC = async () => {
            await confAxios.get('/client/count')
                .then(res => {
                    setCountClient(res.data)
                }).catch(err => {
                    console.log(err)
                })
        }
        const fetchCP = async () => {
            await confAxios.get('/project/count')
                .then(res => {
                    setCountProg(res.data)
                }).catch(err => {
                    console.log(err)
                })
        }
        const fetchCD = async () => {
            await confAxios.get('/auth/count')
                .then(res => {
                    setCountDip(res.data)
                }).catch(err => {
                    console.log(err)
                })
        }

        const fetchCl = async () => {
            await confAxios.get('/client/clients')
                .then(res => {
                    const newClient = {};
                    console.log(res.data.length)
                    res.data.forEach(element => {
                        newClient[element.cod_client] = `${element.name} (${element.cod_client})`;
                    });
                    setClient(newClient);
                })
        }

        const transformData = (input) => {
            const result = [];
            const dataMap = {};
            const allClients = new Set();

            // First pass: Build dataMap and gather all unique cod_client values
            input.forEach(item => {
                if (!dataMap[item.data]) {
                    dataMap[item.data] = {};
                }
                dataMap[item.data][item.cod_client] = item.total_work_time;
                allClients.add(item.cod_client);
            });

            // Second pass: Ensure all cod_client entries are present in each date with default value 0
            Object.keys(dataMap).forEach(date => {
                allClients.forEach(client => {
                    if (!dataMap[date][client]) {
                        dataMap[date][client] = 0;
                    }
                });
            });

            // Build the final result array
            for (const [date, workTimes] of Object.entries(dataMap)) {
                result.push({
                    data: date,
                    ...workTimes
                });
            }

            return result;
        };
        const fetchClient = async () => {
            await confAxios.get('/activity/clients')
                .then(res => {
                    // console.log(res.data)
                    const transformedData = transformData(res.data);
                    console.log(transformedData);
                    setDataClient(transformedData);
                }).catch(err => {
                    console.log(err)
                })
        }

        const fetchProj = async () => {
            await confAxios.get('/activity/projects')
                .then(res => {

                }).catch(err => {
                    console.log(err)
                })
        }

        const fetchAll = async () => {
            setData([])

            await Promise.all([fetchHours(), fetchCl(), fetchClient(), fetchCC(), fetchCP(), fetchCD()]).then(() => {
                setLoading(false)
            })
        }

        fetchAll()
    }, []);

    return (
        <>
            <Grid sx={{ pb: isSmallScreen ? 10 : 0 }} sm={12} md={2} container justifyContent={'space-evenly'} direction={isSmallScreen ? 'row' : 'column'} rowSpacing={5} columnSpacing={isSmallScreen ? 5 : 0}>
                <Grid xs="auto" flexGrow={1}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Dipendenti
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'end' }}>
                            <Typography sx={{ pb: 2, pr: 2 }} variant="h3" component="div">
                                {loading ? '...' : countDip}
                            </Typography>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid xs="auto" flexGrow={1}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Clienti
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'end' }}>
                            <Typography sx={{ pb: 2, pr: 2 }} variant="h3" component="div">
                                {loading ? '...' : countClient}
                            </Typography>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid xs="auto" flexGrow={1}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Progetti
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'end' }}>
                            <Typography sx={{ pb: 2, pr: 2 }} variant="h3" component="div">
                                {loading ? '...' : countProg}
                            </Typography>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid >
            <Grid sm={12} md={10} container direction={'column'} spacing={5}>
                <Grid container xs={12} direction={'row'} sx={{ pb: '0px' }}>
                    <Grid xs="auto" >
                        <Button variant="contained"
                            onClick={() => handleAlert("This is a test alert", "info")} >Storico Lavori</Button>
                    </Grid>
                    <Grid xs="auto">
                        <Button variant="contained"
                            onClick={() => handleAlert("This is a test alert", "info")} >Lista Progetti</Button>
                    </Grid>
                    <Grid xs="auto" xsOffset="auto" >
                        <Button variant="contained"
                            sx={{ bgcolor: 'secondary.main', borderRadius: 3 }}
                            onClick={() => handleAlert("This is a test alert", "info")} >Filtro</Button>
                    </Grid>
                </Grid>
                <Grid xs="auto" flexGrow={1} >
                    <TabContext value={value}>
                        <Card sx={{ p: 2 }}>
                            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '56px' }}>
                                <Typography variant="h6" component="div">Statistiche Generali</Typography>
                                {value !== '1' ?
                                    < ToggleButtonGroup
                                        sx={{ borderRadius: 3, height: 40 }}
                                        value={format}
                                        exclusive
                                        onChange={handleChangeFormat}
                                        aria-label="Platform"
                                    >
                                        <ToggleButton value="m">Mese</ToggleButton>
                                        <ToggleButton value="y">Anno</ToggleButton>
                                    </ToggleButtonGroup> : null}
                            </CardActions>
                            <TabList onChange={handleChange}
                                aria-label="lab API tabs example"
                                sx={{
                                    "& button.Mui-selected": {
                                        color: theme === 'dark' ? '#d3a121' : '#c90076'
                                    },
                                }}
                                textColor="primary"
                                TabIndicatorProps={{ style: { backgroundColor: theme === 'dark' ? '#d3a121' : '#C90076' } }}
                            >
                                <Tab label="Ultima Settimana" value="1" />
                                <Tab label="Ore Cliente" value="2" />
                                <Tab label="Ore Progetto" value="3" />
                            </TabList>
                            {/* TODO:
                                Formattare array ore dipendenti  per far si che si vedano più linee nella tabella    
                            */}
                            <TabPanel value="1">
                                <LineChart
                                    sx={{
                                        '& .MuiLineElement-root': {
                                            strokeWidth: 5,
                                        },
                                    }}
                                    yAxis={[{ valueFormatter: (value) => `${convertM2H(value)}h`, scaleType: 'linear', tickCount: 5 }]}
                                    xAxis={[{
                                        scaleType: 'point',
                                        data: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
                                    }]}
                                    series={[
                                        {
                                            data: data ? data : [],
                                            label: 'Ore',
                                            valueFormatter: (value) => `${convertM2H(value)}h`,
                                            // [0, 3, 0, 2, 10, 0, 0]
                                        },
                                    ]}
                                    height={298}
                                    margin={{ top: 15, right: 10, bottom: 20, left: 50 }}
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
                            </TabPanel>
                            <TabPanel value="2">
                                <LineChart
                                    sx={{
                                        '& .MuiLineElement-root': {
                                            strokeWidth: 5,
                                        },
                                    }}
                                    yAxis={[{ valueFormatter: (value) => `${convertM2H(value)}h`, scaleType: 'linear', tickCount: 5 }]}
                                    xAxis={[{
                                        dataKey: 'data',
                                        // min:,
                                        // max:,
                                        scaleType: 'point',
                                        valueFormatter: (value, context) => {
                                            return format === 'm' ?
                                                context.location === 'tick'
                                                    ? value
                                                    : `${value}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
                                                : value;
                                        },
                                        data:
                                            format === 'm' ? Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(day => day.toString())
                                                : ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
                                    }]}
                                    series={Object.keys(client).map((key, index) => ({
                                        dataKey: key,
                                        label: client[key],
                                        color: colorsArr[index],
                                        valueFormatter: (value) => `${convertM2H(value)}h`,
                                    }))}
                                    dataset={dataClient}
                                    height={298}
                                    margin={{ top: 15, right: 10, bottom: 20, left: 50 }}
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
                            </TabPanel>
                            <TabPanel value="3">
                                <LineChart
                                    sx={{
                                        '& .MuiLineElement-root': {
                                            strokeWidth: 5,
                                        },
                                    }}
                                    // yAxis={[{ valueFormatter: (value) => `${ convertM2H(value) }h`, scaleType: 'linear', tickCount: 5 }]}
                                    xAxis={[{
                                        scaleType: 'point', data:
                                            format === 'm' ? Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(day => day.toString())
                                                : ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
                                    }]}
                                    series={[
                                        {
                                            data: [0, 3, 0, 2, 10, 0, 0],
                                            // datas ? datas : [],
                                            label: 'Ore',
                                            // valueFormatter: (value) => `${ convertM2H(value) }h`,
                                            // [0, 3, 0, 2, 10, 0, 0]
                                        },
                                    ]}
                                    height={298}
                                    margin={{ top: 15, right: 10, bottom: 20, left: 20 }}
                                    grid={{ vertical: true, horizontal: true }}
                                    colors={[theme === 'dark' ? '#d3a121' : '#c90076']}
                                    // loading={loading}
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
                            </TabPanel>
                        </Card>
                    </TabContext>
                </Grid>
            </Grid >
        </>
    );
}

export default ManagerView;