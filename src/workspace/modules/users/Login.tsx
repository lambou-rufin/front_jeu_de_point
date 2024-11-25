import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import routes from '../../../route/public/routes';
import AuthService from '../../../shared/service/AuthService';
import './Login.css';

// Définir le schéma de validation avec Yup
const validationSchema = Yup.object({
  phoneNumber: Yup.string()
    .required('Le numéro de téléphone est requis')
    .matches(/^[0-9]{10}$/, 'Le numéro de téléphone doit comporter 10 chiffres'),
  password: Yup.string().required('Le mot de passe est requis'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string>(''); // État pour l'erreur générale

  const handleSubmit = async (values: { phoneNumber: string; password: string }, { setSubmitting }: any) => {
    setGeneralError(''); // Réinitialise l'erreur générale au début de la soumission

    try {
      const response = await AuthService.signIn(values);
      localStorage.setItem('accessToken', response.accessToken);
      navigate('/round'); // Redirection vers la page "round"
    } catch (error) {
      setGeneralError((error as Error).message); // Définir une erreur générale
    } finally {
      setSubmitting(false);
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
              <p className='forgotPass'><Link to={routes.FORGOTPASSWORD}>Mot de passe oublié ?</Link></p>
              {generalError && <Typography color="error">{generalError}</Typography>} {/* Affiche l'erreur générale */}
              <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
              <p className='creeCompte'><Link to={routes.REGISTER}>Créer un compte</Link></p>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
