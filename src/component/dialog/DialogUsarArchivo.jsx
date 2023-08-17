import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import XLSX from "sheetjs-style";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Carga from "../Carga";
import { useState, useEffect, useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import CheckIcon from "@mui/icons-material/Check";
import DangerousIcon from "@mui/icons-material/Dangerous";
import DialogDeConfirmacion from "./DialogDeConfirmacion";
import DialogEditarRegistro from "./DialogEditarRegistro";

const DialogUsarArchivo = (props) => {
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const inputRef = useRef(undefined);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(undefined);
  const [arrayDeArchivoSeleccionado, setArrayDeArchivoSeleccionado] = useState(
    []
  );
  const [
    arrayDeArchivoSeleccionadoConNovedades,
    setArrayDeArchivoSeleccionadoConNovedades,
  ] = useState([]);
  const [mostrarDialogDeConfirmacion, setmostrarDialogDeConfirmacion] =
    useState(false);
  const [rowSeleccionado, setRowSeleccionado] = useState(undefined);
  const [borrarRow, setBorrarRow] = useState(false);
  const [mostrarDialogEditarRegistro, setMostrarDialogEditarRegistro] =
    useState(false);
  const [
    campoPorEditarDialogEditarRegistro,
    setCampoPorEditarDialogEditarRegistro,
  ] = useState(undefined);
  const [facultades, setFacultades] = useState(undefined);
  const [cedulas, setCedulas] = useState(undefined);

  useEffect(() => {
    if (props?.facultades) {
      setFacultades(props?.facultades?.length ? props?.facultades : []);
    } else {
      setFacultades([]);
    }
  }, [props?.facultades]);

  useEffect(() => {
    if (props?.cedulas) {
      setCedulas(props?.cedulas?.length ? props?.cedulas : []);
    } else setCedulas([]);
  }, [props?.cedulas]);

  useEffect(() => {
    if (archivoSeleccionado) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setArrayDeArchivoSeleccionado(json);
      };
      reader.readAsArrayBuffer(archivoSeleccionado);
    }
  }, [archivoSeleccionado]);

  useEffect(() => {
    setArrayDeArchivoSeleccionadoConNovedades(
      arrayDeArchivoSeleccionado?.map((row) => {
        const rowCedula = row?.cedula ? row?.cedula?.trim() : "";
        const rowNombre1 = row?.nombre1?.trim() || "";
        const rowNombre2 = row?.nombre2?.trim() || "";
        const rowApellido1 = row?.apellido1?.trim() || "";
        const rowApellido2 = row?.apellido2?.trim() || "";
        const rowFacultad = row?.facultad?.trim() || "";

        const novedades = {
          rowConError: false,
          cedula: {
            novedad: 0,
            mensaje: "",
            valor: rowCedula,
          },
          nombre1: {
            novedad: 0,
            mensaje: "",
            valor: rowNombre1,
          },
          nombre2: {
            novedad: 0,
            mensaje: "",
            valor: rowNombre2,
          },
          apellido1: {
            novedad: 0,
            mensaje: "",
            valor: rowApellido1,
          },
          apellido2: {
            novedad: 0,
            mensaje: "",
            valor: rowApellido2,
          },
          facultad: {
            novedad: 0,
            mensaje: "",
            valor: rowFacultad,
          },
        };

        if (rowCedula) {
          let error = false;
          if (rowCedula?.length !== 10) {
            novedades["cedula"]["novedad"] = 2;
            novedades["cedula"]["mensaje"] =
              "El campo cédula debe tener 10 dígitos";
          } else {
            if (rowCedula?.split("")) {
              rowCedula?.split("")?.forEach((el) => {
                if (isNaN(el)) {
                  error = true;
                }
              });
            }

            if (error) {
              novedades["cedula"]["novedad"] = 2;
              novedades["cedula"]["mensaje"] =
                "El campo cédula debe tener solo números";
            }
          }
        } else {
          novedades["cedula"]["novedad"] = 2;
          novedades["cedula"]["mensaje"] =
            "El campo cédula es obligatorio, no puede ser un campo vacío";
        }

        if (rowNombre1) {
          let error = false;
          if (rowNombre1?.split("")) {
            rowNombre1?.split("")?.forEach((el) => {
              if (!isNaN(el)) {
                error = true;
              }
            });
          }
          if (error) {
            novedades["nombre1"]["novedad"] = 2;
            novedades["nombre1"]["mensaje"] =
              "El campo nombre1 debe tener solo letras";
          }
        } else {
          novedades["nombre1"]["novedad"] = 2;
          novedades["nombre1"]["mensaje"] =
            "El campo nombre1 es obligatorio, no puede ser un campo vacío";
          novedades["rowConError"] = true;
        }

        if (rowNombre2) {
          let error = false;
          if (rowNombre2?.split("")) {
            rowNombre2?.split("")?.forEach((el) => {
              if (!isNaN(el)) {
                error = true;
              }
            });
          }
          if (error) {
            novedades["nombre2"]["novedad"] = 2;
            novedades["nombre2"]["mensaje"] =
              "El campo nombre2 debe tener solo letras";
          }
        } else {
          novedades["nombre2"]["novedad"] = 2;
          novedades["nombre2"]["mensaje"] =
            "El campo nombre2 es obligatorio, no puede ser un campo vacío";
          novedades["rowConError"] = true;
        }

        if (rowApellido1) {
          let error = false;
          if (rowApellido1?.split("")) {
            rowApellido1?.split("")?.forEach((el) => {
              if (!isNaN(el)) {
                error = true;
              }
            });
          }
          if (error) {
            novedades["apellido1"]["novedad"] = 2;
            novedades["apellido1"]["mensaje"] =
              "El campo apellido1 debe tener solo letras";
            novedades["rowConError"] = true;
          }
        } else {
          novedades["apellido1"]["novedad"] = 2;
          novedades["apellido1"]["mensaje"] =
            "El campo apellido1 es obligatorio, no puede ser un campo vacío";
          novedades["rowConError"] = true;
        }

        if (rowApellido2) {
          let error = false;
          if (rowApellido2?.split("")) {
            rowApellido2?.split("")?.forEach((el) => {
              if (!isNaN(el)) {
                error = true;
              }
            });
          }
          if (error) {
            novedades["apellido2"]["novedad"] = 2;
            novedades["apellido2"]["mensaje"] =
              "El campo apellido2 debe tener solo letras";
            novedades["rowConError"] = true;
          }
        } else {
          novedades["apellido2"]["novedad"] = 2;
          novedades["apellido2"]["mensaje"] =
            "El campo apellido2 es obligatorio, no puede ser un campo vacío";
          novedades["rowConError"] = true;
        }

        if (rowFacultad) {
          let error = false;
          const nombreFacultades = facultades?.map(
            (facultad) => facultad?.nombre
          );
          if (nombreFacultades) {
            if (
              !nombreFacultades?.filter(
                (facultad) =>
                  facultad.toUpperCase() === rowFacultad?.toUpperCase()
              )?.length
            ) {
              error = true;
            }
          }

          if (error) {
            novedades["facultad"]["novedad"] = 2;
            novedades["facultad"]["mensaje"] =
              "El campo facultad ingresado, no existe en el catálogo";
            novedades["rowConError"] = true;
          }
        } else {
          novedades["facultad"]["novedad"] = 2;
          novedades["facultad"]["mensaje"] =
            "El campo facultad es obligatorio, no puede ser un campo vacío";
          novedades["rowConError"] = true;
        }

        return {
          ...novedades,
        };
      })
    );
    /**
     * novedad:
     * 0: ninguna
     * 1: advertencia
     * 2: error
     */
  }, [arrayDeArchivoSeleccionado, facultades]);

  useEffect(() => {
    if (borrarRow) {
      setArrayDeArchivoSeleccionadoConNovedades(
        arrayDeArchivoSeleccionadoConNovedades?.filter(
          (row) => row?.cedula !== rowSeleccionado?.cedula
        )
      );
      setBorrarRow(false);
    }
  }, [borrarRow, arrayDeArchivoSeleccionadoConNovedades, rowSeleccionado]);

  const generarTemplate = (data) => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        cedula: "",
        nombre1: "",
        nombre2: "",
        apellido1: "",
        apellido2: "",
        facultad: "",
      },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja 1");
    XLSX.writeFile(workbook, "Profesores.xlsx");
  };

  const generarArchivoFinal = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja 1");
    XLSX.writeFile(workbook, "Archivo Final.xlsx");
  };

  return (
    <>
      <Dialog fullScreen open={props?.mostrarDialogUsarArchivo}>
        <DialogTitle
          style={{
            height: "7.5%",
            marginBottom: "1%",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#990000",
            color: "#fff",
          }}
        >
          <Typography variant="body1">
            INGRESAR PROFESORES MEDIANTE ARCHIVO EXCEL (.XLSX)
          </Typography>
          <Button
            variant="outlined"
            onClick={(e) => {
              props?.setMostrarDialogUsarArchivo(false);
              setArchivoSeleccionado(undefined);
              setArrayDeArchivoSeleccionado(undefined);
              setArrayDeArchivoSeleccionadoConNovedades(undefined);
            }}
          >
            <CloseIcon style={{ color: "white" }} />
          </Button>
        </DialogTitle>
        <DialogContent
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <Box component="form" noValidate sx={{ mt: 0, height: "3.5%" }}>
            <Grid item container xs={12} spacing={2}>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="outlined"
                  component="span"
                  onClick={(e) => {
                    generarTemplate();
                  }}
                  fullWidth
                >
                  GENERAR TEMPLATE
                </Button>
              </Grid>
              <Grid item xs={12} sm={3}>
                <input
                  accept=".xlsx"
                  style={{ display: "none" }}
                  id="raised-button-file"
                  type="file"
                  ref={inputRef}
                  onChange={(e) => {
                    setArchivoSeleccionado(inputRef?.current?.files["0"]);
                  }}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="outlined" component="span" fullWidth>
                    SELECCIONAR ARCHIVO
                  </Button>
                </label>
              </Grid>
              <Grid
                container
                item
                xs={12}
                sm={6}
                sx={{
                  alignItems: "center",
                }}
              >
                <Typography>
                  {archivoSeleccionado?.name || "NINGÚN ARCHIVO SELECCIONADO"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          {arrayDeArchivoSeleccionadoConNovedades?.length ? (
            <TableContainer
              sx={{
                height: "100%",
                marginTop: "30px",
                marginBottom: "10px",
                overflow: arrayDeArchivoSeleccionadoConNovedades?.length
                  ? "scroll"
                  : "hidden",
              }}
              component={Paper}
              style={{
                overflowX: "initial",
              }}
            >
              <Table aria-label="tabla de ingreso de profesores" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                      width="20px"
                    >
                      FILA
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                      width="20px"
                    >
                      Válido
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                      width="20px"
                    >
                      Eliminar
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Cédula
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Nombre1
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Nombre2
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Apellido1
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Apellido2
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                        borderStartEndRadius: "5px",
                      }}
                      width="20px"
                    >
                      Facultad
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {arrayDeArchivoSeleccionadoConNovedades?.map((row, i) => (
                    <TableRow
                      key={`${row?.cedula?.valor}-${i}`}
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
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        style={{
                          borderRight: "0.1vh solid grey",
                          borderBottom:
                            i ===
                            arrayDeArchivoSeleccionadoConNovedades?.length - 1
                              ? "0px solid transparent"
                              : "0.1vh solid grey",
                        }}
                      >
                        {i + 1}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          borderBottom:
                            i ===
                            arrayDeArchivoSeleccionadoConNovedades?.length - 1
                              ? "0px solid transparent"
                              : "0.1vh solid grey",
                        }}
                      >
                        {row?.rowConError ? (
                          <DangerousIcon
                            style={{
                              color: "rgba(255, 0, 0, 0.75)",
                              position: "relative",
                              top: 2.5,
                            }}
                          />
                        ) : (
                          <CheckIcon
                            style={{
                              color: "rgba(0, 255, 0, 0.75)",
                              position: "relative",
                              top: 2.5,
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          borderBottom:
                            i ===
                            arrayDeArchivoSeleccionadoConNovedades?.length - 1
                              ? "0px solid transparent"
                              : "0.1vh solid grey",
                        }}
                      >
                        <DeleteForeverIcon
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            setRowSeleccionado(row);
                            setmostrarDialogDeConfirmacion(true);
                          }}
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          backgroundColor:
                            row?.cedula?.novedad === 0
                              ? "rgba(0, 255, 0, 0.15)"
                              : row?.cedula?.novedad === 1
                              ? "rgba(255, 255, 0, 0.15)"
                              : "rgba(255, 0, 0, 0.15)",
                          borderBottom:
                            i ===
                            arrayDeArchivoSeleccionadoConNovedades?.length - 1
                              ? "0px solid transparent"
                              : "0.1vh solid grey",
                          cursor:
                            row?.cedula?.novedad === 0 ? "default" : "pointer",
                        }}
                        onClick={(e) => {
                          if (row?.cedula?.novedad !== 0) {
                            setRowSeleccionado(row);
                            setMostrarDialogEditarRegistro(true);
                            setCampoPorEditarDialogEditarRegistro("cedula");
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            row?.cedula?.novedad === 0
                              ? ""
                              : row?.cedula?.mensaje +
                                " (clik derecho para corregir)"
                          }
                        >
                          {row?.cedula?.valor === ""
                            ? "----------"
                            : row?.cedula?.valor}
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          backgroundColor:
                            row?.nombre1?.novedad === 0
                              ? "rgba(0, 255, 0, 0.15)"
                              : row?.nombre1?.novedad === 1
                              ? "rgba(255, 255, 0, 0.15)"
                              : "rgba(255, 0, 0, 0.15)",
                          borderBottom:
                            i ===
                            arrayDeArchivoSeleccionadoConNovedades?.length - 1
                              ? "0px solid transparent"
                              : "0.1vh solid grey",
                          cursor:
                            row?.nombre1?.novedad === 0 ? "default" : "pointer",
                        }}
                        onClick={(e) => {
                          if (row?.nombre1?.novedad !== 0) {
                            setRowSeleccionado(row);
                            setMostrarDialogEditarRegistro(true);
                            setCampoPorEditarDialogEditarRegistro("nombre1");
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            row?.nombre1?.novedad === 0
                              ? ""
                              : row?.nombre1?.mensaje +
                                " (click derecho para corregir)"
                          }
                        >
                          {row?.nombre1?.valor === ""
                            ? "----------"
                            : row?.nombre1?.valor}
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          backgroundColor:
                            row?.nombre2?.novedad === 0
                              ? "rgba(0, 255, 0, 0.15)"
                              : row?.nombre2?.novedad === 1
                              ? "rgba(255, 255, 0, 0.15)"
                              : "rgba(255, 0, 0, 0.15)",
                          borderBottom:
                            i ===
                            arrayDeArchivoSeleccionadoConNovedades?.length - 1
                              ? "0px solid transparent"
                              : "0.1vh solid grey",
                          cursor:
                            row?.nombre2?.novedad === 0 ? "default" : "pointer",
                        }}
                        onClick={(e) => {
                          if (row?.nombre2?.novedad !== 0) {
                            setRowSeleccionado(row);
                            setMostrarDialogEditarRegistro(true);
                            setCampoPorEditarDialogEditarRegistro("nombre2");
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            row?.nombre2?.novedad === 0
                              ? ""
                              : row?.nombre2?.mensaje +
                                " (click derecho para corregir)"
                          }
                        >
                          {row?.nombre2?.valor === ""
                            ? "----------"
                            : row?.nombre2?.valor}
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          backgroundColor:
                            row?.apellido1?.novedad === 0
                              ? "rgba(0, 255, 0, 0.15)"
                              : row?.apellido1?.novedad === 1
                              ? "rgba(255, 255, 0, 0.15)"
                              : "rgba(255, 0, 0, 0.15)",
                          borderBottom:
                            i ===
                            arrayDeArchivoSeleccionadoConNovedades?.length - 1
                              ? "0px solid transparent"
                              : "0.1vh solid grey",
                          cursor:
                            row?.apellido1?.novedad === 0
                              ? "default"
                              : "pointer",
                        }}
                        onClick={(e) => {
                          if (row?.apellido1?.novedad !== 0) {
                            setRowSeleccionado(row);
                            setMostrarDialogEditarRegistro(true);
                            setCampoPorEditarDialogEditarRegistro("apellido1");
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            row?.apellido1?.novedad === 0
                              ? ""
                              : row?.apellido1?.mensaje +
                                " (click derecho para corregir)"
                          }
                        >
                          {row?.apellido1?.valor === ""
                            ? "----------"
                            : row?.apellido1?.valor}
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          backgroundColor:
                            row?.apellido2?.novedad === 0
                              ? "rgba(0, 255, 0, 0.15)"
                              : row?.apellido2?.novedad === 1
                              ? "rgba(255, 255, 0, 0.15)"
                              : "rgba(255, 0, 0, 0.15)",
                          borderBottom:
                            i ===
                            arrayDeArchivoSeleccionadoConNovedades?.length - 1
                              ? "0px solid transparent"
                              : "0.1vh solid grey",
                          cursor:
                            row?.apellido2?.novedad === 0
                              ? "default"
                              : "pointer",
                        }}
                        onClick={(e) => {
                          if (row?.apellido2?.novedad !== 0) {
                            setRowSeleccionado(row);
                            setMostrarDialogEditarRegistro(true);
                            setCampoPorEditarDialogEditarRegistro("apellido2");
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            row?.apellido2?.novedad === 0
                              ? ""
                              : row?.apellido2?.mensaje +
                                " (click derecho para corregir)"
                          }
                        >
                          {row?.apellido2?.valor === ""
                            ? "----------"
                            : row?.apellido2?.valor}
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          backgroundColor:
                            row?.facultad?.novedad === 0
                              ? "rgba(0, 255, 0, 0.15)"
                              : row?.facultad?.novedad === 1
                              ? "rgba(255, 255, 0, 0.15)"
                              : "rgba(255, 0, 0, 0.15)",
                          borderBottom:
                            i ===
                            arrayDeArchivoSeleccionadoConNovedades?.length - 1
                              ? "0px solid transparent"
                              : "0.1vh solid grey",
                          cursor:
                            row?.facultad?.novedad === 0
                              ? "default"
                              : "pointer",
                        }}
                        onClick={(e) => {
                          if (row?.facultad?.novedad !== 0) {
                            setRowSeleccionado(row);
                            setMostrarDialogEditarRegistro(true);
                            setCampoPorEditarDialogEditarRegistro("facultad");
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            row?.facultad?.novedad === 0
                              ? ""
                              : row?.facultad?.mensaje +
                                " (click derecho para corregir)"
                          }
                        >
                          {row?.facultad?.valor === ""
                            ? "----------"
                            : row?.facultad?.valor}
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography
              sx={{
                mt: "30px",
                textAlign: "center",
                display: archivoSeleccionado?.name ? "block" : "none",
              }}
            >
              ARCHIVO VACÍO
            </Typography>
          )}

          <Grid item xs={12} sm={12} style={{ height: "5%" }}>
            <Button
              sm={12}
              type="submit"
              style={{
                backgroundColor: "#990000",
                color: "white",
                width: "100%",
                display: arrayDeArchivoSeleccionadoConNovedades?.length
                  ? "block"
                  : "none",
              }}
              disabled={
                arrayDeArchivoSeleccionadoConNovedades?.filter(
                  (row) => row?.rowConError
                )?.length > 0
              }
              onClick={async (e) => {
                let profesor;
                const crearProfesor = async (row, archivoFinal) => {
                  const cedula = row?.cedula?.valor;
                  const facultad = facultades?.filter(
                    (facultad) => facultad?.nombre === row?.facultad?.valor
                  )[0]?.id;
                  const nombre1 = row?.nombre1?.valor;
                  const nombre2 = row?.nombre2?.valor;
                  const apellido1 = row?.apellido1?.valor;
                  const apellido2 = row?.apellido2?.valor;

                  try {
                    const response = await fetch(
                      `${process.env.REACT_APP_SERVERURL}/profesor`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          cedula,
                          detalleId: facultad,
                          nombre1,
                          nombre2,
                          apellido1,
                          apellido2,
                          cabeceraId: props?.cabeceraId,
                          creadoPor: "admin@test.com",
                        }),
                      }
                    );
                    profesor = {
                      cedula,
                      facultad,
                      nombre1,
                      nombre2,
                      apellido1,
                      apellido2,
                      statusCode: response?.status,
                    };
                  } catch (err) {
                    profesor = {
                      cedula,
                      facultad,
                      nombre1,
                      nombre2,
                      apellido1,
                      apellido2,
                      error: err,
                    };
                  }

                  return profesor;
                };

                props?.setCargando(true);
                props?.setMostrarDialogUsarArchivo(false);
                e.preventDefault();
                const archivoFinal = [];
                for (const row of arrayDeArchivoSeleccionadoConNovedades) {
                  const profesor = await crearProfesor(row, archivoFinal);
                  archivoFinal?.push(profesor);
                }
                generarArchivoFinal(archivoFinal);
                setArchivoSeleccionado(undefined);
                setArrayDeArchivoSeleccionado(undefined);
                setArrayDeArchivoSeleccionadoConNovedades(undefined);
                props?.getProfesores();
              }}
            >
              GENERAR PROFESORES
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
      <DialogDeConfirmacion
        mostrarDialogDeConfirmacion={mostrarDialogDeConfirmacion}
        setMostrarDialogDeConfirmacion={setmostrarDialogDeConfirmacion}
        setBorrarRow={setBorrarRow}
      />
      <DialogEditarRegistro
        mostrarDialogEditarRegistro={mostrarDialogEditarRegistro}
        setMostrarDialogEditarRegistro={setMostrarDialogEditarRegistro}
        campoPorEditarDialogEditarRegistro={campoPorEditarDialogEditarRegistro}
        setArrayDeArchivoSeleccionadoConNovedades={
          setArrayDeArchivoSeleccionadoConNovedades
        }
        arrayDeArchivoSeleccionadoConNovedades={
          arrayDeArchivoSeleccionadoConNovedades
        }
        facultades={facultades}
        cedulas={cedulas}
        rowSeleccionado={rowSeleccionado}
        setRowSeleccionado={setRowSeleccionado}
      />
    </>
  );
};

export default DialogUsarArchivo;
