import React, {useState} from 'react';

import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";

import { Nav, Navbar, Button, Dropdown, DropdownButton} from "react-bootstrap";

import { loginRequest } from "../authConfig";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
//import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';



    const pages = ['Profile', 'Users'];
    const settings = ['Redirect', 'Popup'];


export const NavigationBar = () => {

    const { instance } = useMsal();

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
  
    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };
  
    return (
        
/*          <Box sx={{ flexGrow: 1 }}>
 */             
               <AppBar position="static">
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                        <Typography variant="h6" component="div"  sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>Api Users</Typography>
         {/*    <Navbar bg="primary" variant="dark"> */}
                       
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit">
                                    <MenuIcon />
                            </IconButton>

                            <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{display: { xs: 'block', md: 'none' }, }} >
                                 
                                 {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page}</Typography>
                                        </MenuItem> ))}
                                     </Menu>
                                    </Box>







                                    

{/*                 <a className="navbar-brand" href="/">API Users</a> */}   
             <AuthenticatedTemplate>
                    <Nav.Link as={Button} href="/profile">Profile</Nav.Link>
                    <Nav.Link as={Button} href="/hello">API Users</Nav.Link>
                    <DropdownButton variant="warning" className="ml-auto" drop="left" title="Sign Out">
                        <Dropdown.Item as="button" onClick={() => instance.logoutPopup({ postLogoutRedirectUri: "/", mainWindowRedirectUri: "/" })}>Sign out using Popup</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => instance.logoutRedirect({ postLogoutRedirectUri: "/" })}>Sign out using Redirect</Dropdown.Item>
                    </DropdownButton>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <DropdownButton variant="secondary" className="ml-auto" drop="left" title="Sign In">
                        <Dropdown.Item as="button" onClick={() => instance.loginPopup(loginRequest)}>Sign in using Popup</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => instance.loginRedirect(loginRequest)}>Sign in using Redirect</Dropdown.Item>
                    </DropdownButton>
                </UnauthenticatedTemplate>
            {/* </Navbar> */}
            </Toolbar>
            </Container>
            </AppBar>

    );
};