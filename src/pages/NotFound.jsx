import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // If you are using React Router

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <Typography variant="h1">404</Typography>
            <Typography variant="h5" style={{ marginBottom: "10px" }}>Page Not Found</Typography>
            <Button onClick={() => navigate('/')} variant="contained" color="primary">Go Home</Button>
        </div>
    );
}

export default NotFoundPage;
