import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField, Typography, Box, Grid, Card, CardContent, Container, Fade, Alert, AlertTitle } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

function SigninForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [credentialError, setCredentialError] = useState('');
  const navigate = useNavigate();
  const ref = useRef(null);
 
  //Get data from local storage and login
  useEffect(() => {
    const savedEmail = JSON.parse(localStorage.getItem("email"))
    const savedPassword = JSON.parse(localStorage.getItem("password"))
    
    if(savedEmail && savedPassword) {
      setEmail(savedEmail)
      setPassword(savedPassword)

      ref.current.click()
    }
  }, [email, password])

  const changeToSignup = (e) => {
    navigate('/signupForm')
  }

  const changeToResetPassword = (e) => {
    navigate('/ForgotPasswordForm')
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post('http://localhost:3001/users/signin', {email, password})
    .then(res => {
      console.log(res.data)

      if(res.data === "0") {
        // Save data to local for auto login
        localStorage.setItem('email', JSON.stringify(email));
        localStorage.setItem('password', JSON.stringify(password));

        navigate('/EventPlatform')
      }
      else if(res.data === "1") {
        setCredentialError("Invalid Email or Password")
      }
      else {
        setCredentialError("User doesn't exist")
      }
    })
    .catch(err => {
      console.log(err)
    })
  };

    return (
      <Container>
        <Typography variant="body2" align="center" sx={{ mt: 20, fontSize: "30px", fontWeight: "bold" }} >
          Welcome to Event Management Platform
        </Typography>
        <Card sx={{ maxWidth: 400, margin: 'auto', mt: 5, borderRadius: "25px" }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Sign In
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Typography variant="body2" align="center">
                Can't login?{''}
                <Button onClick={changeToResetPassword} sx={{ textTransform: 'none' }}>
                  Reset Password
                </Button>
              </Typography>
              <Button type="submit" ref={ref} fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, borderRadius: "25px" }}>
                Sign In
              </Button>
              <Typography variant="body2" align="center" >
                Don't have an account?{''}
                <Button onClick={changeToSignup} sx={{ textTransform: 'none' }}>
                  Sign Up
                </Button>
              </Typography>
              <Fade
                in={credentialError}
                timeout={{ enter: 500, exit: 1000 }}
                addEndListener={() => {
                  setTimeout(() => {
                    setCredentialError("")
                  }, 2000);
                }}
              >
              <Alert severity="error" variant="standard" className="alert" sx={{ borderRadius: "25px" }}>
                <AlertTitle>Error</AlertTitle>
                  {credentialError}
              </Alert>
              </Fade>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
}

export default SigninForm;