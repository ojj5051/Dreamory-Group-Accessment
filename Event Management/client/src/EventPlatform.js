import React, { useState } from 'react'
import { Stack, Box } from '@mui/material';
import SideBar from './SideBar';
import EventList from './EventList';
import RightBar from './RightBar';
import TopBar from './TopBar'
import darkTheme from './themes/darkTheme'
import { ThemeProvider, CssBaseline } from '@mui/material';

function EventPlatform() {
    const [theme, setTheme] = useState(darkTheme)

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box>
                <TopBar/>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                    <SideBar setTheme={setTheme} theme={theme}/>
                    <EventList/>
                    <RightBar/>
                </Stack>
            </Box>
        </ThemeProvider>
    )
}

export default EventPlatform;