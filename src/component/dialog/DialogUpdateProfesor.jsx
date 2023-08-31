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
import ErrorIcon from "@mui/icons-material/Error";
import { useEffect, useState, useRef } from "react";
import Resizer from "react-image-file-resizer";
import {decode as base64_decode, encode as base64_encode} from 'base-64';

const DialogUpdateProfesor = (props) => {
  const inputRef = useRef(undefined);
  const [imagenSeleccionada, setImagenSeleccionda] = useState(undefined);
  const [textFieldCedula, setTextFieldCedula] = useState(undefined);
  const [textFieldCedulaError, setTextFieldCedulaError] = useState(false);
  const [base64, setBase64] = useState(undefined)

  useEffect(() => {
    setTextFieldCedula(props?.profesorSeleccionado?.cedula || "");
  }, [props]);

  useEffect(() => {
    const modoDialogUpdateProfesor = props?.modoDialogUpdateProfesor;
    const profesorSeleccionado = props?.profesorSeleccionado;

    if (modoDialogUpdateProfesor === "ADD") {
      if (
        props?.cedulas?.filter((cedula) => cedula === textFieldCedula)?.length >
        0
      ) {
        setTextFieldCedulaError(true);
      } else {
        setTextFieldCedulaError(false);
      }
    } else if (modoDialogUpdateProfesor === "EDIT") {
      if (
        props?.cedulas?.filter((cedula) => cedula === textFieldCedula)?.length >
        0
      ) {
        if (profesorSeleccionado?.cedula !== textFieldCedula) {
          setTextFieldCedulaError(true);
        } else {
          setTextFieldCedulaError(false);
        }
      } else {
        setTextFieldCedulaError(false);
      }
    } else {
      setTextFieldCedulaError(false);
    }
  }, [textFieldCedula, props]);

  useEffect(() => {
    console.log("textFieldCedulaError:");
    console.log(textFieldCedulaError);
  }, [textFieldCedulaError]);

  useEffect(() => {
    const resizeFile = (file) =>
      new Promise((resolve) => {
        Resizer.imageFileResizer(
          file,
          500,
          500,
          "JPEG",
          80,
          0,
          (uri) => {
            resolve(uri);
          },
          "base64"
        );
      });

    const generateBase64 = async () => {
      const base64 = await resizeFile(imagenSeleccionada)      
      console.log(base64)
      setBase64(base64)
    }
    
    if (imagenSeleccionada) {
      generateBase64()
    }
  }, [imagenSeleccionada])

  const handleSubmit = (event) => {
    const crearProfesor = async () => {
      const data = new FormData(event.currentTarget);
      const cedula = data.get("cedula");
      const facultad = data.get("facultad");
      const nombre1 = data.get("nombre1");
      const nombre2 = data.get("nombre2");
      const apellido1 = data.get("apellido1");
      const apellido2 = data.get("apellido2");

      console.log(cedula);
      console.log(facultad);
      console.log(nombre1);
      console.log(nombre2);
      console.log(apellido1);
      console.log(apellido2);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/profesor`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cedula,
              facultadId: facultad,
              nombre1,
              nombre2,
              apellido1,
              apellido2,
              imagen: base64
            }),
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateProfesor(false);
          setImagenSeleccionda(undefined)
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
          `${process.env.REACT_APP_SERVERURL}/profesor/${props?.profesorSeleccionado?.cedula}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cedula,
              facultadId: facultad,
              nombre1,
              nombre2,
              apellido1,
              apellido2,    
              imagen: base64,
              asistio: props?.profesorSeleccionado?.asistio
            }),
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateProfesor(false);
          setImagenSeleccionda(undefined)
          props?.getProfesores();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const borrarProfesor = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/profesor/${props?.profesorSeleccionado?.cedula}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateProfesor(false);
          setImagenSeleccionda(undefined)
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
            setImagenSeleccionda(undefined)
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
                value={textFieldCedula}
                onChange={(e) => {
                  setTextFieldCedula(e?.target?.value);
                }}
                error={textFieldCedulaError}
                helperText={
                  textFieldCedulaError
                    ? "OTRO PROFESOR YA TIENE REGISTRADA LA CÉDULA INGRESADA"
                    : ""
                }
                disabled={
                      props?.modoDialogUpdateProfesor === "DELETE"
                        ? true                        
                        : false
                        
                    }
              />
            </Grid>
            <Grid item xs={12} sm={6}>              
              <InputLabel>IMAGEN</InputLabel>
              { !imagenSeleccionada?.name &&
                <Grid item xs={12}>
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
              }
              { imagenSeleccionada?.name &&
                <Grid item xs={12} alignItems={'center'} justifyContent={'space-between'} style={{ display: 'flex', paddingRight: 35 }}>
                  <TextField size="small" style={{ width: '100%' }} required disabled value={imagenSeleccionada?.name} />
                  {<CloseIcon
                    onClick={e => {
                      console.log(imagenSeleccionada?.name)
                      setImagenSeleccionda(undefined)
                    }}
                    disabled={
                      props?.modoDialogUpdateFacultad === "DELETE"
                        ? true
                        : false
                        
                    }
                  />}
                </Grid>
              }
            </Grid>  
            <Grid item xs={12} sm={12}>
              <InputLabel required>Facultad</InputLabel>
              <Grid container>
                <Grid item xs={12}>
                  <Select
                    variant="outlined"
                    size="small"
                    id="facultad"
                    name="facultad"
                    fullWidth
                    defaultValue={
                      props?.profesorSeleccionado?.facultad_id ||
                      (props?.facultades?.length
                        ? props?.facultades[0]?.id
                        : "")
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
              </Grid>
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
