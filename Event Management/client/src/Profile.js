import React, { useEffect, useState } from "react";
import { TextField, Typography, Box, Grid, Card, CardContent, Container, Avatar, Button, IconButton, OutlinedInput, 
    InputLabel, InputAdornment, FormControl, Fade, Alert, AlertTitle, styled } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import TopBar from './TopBar'
import { ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from './themes/darkTheme'
import lightTheme from './themes/lightTheme'
import axios from "axios";

let data = null

// Only receive int 
const TextBox = styled(TextField)`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
`;

function Profile() {
    const [theme, setTheme] = useState(darkTheme)
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [credentialError, setCredentialError] = useState('');

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        //Get user from local storage
        if (localStorage.getItem("email") != null) {
            setEmail(JSON.parse((localStorage.getItem("email"))))
        }
        
        // Set theme
        if(localStorage.getItem("theme") === "lightTheme") {
            setTheme(lightTheme)
        }
        else {
            setTheme(darkTheme)
        }

        // Load Current Users
        axios.post('http://localhost:3001/users/findSpecific', {email})
        .then(res => {
            console.log(res.data)
            if(res.data != null) {
                data = res.data
                setName(data.name)
                setEmail(data.email)
                setPhoneNumber(data.phoneNumber)
                setPassword(data.password)
                setConfirmPassword(data.password)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }, [email])

    // Update user data
    const UpdateUserData = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setCredentialError("Password does not match!")
            return;
        }

        axios.put('http://localhost:3001/users/' + email, { name, email, phoneNumber })
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <ThemeProvider theme={theme}>
        <CssBaseline/>
            <TopBar/>
            <Container>
                <Typography variant="body2" align="center" sx={{ mt: 10, fontSize: "30px", fontWeight: "bold" }} >
                    Profile
                </Typography>
                <Box align= "center" sx={{ mt: 2 }}>
                    <Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar>
                </Box>
                <Card sx={{ maxWidth: 400, margin: 'auto', mt: 5, borderRadius: "25px" }}>
                    <CardContent>
                        <Box component="form" sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="name"
                                        type="text"
                                        label="Name"
                                        name="name"
                                        autoComplete="name"
                                        autoFocus
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        type="email"
                                        label="Email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextBox
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="phoneNumber"
                                        type="number"
                                        label="Phone Number"
                                        id="phoneNumber"
                                        autoComplete="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl  variant="outlined" fullWidth>
                                        <InputLabel htmlFor="password">Password</InputLabel>
                                        <OutlinedInput
                                            id="password"
                                            label="Password"
                                            required
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl  variant="outlined" fullWidth>
                                        <InputLabel htmlFor="confirmpassword">Confirm Password</InputLabel>
                                        <OutlinedInput
                                            id="confirmpassword"
                                            label="Confirm Password"
                                            required
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Button type="submit" onClick={UpdateUserData} fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, borderRadius: "25px" }}>
                                Update
                            </Button>
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
        </ThemeProvider>
    )
}

export default Profile