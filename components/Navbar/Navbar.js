import { useState } from 'react';
//-------------- MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
//--------------
import NavMenu from './NavMenu/NavMenu'


export default function Navbar() {
    const [navMenuOpen, setNavMenuOpen] = useState(false)

    // const toggleDrawer = ( open ) => (event) => {
    //     if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    //       return;
    //     }
    
    //     setNavMenuState({open});
    //   };


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick = {() => setNavMenuOpen(!navMenuOpen)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        La Super GonziApp
                    </Typography>
                </Toolbar>
            </AppBar>
            < NavMenu open={navMenuOpen} setNavMenuOpen={setNavMenuOpen}/>
        </Box>
    );
}
