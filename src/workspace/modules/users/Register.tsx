import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import routes from "../../../route/public/routes";
import AuthService from "../../../shared/service/AuthService";
import './Register.css';

const RegisterSchema = Yup.object().shape({
  phoneNumber: Yup.string().required("Phone number is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Passwords must match")
    .required("Confirm password is required"),
  pseudo: Yup.string().required("Pseudo is required"),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [submissionError, setSubmissionError] = useState<string>("");

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    setSubmissionError(""); // Clear any previous errors
    try {
      await AuthService.signUp(values);
      resetForm();
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      setSubmissionError((error as Error).message); // Set the submission error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        marginTop="15rem"
        bgcolor="#ffffff"
        padding={2}
        borderRadius={2}
        boxShadow={3}
      >
        <Typography variant="h5">Créer votre compte</Typography>
        <Formik
          initialValues={{ phoneNumber: "", password: "", confirmPassword: "", pseudo: "" }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form style={{ width: "100%" }}>
              <Field
                as={TextField}
                label="Pseudo"
                name="pseudo"
                fullWidth
                margin="normal"
                error={touched.pseudo && Boolean(errors.pseudo)}
                helperText={touched.pseudo && errors.pseudo}
              />
              <Field
                as={TextField}
                label="Phone Number"
                name="phoneNumber"
                fullWidth
                margin="normal"
                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
              />
              <Field
                as={TextField}
                label="Password"
                type="password"
                name="password"
                fullWidth
                margin="normal"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Field
                as={TextField}
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                fullWidth
                margin="normal"
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              {submissionError && <Typography color="error">{submissionError}</Typography>}
              <Button
                type="submit"
                className="registerButton"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Register
              </Button>
              <p>
                <Link to={routes.LOGIN}>Se connecter</Link>
              </p>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Register;
