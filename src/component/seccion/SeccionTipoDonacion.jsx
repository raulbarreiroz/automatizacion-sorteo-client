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
import DialogUpdateTipoDeDonacion  from "../dialog/DialogUpdateTipoDeDonacion";
import Carga from "../Carga";

const SeccionTipoDonacion = (props) => {
  const [cargando, setCargando] = useState(false);
  const gridBotones = useRef(undefined);
  const [modoDialogUpdateTipoDeDonacion , setModoDialogUpdateTipoDeDonacion ] =
    useState(undefined);
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const [mostrarDialogUpdateTipoDeDonacion , setMostrarDialogUpdateTipoDeDonacion ] =
    useState(false);  
  const [tipoDeDonacionSeleccionada, setTipoDeDonacionSeleccionada] = useState(undefined)
  const [tiposDeDonaciones, setTiposDeDonaciones] = useState(undefined)
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
      setTiposDeDonaciones([])
    }  
    setCargando(false)
  }, []);

  useEffect(() => {
    getTiposDeDonaciones()
  }, [getTiposDeDonaciones])

  useEffect(() => {
    console.log('tiposDeDonacino')
    console.log(tiposDeDonaciones)
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
          
          <Grid container item xs={12}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                startIcon={<SchoolIcon />}
                endIcon={<AddIcon />}
                sx={{ mb: 2 }}
                onClick={(e) => {
                  console.log(e)
                  setMostrarDialogUpdateTipoDeDonacion(true);
                  setModoDialogUpdateTipoDeDonacion("ADD");
                  setTipoDeDonacionSeleccionada(undefined);
                }}
                fullWidth
              >
                TIPO DE DONACION (AUSPICIANTES)
              </Button>
            </Grid>
            
            </Grid>                     
        </Grid>

        <Grid
          item
          xs={12}
          style={{
            maxHeight: `calc(100% - ${gridBotones?.current?.clientHeight}px)`,
            overflow: tiposDeDonaciones?.length ? "scroll" : "hidden",
          }}
        >
          {tiposDeDonaciones?.length ? (
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
                     DESCRIPCION
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
                  {tiposDeDonaciones.map((row, i) => {
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
                        <TableCell>{row.descripcion}</TableCell>                                                      
                        <TableCell>
                          <EditIcon
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              setMostrarDialogUpdateTipoDeDonacion(true);
                              setModoDialogUpdateTipoDeDonacion("EDIT");
                              setTipoDeDonacionSeleccionada(row);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <DeleteForeverIcon
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              setMostrarDialogUpdateTipoDeDonacion(true);
                              setModoDialogUpdateTipoDeDonacion("DELETE");
                              setTipoDeDonacionSeleccionada(row);
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
              NO HAY TIPOS DE DONACIONES REGISTRADAS
            </div>
          )}
        </Grid>
      </Paper>
      <DialogUpdateTipoDeDonacion   
        setMostrarDialogUpdateTipoDeDonacion ={setMostrarDialogUpdateTipoDeDonacion }
        mostrarDialogUpdateTipoDeDonacion ={mostrarDialogUpdateTipoDeDonacion }
        modoDialogUpdateTipoDeDonacion ={modoDialogUpdateTipoDeDonacion }
        setModoDialogUpdateTipoDeDonacion ={setModoDialogUpdateTipoDeDonacion }
        tipoDeDonacionSeleccionada={tipoDeDonacionSeleccionada}       
        getTiposDeDonaciones={getTiposDeDonaciones}
        setCargando={setCargando}        
      />      
      <Carga cargando={cargando} />
    </>
  );
};

export default SeccionTipoDonacion;
