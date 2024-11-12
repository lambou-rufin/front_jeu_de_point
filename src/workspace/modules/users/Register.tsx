import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import routes from "../../../route/public/routes";
import { SignUpData } from "../../../shared/models/interface";
import AuthService from "../../../shared/service/AuthService";
import './Register.css';

const Register: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [pseudo, setPseudo] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const signUpData: SignUpData = {
      phoneNumber,
      password,
      pseudo,
    };

    try {
      await AuthService.signUp(signUpData);
      // Redirect or update the state as necessary
      navigate('/login'); // Redirection vers login
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh" // Center vertically in full height
        marginTop="15rem"
        bgcolor="#ffffff" // Optional: Light background color
        padding={2} // Optional: Padding around the container
        borderRadius={2} // Optional: Rounded corners
        boxShadow={3} // Optional: Shadow effect
      >
        <Typography variant="h5">Créer votre compte</Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Pseudo"
            fullWidth
            margin="normal"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
          />
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
           <TextField
            label="Confirm password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" className="registerButton" fullWidth variant="contained" color="primary">
            Register
          </Button>
          <p>
            <Link to={routes.LOGIN}>Se connecter</Link>
          </p>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
