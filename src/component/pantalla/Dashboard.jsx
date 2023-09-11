import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, secondaryListItems } from "../ListItems";
import { useLocation } from "react-router-dom";
import SeccionSorteo from "../seccion/SeccionSorteo";
import SeccionProfesores from "../seccion/SeccionProfesores";
import SeccionRegalos from "../seccion/SeccionRegalos";
import SeccionUsuarios from "../seccion/SeccionUsuarios";
import SeccionFacultades from "../seccion/SeccionFacultades";
import SeccionCarreras from "../seccion/SeccionCarreras";
import SeccionTipoDonacion from "../seccion/SeccionTipoDonacion";
import SeccionInicio from '../seccion/SeccionInicio'
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import Carga from "../Carga";
import LogoutIcon from '@mui/icons-material/Logout';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Asociación de Profesores UCSG
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO en version movil, hacer Drawer top
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#990000",
    },
    secondary: {
      main: "#fff",
    },
  },
});

export default function Dashboard(props) {
  const appBarRef = useRef(undefined);
  const toolbarRef = useRef(undefined);
  const seccionContainerRef = useRef(undefined);
  const copyrightGridRef = useRef(undefined);
  const boxRef = useRef(undefined);
  const [open, setOpen] = React.useState(true);
  const [seccion, setSeccion] = useState(undefined);
  const [windowWidth, setWindowWidth] = useState(undefined);
  const [, setWindowHeight] = useState(undefined);
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(undefined)
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const location = useLocation();

  useEffect(() => {
    const handlerCambioDimensionesDePantalla = () => {
      setWindowWidth(window?.innerWidth);
      setWindowHeight(window?.innerHeight);
    };

    setWindowWidth(window?.innerWidth);
    setWindowHeight(window?.innerHeight);
    window.addEventListener("resize", handlerCambioDimensionesDePantalla);

    return () => {
      window?.removeEventListener("resize", handlerCambioDimensionesDePantalla);
    };
  }, []);

  useEffect(() => {
    console.log('location')
    console.log(location)
   
    setSeccion(props?.seccion);
  }, [location]);

  useEffect(() => {
    console.log('appLocation in dashboard')
    console.log(props?.appLocation)
  }, [props])

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }} ref={boxRef}>
        <CssBaseline />
        <AppBar position="absolute" open={open} ref={appBarRef}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed,                          
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Plataforma de Automatización de Sorteo de Regalos /{" "}
              {seccion?.substring(7)}
            </Typography>
            <IconButton
              color="inherit"
              onClick={e => {
                navigate('/')
                removeCookie('EMAIL')
                removeCookie('TOKEN')
                removeCookie('ALIAS')
                removeCookie('ROL_ID')
              }
              }
            >
              <LogoutIcon
              />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
            ref={toolbarRef}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {(cookies?.EMAIL &&
              cookies?.TOKEN &&
              cookies?.ALIAS &&
              cookies?.ROL_ID) && (cookies?.ROL_ID === 1 || cookies?.ROL_ID === 2) && mainListItems}
            {(cookies?.EMAIL &&
              cookies?.TOKEN &&
              cookies?.ALIAS &&
              cookies?.ROL_ID) & cookies?.ROL_ID === 1 ?
              <>
                <Divider sx={{ my: 1 }} />
                {secondaryListItems}
              </> : ''
            }
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Grid
            style={{
              height: `${boxRef?.current?.clientHeight - appBarRef?.current?.clientHeight
                }px`,
              width: `${windowWidth - toolbarRef?.current?.clientWidth}px)`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
            }}
          >
            <Container
              maxWidth={false}
              style={{
                width: "100%",
                height: "96%",
              }}
              ref={seccionContainerRef}
            >
              {seccion === 'SeccionInicio' && <SeccionInicio />}
              {seccion === "SeccionSorteo" && (
                <SeccionSorteo setOpen={setOpen} />
              )}
              {seccion === "SeccionProfesores" && <SeccionProfesores />}
              {seccion === "SeccionRegalos" && <SeccionRegalos />}
              {seccion === "SeccionUsuarios" && <SeccionUsuarios />}
              {seccion === "SeccionFacultades" && <SeccionFacultades />}
              {seccion === "SeccionCarreras" && <SeccionCarreras />}
              {seccion === "SeccionTipoDonacion" && <SeccionTipoDonacion />}
            </Container>
            <Grid
              style={{
                height: "3%",
                width: "100%",
                marginTop: "1%",
              }}
              ref={copyrightGridRef}
            >
              <Copyright sx={{}} />
            </Grid>
          </Grid>
        </Box>
        <Carga cargando={cargando} />
      </Box>
    </ThemeProvider>
            );
}
