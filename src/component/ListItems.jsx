import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AppsIcon from '@mui/icons-material/Apps';
import CasinoIcon from '@mui/icons-material/Casino';
import SchoolIcon from '@mui/icons-material/School';
import RedeemIcon from '@mui/icons-material/Redeem';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { NavLink } from "react-router-dom";

const style = {
  color: 'black',
  textDecoration: 'none',
}

export const mainListItems = (
  <React.Fragment>
    <NavLink to='/dashboard/inicio' style={style}>
      <ListItemButton>
        <ListItemIcon>
          <AppsIcon />
        </ListItemIcon>
        <ListItemText primary="Inicio" />
      </ListItemButton>
    </NavLink>
    <NavLink to='/dashboard/sorteo' style={style}>
      <ListItemButton>
        <ListItemIcon>
          <CasinoIcon />
        </ListItemIcon>
        <ListItemText primary="Sorteo" />
      </ListItemButton>
    </NavLink>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>        
    <NavLink to='/dashboard/profesores' style={style}>
      <ListItemButton>      
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="Profesores" />
      </ListItemButton>
    </NavLink>
    <NavLink to='/dashboard/regalos' style={style}>
      <ListItemButton>
        <ListItemIcon>
          <RedeemIcon />
        </ListItemIcon>
        <ListItemText primary="Regalos" />
      </ListItemButton>
    </NavLink>
    <NavLink to='/dashboard/sorteos' style={style}>
      <ListItemButton>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Sorteos" />
      </ListItemButton>
    </NavLink>
    <NavLink to='/dashboard/usuarios' style={style}>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIndIcon />
        </ListItemIcon>
        <ListItemText primary="Usuarios" />
      </ListItemButton>
    </NavLink>
  </React.Fragment>
);