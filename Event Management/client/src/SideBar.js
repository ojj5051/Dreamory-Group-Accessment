import { Switch, Box, List, ListItem} from "@mui/material";
import React, { useState, useEffect } from "react";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import darkTheme from './themes/darkTheme'
import lightTheme from './themes/lightTheme'
import { CreateEventForm } from './CreateEventForm'

function SideBar({theme, setTheme}) {
    const [checked, setChecked] = useState(false)

    //Set theme when load local storage
    useEffect(() => {
        if(localStorage.getItem("theme") === "lightTheme") {
            setTheme(lightTheme)
            setChecked(false)
        }
        else {
            setTheme(darkTheme)
            setChecked(true)
        }
    }, [])

    // Change theme when clicked
    const ChangeTheme = (e) => {
        if(theme === lightTheme) {
            setTheme(darkTheme)
            setChecked(true)
        }
        else {
            setTheme(lightTheme)
            setChecked(false)
        }
        localStorage.setItem("theme", theme === lightTheme ? "darkTheme" : "lightTheme")
    }
    
    return (
        <Box 
            flex= {1}
            p= {2}
            position={"sticky"}
            sx= {{ display: { xs: "none", sm: "block" } }}
        >
            <CreateEventForm/>
            <List>
                <ListItem disablePadding>
                    <DarkModeIcon/>
                    <Switch 
                        onChange={ChangeTheme}
                        checked={checked} />
                </ListItem>
            </List>
        </Box>
    )
}

export default SideBar