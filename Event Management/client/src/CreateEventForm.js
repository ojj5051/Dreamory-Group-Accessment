import React, { useState } from 'react';
import { Typography, Box, Modal, List, ListItem, Button, TextField, Grid, Fade, Alert, AlertTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: "50px",
  p: 4,
};

export function CreateEventForm() {
    const [eventName, setEventName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [completion, setCompletion] = useState('Ongoing');
    const [credentialError, setCredentialError] = useState('');
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.post('http://localhost:4001/events/newEvents', { eventName, date, time, location, completion })
        .then(res => {
            console.log(res.data)

            if(res.data === "Duplicate") {
                setCredentialError("Duplicate name, please try different name!")
                return;
            }

            setOpen(false)
            window.location.reload(false);
        })
        .catch(err => {
            console.log(err)
        })
    };  

    return (
        <div>
            <List sx={{ mt: 8 }}>
                <ListItem disablePadding>
                    <AddIcon/>
                    <Button component="a" onClick={handleOpen} style={{ fontSize: '13px', width: "100px" }} >New Event</Button>
                </ListItem>
            </List>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
            <Box sx={style} onSubmit={handleSubmit}>
            <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                New Event
            </Typography>
            <Box component="form" sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="eventname"
                        label="Event Name"
                        type="text"
                        name="eventname"
                        autoComplete="off"
                        autoFocus
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="date"
                        type="date"
                        id="date"
                        autoComplete="off"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="time"
                        type="time"
                        id="time"
                        autoComplete="off"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="location"
                        label="Location"
                        type="text"
                        id="location"
                        autoComplete="off"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    </Grid>
                </Grid>
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, borderRadius: "25px" }}>
                    Create
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
            </Box>
        </Modal>
        </div>
    );
}