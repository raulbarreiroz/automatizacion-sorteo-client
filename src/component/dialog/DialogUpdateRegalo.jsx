import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useState, useRef, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import ErrorIcon from "@mui/icons-material/Error";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const DialogUpdateRegalo = (props) => {
  const inputRef = useRef(undefined);
  const [imagenSeleccionada, setImagenSeleccionda] = useState(undefined);
  const [nombreDonador, setNombreDonador] = useState(undefined);
  const [tipoDonacionSeleccionada, setTipoDonacionSeleccionada] =
    useState(undefined);
  const [facultadSelccionada, setFacultadSeleccionada] = useState(undefined);
  const a = useRef(undefined);

  useEffect(() => {
    console.log("nombreDonador:");
    console.log(nombreDonador);
  }, [nombreDonador]);

  useEffect(() => {
    if (props?.mostrarDialogUpdateRegalo) {
      const regaloSeleccionado = props?.regaloSeleccionado;
      const tiposDeDonaciones = props?.tiposDeDonaciones;
      const facultades = props?.facultades;
      if (regaloSeleccionado?.tipo_donacion_id) {
        setTipoDonacionSeleccionada(regaloSeleccionado?.tipo_donacion_id);
      } else {
        if (tiposDeDonaciones?.length) {
          setTipoDonacionSeleccionada(tiposDeDonaciones[0]?.id);
        } else {
          setTipoDonacionSeleccionada("");
        }
      }

      if (regaloSeleccionado?.facultad_id) {
        setFacultadSeleccionada(regaloSeleccionado?.facultad_id);
      } else {
        if (facultades?.length) {
          setFacultadSeleccionada(facultades[0]?.id);
        } else {
          setFacultadSeleccionada("");
        }
      }
    }
  }, [
    props?.regaloSeleccionado,
    props?.mostrarDialogUpdateRegalo,
    props?.tiposDeDonaciones,
    props?.facultades,
  ]);

  useEffect(() => {
    if (
      facultadSelccionada &&
      tipoDonacionSeleccionada &&
      props?.facultades?.length
    ) {
      let filtro = undefined;
      if (tipoDonacionSeleccionada === 1) {
        filtro = "director_nombre";
      } else if (tipoDonacionSeleccionada === 2) {
        filtro = "asociacion";
      }

      if (filtro && props?.facultades?.length) {
        setNombreDonador(
          props?.facultades?.filter(
            (facultad) => facultad?.id === facultadSelccionada
          )[0][filtro]
        );
      } else {
        setNombreDonador("ADMINISTRACION CENTRAL");
      }
    }
  }, [facultadSelccionada, tipoDonacionSeleccionada, props?.facultades]);

  const handleSubmit = (event) => {
    const crearRegalo = async () => {
      const data = new FormData(event.currentTarget);
      const nombre = data.get("nombre");
      const imagen = data.get("imagen");

      console.log(
        JSON.stringify({
          nombre,
          tipoDonacionId: tipoDonacionSeleccionada,
          facultadId: tipoDonacionSeleccionada === 3 ? "" : facultadSelccionada,
          nombreDonador,
        })
      );

      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/regalo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre,
              tipoDonacionId: tipoDonacionSeleccionada,
              facultadId:
                tipoDonacionSeleccionada === 3 ? "" : facultadSelccionada,
              nombreDonador,
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
      const imagen = data.get("imagen");
      console.log(props?.regaloSeleccionado);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/regalo/${props?.regaloSeleccionado?.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre,
              tipoDonacionId: tipoDonacionSeleccionada,
              facultadId:
                tipoDonacionSeleccionada === 3 ? "" : facultadSelccionada,
              nombreDonador,
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
    <Dialog fullWidth maxWidth={"ms"} open={props.mostrarDialogUpdateRegalo}>
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
            <Grid item xs={12} sm={9}>
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
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={6}>
              <InputLabel>TIPO DE DONACIÓN</InputLabel>
              {tipoDonacionSeleccionada && (
                <Select
                  variant="outlined"
                  size="small"
                  id="tipoDeDonacion"
                  name="tipoDeDonacion"
                  fullWidth
                  inputRef={a}
                  value={tipoDonacionSeleccionada}
                  onChange={(e) => {
                    setTipoDonacionSeleccionada(e?.target?.value);
                  }}
                  disabled={
                    props?.modoDialogUpdateRegalo === "DELETE" ? true : false
                  }
                >
                  {props?.tiposDeDonaciones?.length &&
                    props?.tiposDeDonaciones?.map((tipoDeDonacion) => {
                      return (
                        <MenuItem
                          key={tipoDeDonacion?.id}
                          value={tipoDeDonacion?.id}
                        >
                          {tipoDeDonacion?.nombre}
                        </MenuItem>
                      );
                    })}
                </Select>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>SELECCIONE FACULTAD</InputLabel>
              {facultadSelccionada && (
                <Select
                  variant="outlined"
                  size="small"
                  id="facultad"
                  name="facultad"
                  fullWidth
                  value={facultadSelccionada}
                  onChange={(e) => {
                    setFacultadSeleccionada(e?.target?.value);
                  }}
                  disabled={
                    props?.modoDialogUpdateProfesor === "DELETE"
                      ? true
                      : props?.facultades?.length
                      ? tipoDonacionSeleccionada === 3
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
              )}
            </Grid>
            <Grid container item xs={12} sm={12} justifyContent={"center"}>
              <InputLabel>DONACIÓN DE: {nombreDonador}</InputLabel>
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
