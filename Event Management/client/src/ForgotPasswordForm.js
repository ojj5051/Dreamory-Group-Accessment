import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Grid, Card, CardContent, Container, Fade, Alert, AlertTitle } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credentialError, setCredentialError] = useState('');
  const navigate = useNavigate();

  const changeToSignin = (e) => {
    navigate('/SigninForm')
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setCredentialError("Password does not match!")
      return;
    }
    
    axios.put('http://localhost:3001/users/' + email, {password})
    .then(res => {
      console.log(res.data)
      changeToSignin()
    })
    .catch(err => console.log(err))

    console.log('Sign In Email:', email);
    console.log('Sign In Password:', password);
  };

    return (
      <Container sx={{color:"white"}}>
        <Typography variant="body2" align="center" sx={{ mt: 20, fontSize: "30px", fontWeight: "bold" }} >
          Welcome to Event Management Platform
        </Typography>
        <Card sx={{ maxWidth: 400, margin: 'auto', mt: 5, borderRadius: "25px" }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom fontSize={"30px"}>
              Reset Password
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, borderRadius: "25px" }}>
                Reset Password
              </Button>
              <Typography variant="body2" align="center">
                Remember your password?{''}
                <Button onClick={changeToSignin} sx={{ textTransform: 'none' }}>
                  Click here
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

export default ForgotPasswordForm;