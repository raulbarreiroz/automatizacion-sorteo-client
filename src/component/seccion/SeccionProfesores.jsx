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
import DialogUpdateProfesor from "../dialog/DialogUpdateProfesor";
import Carga from "../Carga";
import DialogUsarArchivoProfesor from "../dialog/DialogUsarArchivoProfesor";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import PublishIcon from "@mui/icons-material/Publish";
import Divider from "@mui/material/Divider";

const SeccionProfesores = (props) => {
  const [cargando, setCargando] = useState(false);
  const gridBotones = useRef(undefined);
  const [modoDialogUpdateProfesor, setModoDialogUpdateProfesor] =
    useState(undefined);
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const [mostrarDialogUpdateProfesor, setMostrarDialogUpdateProfesor] =
    useState(false);
  const [mostrarDialogUsarArchivo, setMostrarDialogUsarArchivo] =
    useState(false);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(undefined);
  const [profesores, setProfesores] = useState(undefined);
  const [cabeceraId] = useState(12); // cabecera de catalogo de facultad
  const [facultades, setFacultades] = useState(undefined);
  const [cedulas, setCedulas] = useState(undefined);
  const getProfesores = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/profesores`
      );
      const profesores = await response.json();

      if (profesores?.length) {
        setProfesores(profesores);
        const cedulas = profesores?.map((profesor) => profesor?.cedula);
        setCedulas(cedulas?.length ? cedulas : []);
      } else {
        setProfesores([]);
        setCedulas([]);
      }
    } catch (err) {
      console.log(err);
      setProfesores([]);
      setCedulas([]);
    }
    setCargando(false);
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
    setCargando(false);
  }, []);

  useEffect(() => {
    setCargando(true);
    getFacultades();
    getProfesores();
  }, [getProfesores, getFacultades]);

  useEffect(() => {
    console.log("facultades: ");
    console.log(facultades);
  }, [facultades]);

  return (
    <>
      <Paper
        style={{
          width: "100%",
          height: "100%",
          padding: "2.5vh 1.5vw",
        }}
      >
        <Grid ref={gridBotones} container justifyContent={"space-between"}>
          <Grid container item xs={5}>
            <Grid item xs={12} sm={5}>
              <Button
                variant="outlined"
                startIcon={<SchoolIcon />}
                endIcon={<AddIcon />}
                sx={{ mb: 2 }}
                onClick={(e) => {
                  setMostrarDialogUpdateProfesor(true);
                  setModoDialogUpdateProfesor("ADD");
                  setProfesorSeleccionado(undefined);
                }}
                fullWidth
              >
                Profesor
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                sx={{ mb: 2, ml: 2 }}
                startIcon={<SaveAsIcon />}
                endIcon={<PublishIcon />}
                onClick={(e) => {
                  setMostrarDialogUsarArchivo(true);
                }}
              >
                Usar archivo
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          style={{
            maxHeight: `calc(100% - ${gridBotones?.current?.clientHeight}px)`,
            overflow: profesores?.length ? "scroll" : "hidden",
          }}
        >
          {profesores?.length ? (
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
                  {profesores.map((row, i) => {
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
                          <EditIcon
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              setMostrarDialogUpdateProfesor(true);
                              setModoDialogUpdateProfesor("EDIT");
                              setProfesorSeleccionado(row);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <DeleteForeverIcon
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              setMostrarDialogUpdateProfesor(true);
                              setModoDialogUpdateProfesor("DELETE");
                              setProfesorSeleccionado(row);
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
      <DialogUpdateProfesor
        mostrarDialogUpdateProfesor={mostrarDialogUpdateProfesor}
        setMostrarDialogUpdateProfesor={setMostrarDialogUpdateProfesor}
        modoDialogUpdateProfesor={modoDialogUpdateProfesor}
        setModoDialogUpdateProfesor={setModoDialogUpdateProfesor}
        profesorSeleccionado={profesorSeleccionado}
        facultades={facultades}
        setCargando={setCargando}
        getProfesores={getProfesores}
        cabeceraId={cabeceraId}
        cedulas={cedulas}
      />
      <DialogUsarArchivoProfesor
        cedulas={cedulas}
        mostrarDialogUsarArchivo={mostrarDialogUsarArchivo}
        setMostrarDialogUsarArchivo={setMostrarDialogUsarArchivo}
        facultades={facultades}
        cabeceraId={cabeceraId}
        setCargando={setCargando}
        getProfesores={getProfesores}
      />
      <Carga cargando={cargando} />
    </>
  );
};

export default SeccionProfesores;
