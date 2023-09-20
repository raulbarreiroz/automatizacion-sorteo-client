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
import DialogUpdateAutoridad from "../dialog/DialogUpdateAutoridad";
import Carga from "../Carga";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Tooltip from '@mui/material/Tooltip';
import Visualizador from "../Visualizador";
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"

const SeccionAutoridades = (props) => {
  const [cargando, setCargando] = useState(false);
  const gridBotones = useRef(undefined);
  const [modoDialogUpdateAutoridad, setModoDialogUpdateAutoridad] =
    useState(undefined);
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const [mostrarDialogUpdateAutoridad, setMostrarDialogUpdateAutoridad] =
    useState(false);    
  const [autoridadSeleccionada, setAutoridadSeleccionada] = useState(undefined);
  const [autoridades, setAutoridades] = useState(undefined);  
  const [autoridadesFiltradas, setAutoridadesFiltradas] = useState(undefined)
  const [facultades, setFacultades] = useState(undefined);
  const [carreras, setCarreras] = useState(undefined)    
  const [openVisualizador, setOpenVisualizador] = useState(false)
  const [imagenVisualizador, setImagenVisualizador] = useState(undefined)  
  const [tipoDeAutoridadSeleccionada, setTipoDeAutoridadSeleccionada] = useState(undefined)
  const getAutoridades = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/autoridades`
      );            
      const autoridades = await response.json();
      if (autoridades?.length) {
        setAutoridades(autoridades);
        setTipoDeAutoridadSeleccionada(autoridades[0]?.id)
      } else {
        setAutoridades([]);
        setTipoDeAutoridadSeleccionada('')
      }
      setCargando(false);
    } catch (err) {
      console.log(err);
      setAutoridades([]);
      setTipoDeAutoridadSeleccionada('')
      setCargando(false);
    }    
  }, []);
  
  useEffect(() => {    
    setCargando(true);
    getAutoridades()    
  }, [getAutoridades]);

  useEffect(() => {
    if (tipoDeAutoridadSeleccionada && autoridades?.length) {      
      setAutoridadesFiltradas(autoridades?.filter(a => a?.id === tipoDeAutoridadSeleccionada)[0]?.detalles)
    }
  }, [tipoDeAutoridadSeleccionada, autoridades])

  return (
    <>
      <Paper
        style={{
          width: "100%",
          height: "100%",
          padding: "2.5vh 1.5vw",
        }}
      >
        <Grid
          width={'100%'}
          ref={gridBotones}
          container justifyContent={"flex-start"}          
          columnGap={1}
        >         
          <Grid item xs={12} sm={7} >
            {autoridades?.length > 0 ?              
                <Select
                  sx={{
                    p: 0,
                    m: 0,
                    mb: 2,
                  }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  id="cabecera-select"
                  value={tipoDeAutoridadSeleccionada}
                  onChange={e => {
                    console.log(e?.target?.value)
                    setTipoDeAutoridadSeleccionada(e?.target?.value)
                  }}
                >
                  {
                    autoridades?.length &&
                    autoridades?.map((autoridad, i) => {
                      return (
                        <MenuItem key={i} value={autoridad?.id}>
                          {autoridad?.nombre}
                        </MenuItem>
                      );
                    })
                  }
                </Select>
               : ''
            }
          </Grid>
          <Grid  item xs={12} sm={4} md={2}>
            <Button
              variant="outlined"
              startIcon={<SchoolIcon />}
              endIcon={<AddIcon />}
              sx={{ mb: 2 }}
              size="large"
              onClick={(e) => {
                setMostrarDialogUpdateAutoridad(true);
                setModoDialogUpdateAutoridad("ADD");
                setAutoridadSeleccionada(undefined);
              }}
              fullWidth
            >
              Autoridad
            </Button>
          </Grid>                                          
        </Grid>

        <Grid
          item
          xs={12}
          style={{
            maxHeight: `calc(100% - ${gridBotones?.current?.clientHeight}px)`,
            overflow: autoridades?.length ? "scroll" : "hidden",
          }}
        >          
          {autoridadesFiltradas?.length ? (
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
                      Cédula
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Nombre completo
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Facultad
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Imagen
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Asistio
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
                  {autoridades.map((row, i) => {
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
                          {row.cedula}
                        </TableCell>
                        <TableCell>{`${row?.nombre1} ${row?.nombre2} ${row?.apellido1} ${row?.apellido2}`}</TableCell>
                        <TableCell>
                          {
                            facultades?.filter(
                              (facultad) => facultad?.id === row?.facultad_id
                            )[0]?.nombre
                          }
                        </TableCell>
                        
                        <TableCell>
                          {row?.imagen ?
                            <img
                              src={row?.imagen}
                              alt="cargando"
                              style={{
                                width: '5vw',
                                height: '5vw',
                                borderRadius: '50%',
                                cursor: 'pointer'
                              }}     
                              onClick={e => {
                                setImagenVisualizador(row?.imagen)
                                setOpenVisualizador(true)
                              }}
                            /> : <>
                              <Tooltip title="Profesor no tiene imagen asignada">
                                <AccountCircleIcon style={{
                                width: '5vw',
                            height: '5vw',}} /></Tooltip></>
                          }
                          
                        </TableCell>
                        <TableCell>{ row?.asistio}</TableCell>
                        <TableCell>
                          <EditIcon
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              setMostrarDialogUpdateAutoridad(true);
                              setModoDialogUpdateAutoridad("EDIT");
                              setAutoridadSeleccionada(row);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <DeleteForeverIcon
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              setMostrarDialogUpdateAutoridad(true);
                              setModoDialogUpdateAutoridad("DELETE");
                              setAutoridadSeleccionada(row);
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
              No hay profesores registrados
            </div>
          )}
        </Grid>
      </Paper>
      <DialogUpdateAutoridad
        mostrarDialogUpdateAutoridad={mostrarDialogUpdateAutoridad}
        setMostrarDialogUpdateAutoridad={setMostrarDialogUpdateAutoridad}
        modoDialogUpdateAutoridad={modoDialogUpdateAutoridad}
        setModoDialogUpdateAutoridad={setModoDialogUpdateAutoridad}
        autoridadSeleccionada={autoridadSeleccionada}
        autoridades={autoridades}
        facultades={facultades}
        setCargando={setCargando}                        
      />      
      <Carga cargando={cargando} />
      {
        openVisualizador &&
        <Visualizador
          imagen={imagenVisualizador}
          openVisualizador={openVisualizador}
          setOpenVisualizador={setOpenVisualizador}
        />
      }
    </>
  );
};

export default SeccionAutoridades;
