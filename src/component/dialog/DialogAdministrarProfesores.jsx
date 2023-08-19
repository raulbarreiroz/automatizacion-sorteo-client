import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState, useEffect, useRef } from "react";
import * as React from "react";
import CheckIcon from "@mui/icons-material/Check";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const DialogAdministrarProfesores = (props) => {
  const [facultadesSeleccionadas, setFacultadesSeleccionadas] =
    useState(undefined);
  const [regalosSeleccionados, setRegalosSeleccionados] = useState(undefined)  
  const [agruparPor, setAgruparPor] = useState("FACULTAD");
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(undefined);
  
  useEffect(() => {    
    if (props?.facultades?.length) {
      const facultades = props?.facultades?.map((facultad) => ({
        ...facultad,
        seleccionada: false,
        profesores: props?.profesores?.length
          ? props?.profesores?.filter(
              (profesor) => profesor?.detalle_id === facultad?.id
            )
          : [],
      }));
      if (props?.sorteoSeleccionado?.facultades?.length) {
        for (const facultad of props?.sorteoSeleccionado?.facultades) {
          facultades[facultad?.id]["seleccionada"] = true;
        }
      }
      setFacultadesSeleccionadas(facultades);
    } else {
      setFacultadesSeleccionadas([]); // estariamos en problema jeje
    }    

    if (props?.regalos?.length) {
      const regalos = props?.regalos?.map((regalo) => ({
        ...regalo,
        seleccionada: false, 
        profesores: props?.profesores?.length
          ? props?.profesores?.filter(
              (profesor) => profesor?.detalle_id === facultad?.id
            )
          : [],
      }));
      if (props?.sorteoSeleccionado?.facultades?.length) {
        for (const facultad of props?.sorteoSeleccionado?.facultades) {
          facultades[facultad?.id]["seleccionada"] = true;
        }
      }
      setFacultadesSeleccionadas(facultades);
    } else {
      setFacultadesSeleccionadas([]); // estariamos en problema jeje
    }        
  },[])    

  return (
    <>
      <Dialog fullScreen open={props?.mostrarDialogAdministrarProfesores}>
        <DialogTitle
          style={{
            height: "7.5%",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#990000",
            color: "#fff",
          }}
        >
          <Typography variant="body1">
            ADMINISTRAR PROFESORES QUE PARTICIPARÁN EN EL SORTEO
          </Typography>
          <Button
            variant="outlined"
            onClick={(e) => {
              props?.setMostrarDialogAdministrarProfesores(false);
            }}
          >
            <CloseIcon style={{ color: "white" }} />
          </Button>
        </DialogTitle>
        <DialogContent
          style={{
            margin: 0,
            padding: 15,
          }}
        >
          <Grid
            container
            xs={12}
            style={{
              height: "100%",
            }}
            justifyContent={"space-between"}
          >
            <Grid
              container
              xs={12}
              sm={3.8}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Paper
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "15px 5px",
                }}
                elevation={24}
              >
                <Grid container xs={12} gap={1}>
                  <Grid
                    container
                    xs={12}
                    sm={4}
                    justifyContent={"flex-end"}
                    alignItems={"center"}
                  >
                    AGRUPAR POR
                  </Grid>
                  <Grid xs={12} sm={7.5}>
                    <Select
                      variant="outlined"
                      size="small"
                      id="agruparPor"
                      name="agruparPor"
                      fullWidth
                      value={agruparPor}
                      onChange={(e) => {
                        setAgruparPor(e?.target?.value);
                      }}
                    >
                      {["FACULTAD", "ORDEN ALEATORIA"]?.map((el) => {
                        return (
                          <MenuItem key={el} value={el}>
                            {el}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Grid>
                  <Grid
                    container
                    xs={12}
                    style={{
                      margin: "0 10px",
                    }}
                    justifyContent={"space-between"}
                    rowGap={0.75}
                  >
                    {agruparPor === "FACULTAD" &&
                      facultadesSeleccionadas &&
                      facultadesSeleccionadas?.map((facultad) => {
                        return (
                          <Chip
                            variant="outlined"
                            key={facultad?.id}
                            label={facultad?.nombre}
                            onClick={(e) => {
                              const facultadesSeleccionadasEditado = [
                                ...facultadesSeleccionadas?.map((f) => {
                                  if (facultad?.id === f?.id) {
                                    f["seleccionada"] = !f["seleccionada"];
                                  }
                                  return f;
                                }),
                              ];
                              console.log(facultadesSeleccionadasEditado);
                              setFacultadesSeleccionadas(
                                facultadesSeleccionadasEditado
                              );
                              setGrupoSeleccionado(facultad);
                            }}
                            icon={
                              facultad?.seleccionada ? (
                                <CheckIcon />
                              ) : (
                                <DeleteForeverIcon />
                              )
                            }
                            color={
                              facultad?.seleccionada ? "success" : "primary"
                            }
                            style={{
                              width: "48%",
                            }}
                          />
                        );
                      })}
                  </Grid>
                </Grid>
              </Paper>
            </Grid> 
            <Grid
              container
              xs={12}
              sm={3.8}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Paper
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "15px 5px",
                }}
                elevation={24}
              >
                <Grid container xs={12} gap={1}>
                  {?.length ? (
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
            </Grid>
            <Grid
              container
              xs={12}
              sm={3.8}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Paper
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "15px 5px",
                }}
                elevation={24}
              >
                <Grid container xs={12} gap={1}>
                  <Grid
                    container
                    xs={12}
                    sm={4}
                    justifyContent={"flex-end"}
                    alignItems={"center"}
                  >
                    AGRUPAR POR
                  </Grid>
                  <Grid xs={12} sm={7.5}>
                    <Select
                      variant="outlined"
                      size="small"
                      id="agruparPor"
                      name="agruparPor"
                      fullWidth
                      value={agruparPor}
                      onChange={(e) => {
                        setAgruparPor(e?.target?.value);
                      }}
                    >
                      {["FACULTAD", "ORDEN ALEATORIA"]?.map((el) => {
                        return (
                          <MenuItem key={el} value={el}>
                            {el}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Grid>
                  <Grid
                    container
                    xs={12}
                    style={{
                      margin: "0 10px",
                    }}
                    justifyContent={"space-between"}
                    rowGap={0.75}
                  >
                    {agruparPor === "FACULTAD" &&
                      facultadesSeleccionadas &&
                      facultadesSeleccionadas?.map((facultad) => {
                        return (
                          <Chip
                            variant="outlined"
                            key={facultad?.id}
                            label={facultad?.nombre}
                            onClick={(e) => {
                              const facultadesSeleccionadasEditado = [
                                ...facultadesSeleccionadas?.map((f) => {
                                  if (facultad?.id === f?.id) {
                                    f["seleccionada"] = !f["seleccionada"];
                                  }
                                  return f;
                                }),
                              ];
                              console.log(facultadesSeleccionadasEditado);
                              setFacultadesSeleccionadas(
                                facultadesSeleccionadasEditado
                              );
                              setGrupoSeleccionado(facultad);
                            }}
                            icon={
                              facultad?.seleccionada ? (
                                <CheckIcon />
                              ) : (
                                <DeleteForeverIcon />
                              )
                            }
                            color={
                              facultad?.seleccionada ? "success" : "primary"
                            }
                            style={{
                              width: "48%",
                            }}
                          />
                        );
                      })}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>           
          </Grid>
        </DialogContent>
        <DialogTitle
          style={{
            height: "7.5%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#990000",
            color: "#fff",
          }}
        >
          <Typography variant="body1">FOOTER</Typography>
          <Button
            variant="outlined"
            onClick={(e) => {
              props?.setMostrarDialogAdministrarProfesores(false);
            }}
          >
            <CloseIcon style={{ color: "white" }} />
          </Button>
        </DialogTitle>
      </Dialog>
    </>
  );
};

export default DialogAdministrarProfesores;
