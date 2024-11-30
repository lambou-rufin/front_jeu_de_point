import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthService from '../../../shared/service/AuthService';
import './Login.css';
import routes from '../../../route/public/routes';

// Schéma de validation Yup
const validationSchema = Yup.object({
  phoneNumber: Yup.string()
    .required('Le numéro de téléphone est requis')
    .matches(/^[0-9]{10}$/, 'Le numéro de téléphone doit comporter 10 chiffres'),
  password: Yup.string().required('Le mot de passe est requis'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string>('');

  const handleSubmit = async (values: { phoneNumber: string; password: string }, { setSubmitting }: any) => {
    setGeneralError('');
    try {
      const response = await AuthService.signIn(values);
      localStorage.setItem('accessToken', response.accessToken);
      navigate('/round');
    } catch (error) {
      setGeneralError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Grid container className="login-container">
      {/* Section illustration
      <Grid item xs={12} md={6} className="login-illustration">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
          <img src="/path-to-devices-image.png" alt="App on devices" className="devices-image" />
          <Typography variant="h6" className="illustration-text">
            Connectez-vous et jouez sur tous vos appareils : Android ou Web !
          </Typography>
        </Box>
      </Grid> */}

      {/* Section formulaire */}
      <Grid item xs={12} md={6} className="login-form-container">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
          padding={4}
          bgcolor="#ffffff"
          boxShadow={4}
          borderRadius={2}
        >
          <Typography variant="h5" marginBottom={2}>
            Bienvenue ! Connectez-vous
          </Typography>
          <Formik
            initialValues={{ phoneNumber: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors }) => (
              <Form style={{ width: '100%' }}>
                <Field
                  as={TextField}
                  label="Numéro de téléphone"
                  name="phoneNumber"
                  fullWidth
                  margin="normal"
                  helperText={<ErrorMessage name="phoneNumber" />}
                  error={Boolean(errors.phoneNumber)}
                />
                <Field
                  as={TextField}
                  label="Mot de passe"
                  type="password"
                  name="password"
                  fullWidth
                  margin="normal"
                  helperText={<ErrorMessage name="password" />}
                  error={Boolean(errors.password)}
                />
                {generalError && <Typography color="error">{generalError}</Typography>}
                <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Link to={routes.FORGOTPASSWORD}>Mot de passe oublié ?</Link>
                  <Link to={routes.REGISTER}>Créer un compte</Link>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
