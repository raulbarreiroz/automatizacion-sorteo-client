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
import { useEffect, useState, useCallback } from "react";
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
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  const [usuarioDebeCambiarPwd, setUsuarioDebeCambiarPwd] = useState(undefined)
  const [usuarios, setUsuarios] = useState(undefined)

  const getUsuarios = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/usuarios`
      );
      const usuarios = await response.json();

      if (usuarios?.length) {
        console.log("usuarios: ");
        console.log(usuarios);
        setUsuarios(usuarios);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      console.log(err);
      setUsuarios([]);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    console.log('eusuarios que deben cambiar')
    const usuariosConPwdNull = usuarios?.filter(u => !u?.hashed_pwd && email?.toLowerCase() === u?.email?.toLowerCase())
    if (usuariosConPwdNull?.length > 0) {
      setUsuarioDebeCambiarPwd(usuariosConPwdNull[0])
    } else {
      setUsuarioDebeCambiarPwd(undefined)
    }
  }, [usuarios, email])

  useEffect(() => {
    getUsuarios()
  }, [getUsuarios])

  const handleSubmit = (event) => {
    event.preventDefault();   
    
    const iniciarSesion = async () => {
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const pwd = data.get("pwd");            

      const actualizarUsuario = async () => {      
        try {
          await fetch(
            `${process.env.REACT_APP_SERVERURL}/usuario/${usuarioDebeCambiarPwd?.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: usuarioDebeCambiarPwd?.email,            
                alias: usuarioDebeCambiarPwd?.alias,
                actualizarPwd: pwd
              })            
            }
          );
          
        } catch (err) {
          console.log(err);
        }
      };

      if (usuarioDebeCambiarPwd) {
        actualizarUsuario()
      }

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

  useEffect(() => {
    console.log('email')
    console.log(email)
  }, [email])

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
                  EMAIL
                  <TextField
                    required
                    fullWidth
                    id="email"                    
                    name="email"
                    value={email}
                    onChange={e => {
                      setEmail(e?.target?.value)
                    }}
                    style={{
                      backgroundColor: "white",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  {'contraseña'?.toUpperCase()}
                  <TextField
                    required
                    fullWidth
                    name="pwd"
                    value={pwd}
                    onChange={e => {
                      setPwd(e?.target?.value)
                    }}
                    type="password"                    id="pwd"
                    style={{
                      backgroundColor: "white",
                    }}
                  />
                </Grid>
                {usuarioDebeCambiarPwd ? <Grid item xs={12}>
                  {'confirmar contraseña'?.toUpperCase()}
                  <TextField
                    required
                    fullWidth
                    name="confirmPwd"
                    value={confirmPwd}
                    onChange={e => {
                      setConfirmPwd(e?.target?.value)
                    }}
                    type="password" id="pwd"
                    style={{
                      backgroundColor: "white",
                    }}
                  />
                </Grid> : ''}
                <Grid item xs={12} sm={12} margin={0} padding={0} width="100%">
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: "#990000",
                      color: "white",
                    }}
                    disabled={usuarioDebeCambiarPwd ? pwd !== confirmPwd ? true : false : false}
                  >
                    {usuarioDebeCambiarPwd ? 'Debe cambiar la contraseña' : 'Iniciar Sesión'}
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
