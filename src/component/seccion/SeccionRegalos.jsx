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
import DialogUpdateRegalo from "../dialog/DialogUpdateRegalo";
import Carga from "../Carga";
import DialogUsarArchivoRegalo from "../dialog/DialogUsarArchivoRegalo";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import PublishIcon from "@mui/icons-material/Publish";

const SeccionRegalos = (props) => {
  const [cargando, setCargando] = useState(false);
  const gridBotones = useRef(undefined);
  const [modoDialogUpdateRegalo, setModoDialogUpdateRegalo] =
    useState(undefined);
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const [mostrarDialogUpdateRegalo, setMostrarDialogUpdateRegalo] =
    useState(false);
  const [mostrarDialogUsarArchivo, setMostrarDialogUsarArchivo] =
    useState(false);
  const [regaloSeleccionado, setRegaloSeleccionado] = useState(undefined);
  const [regalos, setRegalos] = useState(undefined);
  const getRegalos = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/regalos`
      );
      const regalos = await response.json();

      if (regalos?.length) {
        console.log('regalos: ')
        console.log(regalos)
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

  useEffect(() => {
    setCargando(true);
    getRegalos();
  }, [getRegalos]);

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
              setMostrarDialogUpdateRegalo(true);
              setModoDialogUpdateRegalo("ADD");
              setRegaloSeleccionado(undefined);
            }}
          >
            Regalo
          </Button>
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
        <Grid
          item
          xs={12}
          style={{
            maxHeight: `calc(100% - ${gridBotones?.current?.clientHeight}px)`,
            overflow: regalos?.length ? "scroll" : "hidden",
          }}
        >
          {regalos?.length ? (
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
                      AUSPICIANTE
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      IMAGEN
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
                  {regalos.map((row, i) => (
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
                      <TableCell>{row?.auspiciante}</TableCell>
                      <TableCell>{row?.imagen}</TableCell>
                      <TableCell>{row.creado_por}</TableCell>
                      <TableCell>{row.fecha_creacion}</TableCell>
                      <TableCell>
                        <EditIcon
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            setMostrarDialogUpdateRegalo(true);
                            setModoDialogUpdateRegalo("EDIT");
                            setRegaloSeleccionado(row);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteForeverIcon
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            setMostrarDialogUpdateRegalo(true);
                            setModoDialogUpdateRegalo("DELETE");
                            setRegaloSeleccionado(row);
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
              No hay Regalos registrados
            </div>
          )}
        </Grid>
      </Paper>
      <DialogUpdateRegalo
        mostrarDialogUpdateRegalo={mostrarDialogUpdateRegalo}
        setMostrarDialogUpdateRegalo={setMostrarDialogUpdateRegalo}
        modoDialogUpdateRegalo={modoDialogUpdateRegalo}
        setModoDialogUpdateRegalo={setModoDialogUpdateRegalo}
        regaloSeleccionado={regaloSeleccionado}
        setCargando={setCargando}
        getRegalos={getRegalos}
      />
      <DialogUsarArchivoRegalo
        mostrarDialogUsarArchivo={mostrarDialogUsarArchivo}
        setMostrarDialogUsarArchivo={setMostrarDialogUsarArchivo}
        setCargando={setCargando}
        getRegalos={getRegalos}
      />
      <Carga cargando={cargando} />
    </>
  );
};

export default SeccionRegalos;
