import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useState, useRef } from "react";
import InputLabel from "@mui/material/InputLabel";
import ErrorIcon from "@mui/icons-material/Error";

const DialogUpdateRegalo = (props) => {
  const inputRef = useRef(undefined);
  const [imagenSeleccionada, setImagenSeleccionda] = useState(undefined);

  const handleSubmit = (event) => {
    const crearRegalo = async () => {
      const data = new FormData(event.currentTarget);
      const nombre = data.get("nombre");
      const auspiciante = data.get("auspiciante");
      const imagen = data.get("imagen");

      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/regalo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre,
              auspiciante,
              imagen: imagenSeleccionada,
              creadoPor: "admin@test.com",
            }),
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateRegalo(false);
          props?.getRegalos();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const actualizarRegalo = async () => {
      const data = new FormData(event.currentTarget);
      const nombre = data.get("nombre");
      const auspiciante = data.get("auspiciante");
      const imagen = data.get("imagen");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/regalo/${props?.regaloSeleccionado?.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre,
              auspiciante,
              imagen,
            }),
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateRegalo(false);
          props?.getRegalos();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const borrarRegalo = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/regalo/${props?.regaloSeleccionado?.id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateRegalo(false);
          props?.getRegalos();
        }
      } catch (err) {
        console.log(err);
      }
    };

    event.preventDefault();

    props?.setCargando(true);
    if (props?.modoDialogUpdateRegalo === "ADD") crearRegalo();
    else if (props?.modoDialogUpdateRegalo === "EDIT") actualizarRegalo();
    else if (props?.modoDialogUpdateRegalo === "DELETE") borrarRegalo();
  };

  return (
    <Dialog fullWidth maxWidth={"sm"} open={props.mostrarDialogUpdateRegalo}>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {props?.modoDialogUpdateRegalo === "ADD" ? (
            <Typography>{`AÑADIR NUEVO REGALO`}</Typography>
          ) : props?.modoDialogUpdateRegalo === "EDIT" ? (
            <Typography>EDITAR REGALO</Typography>
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
                EL REGALO SERÁ ELIMINADO
              </Typography>
            </div>
          )}
        </div>
        <Button
          onClick={(e) => {
            props?.setMostrarDialogUpdateRegalo(false);
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
            <Grid item xs={12}>
              <InputLabel required>Nombre</InputLabel>
              <TextField
                size="small"
                fullWidth
                multiline
                maxRows={3}
                name="nombre"
                type="nombre"
                id="nombre"
                defaultValue={props?.regaloSeleccionado?.nombre || ""}
                disabled={
                  props?.modoDialogUpdateRegalo === "DELETE" ? true : false
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>AUSPICIANTE</InputLabel>
              <TextField
                fullWidth
                size="small"
                name="auspiciante"
                type="auspiciante"
                id="auspiciante"
                defaultValue={props?.regaloSeleccionado?.auspiciante || ""}
                disabled={
                  props?.modoDialogUpdateRegalo === "DELETE" ? true : false
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>IMAGEN</InputLabel>
              <input
                accept=".jpg,.jpeg,.png"
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                ref={inputRef}
                onChange={(e) => {
                  setImagenSeleccionda(inputRef?.current?.files["0"]);
                }}
              />
              <label htmlFor="raised-button-file">
                <Button
                  style={{ padding: "6.5px 0" }}
                  variant="outlined"
                  component="span"
                  fullWidth
                >
                  SELECCIONAR
                </Button>
              </label>
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
                {props?.modoDialogUpdateRegalo === "ADD"
                  ? "GUARDAR"
                  : props?.modoDialogUpdateRegalo === "EDIT"
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

export default DialogUpdateRegalo;
