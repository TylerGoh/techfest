import { AppBar, Toolbar, Button } from "@mui/material"
import { Link } from "react-router-dom"

function NavigationBar(){
    return(
        <AppBar position="static" color="primary">
            <Toolbar>
                <Button href="/" sx={{ my: 2, color: 'white', display: 'block' }}>
                    Home
                </Button>
                <Button href="/settings" sx={{ my: 2, color: 'white', display: 'block' }}>
                    Inventory
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default NavigationBar