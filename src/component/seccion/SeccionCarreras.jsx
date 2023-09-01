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
import DialogUpdateCarrera from "../dialog/DialogUpdateCarrera";
import Carga from "../Carga";

const SeccionCarreras = (props) => {
  const [cargando, setCargando] = useState(false);
  const gridBotones = useRef(undefined);
  const [modoDialogUpdateCarrera, setModoDialogUpdateCarrera] =
    useState(undefined);
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const [mostrarDialogUpdateCarrera, setMostrarDialogUpdateCarrera] =
    useState(false);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(undefined);  
  const [carreras, setCarreras] = useState(undefined)
  const [facultades, setFacultades] = useState(undefined)
  const [directores, setDirectores] = useState(undefined)
  const getCarreras = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/carreras`
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
  const getDirectores = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/directores`
      );
      const facultades = await response.json();
      if (facultades?.length) {
        setDirectores(facultades);
      } else {
        setDirectores([]);
      }
    } catch (err) {
      console.log(err);
      setDirectores([]);
    }    
  }, []);

  useEffect(() => {
    setCargando(true);
    getFacultades()
    getDirectores()
    getCarreras()
    
  }, [getCarreras, getFacultades, getDirectores]);

  useEffect(() => {
    console.log('carreras: ')
    console.log(carreras)    
  })

  useEffect(() => {
    console.log('facultades: ')
    console.log(facultades)
  })

  useEffect(() => {
    console.log('directores: ')
    console.log(directores)
  }, [directores])

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
                  setMostrarDialogUpdateCarrera(true);
                  setModoDialogUpdateCarrera("ADD");
                  setCarreraSeleccionada(undefined);
                }}
                fullWidth
              >
                CARRERA
              </Button>
            </Grid>
            
            </Grid>                     
        </Grid>

        <Grid
          item
          xs={12}
          style={{
            maxHeight: `calc(100% - ${gridBotones?.current?.clientHeight}px)`,
            overflow: carreras?.length ? "scroll" : "hidden",
          }}
        >
          {carreras?.length ? (
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
                      DIRECTOR
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      FACULTAD
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
                  {carreras.map((row, i) => {
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
                        <TableCell>{directores ? directores?.filter(director => director?.carrera_id === row?.id)[0]?.nombre : ''}</TableCell>                       
                        <TableCell>{facultades ? facultades?.filter(facultad => facultad?.id === row?.facultad_id)[0]?.nombre : ''}</TableCell>                        
                        <TableCell>
                          <EditIcon
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              setMostrarDialogUpdateCarrera(true);
                              setModoDialogUpdateCarrera("EDIT");
                              setCarreraSeleccionada(row);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <DeleteForeverIcon
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              setMostrarDialogUpdateCarrera(true);
                              setModoDialogUpdateCarrera("DELETE");
                              setCarreraSeleccionada(row);
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
              NO HAY CARRERAS REGISTRADAS
            </div>
          )}
        </Grid>
      </Paper>
      <DialogUpdateCarrera      
        setMostrarDialogUpdateCarrera={setMostrarDialogUpdateCarrera}
        mostrarDialogUpdateCarrera={mostrarDialogUpdateCarrera}
        modoDialogUpdateCarrera={modoDialogUpdateCarrera}
        setModoDialogUpdateCarrera={setModoDialogUpdateCarrera}
        carreraSeleccionada={carreraSeleccionada}
        carreras={carreras}
        facultades={facultades}
        directores={directores}
        getCarreras={getCarreras}        
        getDirectores={getDirectores}
        setCargando={setCargando}           
      />      
      <Carga cargando={cargando} />
    </>
  );
};

export default SeccionCarreras;
