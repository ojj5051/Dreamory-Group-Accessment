import { Box } from "@mui/material";
import React from "react";

function RightBar() {
    return (
        <Box 
            bgcolor= "transparent"
            flex= {2}
            p= {2}
            sx= {{ display: { xs: "none", sm: "block" } }}
        >
        </Box>
    )
}

export default RightBar