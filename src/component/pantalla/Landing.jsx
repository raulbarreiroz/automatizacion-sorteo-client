import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import DialogCrearUsuario from "../dialog/DialogCrearUsuario";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import aso from "../../resources/imagen/aso.jpg";
import Carga from "../Carga";
import { useCookies } from "react-cookie";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        Asociación de Profesores UCSG
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme({});

export default function Landing(props) {
  const navigate = useNavigate();
  const [mostrarDialogCrearUsuario, setMostrarDialogCrearUsuario] =
    useState(false);    
  const [cargando, setCargando] = useState(undefined)
  const [, setCookie] = useCookies(null);

  const handleSubmit = (event) => {
    event.preventDefault();   
    
    const iniciarSesion = async () => {
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const pwd = data.get("pwd");            

      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/iniciar-sesion`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email, pwd
            }),
          }
        );
        if (response.status === 200) {
          const usuario = await response?.json()
          
          console.log('usuario')
          console.log(usuario)
          
          if (usuario) {
            console.log(usuario?.severity)
            console.log(usuario?.message)

            if (usuario?.email && usuario?.token) {
              setCookie('EMAIL', usuario?.email)
              setCookie('TOKEN', usuario?.token)
              setCookie('ALIAS', usuario?.alias)
              setCookie('ROL_ID', usuario?.rolId)
              navigate('/dashboard/inicio')
            }

            props?.setSeverity(usuario?.severity)
            props?.setMessage(usuario?.message)
          }
        } else {
          
        }
      } catch (err) {
        console.log(err);
        setCargando(false)
      }
      setCargando(false)
      props?.setOpenSnackBar(true)
    };

    setCargando(true)
    iniciarSesion()    
  };  

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              variant="rounded"
              sx={{ width: "60%", height: "60%", m: 1 }}
              src={aso}
              alt="logo-aso"
            />
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="email"
                    name="email"
                    autoComplete="email"
                    style={{
                      backgroundColor: "white",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="pwd"
                    label="contraseña"
                    type="password"
                    id="pwd"
                    style={{
                      backgroundColor: "white",
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} margin={0} padding={0} width="100%">
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: "#990000",
                      color: "white",
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                </Grid>
                {/*
                <Grid
                  item
                  xs={12}
                  mt={1}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Link
                    onClick={(e) => {
                      setMostrarDialogCrearUsuario(true);
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    Crear nuevo usuario
                  </Link>
                </Grid>
                  */}
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
      <DialogCrearUsuario
        mostrarDialogCrearUsuario={mostrarDialogCrearUsuario}
        setMostrarDialogCrearUsuario={setMostrarDialogCrearUsuario}
      />
      <Carga cargando={cargando} />      
    </>
  );
}
