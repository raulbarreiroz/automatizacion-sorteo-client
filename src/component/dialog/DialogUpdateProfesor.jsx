import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { useEffect } from "react";
import ErrorIcon from "@mui/icons-material/Error";

const DialogUpdateProfesor = (props) => {
  const handleSubmit = (event) => {
    const crearProfesor = async () => {
      const data = new FormData(event.currentTarget);
      const cedula = data.get("cedula");
      const facultad = data.get("facultad");
      const nombre1 = data.get("nombre1");
      const nombre2 = data.get("nombre2");
      const apellido1 = data.get("apellido1");
      const apellido2 = data.get("apellido2");

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
        if (response.status === 200) {
          props?.setMostrarDialogUpdateProfesor(false);
          props?.getProfesores();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const actualizarProfesor = async () => {
      const data = new FormData(event.currentTarget);
      const cedula = data.get("cedula");
      const facultad = data.get("facultad");
      const nombre1 = data.get("nombre1");
      const nombre2 = data.get("nombre2");
      const apellido1 = data.get("apellido1");
      const apellido2 = data.get("apellido2");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/profesor/${props?.profesorSeleccionado?.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cedula,
              detalleId: facultad,
              nombre1,
              nombre2,
              apellido1,
              apellido2,
              cabeceraId: props?.cabeceraId,
            }),
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateProfesor(false);
          props?.getProfesores();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const borrarProfesor = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/profesor/${props?.profesorSeleccionado?.id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateProfesor(false);
          props?.getProfesores();
        }
      } catch (err) {
        console.log(err);
      }
    };

    event.preventDefault();

    props?.setCargando(true);
    if (props?.modoDialogUpdateProfesor === "ADD") crearProfesor();
    else if (props?.modoDialogUpdateProfesor === "EDIT") actualizarProfesor();
    else if (props?.modoDialogUpdateProfesor === "DELETE") borrarProfesor();
  };

  return (
    <Dialog fullWidth maxWidth={"sm"} open={props.mostrarDialogUpdateProfesor}>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {props?.modoDialogUpdateProfesor === "ADD" ? (
            <Typography>{`AÑADIR NUEVO PROFESOR`}</Typography>
          ) : props?.modoDialogUpdateProfesor === "EDIT" ? (
            <Typography>EDITAR PROFESOR</Typography>
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
                EL PROFESOR SERÁ ELIMINADO
              </Typography>
            </div>
          )}
        </div>
        <Button
          onClick={(e) => {
            props?.setMostrarDialogUpdateProfesor(false);
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
            <Grid item xs={12} sm={6}>
              <InputLabel required>Cédula</InputLabel>
              <TextField
                required
                fullWidth
                id="cedula"
                name="cedula"
                autoComplete="cedula"
                size="small"
                defaultValue={props?.profesorSeleccionado?.cedula || ""}
                disabled={
                  props?.modoDialogUpdateProfesor === "DELETE" ? true : false
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel required>Facultad</InputLabel>
              <Select
                variant="outlined"
                size="small"
                id="facultad"
                name="facultad"
                fullWidth
                defaultValue={
                  props?.profesorSeleccionado?.detalle_id ||
                  (props?.facultades?.length ? props?.facultades[0]?.id : -1)
                }
                disabled={
                  props?.modoDialogUpdateProfesor === "DELETE"
                    ? true
                    : props?.facultades?.length
                    ? false
                    : true
                }
              >
                {props?.facultades?.length &&
                  props?.facultades?.map((facultad) => {
                    return (
                      <MenuItem key={facultad?.id} value={facultad?.id}>
                        {facultad?.nombre}
                      </MenuItem>
                    );
                  })}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel required>Primer nombre</InputLabel>
              <TextField
                size="small"
                fullWidth
                id="nombre1"
                name="nombre1"
                autoComplete="nombre1"
                defaultValue={props?.profesorSeleccionado?.nombre1 || ""}
                disabled={
                  props?.modoDialogUpdateProfesor === "DELETE" ? true : false
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Segundo nombre</InputLabel>
              <TextField
                fullWidth
                size="small"
                id="nombre2"
                name="nombre2"
                autoComplete="nombre2"
                defaultValue={props?.profesorSeleccionado?.nombre2 || ""}
                disabled={
                  props?.modoDialogUpdateProfesor === "DELETE" ? true : false
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel required>Primer apellido</InputLabel>
              <TextField
                size="small"
                fullWidth
                name="apellido1"
                type="apellido1"
                id="apellido1"
                defaultValue={props?.profesorSeleccionado?.apellido1 || ""}
                disabled={
                  props?.modoDialogUpdateProfesor === "DELETE" ? true : false
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel required>Segundo apellido</InputLabel>
              <TextField
                fullWidth
                size="small"
                name="apellido2"
                type="apellido2"
                id="apellido2"
                defaultValue={props?.profesorSeleccionado?.apellido2 || ""}
                disabled={
                  props?.modoDialogUpdateProfesor === "DELETE" ? true : false
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} style={{ display: "flex" }}>
              <Button
                sm={12}
                type="submit"
                style={{
                  backgroundColor: "#990000",
                  color: "white",
                  width: "100%",
                }}
              >
                {props?.modoDialogUpdateProfesor === "ADD"
                  ? "GUARDAR"
                  : props?.modoDialogUpdateProfesor === "EDIT"
                  ? "EDITAR"
                  : "ELIMINAR"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DialogUpdateProfesor;
