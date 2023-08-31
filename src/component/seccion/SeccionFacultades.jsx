import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DialogUpdateFacultad from "../dialog/DialogUpdateFacultad";
import Carga from "../Carga";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import imagenNoDisponible from "../../resources/imagen/imagen no disponible.jpg"


const SeccionFacultades = (props) => {
  const [cargando, setCargando] = useState(false);
  const gridBotones = useRef(undefined);
  const [modoDialogUpdateFacultad, setModoDialogUpdateFacultad] =
    useState(undefined);
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const [mostrarDialogUpdateFacultad, setMostrarDialogUpdateFacultad] =
    useState(false);
  const [facultadSeleccionado, setFacultadSeleccionado] = useState(undefined);
  const [facultades, setFacultades] = useState(undefined);
  const [carreras, setCarreras] = useState(undefined)
  const [decanos, setDecanos] = useState(undefined)
  const getFacultades = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/facultades`
      );
      const facultades = await response.json();
      if (facultades?.length) {
        setFacultades(facultades);
      } else {
        setFacultades([]);
      }
    } catch (err) {
      console.log(err);
      setFacultades([]);
    }
    setCargando(false)
  }, []);
  const getDecanos = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/decanos`
      );
      const decanos = await response.json();
      if (decanos?.length) {
        setDecanos(decanos);
      } else {
        setDecanos([]);
      }
    } catch (err) {
      console.log(err);
      setDecanos([]);
    }
    setCargando(false)
  }, []);
  const getCarrerasSinFacultades = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/carreras-sin-facultades`
      );
      const carreras = await response.json();
      if (carreras?.length) {
        setCarreras(carreras);
      } else {
        setCarreras([]);
      }
    } catch (err) {
      console.log(err);
      setCarreras([]);
    }  
    setCargando(false)
  }, []);

  useEffect(() => {
    setCargando(true);
    getCarrerasSinFacultades()
    getDecanos()
    getFacultades();
  }, [getFacultades, getCarrerasSinFacultades, getDecanos]);

  useEffect(() => {
    console.log('hola')
    console.log('faculteades: ')
    console.log(facultades)
  }, [facultades])

  useEffect(() => {
    console.log('decnaos')
    console.log(decanos)
  }, [decanos])

  useEffect(() => {
    console.log('carreras: ')
    console.log(carreras)    
  })

  return (
    <>
      <Paper
        style={{
          width: "100%",
          height: "100%",
          padding: "2.5vh 1.5vw",
        }}
      >
        <Grid  width={'100%'} ref={gridBotones} container justifyContent={"flex-start"}>
          
          <Grid container item xs={6}>
            <Grid item xs={12} sm={5}>
              <Button
                variant="outlined"
                startIcon={<SchoolIcon />}
                endIcon={<AddIcon />}
                sx={{ mb: 2 }}
                onClick={(e) => {
                  setMostrarDialogUpdateFacultad(true);
                  setModoDialogUpdateFacultad("ADD");
                  setFacultadSeleccionado(undefined);
                }}
                fullWidth
              >
                Facultad
              </Button>
            </Grid>
            
            </Grid>                     
        </Grid>

        <Grid
          item
          xs={12}
          style={{
            maxHeight: `calc(100% - ${gridBotones?.current?.clientHeight}px)`,
            overflow: facultades?.length ? "scroll" : "hidden",
          }}
        >
          {facultades?.length ? (
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
                      Nombre
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Color
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Logo
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Carreras
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Decano
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                      width="20px"
                    >
                      Editar
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                        borderStartEndRadius: "5px",
                      }}
                      width="20px"
                    >
                      Borrar
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facultades.map((row, i) => {
                    console.log(row)
                    console.log(decanos)
                    console.log(decanos?.filter(decano => decano?.id === row?.decano_id))
                    return (
                      <TableRow
                        key={`${row?.id}-${i}`}
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
                          {row.nombre}
                        </TableCell>
                        <TableCell>{row.color }</TableCell>
                        <TableCell>
                        <img
                            src={row?.logo || imagenNoDisponible}
                            alt="cargando"
                            style={{
                              width: '5vw',
                              height: '5vw'
                            }}
                          />
                        </TableCell>
                        <TableCell>{row.carreras?.map(carrera => carrera?.nombre)?.join(',')}</TableCell>
                        <TableCell>{decanos?.filter(decano => decano?.id === row?.decano_id)[0]?.nombre}</TableCell>
                        <TableCell>
                          <EditIcon
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              setMostrarDialogUpdateFacultad(true);
                              setModoDialogUpdateFacultad("EDIT");
                              setFacultadSeleccionado(row);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <DeleteForeverIcon
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              setMostrarDialogUpdateFacultad(true);
                              setModoDialogUpdateFacultad("DELETE");
                              setFacultadSeleccionado(row);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div
              style={{
                textAlign: "center",
                margin: "10px 0",
              }}
            >
              NO HAY FACULTADES REGISTRADAS
            </div>
          )}
        </Grid>
      </Paper>
      <DialogUpdateFacultad        
        setMostrarDialogUpdateFacultad={setMostrarDialogUpdateFacultad}
        mostrarDialogUpdateFacultad={mostrarDialogUpdateFacultad}
        modoDialogUpdateFacultad={modoDialogUpdateFacultad}
        setModoDialogUpdateFacultad={setModoDialogUpdateFacultad}
        facultadSeleccionado={facultadSeleccionado}
        carreras={carreras}
        getFacultades={getFacultades}    
        getDecanos={getDecanos}
        setCargando={setCargando}        
      />      
      <Carga cargando={cargando} />
    </>
  );
};

export default SeccionFacultades;
