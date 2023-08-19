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
import DialogUpdateUsuario from "../dialog/DialogUpdateUsuario";
import Carga from "../Carga";

const SeccionUsuarios = (props) => {
  const [cargando, setCargando] = useState(false);
  const gridBotones = useRef(undefined);
  const [modoDialogUpdateUsuario, setModoDialogUpdateUsuario] =
    useState(undefined);
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const [mostrarDialogUpdateUsuario, setMostrarDialogUpdateUsuario] =
    useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(undefined);
  const [usuarios, setUsuarios] = useState(undefined);
  const [cabeceraId] = useState(11); // cabecera de catalogo de rol
  const [roles, setRoles] = useState(undefined);
  const getRoles = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/catalogo/${cabeceraId}`
      );
      const cabecera = await response.json();
      if (cabecera?.length) {
        const roles = cabecera[0]?.detalles;
        setRoles(roles?.length ? roles : []);
      } else {
        setRoles([]);
      }
    } catch (err) {
      console.log(err);
      setRoles([]);
    }
    setCargando(false);
  }, [cabeceraId]);
  const getUsuarios = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/usuarios`
      );
      const usuarios = await response.json();

      if (usuarios?.length) {
        console.log("usuarios: ");
        console.log(usuarios);
        setUsuarios(usuarios);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      console.log(err);
      setUsuarios([]);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    setCargando(true);
    getRoles();
    getUsuarios();
  }, [getUsuarios, getRoles]);

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
              setMostrarDialogUpdateUsuario(true);
              setModoDialogUpdateUsuario("ADD");
              setUsuarioSeleccionado(undefined);
            }}
          >
            USUARIO
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            maxHeight: `calc(100% - ${gridBotones?.current?.clientHeight}px)`,
            overflow: usuarios?.length ? "scroll" : "hidden",
          }}
        >
          {usuarios?.length ? (
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
                      EMAIL
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      ALIAS
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      ROL
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
                  {usuarios.map((row, i) => (
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
                        {row.email}
                      </TableCell>
                      <TableCell>{row?.alias}</TableCell>
                      <TableCell>
                        {
                          roles?.filter((rol) => rol?.id === row?.detalle_id)[0]
                            ?.nombre
                        }
                      </TableCell>
                      <TableCell>{row.creado_por}</TableCell>
                      <TableCell>{row.fecha_creacion}</TableCell>
                      <TableCell>
                        <EditIcon
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            setMostrarDialogUpdateUsuario(true);
                            setModoDialogUpdateUsuario("EDIT");
                            setUsuarioSeleccionado(row);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteForeverIcon
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            setMostrarDialogUpdateUsuario(true);
                            setModoDialogUpdateUsuario("DELETE");
                            setUsuarioSeleccionado(row);
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
              No hay Usuarios registrados
            </div>
          )}
        </Grid>
      </Paper>
      <DialogUpdateUsuario
        mostrarDialogUpdateUsuario={mostrarDialogUpdateUsuario}
        setMostrarDialogUpdateUsuario={setMostrarDialogUpdateUsuario}
        modoDialogUpdateUsuario={modoDialogUpdateUsuario}
        setModoDialogUpdateUsuario={setModoDialogUpdateUsuario}
        usuarioSeleccionado={usuarioSeleccionado}
        setCargando={setCargando}
        getUsuarios={getUsuarios}
        roles={roles}
        cabeceraId={cabeceraId}
      />
      <Carga cargando={cargando} />
    </>
  );
};

export default SeccionUsuarios;
