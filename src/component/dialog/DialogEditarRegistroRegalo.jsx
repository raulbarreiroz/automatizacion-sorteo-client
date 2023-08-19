import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import { mensajesPorCampoRegalo } from "../../resources/utils/mensajesPorCampo";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import CheckIcon from "@mui/icons-material/Check";
import DangerousIcon from "@mui/icons-material/Dangerous";
import Grid from "@mui/material/Grid";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import EditIcon from "@mui/icons-material/Edit";
import MenuItem from "@mui/material/MenuItem";

const DialogEditarRegistroProfesor = (props) => {
  const [mensajesSeleccionados, setMensajesSeleccionado] = useState(undefined);
  const [campo, setCampo] = useState("");

  useEffect(() => {
    if (props?.rowSeleccionado) {
      setCampo(
        props?.rowSeleccionado[props?.campoPorEditarDialogEditarRegistro]
          ?.valor || ""
      );
    }
  }, [props]);

  useEffect(() => {
    if (
      props?.campoPorEditarDialogEditarRegistro &&
      props?.mostrarDialogEditarRegistro
    ) {
      setMensajesSeleccionado(
        mensajesPorCampoRegalo
          ?.filter(
            (mensaje) =>
              mensaje?.campo === props?.campoPorEditarDialogEditarRegistro
          )[0]
          ?.mensajes?.map((row) => {
            let validado = false;
            const rowId = row?.id;
            const rowValidador = row?.validador;
            if (rowId === 0) {
              validado = rowValidador(campo);
            }
            row["validado"] = validado;
            return row;
          })
      );
    }
  }, [props, campo]);

  return (
    <Dialog fullWidth maxWidth={"sm"} open={props.mostrarDialogEditarRegistro}>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#990000",
          color: "white",
          height: "45px",
        }}
      >
        <Typography
          fontSize={"medium"}
        >{`El campo ${props?.campoPorEditarDialogEditarRegistro} presenta errores`}</Typography>
        <Button
          variant="outlined"
          onClick={(e) => {
            props?.setMostrarDialogEditarRegistro(false);
          }}
        >
          <CloseIcon style={{ color: "white" }} />
        </Button>
      </DialogTitle>
      <DialogContent
        style={{
          marginTop: "-15px",
        }}
      >
        <TableContainer
          sx={{
            height: "100%",
            marginTop: "30px",
            marginBottom: "10px",
          }}
          component={Paper}
          style={{
            overflowX: "initial",
          }}
        >
          <Table aria-label="tabla de ingreso de regalos" stickyHeader>
            <TableBody>
              {mensajesSeleccionados
                ?.sort((a, b) => a?.id - b?.id)
                ?.map((row, i) => (
                  <TableRow
                    key={`${row?.orden}-${i}`}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                      style={{
                        width: "10%",
                        borderBottom:
                          i === mensajesSeleccionados?.length - 1
                            ? "0px solid transparent"
                            : "0.1vh solid grey",
                      }}
                    >
                      {!row?.validado ? (
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
                      align="left"
                      style={{
                        borderBottom:
                          i === mensajesSeleccionados?.length - 1
                            ? "0px solid transparent"
                            : "0.1vh solid grey",
                        backgroundColor: row?.validado
                          ? "rgba(0, 255, 0, 0.25)"
                          : "rgba(255, 0, 0, 0.25)",
                      }}
                    >
                      {row?.nombre}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid
          item
          container
          xs={12}
          spacing={2}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Grid item xs={12} sm={8}>
            <TextField
              id="outlined-basic"
              label={props?.campoPorEditarDialogEditarRegistro}
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                mt: 1,
              }}
              value={campo}
              onChange={(e) => {
                setCampo(e?.target?.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mt: "6.5px" }}>
            <Button
              variant="outlined"
              size="medium"
              endIcon={<EditIcon />}
              fullWidth
              startIcon={
                <EditAttributesIcon style={{ transform: "scale(1.75)" }} />
              }
              disabled={
                mensajesSeleccionados
                  ?.map((mensaje) => mensaje?.validado)
                  ?.filter((validado) => !validado)?.length
                  ? true
                  : false
              }
              onClick={(e) => {
                props?.setMostrarDialogEditarRegistro(false);
                console.log("mapping: ");
                const arregloEditado = [
                  ...props?.arrayDeArchivoSeleccionadoConNovedades?.map(
                    (row) => {
                      console.log(row);
                      console.log(props?.rowSeleccionado);
                      if (row?.id === props?.rowSeleccionado?.id) {
                        row[props?.campoPorEditarDialogEditarRegistro] = {
                          valor: campo,
                          novedad: 0,
                          mensaje: "",
                        };
                        const keys = Object?.keys(row);

                        const keysFiltrados = keys?.filter(
                          (key) => key !== "rowConError"
                        );
                        const novedades = keysFiltrados?.map((key) => {
                          return row[key];
                        });
                        row.rowConError =
                          novedades?.filter((novedad) => novedad?.novedad > 0)
                            ?.length > 0;
                      }
                      return row;
                    }
                  ),
                ];
                props?.setArrayDeArchivoSeleccionadoConNovedades(
                  arregloEditado
                );
              }}
            >
              ACTUALIZAR
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditarRegistroProfesor;
