import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import {
    ExitToApp,
    Work,
    Home,
    Person,
    Face,
    ArrowUpward
  } from "@material-ui/icons";

const Lists = () => {
    return (
    <div>
        <List component="nav">
            <ListItem button>
                <ListItemIcon>
                    <Home />
                </ListItemIcon>
                <ListItemText primary="Inicio" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <Work />
                </ListItemIcon>
                <ListItemText primary="Encontrar trabajador" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <Person />
                </ListItemIcon>
                <ListItemText primary="Mi Perfil" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <Face />
                </ListItemIcon>
                <ListItemText primary="Nosotros" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <ArrowUpward />
                </ListItemIcon>
                <ListItemText primary="WorkPremium" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Cerrar sesión" />
            </ListItem>
        </List>
    </div>
    )
}

export default Lists;