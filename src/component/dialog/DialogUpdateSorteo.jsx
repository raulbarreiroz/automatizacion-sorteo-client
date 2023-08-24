import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import ErrorIcon from "@mui/icons-material/Error";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";

const DialogUpdateSorteo = (props) => {
  const [profesores, setProfesores] = useState(undefined);
  const [profesoresSeleccionados, setProfesoresSeleccionados] =
    useState(undefined);
  const [regalos, setRegalos] = useState(undefined);
  const [regalosSeleccionados, setRegalosSeleccionados] = useState(undefined);
  const [
    mostrarDialogAdministrarProfesores,
    setMostrarDialogAdministrarProfesores,
  ] = useState(false);
  const [facultades, setFacultades] = useState(undefined);
  const [facultadesSeleccionadas, setFacultadesSeleccionadas] =
    useState(undefined);
  const [agruparProfesoresPor, setAgruparProfesoresPor] = useState("facultad");

  const handleSubmit = (event) => {
    const crearSorteo = async () => {
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const pwd = data?.get("pwd");
      const alias = data?.get("alias");
      const rol = data?.get("rol");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/sorteo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              pwd,
              alias,
              cabeceraId: props?.cabeceraId,
              detalleId: rol,
              creadoPor: "admin@test.com",
            }),
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateSorteo(false);
          props?.getSorteos();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const actualizarSorteo = async () => {
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const pwd = data?.get("pwd");
      const alias = data?.get("alias");
      const rol = data?.get("rol");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/sorteo/${props?.sorteoSeleccionado?.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              pwd: props?.modoDialogUpdateSorteo === "EDIT" ? undefined : pwd,
              alias,
              cabeceraId: props?.cabeceraId,
              detalleId: rol,
            }),
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateSorteo(false);
          props?.getSorteos();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const borrarSorteo = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/sorteo/${props?.sorteoSeleccionado?.id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateSorteo(false);
          props?.getSorteos();
        }
      } catch (err) {
        console.log(err);
      }
    };

    event.preventDefault();

    props?.setCargando(true);
    if (props?.modoDialogUpdateSorteo === "ADD") crearSorteo();
    else if (props?.modoDialogUpdateSorteo === "EDIT") actualizarSorteo();
    else if (props?.modoDialogUpdateSorteo === "DELETE") borrarSorteo();
  };

  useEffect(() => {
    if (props?.sorteoSeleccionado?.profesores?.length) {
      setProfesoresSeleccionados(props?.sorteoSeleccionado?.profesores);
    } else {
      setProfesoresSeleccionados([]);
    }

    if (props?.sorteoSeleccionado?.regalos?.length) {
      setRegalosSeleccionados(props?.sorteoSeleccionado?.regalos);
    } else {
      setRegalosSeleccionados([]);
    }

    if (props?.profesores?.length) {
      setProfesores(props?.profesores);
    } else {
      setProfesores([]);
    }

    if (props?.facultades?.length) {
      setFacultades(props?.facultades);
    } else {
      setFacultades([]);
    }

    if (props?.regalos?.length) {
      setRegalos(props?.regalos);
    } else {
      setRegalos([]);
    }
  }, [props]);

  return (
    <>
      <Dialog fullWidth maxWidth={"sm"} open={props.mostrarDialogUpdateSorteo}>
        <DialogTitle
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            {props?.modoDialogUpdateSorteo === "ADD" ? (
              <Typography>{`AÑADIR NUEVO SORTEO`}</Typography>
            ) : props?.modoDialogUpdateSorteo === "EDIT" ? (
              <Typography>EDITAR SORTEO</Typography>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ErrorIcon
                  style={{
                    color: "red",
                  }}
                />
                <Typography
                  style={{
                    marginLeft: 5,
                  }}
                >
                  EL SORTEO SERÁ ELIMINADO
                </Typography>
              </div>
            )}
          </div>
          <Button
            onClick={(e) => {
              props?.setMostrarDialogUpdateSorteo(false);
            }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 0.5 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <InputLabel required>NOMBRE</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  name="nombre"
                  type="text"
                  id="nombre"
                  defaultValue={props?.sorteoSeleccionado?.nombre || ""}
                  disabled={
                    props?.modoDialogUpdateSorteo === "DELETE" ? true : false
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel required>AGRUPAR PROFESORES POR</InputLabel>
                <Select
                  variant="outlined"
                  size="small"
                  id="agruparProfesoresPor"
                  name="agruparProfesoresPor"
                  fullWidth
                  value={agruparProfesoresPor}
                  onChange={(e) => {
                    setAgruparProfesoresPor(e?.target?.value);
                  }}
                >
                  <MenuItem key={"facultadMenuItem"} value={"facultad"}>
                    FACULTAD
                  </MenuItem>
                  <MenuItem key={"facultadMenuItem"} value={"ordenAleatorio"}>
                    ORDEN ALEATORIO
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel required>REGALOS</InputLabel>
                <Button
                  sm={12}
                  type="submit"
                  style={{
                    backgroundColor: "#990000",
                    color: "white",
                    width: "100%",
                  }}
                  onClick={(e) => {
                    e?.preventDefault();
                  }}
                >
                  ASIGNAR
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  sm={12}
                  type="submit"
                  style={{
                    backgroundColor: "#990000",
                    color: "white",
                    width: "100%",
                  }}
                >
                  {props?.modoDialogUpdateSorteo === "ADD"
                    ? "GUARDAR"
                    : props?.modoDialogUpdateSorteo === "EDIT"
                    ? "EDITAR"
                    : "ELIMINAR"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogUpdateSorteo;
