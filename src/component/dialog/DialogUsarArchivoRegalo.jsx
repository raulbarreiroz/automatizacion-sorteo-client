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
import { useState, useEffect, useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import CheckIcon from "@mui/icons-material/Check";
import DangerousIcon from "@mui/icons-material/Dangerous";
import DialogDeConfirmacion from "./DialogDeConfirmacion";
import DialogEditarRegistroRegalo from "./DialogEditarRegistroRegalo";

const DialogUsarArchivoRegalo = (props) => {
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
      arrayDeArchivoSeleccionado?.map((row, i) => {
        const rowNombre = row?.nombre?.trim() || "";
        const rowAuspiciante = row?.auspiciante?.trim() || "";

        const novedades = {
          id: i,
          rowConError: false,
          nombre: {
            novedad: 0,
            mensaje: "",
            valor: rowNombre,
          },
          auspiciante: {
            novedad: 0,
            mensaje: "",
            valor: rowAuspiciante,
          },
        };

        if (!rowNombre) {
          novedades["nombre"]["novedad"] = 2;
          novedades["nombre"]["mensaje"] =
            "El campo nombre1 es obligatorio, no puede ser un campo vacío";
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
  }, [arrayDeArchivoSeleccionado]);

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
        nombre: "",
        auspiciante: "",
      },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja 1");
    XLSX.writeFile(workbook, "Regalos.xlsx");
  };

  const generarArchivoFinal = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja 1");
    XLSX.writeFile(workbook, "Archivo Final Regalos.xlsx");
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
            INGRESAR REGALOS MEDIANTE ARCHIVO EXCEL (.XLSX)
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
              <Table aria-label="tabla de ingreso de regalos" stickyHeader>
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
                      NOMBRE
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      AUSPICIANTE
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
                            row?.nombre?.novedad === 0
                              ? "rgba(0, 255, 0, 0.15)"
                              : row?.nombre?.novedad === 1
                              ? "rgba(255, 255, 0, 0.15)"
                              : "rgba(255, 0, 0, 0.15)",
                          borderBottom:
                            i ===
                            arrayDeArchivoSeleccionadoConNovedades?.length - 1
                              ? "0px solid transparent"
                              : "0.1vh solid grey",
                          cursor:
                            row?.nombre?.novedad === 0 ? "default" : "pointer",
                        }}
                        onClick={(e) => {
                          if (row?.nombre?.novedad !== 0) {
                            setRowSeleccionado(row);
                            setMostrarDialogEditarRegistro(true);
                            setCampoPorEditarDialogEditarRegistro("nombre");
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            row?.nombre?.novedad === 0
                              ? ""
                              : row?.nombre?.mensaje +
                                " (clik derecho para corregir)"
                          }
                        >
                          {row?.nombre?.valor === ""
                            ? "----------"
                            : row?.nombre?.valor}
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          backgroundColor:
                            row?.auspiciante?.novedad === 0
                              ? "rgba(0, 255, 0, 0.15)"
                              : row?.auspiciante?.novedad === 1
                              ? "rgba(255, 255, 0, 0.15)"
                              : "rgba(255, 0, 0, 0.15)",
                          borderBottom:
                            i ===
                            arrayDeArchivoSeleccionadoConNovedades?.length - 1
                              ? "0px solid transparent"
                              : "0.1vh solid grey",
                          cursor:
                            row?.auspiciante?.novedad === 0
                              ? "default"
                              : "pointer",
                        }}
                        onClick={(e) => {
                          if (row?.auspiciante?.novedad !== 0) {
                            setRowSeleccionado(row);
                            setMostrarDialogEditarRegistro(true);
                            setCampoPorEditarDialogEditarRegistro(
                              "auspiciante"
                            );
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            row?.auspiciante?.novedad === 0
                              ? ""
                              : row?.auspiciante?.mensaje +
                                " (click derecho para corregir)"
                          }
                        >
                          {row?.auspiciante?.valor === ""
                            ? "----------"
                            : row?.auspiciante?.valor}
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
                let regalo;
                const crearRegalo = async (row, archivoFinal) => {
                  const nombre = row?.nombre?.valor;
                  const auspiciante = row?.auspiciante?.valor;

                  try {
                    const response = await fetch(
                      `${process.env.REACT_APP_SERVERURL}/regalo`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          nombre,
                          auspiciante,
                          creadoPor: "admin@test.com",
                        }),
                      }
                    );
                    regalo = {
                      nombre,
                      auspiciante,
                      statusCode: response?.status,
                    };
                  } catch (err) {
                    regalo = {
                      nombre,
                      auspiciante,
                      error: err,
                    };
                  }

                  return regalo;
                };

                props?.setCargando(true);
                props?.setMostrarDialogUsarArchivo(false);
                e.preventDefault();
                const archivoFinal = [];
                for (const row of arrayDeArchivoSeleccionadoConNovedades) {
                  const regalo = await crearRegalo(row, archivoFinal);
                  archivoFinal?.push(regalo);
                }
                generarArchivoFinal(archivoFinal);
                setArchivoSeleccionado(undefined);
                setArrayDeArchivoSeleccionado(undefined);
                setArrayDeArchivoSeleccionadoConNovedades(undefined);
                props?.getRegalos();
              }}
            >
              GENERAR REGALOS
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
      <DialogDeConfirmacion
        mostrarDialogDeConfirmacion={mostrarDialogDeConfirmacion}
        setMostrarDialogDeConfirmacion={setmostrarDialogDeConfirmacion}
        setBorrarRow={setBorrarRow}
      />
      <DialogEditarRegistroRegalo
        mostrarDialogEditarRegistro={mostrarDialogEditarRegistro}
        setMostrarDialogEditarRegistro={setMostrarDialogEditarRegistro}
        campoPorEditarDialogEditarRegistro={campoPorEditarDialogEditarRegistro}
        setArrayDeArchivoSeleccionadoConNovedades={
          setArrayDeArchivoSeleccionadoConNovedades
        }
        arrayDeArchivoSeleccionadoConNovedades={
          arrayDeArchivoSeleccionadoConNovedades
        }
        rowSeleccionado={rowSeleccionado}
        setRowSeleccionado={setRowSeleccionado}
      />
    </>
  );
};

export default DialogUsarArchivoRegalo;
