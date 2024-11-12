import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import routes from '../../../route/public/routes';
import AuthService from '../../../shared/service/AuthService';
import './Login.css';

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await AuthService.signIn({ phoneNumber, password });
      localStorage.setItem('accessToken', response.accessToken);
      // Redirige immédiatement après la réussite de la connexion
      navigate('/round'); // Redirection vers le round
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        display="flex"
        marginTop="15rem"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        bgcolor="#ffffff"
        padding={2}
        borderRadius={2}
        boxShadow={4}
      >
        <Typography variant="h5">Se connecter</Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
         <p className='forgotPass'><Link to={routes.FORGOTPASSWORD}>Forgot Password?</Link></p>
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" color="primary">
            Login
          </Button>
          <p className='creeCompte'><Link to={routes.REGISTER}>Créer compte</Link></p>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
