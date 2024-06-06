import { Snackbar, Alert } from '@mui/material';

export const CustomAlert = ({ message, severity, handleClose }) => {
    if (!message || !severity) return null;
    const open = message !== null && severity !== null;
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};
