import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Chip from '@mui/material/Chip';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function Filter({ clients, progets, user, value, handleChangeGraph }) {

    const { theme } = useContext(ThemeContext);

    const [opz, setOpz] = React.useState([]);
    const [options, setOptions] = React.useState([]);
    const [selectedOptions, setSelectedOptions] = React.useState([]);

    const [first, setFirst] = React.useState(true);

    React.useEffect(() => {
        if (clients && progets && user) {
            const arr = Object.keys(progets).map(key => {
                return {
                    "type": "project",
                    "value": progets[key],
                    [key]: progets[key]
                };
            });

            const arr2 = Object.keys(clients).map(key => {
                return {
                    "type": "client",
                    "value": clients[key],
                    [key]: clients[key]
                };
            });

            const arr3 = Object.keys(user).map(key => {
                return {
                    "type": "user",
                    "value": user[key],
                    [key]: user[key]
                };
            });
            setOpz([...arr, ...arr2, ...arr3]);
        }
    }, [clients, progets, user]);

    React.useEffect(() => {
        if (first) {
            setFirst(false);
            return
        };
        if (!selectedOptions)
            handleChangeGraph(null);

        const copy = selectedOptions.reduce((acc, { type, value, ...rest }) => {
            return { ...acc, ...rest };
        }, {});
        handleChangeGraph(copy)
    }, [selectedOptions]);

    React.useEffect(() => {
        if (value && opz.length > 0)
            switch (value) {
                case "1":
                    setOptions([...opz.filter(e => e.type === "user")]);
                    setSelectedOptions(opz.filter(e => e.type === "user"));
                    break;
                case "2":
                    setOptions([...opz.filter(e => e.type === "client")]);
                    setSelectedOptions(opz.filter(e => e.type === "client"));
                    break;
                case "3":
                    setOptions([...opz.filter(e => e.type === "project")]);
                    setSelectedOptions(opz.filter(e => e.type === "project"));
                    break;
                default:
                    setOptions([...opz]);
                    setSelectedOptions(opz);
                    break;
            }
    }, [opz, value]);

    return (
        <Autocomplete
            sx={{ boxShadow: "3px 3px 5px 0px #000000", borderRadius: "5px" }}
            multiple
            id="checkboxes-tags-demo"
            options={options.sort((a, b) => -b.type.localeCompare(a.type))}
            groupBy={(option) => option.type.charAt(0).toUpperCase() + option.type.slice(1)}
            disableCloseOnSelect
            limitTags={2}
            getOptionLabel={(option) => option.value}
            value={selectedOptions}
            loading={options.length === 0}
            onChange={(event, newValue) => {
                setSelectedOptions(newValue);
            }}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        variant="outlined"
                        label={option.value}
                        // sx={{ backgroundColor: theme === 'dark' ? null : "#f0f0f0", borderColor: theme === 'dark' ? null : "#f0f0f0" }}
                        {...getTagProps({ index })}
                    />
                ))
            }
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option.value}
                </li>
            )}
            style={{ width: 430 }}
            renderInput={(params) => (
                <TextField sx={{
                    ['& .MuiFormLabel-root']: {
                        ['&.Mui-focused']: {
                            // color: theme === 'dark' ? "#fff" : "#000",
                            // mt: 2,
                        }
                    },
                }} {...params} label="Filtro" />
            )}
        />
    );
}