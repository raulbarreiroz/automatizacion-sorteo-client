import Paper from "@mui/material/Paper";
import React, { useEffect, useState, useCallback } from "react";
import Carga from "../Carga";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import blanco from "../../resources/imagen/blanco.jpg"
import ReactCardFlip from "react-card-flip";
import Box from "@mui/material/Box"
import List from '@mui/material/List';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from '@mui/icons-material/Check';
import Select from "@mui//material/Select"
import MenuItem from "@mui/material/MenuItem"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { TextField } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Wheel } from 'react-custom-roulette'

const SeccionSorteo = (props) => {
  const [facultades, setFacultades] = useState(undefined);
  const [regalos, setRegalos] = useState(undefined);
  const [tiposDeDonaciones, setTiposDeDonaciones] = useState(undefined);
  const [sorteo, setSorteo] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [tipoDeDonacionSeleccinado, setTipoDeDonacionSeleccionado] =
    useState(undefined);
  const [open, setOpen] = useState(false)
  const [openasistencia, setOpenAsistencia] = useState(undefined)
  const [openFacultades, setOpenFacultades] = useState(false)
  const [openSorteo, setOpenSorteo] = useState(false)
  const [facultadSeleccionada, setFacultadSeleccionada] = useState(undefined)  
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const [profesores, setProfesores] = useState(undefined)
  const [nombreRegalos, setNombreRegalos] = useState(undefined)
  const [regaloSeleccionado, setRegaloSeleccionado] = useState(undefined)
  const [empezarSorteo, setEmpezarSorteo] = useState(false)
  const [sorteosRealizados, setSorteosRealizados] = useState(false)
  const [profesoresParticipando, setProfesoresParticipando] = useState(false)
  const [regalosDisponibles, setRegalosDisponibles] = useState(false)
  const [showWheel, setShoWheel] = useState(false)

  const data = [
    { option: '0', style: { backgroundColor: 'green', textColor: 'black' } },
    { option: '1', style: { backgroundColor: 'white' } },
    { option: '2' },
  ]

  const getFacultades = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/facultades`
      );
      const facultades = await response.json();
      if (facultades?.length) {        
        setFacultades(facultades?.map(facultad => ({
          ...facultad,
          isFlipped: false,
          profesorSeleccionado: {},
          regaloSeleccionado: {}
        })))
      } else {
        setFacultades([]);
      }
    } catch (err) {
      console.log(err);
      setFacultades([]);
    }
    setCargando(false);
  }, []);
  const getProfesores = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/profesores`
      );
      const profesores = await response.json();

      if (profesores?.length) {
        setProfesores(profesores);
      } else {
        setProfesores([]);
      }
    } catch (err) {
      console.log(err);
      setProfesores([]);
    }
    setCargando(false);
  }, []);

  
  const getRegalos = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/regalos-no-sorteados`
      );
      const regalos = await response.json();

      if (regalos?.length) {
        setRegalos(regalos);
      } else {
        setRegalos([]);
      }
    } catch (err) {
      console.log(err);
      setRegalos([]);
    }
  }, []);

  const getNombreRegalos = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/nombre-regalos`
      );
      const regalos = await response.json();

      if (regalos?.length && tipoDeDonacionSeleccinado) {
        const nombreRegaloTemp = regalos?.map((regalo, id) => ({ ...regalo, id }));
        
        setNombreRegalos(nombreRegaloTemp?.filter(regalo => regalo?.tipo_donacion_id === tipoDeDonacionSeleccinado))
      } else {
        setNombreRegalos([]);
      }
    } catch (err) {
      console.log(err);
      setNombreRegalos([]);
    }
  }, [tipoDeDonacionSeleccinado]);

  useEffect(() => {
    if (!open) {
      getRegalos()
      getNombreRegalos()
      getFacultades()
    }
  }, [open, getFacultades, getRegalos, getNombreRegalos])


  useEffect(() => {
    console.log('tipodDEonacionSelecionado')
    console.log(tipoDeDonacionSeleccinado)
  }, [tipoDeDonacionSeleccinado])

  const shuffleArray = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // Mientras queden elementos a mezclar...
    while (0 !== currentIndex) {
  
      // Seleccionar un elemento sin mezclar...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // E intercambiarlo con el elemento actual
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  const getTiposDeDonaciones = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/tiposDeDonaciones`
      );
      const tiposDeDonaciones = await response.json();

      if (tiposDeDonaciones?.length) {
        setTiposDeDonaciones(tiposDeDonaciones);
      } else {
        setTiposDeDonaciones([]);
      }
    } catch (err) {
      console.log(err);
      setTiposDeDonaciones([]);
    }
  }, []);

  useState(() => {
    getFacultades()
    getProfesores()
  }, [getProfesores, getFacultades])

  useEffect(() => {
    setCargando(true);
    getRegalos();    
    getNombreRegalos()
    getTiposDeDonaciones();
    getFacultades();
  }, [getFacultades, getRegalos, getTiposDeDonaciones, getNombreRegalos]);

  useEffect(() => {
    console.log('nombreRegalos')
    console.log(nombreRegalos)
  }, [nombreRegalos])

  useEffect(() => {
    console.log('facultades')
    console.log(facultades)

    if (facultades && tipoDeDonacionSeleccinado) {
      console.log('entramos')
    }
  }, [facultades, tipoDeDonacionSeleccinado])

  useEffect(() => {
    console.log('sorteo')
    console.log(sorteo)
  }, [sorteo])

  useEffect(() => {
    console.log('regaloSeleccionado')
    console.log(regaloSeleccionado)
  }, [regaloSeleccionado])

  useEffect(() => {
    setSorteo([])
    setShoWheel(true)
    if (tipoDeDonacionSeleccinado) {
      if (tipoDeDonacionSeleccinado === 1) {
        if (empezarSorteo && facultades && regalos && facultadSeleccionada) {
          const facultadesSeleccionadas = facultades?.filter(f => f.id === facultadSeleccionada)[0]
          let profesoresSeleccionados = []
          if (facultadesSeleccionadas) {
            profesoresSeleccionados = facultadesSeleccionadas?.profesores
          }
          let profesoresQueAsistieron = []

          if (profesoresSeleccionados?.length) {
            profesoresQueAsistieron = profesoresSeleccionados?.filter(p => p?.asistio?.trim() === 'SI')
          }
          let profesoresQueAsistieronSinRegalo = []
          if (profesoresQueAsistieron?.length) {
            profesoresQueAsistieronSinRegalo = profesoresQueAsistieron?.filter(p => !p?.regalo_id)
          }
          let regalosDeTipoDeDonacion = []
          if (regalos?.length) {
            regalosDeTipoDeDonacion = regalos?.filter(r => r?.tipo_donacion_id === tipoDeDonacionSeleccinado)
          }
          let regalosDeTipoDeDonacionSinSortear = []
          if (regalosDeTipoDeDonacion?.length) {
            regalosDeTipoDeDonacionSinSortear = regalosDeTipoDeDonacion?.filter(r => !r?.profesor_id)
          }
          let regalosValidadosQuePertenecenAfacultad = []

          if (regalosDeTipoDeDonacionSinSortear?.length) {
            regalosValidadosQuePertenecenAfacultad = regalosDeTipoDeDonacionSinSortear?.filter(r => r?.facultad_id === facultadSeleccionada)
          }

          console.log('profesoresQueAsistieronSinRegalod')
          console.log(profesoresQueAsistieronSinRegalo)

          console.log('regalosvalidaos')
          console.log(regalosValidadosQuePertenecenAfacultad)

          while (profesoresQueAsistieronSinRegalo?.length > 0 && regalosValidadosQuePertenecenAfacultad?.length > 0) {
            const regalosMezclados = shuffleArray(regalosValidadosQuePertenecenAfacultad)
            const regaloSeleccionado = regalosMezclados?.pop()
            console.log('regaloSeleccionadao')
            console.log(regaloSeleccionado)

            const profesoresMezclados = shuffleArray(profesoresQueAsistieronSinRegalo)
            const profesorSeleccionado = profesoresMezclados?.pop()

            console.log('profesor seleciconado')
            console.log(profesorSeleccionado)

            setSorteo(prev => [...prev, {
              profesor: profesorSeleccionado,
              regalo: regaloSeleccionado,
            }])
          }
        }
      } else if (tipoDeDonacionSeleccinado >= 2) {
        console.log('facultades')
        console.log(facultades)

        const facultadesMezcladas = shuffleArray(facultades)

        for (const facultadIterada of facultadesMezcladas) {
          console.log(facultadIterada)

          const facultadesSeleccionadas = facultades?.filter(f => f.id === facultadIterada?.id)[0]
          let profesoresSeleccionados = []
          if (facultadesSeleccionadas) {
            profesoresSeleccionados = facultadesSeleccionadas?.profesores
          }
          let profesoresQueAsistieron = []

          if (profesoresSeleccionados?.length) {
            profesoresQueAsistieron = profesoresSeleccionados?.filter(p => p?.asistio?.trim() === 'SI')
          }
          let profesoresQueAsistieronSinRegalo = []
          if (profesoresQueAsistieron?.length) {
            profesoresQueAsistieronSinRegalo = profesoresQueAsistieron?.filter(p => !p?.regalo_id)
          }
          let regalosDeTipoDeDonacion = []
          if (regalos?.length) {
            regalosDeTipoDeDonacion = regalos?.filter(r => r?.tipo_donacion_id === tipoDeDonacionSeleccinado)
          }
          let regalosDeTipoDeDonacionSinSortear = []
          if (regalosDeTipoDeDonacion?.length) {
            regalosDeTipoDeDonacionSinSortear = regalosDeTipoDeDonacion?.filter(r => !r?.profesor_id)
          }
          let regalosValidadosQuePertenecenAfacultad = []

          if (regalosDeTipoDeDonacionSinSortear?.length) {
            regalosValidadosQuePertenecenAfacultad = regalosDeTipoDeDonacionSinSortear?.filter(r => r?.facultad_id === facultadIterada?.id)
          }

          console.log('profesoresQueAsistieronSinRegalod')
          console.log(profesoresQueAsistieronSinRegalo)

          console.log('regalosvalidaos')
          console.log(regalosValidadosQuePertenecenAfacultad)          

          let regaloSeleccionadoNombre

          if (nombreRegalos?.length) {
            regaloSeleccionadoNombre = nombreRegalos?.filter(r => r?.id === regaloSeleccionado)[0]?.nombre
          }

          console.log('regaloSeleccionadoNombre')
          console.log(regaloSeleccionadoNombre)

          console.log(regalosValidadosQuePertenecenAfacultad)

          let regalosValidado = []
          if (regalosValidadosQuePertenecenAfacultad?.length) {
            console.log(regalosValidadosQuePertenecenAfacultad?.filter(r => r?.nombre === regaloSeleccionadoNombre))
            regalosValidado = regalosValidadosQuePertenecenAfacultad?.filter(r => r?.nombre === regaloSeleccionadoNombre)
          }

          console.log('profesoresQueAsistieronSinRegalo')
          console.log(profesoresQueAsistieronSinRegalo)
          console.log('regalosValidado')
          console.log(regalosValidado)

          while (profesoresQueAsistieronSinRegalo?.length > 0 && regalosValidado?.length > 0) {
            const regalosMezclados = shuffleArray(regalosValidado)
            const regaloSeleccionado = regalosMezclados?.pop()
            console.log('regaloSeleccionadao')
            console.log(regaloSeleccionado)

            const profesoresMezclados = shuffleArray(profesoresQueAsistieronSinRegalo)
            const profesorSeleccionado = profesoresMezclados?.pop()

            console.log('profesor seleciconado')
            console.log(profesorSeleccionado)

            setSorteo(prev => [...prev, {
              profesor: profesorSeleccionado,
              regalo: regaloSeleccionado,
            }])            
          }
        }
      }
    }       
  }, [empezarSorteo, facultades, regalos, facultadSeleccionada, tipoDeDonacionSeleccinado, regaloSeleccionado, nombreRegalos])



  useEffect(() => {
    console.log('sorteo')
    console.log(sorteo)
  }, [sorteo])

  useEffect(() => {
    if (nombreRegalos?.length) {      
      setRegaloSeleccionado(nombreRegalos[0]?.id)
    } else {
      setNombreRegalos('')
    }
  }, [nombreRegalos, tipoDeDonacionSeleccinado])

  useEffect(() => {
  
      console.log('regalosEleccionado')
      console.log(regaloSeleccionado)
  
  }, [regaloSeleccionado])

  useEffect(() => {
    console.log('showWheel')
    console.log(showWheel)
  }, [showWheel])

  return (
    <>
      {!tipoDeDonacionSeleccinado &&
        <Paper
          style={{
            width: "100%",
            height: "100%",            
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "column",
            gap: 20,
            overflowY: "scroll",
            
          }}
        >
          <Grid width={"100%"} height={'8%'} container justifyContent={'flex-start'} >
            <Button
              type="submit"
              style={{
                backgroundColor: "#990000",
                color: "white",
                
                fontSize: 17.5,
                padding: "20",
            }}        
            fullWidth
              onClick={(e) => {
                setOpenAsistencia(true)
              }}
            >
              REGISTRAR ASISTENCIA
            </Button>
          </Grid>
          <Grid width={"100%"} height={'8%'} container justifyContent={"center"}>
            <Typography fontSize={'150%'}>
                Seleccione que regalos desea sortear
            </Typography>
          </Grid>
          <Grid
            width={"100%"}
            
            container            
            style={{
              display:'flex',
              flexWrap: 'wrap',    
              justifyContent: 'space-around',
              alignItems: 'stretch',
              gap: '3%',
              overflowY: 'scroll',
              pading: 0,
              margin: 0,
              flexDirection: 'row',
              rowGap: '2.5vh'
            }}
          >
            {tiposDeDonaciones?.length ?
              tiposDeDonaciones?.map((tipoDeDonacion) => {
                return (
                  
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: "#990000",
                      color: "white",
                      fontSize: '1.5vw',                                          
                      width: '30vw',                      
                      height: 'auto',                      
                    }}
                    key={tipoDeDonacion?.id}
                    onClick={(e) => {
                      function getRandomInt(max) {
                        return Math.floor(Math.random() * max);
                      }

                      setTipoDeDonacionSeleccionado(tipoDeDonacion?.id);
                      if (tipoDeDonacion?.id === 1) {
                        setOpenFacultades(true)
                      } else {
                        setOpenSorteo(true)
                        if (tipoDeDonacionSeleccinado >= 3) {
                          console.log('regalos')
                          const regalosEditados = regalos?.map(r => {
                            if (!r?.facultad_id) {
                              const indiceFacultadSeleccionado = getRandomInt(r?.length)                        
                              r.facultad_id = facultades[indiceFacultadSeleccionado]?.id
                            }
                            return r
                          })
                          console.log(regalosEditados)
                          setRegalos(regalosEditados)
                        } 
                      }

                      // old code
                      //setSorteo([])
                    }}
                  >
                    {tipoDeDonacion?.nombre}
                  </Button>
                );
              }) : 'NO EXISTE NINGUN TIPO DE SORTEO REGISTRADO'
            }
          </Grid>
        </Paper>}        
      <Carga cargando={cargando} />
      <Dialog open={open}>
        <DialogTitle>GANADORES</DialogTitle>
        <List sx={{ pt: 0 }}>
        <TableContainer
                component={Paper}
                style={{
                  overflowX: "initial",
                }}
              >
                <Table aria-label="tabla de profesores" stickyHeader>
                  <TableHead>
                    <TableRow>
                      
                      <TableCell
                        style={{
                          backgroundColor: "rgb(153, 0, 0)",
                          color: "white",
                        }}
                      >
                        SE FUE
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: "rgb(153, 0, 0)",
                          color: "white",
                        }}
                      >
                        PROFESOR (GANADOR)
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: "rgb(153, 0, 0)",
                          color: "white",
                        }}
                        width="20px"
                      >
                        REGALO
                      </TableCell>                    
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {sorteo?.map((row, i) => {
             
                      return (
                        <TableRow
                          key={`${row?.cedula}-${i}`}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                            backgroundColor:
                              hoveredCell !== undefined
                                ? hoveredCell === i
                                  ? "rgba(153, 0, 0, 0.2)"
                                  : "white"
                                : "white",
                          }}
                          onMouseEnter={(e) => {
                            setHoveredCell(i);
                          }}
                          onMouseLeave={(e) => {
                            setHoveredCell(undefined);
                          }}
                        >                          
                          <TableCell>
                            <ThumbDownIcon
                              style={{
                                cursor: "pointer",
                                color: 'red'
                              }}
                              onClick={(e) => {
                                const sorteoEditado = [...sorteo?.filter(s => row?.profesor?.id !== s?.profesor?.id && row?.regalo?.id !== s?.regalo?.id)]
                                console.log('sorteoEditado')
                                console.log(sorteoEditado)
                                //setSorteo(sorteoEditado)
                              }}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {`${row?.profesor?.nombre1} ${row?.profesor?.nombre2} ${row?.profesor?.apellido1} ${row?.profesor?.apellido2}`}
                          </TableCell>
                          <TableCell>{`${row?.regalo?.nombre}`}</TableCell>                                             
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
            </TableContainer>   
            <Button
                      type="submit"
                      fullWidth
                      style={{
                        backgroundColor: "#990000",
                        color: "white",
                        marginTop: 10
              }}
            onClick={e => { 
              const asignarRegalo = async (s) => {                
                try {
                  const asignarRegalo = await fetch(
                    `${process.env.REACT_APP_SERVERURL}/asignarRegalo`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        profesorId: s?.profesor?.id?.toString(),   
                        regaloId: s?.regalo?.id?.toString()
                      }),
                    }
                  );
                  return asignarRegalo
                } catch (err) {
                  console.log(err);
                }
              };

              const asignarProfesor = async (s) => {                
                try {
                  const asignarProfesor = await fetch(
                    `${process.env.REACT_APP_SERVERURL}/asignarProfesor`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({                        
                        profesorId: s?.profesor?.id?.toString(),
                        regaloId: s?.regalo?.id?.toString()
                      }),
                    }
                  );
                  return asignarProfesor
                } catch (err) {
                  console.log(err);
                }
              };

              const agregarRegistroBitacora = async (s) => {                
                try {
                  const agregarRegistroBitacora = await fetch(
                    `${process.env.REACT_APP_SERVERURL}/agregar-registro-bitacora`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({                        
                        nombreProfesor: `${s?.profesor?.nombre1} ${s?.profesor?.nombre2} ${s?.profesor?.apellido1} ${s?.profesor?.apellido2}`,
                        nombreRegalo: s?.regalo?.nombre,
                        nombreFacultad: facultades?.filter(f => f?.id === s?.regalo?.facultad_id)[0]?.nombre
                      }),
                    }
                  );
                  return agregarRegistroBitacora
                } catch (err) {
                  console.log(err);
                }
              };

              const funciones = async (s) => {
                console.log(s)
                  console.log('regalo_id')
                  console.log(s?.regalo?.id)
                  console.log('profesor_id')
                  console.log(s?.profesor?.id)

                  const p = await asignarProfesor(s)
                  const r = await asignarRegalo(s)
                  console.log(p)
                  console.log(r)
                  const b = await agregarRegistroBitacora(s)
                  console.log(b)
              }
            
                setCargando(true)
                for (const s of sorteo) {
                  funciones(s)
                }
                
                
              
              //setSorteo([])                          
              setOpen(false)             
              }}
                    >
                    CONTINUAR
                    </Button>
        </List>
      </Dialog>
      <Dialog open={openasistencia} fullScreen>
      <DialogTitle
          style={{
            height: "7.5%",
            
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#990000",
            color: "#fff",
          }}
        >
          <Typography variant="body1">
            REGISTRAR ASISTENCIA A EVENTO
          </Typography>
          <Button
            variant="outlined"
            onClick={(e) => {
              setOpenAsistencia(false)
            }}
          >
            <CloseIcon style={{ color: "white" }} />
          </Button>
        </DialogTitle>  
          <TextField />
          {
          profesores?.length > 0 ? 
            <Grid container style={{
              
              margin: 0,
              padding: 0,
              height: 'calc(100% - 7.5%)',
              color: 'black',
              overflowY: 'scroll'
            }}
              justifyContent={'flex-start'}
              alignItems={'flex-start'}
              flexWrap={'wrap'}
            > 
              
              {profesores?.map(p => {
                return (
                  <Card sx={{                                     
                    width: '15%',
                    minWidth: '400px',
                    height: '30%',                    
                    minHeight: '300px',
                    margin: '1%',
                    display: 'flex',
                    flexFlow: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      height: '55%',
                    }}>
                    {p?.imagen ?
                            <CardMedia
                            sx={{
                              height: '100%',
                              width: '100%',
                                             
                              textAlign: 'center',
                              padding: 0
                            }}                                            
                            image={p?.imagen}
                            title={`${p?.nombre1} ${p?.nombre2} ${p?.apellido1} ${p?.apellido2}`}
                          /> : <div style={{display: 'flex', justifyContent: 'center', height: '100%',
                        width: '100%', alignItems: 'center',
                        }}><AccountCircleIcon style={{ height: '90%', width: '90%' }} /></div> 
                      }
                      </div>
      <div style={{backgroundColor: p?.asistio?.trim() === 'SI' ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)', height: '45%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <CardContent sx={{ textAlign: 'center', p: 0}}>
        <Typography gutterBottom variant="h5" component="div" color={'black'} >
          {`${p?.nombre1} ${p?.nombre2} ${p?.apellido1} ${p?.apellido2}`}
        </Typography>
                      
                      <Typography variant="h6" color="black">
          {p?.cedula}
                </Typography>
      </CardContent>
                      <CardActions sx={{pt: 0, pb: 0, textAlign: 'center'}} style={{
                        display: 'flex',
                        justifyContent: 'center',
                        color: 'white'
                        }}>
                        <Button  size="small" style={{
                            backgroundColor: "#990000",
                            color: "white",
                            width: "100%",                              
                        }}
                          onClick={e => {
                            const actualizarProfesor = async () => {
                              try {
                                const response = await fetch(
                                  `${process.env.REACT_APP_SERVERURL}/profesor/${p?.cedula}`,
                                  {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      cedula: p?.cedula,
                                      facultadId: p?.facultad_id,
                                      nombre1: p?.nombre1,
                                      nombre2: p?.nombre2,
                                      apellido1: p?.apellido1,
                                      apellido2: p?.apellido2,
                                      asistio: p?.asistio?.trim() === 'SI' ? 'NO' : 'SI',
                                      imagen: p?.imagen
                                    }),
                                  }
                                );
                                if (response.status === 200) {
                                  getProfesores();
                                  getFacultades()
                                  setCargando(false)
                                }
                              } catch (err) {
                                console.log(err);
                                setCargando(false)
                              }
                            };
                            setCargando(true)                           
                            setOpenAsistencia(false)
                            
                            actualizarProfesor()
                            setOpenAsistencia(true)
                          }}
                        >
                          CAMBIAR ASISTENCIA</Button>  
                                  </CardActions>
                    </div>
    </Card>
                )
              })}
            </Grid> : 'NO SE HAN REGISTRADO PROFESORES'
          }          
      </Dialog>
      <Dialog open={openFacultades} fullScreen>
      <DialogTitle
          style={{
            height: "7.5%",
            
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#990000",
            color: "#fff",
          }}
        >
          <Typography variant="body1">
            {
              tiposDeDonaciones?.length && tipoDeDonacionSeleccinado ?
                tiposDeDonaciones?.filter(t => t?.id === tipoDeDonacionSeleccinado)[0]?.nombre
              : ''
            }
          </Typography>
          <Button
            variant="outlined"
            onClick={(e) => {
              setTipoDeDonacionSeleccionado(undefined)              

              setOpenFacultades(false)
              
            }}
          >
            <CloseIcon style={{ color: "white" }} />
          </Button>
        </DialogTitle>
        {/*
        <Grid container width='100%' columnGap={1} justifyContent={'center'} height={'10%'} alignItems={'center'}
          style={{
            
          }}
        >
          
          <Grid item xs={12} sm={3}>
          <Button
                variant="outlined"                
                
                onClick={(e) => {
                  
                }}
                fullWidth
              >
                PROFESORES PARTICIPANTES
              </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
          <Button
                variant="outlined"                
                
                onClick={(e) => {
                  
                }}
                fullWidth
              >
                REGALOS DISPONIBLES
              </Button>
          </Grid>
        </Grid>
              */}
          { facultades?.length > 0 ? 
            <Grid container style={{
              
              margin: 0,
              padding: 0,
              height: 'calc(100% - 7.5%)',
              color: 'black',
              overflowY: 'scroll'
            }}
              justifyContent={'flex-start'}
              alignItems={'flex-start'}
              flexWrap={'wrap'}
            > 
              
              {facultades?.map(f => {
                return (
                  <Card sx={{                                     
                    width: '15%',
                    minWidth: '400px',
                    height: '30%',                    
                    minHeight: '300px',
                    margin: '1%',
                    display: 'flex',
                    flexFlow: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      height: '55%',
                    }}>
                    {f?.logo ?
                            <CardMedia
                            sx={{
                              height: '100%',
                              width: '100%',
                                             
                              textAlign: 'center',
                              padding: 0
                            }}                                            
                            image={f?.logo}
                            title={f?.nombre}
                          /> : <div style={{display: 'flex', justifyContent: 'center', height: '100%',
                        width: '100%', alignItems: 'center',
                        }}><AccountCircleIcon style={{ height: '90%', width: '90%' }} /></div> 
                      }
                      </div>
      <div style={{ height: '45%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <CardContent sx={{ textAlign: 'center', p: 0}}>
        <Typography gutterBottom variant="h5" component="div" color={'black'} >
          {f?.nombre}
        </Typography>                                           
      </CardContent>
                      <CardActions sx={{pt: 0, pb: 0, textAlign: 'center'}} style={{
                        display: 'flex',
                        justifyContent: 'center',
                        color: 'white'
                        }}>
                        <Button  size="small" style={{
                            backgroundColor: "#990000",
                            color: "white",
                            width: "100%",                              
                        }}
                          onClick={e => {
                            setFacultadSeleccionada(f?.id)
                            setOpenSorteo(true)
                            setEmpezarSorteo(false)
                            setSorteosRealizados(false)
                            setProfesoresParticipando(false)
                            setRegalosDisponibles(false)
                          }}
                        >
                          EMPEZAR SORTEO</Button>  
                                  </CardActions>
                    </div>
    </Card>
                )
              })}
            </Grid>
               : 'NO SE HAN REGISTRADO FACULTADES'
          }          
      </Dialog>    
      <Dialog open={openSorteo} fullScreen>
      <DialogTitle
          style={{
            height: "7.5%",
            
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#990000",
            color: "#fff",
          }}
        >
          <Typography variant="body1">
            {
              tiposDeDonaciones?.length && facultadSeleccionada ?
                facultades?.filter(f => f?.id === facultadSeleccionada)[0]?.nombre
              : ''
            }
          </Typography>          
          <Button
            variant="outlined"
            onClick={(e) => {
              setOpenSorteo(false)
              setFacultadSeleccionada(undefined)

              if (tipoDeDonacionSeleccinado > 1) {
                setOpenFacultades(false)
                setTipoDeDonacionSeleccionado(undefined)
              }
            }}
          >
            <CloseIcon style={{ color: "white" }} />
          </Button>
        </DialogTitle>
        {empezarSorteo || sorteosRealizados || profesoresParticipando || regalosDisponibles ? 
          <Grid container width='100%' columnGap={1} justifyContent={'center'} height={'10%'} alignItems={'center'}
          style={{
            
          }}
          >             
            <Grid item xs={12} sm={6}>              
              <Button
                    variant="outlined"                
                    
                    onClick={(e) => {
                      if (empezarSorteo) {
                        setEmpezarSorteo(false)
                      }

                      if (sorteosRealizados) {
                        setSorteosRealizados(false)
                      }

                      if (profesoresParticipando) {
                        setProfesoresParticipando(false)
                  }
                      if (regalosDisponibles) {
                        setRegalosDisponibles(false)
                      }                      
                    }}
                    
                    fullWidth
                  >
                    VOLVER A DESPLEGAR MENU
              </Button>
              
            </Grid>          
            <Grid item xs={12} sm={5}>              
              <Button
                    variant="outlined"                
                    
                    
                      onClick={e => { 
                        const asignarRegalo = async (s) => {                
                          try {
                            const asignarRegalo = await fetch(
                              `${process.env.REACT_APP_SERVERURL}/asignarRegalo`,
                              {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  profesorId: s?.profesor?.id?.toString(),   
                                  regaloId: s?.regalo?.id?.toString()
                                }),
                              }
                            );
                            return asignarRegalo
                          } catch (err) {
                            console.log(err);
                          }
                        };
          
                        const asignarProfesor = async (s) => {                
                          try {
                            const asignarProfesor = await fetch(
                              `${process.env.REACT_APP_SERVERURL}/asignarProfesor`,
                              {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({                        
                                  profesorId: s?.profesor?.id?.toString(),
                                  regaloId: s?.regalo?.id?.toString()
                                }),
                              }
                            );
                            return asignarProfesor
                          } catch (err) {
                            console.log(err);
                          }
                        };
          
                        const agregarRegistroBitacora = async (s) => {                
                          try {
                            const agregarRegistroBitacora = await fetch(
                              `${process.env.REACT_APP_SERVERURL}/agregar-registro-bitacora`,
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({                        
                                  nombreProfesor: `${s?.profesor?.nombre1} ${s?.profesor?.nombre2} ${s?.profesor?.apellido1} ${s?.profesor?.apellido2}`,
                                  nombreRegalo: s?.regalo?.nombre,
                                  nombreFacultad: facultades?.filter(f => f?.id === s?.regalo?.facultad_id)[0]?.nombre
                                }),
                              }
                            );
                            return agregarRegistroBitacora
                          } catch (err) {
                            console.log(err);
                          }
                        };
          
                        const funciones = async (s) => {
                          console.log(s)
                            console.log('regalo_id')
                            console.log(s?.regalo?.id)
                            console.log('profesor_id')
                            console.log(s?.profesor?.id)
          
                            const p = await asignarProfesor(s)
                            const r = await asignarRegalo(s)
                            console.log(p)
                            console.log(r)
                            const b = await agregarRegistroBitacora(s)
                            console.log(b)
                        }
                      
                          setCargando(true)
                          for (const s of sorteo) {
                            funciones(s)
                          }
                                                                            
                        setSorteo([])                          
                        setOpenSorteo(false)
                        if (tipoDeDonacionSeleccinado === 1) {
                          setFacultadSeleccionada(undefined)
                        } else {
                          setOpenFacultades(false)
                          setTipoDeDonacionSeleccionado(undefined)
                        }
                        setCargando(false)
                    }}
                    
                    fullWidth
                  >
                    GUARDAR
              </Button>
              
              </Grid>   
        </Grid>
        :
          <Grid container width='100%' columnGap={1} justifyContent={'center'} height={'10%'} alignItems={'center'}
            style={{
              
            }}
            >     
          <Grid item xs={12} sm={2}>              
                <Button
                      variant="outlined"                
                      
                      onClick={(e) => {
                        setEmpezarSorteo(true)
                        setShoWheel(true)
                      }}
                fullWidth
                disabled={tipoDeDonacionSeleccinado <= 1 ? false : !regaloSeleccionado ? true : false }
                    >
                      EMPEZAR SORTEO
                    </Button>
                </Grid>    
              
              
                 
          </Grid>
        }
        {!empezarSorteo ? regaloSeleccionado ?
          tipoDeDonacionSeleccinado !== 1 ?
            <Select
              variant="outlined"
              size="small"
              id="facultad"
              name="facultad"                      
      value={regaloSeleccionado}
      style={{
        width: '80%',
        margin: '0 auto'
            }}
      onChange={e => {     
        console.log(e?.target)
        console.log(e?.target)
                setRegaloSeleccionado(e?.target?.value)
              }}
            >
              {nombreRegalos?.length >= 0 && tipoDeDonacionSeleccinado &&
                nombreRegalos?.filter(regalo => regalo?.tipo_donacion_id === tipoDeDonacionSeleccinado)?.map((regalo) => {
                  return (
                    <MenuItem key={regalo?.nombre} value={regalo?.id}>
                      {regalo?.nombre}
                    </MenuItem>
                  );
                })}
            </Select> : '' : <Typography>NO SE HA DONADO REGALOS PARA ESTE TIPO DE SORTEO</Typography> : ''
        }
        {
          <Grid container width={'100%'}>
            {
              empezarSorteo ? 
                sorteo?.length ? 
                  sorteo?.map(s => {
                    return (
                      <Card sx={{                                     
                        width: '15%',
                        minWidth: '400px',
                        height: '35%',                    
                        minHeight: '325px',
                        margin: '1%',
                        display: 'flex',
                        flexFlow: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{
                          height: '55%',
                          display: 'flex',
                          width: '100%'
                        }}>
                        {s?.profesor?.imagen ?
                                <CardMedia
                                sx={{
                                  height: '100%',
                                  width: '100%',
                                                 
                                  textAlign: 'center',
                                  padding: 0
                                }}                                            
                                image={s?.profesor?.imagen}
                                title={s?.profesor?.imagen}
                              /> : <div style={{display: 'flex', justifyContent: 'center', height: '100%',
                            width: '100%', alignItems: 'center',
                            }}><AccountCircleIcon style={{ height: '90%', width: '90%' }} /></div> 
                          }
                          {s?.regalo?.imagen ?
                                <CardMedia
                                sx={{
                                  height: '100%',
                                  width: '100%',
                                                 
                                  textAlign: 'center',
                                  padding: 0
                                }}                                            
                                image={s?.regalo?.imagen}
                                title={s?.regalos?.imagen}
                              /> : <div style={{display: 'flex', justifyContent: 'center', height: '100%',
                            width: '100%', alignItems: 'center',
                            }}><AccountCircleIcon style={{ height: '90%', width: '90%' }} /></div> 
                          }
                          </div>
          <div style={{height: '45%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <CardContent sx={{ textAlign: 'center', p: 0}}>                                    
            <Typography variant="h6" color="black" fontSize={'90%'}>
              {`${s?.profesor?.nombre1} ${s?.profesor?.nombre2} ${s?.profesor?.apellido1} ${s?.profesor?.apellido2}`}
            </Typography>
                            <Typography variant="h6" color="black" fontSize={'90%'}>
              {s?.regalo?.nombre}
                            </Typography>
                            <Typography variant="h6" color="black" fontSize={'90%'}> 
              {s?.regalo?.nombre_donador}
            </Typography>
          </CardContent>
                          <CardActions sx={{pt: 0, pb: 0, textAlign: 'center'}} style={{
                            display: 'flex',
                            justifyContent: 'center',
                            color: 'white'
                            }}>
                            <Button  size="small" style={{
                                backgroundColor: "#990000",
                                color: "white",
                                width: "100%",                              
                            }}
                              onClick={e => {
                                const sorteoEditado = [...sorteo?.filter(s2 => s2?.profesor?.id !== s?.profesor?.id && s2?.regalo?.id !== s?.regalo?.id)]
                                console.log('sorteoEditado')
                                console.log(sorteoEditado)
                                setSorteo(sorteoEditado)
                              }}
                            >
                              EL PROFESOR NO ESTA EN LA FIESTA</Button>  
                                      </CardActions>
                        </div>
        </Card>
                    )
                  })
                : 
                <Grid container width='100%' justifyContent={'center'}>
                <Wheel
                    mustStartSpinning={empezarSorteo}
                    prizeNumber={0}
                    data={ [
                      { option: '', style: { backgroundColor: 'green', textColor: 'black' } },
                      { option: '', style: { backgroundColor: 'white' } },
                      { option: '' },
                    ]}
                    backgroundColors={['#3e3e3e', '#df3428']}              
                  /></Grid> 
              : ''
            }
          </Grid>
        }   
        
      </Dialog>  
    </>
  );
};

export default SeccionSorteo;
