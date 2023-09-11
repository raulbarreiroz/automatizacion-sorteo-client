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
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from '@mui/icons-material/Check';
import Select from "@mui//material/Select"
import MenuItem from "@mui/material/MenuItem"

const SeccionSorteo = (props) => {
  const [facultades, setFacultades] = useState(undefined);
  const [regalos, setRegalos] = useState(undefined);
  const [tiposDeDonaciones, setTiposDeDonaciones] = useState(undefined);
  const [sorteo, setSorteo] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [empezarSorteo, setEmpezarSorteo] = useState(undefined);
  const [tipoDeDonacionSeleccinado, setTipoDeDonacionSeleccionado] =
    useState(undefined);
  const [open, setOpen] = useState(false)
  const [openasistencia, setOpenAsistencia] = useState(undefined)
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const [profesores, setProfesores] = useState(undefined)
  const [nombreRegalos, setNombreRegalos] = useState(undefined)
  const [regaloSeleccionado, setRegaloSeleccionado] = useState(undefined)
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

      if (regalos?.length) {
        setNombreRegalos(regalos);
      } else {
        setNombreRegalos([]);
      }
    } catch (err) {
      console.log(err);
      setNombreRegalos([]);
    }
  }, []);

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
    if (tiposDeDonaciones?.length && facultades?.length && regalos?.length) {
      setEmpezarSorteo(true);
    }
  }, [regalos, tiposDeDonaciones, facultades]);

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

  return (
    <>
      {!tipoDeDonacionSeleccinado &&
        <Paper
          style={{
            width: "100%",
            height: "100%",
            padding: "2.5vh 1.5vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 20,
            overflowY: "scroll",
          }}
        >
        <Grid width={"100%"} container justifyContent={"center"}>
        <Button
                type="submit"
                style={{
                  backgroundColor: "#990000",
                  color: "white",
                  width: "50%",
                  fontSize: 17.5,
                  padding: "20",
                }}              
                onClick={(e) => {
                  setOpenAsistencia(true)
                }}
              >
                REGISTRAR ASISTENCIA
              </Button>
        </Grid>
        <Grid width={"100%"} container justifyContent={"center"}>
          <Typography fontSize={30}>
            Seleccione que regalos desea sortear
          </Typography>
        </Grid>
        {tiposDeDonaciones?.length ?
          tiposDeDonaciones?.map((tipoDeDonacion) => {
            return (
              <Button
                type="submit"
                style={{
                  backgroundColor: "#990000",
                  color: "white",
                  width: "50%",
                  fontSize: 17.5,
                  padding: "20",
                }}
                key={tipoDeDonacion?.id}
                onClick={(e) => {
                  setTipoDeDonacionSeleccionado(tipoDeDonacion?.id);
                  setSorteo([])
                }}
              >
                {tipoDeDonacion?.nombre}
              </Button>
            );
          }) : ''}
        </Paper>}
        {
        tipoDeDonacionSeleccinado && (
          <Paper
          style={{
            width: "100%",
            height: "100%",
            padding: "2.5vh 1.5vw",
            overflowY: "scroll",
          }}
          >      
            <Grid container justifyContent={'flex-start'} alignItems={'flex-start'}  gap={1}>
              <Typography fontSize={27.5}>
                {tiposDeDonaciones?.filter(t => t?.id === tipoDeDonacionSeleccinado)[0]?.nombre} 
                { tipoDeDonacionSeleccinado !== 1 &&
                <Select
                  variant="outlined"
                  size="small"
                  id="facultad"
                  name="facultad"
                  fullWidth
                    value={regaloSeleccionado}
                    onChange={e => {
                      setRegaloSeleccionado(e?.target?.value)
                    }}
                >
                  {nombreRegalos?.length &&
                    nombreRegalos?.filter(regalo => regalo?.tipo_donacion_id === tipoDeDonacionSeleccinado )?.map((regalo) => {
                      return (
                        <MenuItem key={regalo?.nombre} value={regalo?.nombre}>
                          {regalo?.nombre}
                        </MenuItem>
                      );
                    })}
                </Select>}
              </Typography>           
             
              <Button 
                variant="outlined"  
                size="small"
                style={{
                  marginTop: 5
                }}
                onClick={e => {
                      setSorteo([])
                      function getRandomInt(max) {
                        return Math.floor(Math.random() * max);
                      }
                      
                  if (tipoDeDonacionSeleccinado === 1) {
                    facultades?.forEach(facultad => {
                        
                      const r = regalos?.filter(regalo => regalo?.tipo_donacion_id === tipoDeDonacionSeleccinado &&
                        regalo?.facultad_id === facultad?.id)
                      const p = facultad?.profesores?.filter(profesor => profesor?.asistio?.trim() === 'SI' && !profesor?.regalo_id)
                      console.log(facultad?.profesores)
                      if (r?.length > 0 && p?.length > 0) {
                        console.log('regalos: ')
                        console.log(r)
                        console.log('profesores')
                        console.log(p)

                        const indiceRegaloSeleccionado = getRandomInt(r?.length)
                        const indiceProfesorSeleccionado = getRandomInt(p?.length)
                        
                        console.log(indiceRegaloSeleccionado)
                        console.log(indiceProfesorSeleccionado)

                        const regaloSeleccionado = r[indiceRegaloSeleccionado]
                        const profesorSeleccionado = p[indiceProfesorSeleccionado]

                        console.log(regaloSeleccionado)
                        console.log(profesorSeleccionado)

                        console.log('sorteo')
                        console.log(sorteo)

                        setSorteo(prev => [...prev, {
                          profesor: profesorSeleccionado,
                          regalo: regaloSeleccionado,
                        }])

                        console.log(facultades?.map(prev => {
                          if (prev?.id === facultad?.id) {
                            prev['isFlipped'] = true
                            prev['profesorSeleccionado'] = profesorSeleccionado
                            prev['regaloSeleccionado'] = regaloSeleccionado
                          }
                          return prev
                        }))
                      }
                    })
                  } else if (tipoDeDonacionSeleccinado === 2) {
                    facultades?.forEach(facultad => {
                      console.log('iteracion por facultad')
                      const r = regalos?.filter(regalo => regalo?.tipo_donacion_id === tipoDeDonacionSeleccinado &&
                        regalo?.facultad_id === facultad?.id && regalo?.nombre === regaloSeleccionado)                      
                      const p = facultad?.profesores?.filter(profesor => profesor?.asistio?.trim() === 'SI' && !profesor?.regalo_id)
                      console.log(facultad?.profesores)
                      if (r?.length > 0 && p?.length > 0) {
                        console.log('regalos: ')
                        console.log(r)
                        console.log('profesores')
                        console.log(p)
                             
                        function shuffleArray(inputArray){
                          return inputArray.sort((a, b)=> (Math.random() - a?.id) - (Math.random() - b?.id));
                        } 

                        const rMezclado = shuffleArray(r)
                        const pMezclado = shuffleArray(p)

                        while (rMezclado?.length > 0 && pMezclado?.length > 0) 
                        {
                          const profesorSeleccionado = pMezclado?.pop()
                          const regaloSeleccionado = rMezclado?.pop()
                          console.log('iteracion por regalo')
                          setSorteo(prev => [...prev, {
                            profesor: profesorSeleccionado,
                            regalo: regaloSeleccionado,
                          }])
                        }                                                                                                                      
                      }
                    })
                  } else if (tipoDeDonacionSeleccinado >= 3) {                    
                      console.log('iteracion por facultad')
                      const r = regalos?.filter(regalo => regalo?.tipo_donacion_id === tipoDeDonacionSeleccinado &&
                        regalo?.nombre === regaloSeleccionado) 
                    const rNuevo = r?.map(regalo => {
                      if (regalo?.facultad_id === -1) {
                        const indiceFacultadSeleccionado = getRandomInt(r?.length)
                        console.log('facultadSeleccionada')
                        regalo.facultad_id = facultades[indiceFacultadSeleccionado]?.id
                      }
                      return regalo
                    })
                    console.log(rNuevo)
                    console.log('regalos tipodonacion3, pueden o no tener facultad_id')
                    console.log(r)
                    
                    facultades?.forEach(facultad => {
                      console.log('iteracion por facultad')
                      const r = rNuevo?.filter(regalo => regalo?.tipo_donacion_id === tipoDeDonacionSeleccinado &&
                        regalo?.facultad_id === facultad?.id && regalo?.nombre === regaloSeleccionado)                      
                      const p = facultad?.profesores?.filter(profesor => profesor?.asistio?.trim() === 'SI' && !profesor?.regalo_id)
                      console.log(facultad?.profesores)
                      if (r?.length > 0 && p?.length > 0) {
                        console.log('regalos: ')
                        console.log(r)
                        console.log('profesores')
                        console.log(p)
                             
                        function shuffleArray(inputArray){
                          return inputArray.sort((a, b)=> (Math.random() - a?.id) - (Math.random() - b?.id));
                        } 

                        const rMezclado = shuffleArray(r)
                        const pMezclado = shuffleArray(p)

                        while (rMezclado?.length > 0 && pMezclado?.length > 0) 
                        {
                          const profesorSeleccionado = pMezclado?.pop()
                          const regaloSeleccionado = rMezclado?.pop()
                          console.log('iteracion por regalo')
                          setSorteo(prev => [...prev, {
                            profesor: profesorSeleccionado,
                            regalo: regaloSeleccionado,
                          }])
                        }                                                                                                                      
                      }
                    })
                  }
                
                      setTimeout(function () {
                        console.log("vean los ganadores");
                        setOpen(true)
                      }, 500);                  
               
                    }}
                  
                disabled={
                  tipoDeDonacionSeleccinado !== 1 ? regaloSeleccionado ? false : true : false
                }
                >
                    EMPEZAR RONDA
              </Button>
              <Button
                onClick={(e) => {
                      setSorteo([])
                      setTipoDeDonacionSeleccionado(undefined)
                }}
              >
                <CloseIcon />
              </Button> 
            </Grid>
            <Grid container justifyContent={'space-between'} flexWrap={"wrap"} 
              style={{                
                width: '100%',
                height: '92.5%',                                                                             
              }}
            >
              {tipoDeDonacionSeleccinado && facultades?.length &&
                facultades?.map(facultad => {
               
                    return (
                      <Grid                         
                        item sm={12} md={6} lg={4} xl={3}
                        style={{                      
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',                          
                          height: '33%',                          
                        }} key={`${facultad?.id}-${facultad?.nombre}`}                        
                      >    
                        <ReactCardFlip isFlipped={facultad?.isFlipped} flipDirection="vertical"
                          style={{
                            width: '100%',
                            height: '100%'
                          }}
                        >
                          <Paper
                            onClick={e => {
                              const facultadesActualizado = [...facultades?.map(f => {
                                if (f?.id === facultad?.id) {
                                  f['isFlipped'] = !f['isFlipped']
                                }
                                return f
                              })]                              
                              setFacultades(facultadesActualizado)
                            }}
                          >
                            <Box  className='pointed'
                              component="img"
                              sx={{
                                height: '127px',
                                width: '367px',                                   
                              }}
                              alt={`${facultad?.nombre}`}                          
                              src={facultad?.logo ? facultad.logo : blanco}
                            />
                            <Grid container justifyContent={'space-around'}>
                            <Typography fontSize={12.5}  style={{
                                  color: facultad?.color || 'black'
                              }}>PROFESORES RESTANTES : {facultad?.profesores?.filter(profesor => profesor?.asistio?.trim() === 'SI' && !profesor?.regalo_id)?.length || 0}</Typography>
                              <Typography fontSize={12.5} style={{
                                  color: facultad?.color || 'black'
                              }}>REGALOS RESTANTES : {regalos?.filter(regalo => regalo?.tipo_donacion_id === tipoDeDonacionSeleccinado && 
                                regalo?.facultad_id === facultad?.id)?.length }</Typography>
                            
                              </Grid>
                            </Paper>                          
                          <Paper
                            onClick={e => {
                              const facultadesActualizado = [...facultades?.map(f => {
                                if (f?.id === facultad?.id) {
                                  f['isFlipped'] = !f['isFlipped']
                                }
                                return f
                              })]                              
                              setFacultades(facultadesActualizado)
                            }}
                          >
                            <Box
                              component="div"
                              sx={{
                                height: '127px',
                                width: '367px',                                
                                textAlign: 'center',
                                paddingTop: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                
                              }}                                                         
                            >
                              <Typography className='pointed' gutterBottom variant="h6" component="div"                                
                                style={{
                                  color: facultad?.color || 'black'
                                }}
                              >
                                {facultad?.nombre}
                              </Typography>                              
                              <Typography className='pointed' style={{
                                  color: facultad?.color || 'black'
                                }} variant="body2" color="text.secondary">
                                GANADOR
                              </Typography>
                              <Typography className='pointed' style={{
                                  color: facultad?.color || 'black'
                                }} variant="body2" color="text.secondary">
                                {  `${facultad?.profesorSeleccionado?.nombre1} ${facultad?.profesorSeleccionado?.nombre2} ${facultad?.profesorSeleccionado?.apellido1} ${facultad?.profesorSeleccionado?.apellido2} : ${facultad?.regaloSeleccionado?.nombre}`}
                              </Typography>
                            </Box>
                          </Paper>                                          
                        </ReactCardFlip>
                      </Grid>                  
                    )
              })}
            </Grid>
        </Paper>
          )
        }
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
                                setSorteo(sorteoEditado)
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
                
                
              
              setSorteo([])                          
              setOpen(false)             
              }}
                    >
                    CONTINUAR
                    </Button>
        </List>
      </Dialog>
      <Dialog open={openasistencia} fullWidth>
        <DialogTitle>ASISTENCIA</DialogTitle>
        <List sx={{ pt: 0 }}>          
          {
            profesores?.length > 0 ?
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
                      borderStartStartRadius: "5px",
                    }}
                  >
                    PROFESOR
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "rgb(153, 0, 0)",
                      color: "white",
                    }}
                  >
                    ASISTIO
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profesores?.length > 0 && profesores?.map((row, i) => {
            
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
                      <TableCell component="th" scope="row">
                        {`${row?.nombre1} ${row?.nombre2} ${row?.apellido1} ${row?.apellido2}`}
                      </TableCell>
                      <TableCell>
                        {row?.asistio?.trim() === 'SI' ? <CheckIcon
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                          
                            const actualizarProfesor = async () => {
                              try {
                                const response = await fetch(
                                  `${process.env.REACT_APP_SERVERURL}/profesor/${row?.cedula}`,
                                  {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      cedula: row?.cedula,
                                      facultadId: row?.facultad_id,
                                      nombre1: row?.nombre1,
                                      nombre2: row?.nombre2,
                                      apellido1: row?.apellido1,
                                      apellido2: row?.apellido2,
                                      asistio: "NO",
                                      imagen: row?.imagen
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
                                  
                            
                            setOpenAsistencia(false)
                            setCargando(true)
                            actualizarProfesor()
                            setOpenAsistencia(true)
                          }}
                        /> : <CloseIcon
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            
                            const actualizarProfesor = async () => {
                              try {
                                const response = await fetch(
                                  `${process.env.REACT_APP_SERVERURL}/profesor/${row?.cedula}`,
                                  {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      cedula: row?.cedula,
                                      facultadId: row?.facultad_id,
                                      nombre1: row?.nombre1,
                                      nombre2: row?.nombre2,
                                      apellido1: row?.apellido1,
                                      apellido2: row?.apellido2,
                                      asistio: "SI",
                                      imagen: row?.imagen
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
                                      
                        
                            setOpenAsistencia(false)
                            setCargando(true)
                            actualizarProfesor()
                            setOpenAsistencia(true)
                          }}
                        />}
                                
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
              </TableContainer> : <Typography style={{ textAlign: 'center' }}>NO HAY PROFESORES REGISTRADOS</Typography>
          }            
          <Button
                      type="submit"
                      fullWidth
                      style={{
                        backgroundColor: "#990000",
                        color: "white",
                        marginTop: 10
              }}
              onClick={e => { 
                setOpenAsistencia(false)
              }}
                    >
                    SALIR
            </Button>          
        </List>
      </Dialog>
    </>
  );
};

export default SeccionSorteo;
