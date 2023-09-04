import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AppsIcon from "@mui/icons-material/Apps";
import CasinoIcon from "@mui/icons-material/Casino";
import StorageIcon from "@mui/icons-material/Storage";
import SchoolIcon from "@mui/icons-material/School";
import RedeemIcon from "@mui/icons-material/Redeem";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { NavLink } from "react-router-dom";
import ReorderIcon from '@mui/icons-material/Reorder';
import HomeIcon from '@mui/icons-material/Home';
import { Home } from "@mui/icons-material";

const style = {
  color: "black",
  textDecoration: "none",
};

export const mainListItems = (
  <React.Fragment>    
    <NavLink to="/dashboard/inicio" style={style}>
      <ListItemButton>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Inicio" />
      </ListItemButton>
    </NavLink>
    <NavLink to="/dashboard/sorteo" style={style}>
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
    <NavLink to="/dashboard/profesores" style={style}>
      <ListItemButton>
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="Profesores" />
      </ListItemButton>
    </NavLink>
    <NavLink to="/dashboard/facultades" style={style}>
      <ListItemButton>
        <ListItemIcon>
          <AccountBalanceIcon />
        </ListItemIcon>
        <ListItemText primary="Facultades" />
      </ListItemButton>
    </NavLink>
    <NavLink to="/dashboard/carreras" style={style}>
      <ListItemButton>
        <ListItemIcon>
          <MenuBookIcon />
        </ListItemIcon>
        <ListItemText primary="Carreras" />
      </ListItemButton>
    </NavLink>
    <NavLink to="/dashboard/regalos" style={style}>
      <ListItemButton>
        <ListItemIcon>
          <RedeemIcon />
        </ListItemIcon>
        <ListItemText primary="Regalos" />
      </ListItemButton>
    </NavLink>
    <NavLink to="/dashboard/tipoDonacion" style={style}>
      <ListItemButton>
        <ListItemIcon>
          <ReorderIcon />
        </ListItemIcon>
        <ListItemText primary="TiposDonaciones" />
      </ListItemButton>
    </NavLink>
    <NavLink to="/dashboard/usuarios" style={style}>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIndIcon />
        </ListItemIcon>
        <ListItemText primary="Usuarios" />
      </ListItemButton>
    </NavLink>
  </React.Fragment>
);
