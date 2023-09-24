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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Tooltip from "@mui/material/Tooltip";
import Visualizador from "../Visualizador";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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
  const [autoridadesFiltradas, setAutoridadesFiltradas] = useState(undefined);
  const [facultades, setFacultades] = useState(undefined);
  const [carreras, setCarreras] = useState(undefined);
  const [openVisualizador, setOpenVisualizador] = useState(false);
  const [imagenVisualizador, setImagenVisualizador] = useState(undefined);
  const [tipoDeAutoridadSeleccionada, setTipoDeAutoridadSeleccionada] =
    useState(undefined);
  const getAutoridades = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/autoridades`
      );
      const autoridades = await response.json();
      if (autoridades?.length) {
        setAutoridades(autoridades);
        setTipoDeAutoridadSeleccionada(autoridades[0]?.id);
      } else {
        setAutoridades([]);
        setTipoDeAutoridadSeleccionada("");
      }
      setCargando(false);
    } catch (err) {
      console.log(err);
      setAutoridades([]);
      setTipoDeAutoridadSeleccionada("");
      setCargando(false);
    }
  }, []);
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
      setCargando(false);
    } catch (err) {
      console.log(err);
      setCarreras([]);
    }
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
        setFacultades(facultades);
      }
    } catch (err) {
      console.log(err);
      setFacultades([]);
    }
  }, []);

  useEffect(() => {
    setCargando(true);
    getFacultades();
    getCarreras();
    getAutoridades();
  }, [getAutoridades, getFacultades, getCarreras]);

  useEffect(() => {
    if (tipoDeAutoridadSeleccionada && autoridades?.length) {
      setAutoridadesFiltradas(
        autoridades?.filter((a) => a?.id === tipoDeAutoridadSeleccionada)[0]
          ?.detalles
      );
    }
  }, [tipoDeAutoridadSeleccionada, autoridades]);

  useEffect(() => {
    console.log("autoridades: ");
    console.log(autoridades);
  }, [autoridades]);

  useEffect(() => {
    console.log("autoridadesFiltradas");
    console.log(autoridadesFiltradas);
  }, [autoridadesFiltradas]);

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
          width={"100%"}
          ref={gridBotones}
          container
          justifyContent={"flex-start"}
          columnGap={1}
        >
          <Grid item xs={12} sm={5.5}>
            {autoridades?.length > 0 ? (
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
                onChange={(e) => {
                  console.log(e?.target?.value);
                  setTipoDeAutoridadSeleccionada(e?.target?.value);
                }}
              >
                {autoridades?.length &&
                  autoridades?.map((autoridad, i) => {
                    return (
                      <MenuItem key={i} value={autoridad?.id}>
                        {autoridad?.nombre}
                      </MenuItem>
                    );
                  })}
              </Select>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12} sm={5.5} lg={2}>
            <Button
              variant="outlined"
              startIcon={<SchoolIcon />}
              endIcon={<AddIcon />}
              sx={{ mb: 2 }}
              size="large"
              fullWidth
              onClick={(e) => {
                setMostrarDialogUpdateAutoridad(true);
                setModoDialogUpdateAutoridad("ADD");
                setAutoridadSeleccionada(undefined);
              }}
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
            overflow: autoridadesFiltradas?.length > 0 ? "scroll" : "hidden",
          }}
        >
          {autoridadesFiltradas?.length > 0 ? (
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
                      NOMBRE
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
                  {autoridadesFiltradas.map((row, i) => {
                    console.log("iteracion");
                    console.log(row);
                    return (
                      <TableRow
                        key={`${row?.nombre}-${row?.id}-${i}`}
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
                          {tipoDeAutoridadSeleccionada === 1 &&
                          facultades?.length
                            ? facultades?.filter(
                                (facultad) =>
                                  facultad?.id === row?.institucion_id
                              )[0]?.nombre
                            : (tipoDeAutoridadSeleccionada === 2 ||
                                tipoDeAutoridadSeleccionada === 3) &&
                              carreras?.length &&
                              carreras?.filter(
                                (carrera) => carrera?.id === row?.institucion_id
                              )[0]?.nombre}
                        </TableCell>

                        <TableCell>
                          {row?.imagen ? (
                            <img
                              src={row?.imagen}
                              alt="cargando"
                              style={{
                                width: "5vw",
                                height: "5vw",
                                borderRadius: "50%",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                setImagenVisualizador(row?.imagen);
                                setOpenVisualizador(true);
                              }}
                            />
                          ) : (
                            <>
                              <Tooltip title="Autoridad no tiene imagen asignada">
                                <AccountCircleIcon
                                  style={{
                                    width: "5vw",
                                    height: "5vw",
                                  }}
                                />
                              </Tooltip>
                            </>
                          )}
                        </TableCell>
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
              No hay autoridades registrados
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
        carreras={carreras}
        setCargando={setCargando}
        tipoDeAutoridadSeleccionada={tipoDeAutoridadSeleccionada}
        getAutoridades={getAutoridades}
        autoridadesFiltradas={autoridadesFiltradas}
      />
      <Carga cargando={cargando} />
      {openVisualizador && (
        <Visualizador
          imagen={imagenVisualizador}
          openVisualizador={openVisualizador}
          setOpenVisualizador={setOpenVisualizador}
        />
      )}
    </>
  );
};

export default SeccionAutoridades;
