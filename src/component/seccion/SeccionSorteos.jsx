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
import DialogUpdateSorteo from "../dialog/DialogUpdateSorteo";
import Carga from "../Carga";

const SeccionSorteos = (props) => {
  const [cargando, setCargando] = useState(false);
  const gridBotones = useRef(undefined);
  const [modoDialogUpdateSorteo, setModoDialogUpdateSorteo] =
    useState(undefined);
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const [mostrarDialogUpdateSorteo, setMostrarDialogUpdateSorteo] =
    useState(false);
  const [sorteoSeleccionado, setSorteoSeleccionado] = useState(undefined);
  const [sorteos, setSorteos] = useState(undefined);
  const [profesores, setProfesores] = useState(undefined);
  const [regalos, setRegalos] = useState(undefined);
  const [facultades, setFacultades] = useState(undefined);
  const [cabeceraId] = useState(12);
  const getFacultades = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/catalogo/${cabeceraId}`
      );
      const cabecera = await response.json();
      if (cabecera?.length) {
        const facultades = cabecera[0]?.detalles;
        setFacultades(facultades?.length ? facultades : []);
      } else {
        setFacultades([]);
      }
    } catch (err) {
      console.log(err);
      setFacultades([]);
    }
    setCargando(false);
  }, [cabeceraId]);
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
        `${process.env.REACT_APP_SERVERURL}/regalos`
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
    setCargando(false);
  }, []);
  const getSorteos = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/sorteos`
      );
      const sorteos = await response.json();

      if (sorteos?.length) {
        console.log("sorteos: ");
        console.log(sorteos);
        setSorteos(sorteos);
      } else {
        setSorteos([]);
      }
    } catch (err) {
      console.log(err);
      setSorteos([]);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    console.log("profesores: ");
    console.log(profesores);
  }, [profesores]);

  useEffect(() => {
    console.log("regalos: ");
    console.log(regalos);
  }, [regalos]);

  useEffect(() => {
    setCargando(true);
    getFacultades();
    getRegalos();
    getProfesores();
    getSorteos();
  }, [getSorteos, getProfesores, getRegalos, getFacultades]);

  return (
    <>
      <Paper
        style={{
          width: "100%",
          height: "100%",
          padding: "2.5vh 1.5vw",
        }}
      >
        <Grid ref={gridBotones}>
          <Button
            variant="outlined"
            startIcon={<SchoolIcon />}
            endIcon={<AddIcon />}
            sx={{ mb: 2 }}
            onClick={(e) => {
              setMostrarDialogUpdateSorteo(true);
              setModoDialogUpdateSorteo("ADD");
              setSorteoSeleccionado(undefined);
            }}
          >
            SORTEO
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            maxHeight: `calc(100% - ${gridBotones?.current?.clientHeight}px)`,
            overflow: sorteos?.length ? "scroll" : "hidden",
          }}
        >
          {sorteos?.length ? (
            <TableContainer
              component={Paper}
              style={{
                overflowX: "initial",
              }}
            >
              <Table aria-label="tabla de Regalos" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                        borderStartStartRadius: "5px",
                      }}
                    >
                      NOMBRE
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      PROFESORES
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      REGALOS
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Creado por
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Fecha de Creacion
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
                  {sorteos.map((row, i) => (
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
                      <TableCell>
                        <ul>
                          {row?.profesores?.map((profesor, i) => (
                            <li
                              key={`${profesor?.id}-${i}`}
                            >{`${profesor?.nombre1} ${profesor?.nombre2} ${profesor?.apellido1} ${profesor?.apellido2}`}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <ul>
                          {row?.regalos?.map((regalo) => (
                            <li>{regalo?.nombre}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>{row.creado_por}</TableCell>
                      <TableCell>{row.fecha_creacion}</TableCell>
                      <TableCell>
                        <EditIcon
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            setMostrarDialogUpdateSorteo(true);
                            setModoDialogUpdateSorteo("EDIT");
                            setSorteoSeleccionado(row);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteForeverIcon
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            setMostrarDialogUpdateSorteo(true);
                            setModoDialogUpdateSorteo("DELETE");
                            setSorteoSeleccionado(row);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
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
              NO HAY SORTEOS REGISTRADOS
            </div>
          )}
        </Grid>
      </Paper>
      <DialogUpdateSorteo
        mostrarDialogUpdateSorteo={mostrarDialogUpdateSorteo}
        setMostrarDialogUpdateSorteo={setMostrarDialogUpdateSorteo}
        modoDialogUpdateSorteo={modoDialogUpdateSorteo}
        setModoDialogUpdateSorteo={setModoDialogUpdateSorteo}
        sorteoSeleccionado={sorteoSeleccionado}
        setCargando={setCargando}
        getSorteos={getSorteos}
        profesores={profesores}
        regalos={regalos}
        facultades={facultades}
      />
      <Carga cargando={cargando} />
    </>
  );
};

export default SeccionSorteos;
