import React, { useState } from 'react'
import { Typography, Box, AppBar, Toolbar, styled, Avatar, Menu, MenuItem } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom'

const StyledToolBar = styled(Toolbar) ({
    display: "flex",
    justifyContent: "space-between"
})

// const Search = styled("div")(({ theme }) => ({
//     backgroundColor: "white",
//     padding: "0 10px",
//     borderRadius: theme.shape.borderRadius,
//     width: "40%"
// }))

const Icons = styled(Box)(({ theme }) => ({ 
    display: "none",
    alignItems: "center",
    gap: "20px",
    [theme.breakpoints.up("sm")]: {
        display: "flex"
    }
}))

const UserBox = styled(Box)(({ theme }) => ({ 
    display: "flex",
    alignItems: "center",
    gap: "10px",
    [theme.breakpoints.up("sm")]: {
        display: "none"
    }
}))

// Hide top bar when scroll
// function HideOnScroll(props) {
//     const { children, window } = props;

//     const trigger = useScrollTrigger({
//       target: window ? window() : undefined,
//     });
  
//     return (
//       <Slide appear={false} direction="down" in={!trigger}>
//         {children}
//       </Slide>
//     );
//   }
  
// HideOnScroll.propTypes = {
//     children: PropTypes.element.isRequired,
//     window: PropTypes.func,
// };

function TopBar(props) {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("email")
        localStorage.removeItem("password")

        navigate('/SigninForm')
    }

    const navigateProfile = () => {
        navigate('/Profile')
    }

    const navigateHomePage = () => {
        navigate('/EventPlatform')
    }

    return (
        <Box>
            <AppBar>
                <StyledToolBar>
                    <Typography variant='h6' justifyContent={"center"} onClick={navigateHomePage} 
                                sx={{ display: { xs: "none", sm: "block", cursor: 'pointer' } }}>
                        Event Management Platform
                    </Typography>
                    <Icons>
                        <Avatar 
                            onClick={e => setOpen(true)}
                            sx={{ width: 30, 
                                height: 30, 
                                bgcolor: deepOrange[500],
                                cursor: "pointer" }}
                        >N
                        </Avatar>
                    </Icons>
                    <UserBox>
                         <Avatar 
                            onClick={e => setOpen(true)}
                            sx={{ width: 30, 
                            height: 30, 
                            bgcolor: deepOrange[500] }}>N
                        </Avatar>
                        <Typography variant="span">Alice</Typography>
                    </UserBox>
                </StyledToolBar>
                <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    open={open}
                    onClose={ (e) => setOpen(false)}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={navigateProfile}>My account</MenuItem>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
            </AppBar>
        </Box>
    )
}

export default TopBar;