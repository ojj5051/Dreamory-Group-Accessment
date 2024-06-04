import React, { useEffect, useState } from "react";
import { Typography, Box, Modal, Button, TextField, Grid } from '@mui/material';
import axios from 'axios'

let data = null

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

export function EditEventForm({open, setOpen, _id}) {
    const [eventName, setEventName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [completion, setCompletion] = useState('');
    
    const handleClose = () => setOpen(false);

    useEffect(() => {
        axios.post('http://localhost:4001/events/findID', {_id})
        .then(res => {
            console.log(res.data)
            data = res.data
            setEventName(data[0].eventName)
            setDate(data[0].date)
            setTime(data[0].time)
            setLocation(data[0].location)
            setCompletion(data[0].completion)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.put('http://localhost:4001/events/' + _id, { eventName, date, time, location, completion } )
        .then(res => {
            console.log(res.data)
            setOpen(false)
            window.location.reload(false);
        })
        .catch(err => {
            console.log(err)
        })
    };  

    return (
        <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
            <Box sx={style} onSubmit={handleSubmit}>
            <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                Edit Event
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
                        autoComplete="eventname"
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
                        autoComplete="date"
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
                        autoComplete="time"
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
                        autoComplete="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="completion"
                        label="Completion"
                        type="text"
                        id="completion"
                        autoComplete="completion"
                        value={completion}
                        onChange={(e) => setCompletion(e.target.value)}
                    />
                    </Grid>
                </Grid>
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, borderRadius: "25px" }}>
                    Edit
                </Button>
                </Box>
            </Box>
        </Modal>
    )
}