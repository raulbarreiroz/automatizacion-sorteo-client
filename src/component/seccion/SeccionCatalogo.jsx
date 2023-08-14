import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
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
import DialogUpdateDetalleCatalogo from "../dialog/DialogUpdateDetalleCatalogo";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Carga from "../Carga";

const SeccionCatalogo = (props) => {
  const selectRef = useRef(undefined);
  const gridBotones = useRef(undefined);
  const [modoDialogUpdateDetalleCatalogo, setModoDialogUpdateDetalleCatalogo] =
    useState(undefined);
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const [
    mostrarDialogUpdateDetalleCatalogo,
    setMostrarDialogUpdateDetalleCatalogo,
  ] = useState(false);
  const [catalogos, setCatalogos] = useState(undefined);
  const [cabeceras, setCabeceras] = useState(undefined);
  const [detalles, setDetalles] = useState(undefined);
  const [cabeceraSeleccionada, setcabeceraSeleccionada] = useState({});
  const [updateCabeceraSeleccionada, setUpdateCabeceraSeleccionada] =
    useState(true);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState({});
  const [cargando, setCargando] = useState(false);
  const getCatalogos = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/catalogos`
      );
      const catalogos = await response.json();
      setCatalogos(catalogos || []);
      setCabeceras(
        catalogos?.map((cabecera) => ({
          nombre: cabecera?.nombre,
          id: cabecera?.id,
        }))
      );

      if (updateCabeceraSeleccionada) {
        setcabeceraSeleccionada({
          id: catalogos[0]?.id,
          nombre: catalogos[0]?.nombre,
        });
        setUpdateCabeceraSeleccionada(false);
      }
    } catch (err) {
      console.log(err);
      setCatalogos([]);
      setCabeceras(-1);
      setcabeceraSeleccionada({});
    }
    setCargando(false);
  }, [updateCabeceraSeleccionada]);

  useEffect(() => {
    setCargando(true);
    getCatalogos();
  }, [getCatalogos]);

  useEffect(() => {
    const catalogosFiltrados = catalogos?.filter(
      (catalogo) => catalogo?.id === cabeceraSeleccionada?.id
    );
    if (catalogosFiltrados?.length) {
      setDetalles(catalogosFiltrados[0]?.detalles);
    } else {
      setDetalles([]);
    }
  }, [cabeceraSeleccionada, catalogos]);

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
          ref={gridBotones}
          container
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {cabeceraSeleccionada?.id && (
            <Select
              ref={selectRef}
              sx={{
                p: 0,
                m: 0,
                mb: 2,
                ml: -3,
                transform: "scale(0.9)",
                width: "40%",
              }}
              variant="outlined"
              size="small"
              id="facultad-select"
              value={cabeceraSeleccionada?.id}
              onChange={(e) => {
                const cabeceraIdSeleccionada = e?.target?.value;
                const cabeceraSeleccionada =
                  catalogos?.filter(
                    (catalogo) => catalogo?.id === cabeceraIdSeleccionada
                  )[0] || undefined;
                if (cabeceraSeleccionada) {
                  setcabeceraSeleccionada({
                    id: cabeceraSeleccionada?.id,
                    nombre: cabeceraSeleccionada?.nombre,
                  });
                } else setcabeceraSeleccionada({});
              }}
            >
              {cabeceras?.map((cabecera) => {
                return (
                  <MenuItem key={cabecera?.id} value={cabecera?.id}>
                    {cabecera?.nombre}
                  </MenuItem>
                );
              })}
            </Select>
          )}
          <Button
            variant="outlined"
            endIcon={<AddIcon />}
            sx={{ mb: 2 }}
            onClick={(e) => {
              setMostrarDialogUpdateDetalleCatalogo(true);
              setModoDialogUpdateDetalleCatalogo("ADD");
              setDetalleSeleccionado({});
            }}
          >
            DETALLE
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            maxHeight: `calc(100% - ${gridBotones?.current?.clientHeight}px)`,
            overflow: detalles?.length ? "scroll" : "hidden",
          }}
        >
          {detalles?.length ? (
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
                      Descripcion
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
                  {detalles.map((row, i) => (
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
                        {row.nombre}
                      </TableCell>
                      <TableCell>{row.descripcion}</TableCell>
                      <TableCell>{row.creado_por}</TableCell>
                      <TableCell>{row.fecha_creacion}</TableCell>
                      <TableCell>
                        <EditIcon
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            setMostrarDialogUpdateDetalleCatalogo(true);
                            setModoDialogUpdateDetalleCatalogo("EDIT");
                            setDetalleSeleccionado(row);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteForeverIcon
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            setMostrarDialogUpdateDetalleCatalogo(true);
                            setModoDialogUpdateDetalleCatalogo("DELETE");
                            setDetalleSeleccionado(row);
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
              No existen datos para la cabecera seleccionada
            </div>
          )}
        </Grid>
      </Paper>
      <DialogUpdateDetalleCatalogo
        mostrarDialogUpdateDetalleCatalogo={mostrarDialogUpdateDetalleCatalogo}
        setMostrarDialogUpdateDetalleCatalogo={
          setMostrarDialogUpdateDetalleCatalogo
        }
        modoDialogUpdateDetalleCatalogo={modoDialogUpdateDetalleCatalogo}
        cabeceraSeleccionada={cabeceraSeleccionada}
        detalleSeleccionado={detalleSeleccionado}
        getCatalogos={getCatalogos}
        setCargando={setCargando}
      />
      <Carga cargando={cargando} />
    </>
  );
};

export default SeccionCatalogo;

/**
 * TODO:
 * arreglar select y boton
 */
