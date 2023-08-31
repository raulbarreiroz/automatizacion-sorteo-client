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
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select"
import { useEffect, useState, useRef } from "react";

const DialogUpdateCarrera = (props) => {  
  const [textFieldNombre, setTextFieldNombre] = useState(undefined);
  const [textFieldNombreError, setTextFieldNombreError] = useState(false);
  const [textFieldDirector, setTextFieldDirector] = useState(undefined);
  const [facultades, setFacultades] = useState(undefined)
  const [facultadSeleccionada, setFacultadSeleccionada] = useState(false)

  useEffect(() => {
    console.log('facultades: ')
    console.log(props?.facultades)
  }, [props])

  useEffect(() => {
    console.log('facultadSeleccionada')
    console.log(facultadSeleccionada)
  }, [facultadSeleccionada])

  useEffect(() => {
    const facultades = props?.facultades
    if (facultades?.length) {
      setFacultades(facultades)
      
      setFacultadSeleccionada(facultades[0]?.id)
    } else {
      setFacultades([])
      setFacultadSeleccionada('')
    } 
  }, [props])
 
  const handleSubmit = (event) => {      
    const crearCarrera = async () => {
      try {      
        console.log({
              nombre: textFieldNombre,
              directorNombre: textFieldDirector,
              facultad_id: facultadSeleccionada
            })

        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/carrera`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: textFieldNombre,
              directorNombre: textFieldDirector,
              facultad_id: facultadSeleccionada
            })
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateCarrera(false);
          props?.getCarreras();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const actualizarCarrera = async () => {      
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/carrera/${props?.carreraSeleccionada?.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: textFieldNombre,
              directorNombre: textFieldDirector,
              facultad_id: facultadSeleccionada
            }),
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateCarrera(false);
          props?.getCarreras();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const borrarCarrera = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/carrera/${props?.carreraSeleccionada?.id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateCarrera(false);
          props?.getCarreras();
        }
      } catch (err) {
        console.log(err);
      }
    };

    event.preventDefault();

    props?.setCargando(true);
    console.log('empezando')
    if (props?.modoDialogUpdateCarrera === "ADD") crearCarrera();
    else if (props?.modoDialogUpdateCarrera === "EDIT") actualizarCarrera();
    else if (props?.modoDialogUpdateCarrera === "DELETE") borrarCarrera();
  };

  return (
    <Dialog fullWidth maxWidth={"sm"} open={props.mostrarDialogUpdateCarrera}>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {props?.modoDialogUpdateCarrera === "ADD" ? (
            <Typography>{`AÑADIR NUEVO CARRERA`}</Typography>
          ) : props?.modoDialogUpdateCarrera === "EDIT" ? (
            <Typography>EDITAR CARRERA</Typography>
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
                LA CARRERA SERÁ ELIMINADA
              </Typography>
            </div>
          )}
        </div>
        <Button
          onClick={(e) => {
            props?.setMostrarDialogUpdateCarrera(false);
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
            <Grid item xs={12} >
              <InputLabel required>NOMBRE</InputLabel>
              <TextField
                required
                fullWidth
                id="nombre"
                name="nombre"
                autoComplete="nombre"
                size="small"
                value={textFieldNombre}
                onChange={(e) => {
                  setTextFieldNombre(e?.target?.value);
                }}                             
                disabled={
                      props?.modoDialogUpdateCarrera === "DELETE"
                        ? true
                        : false
                        
                    }
              />
            </Grid>
            <Grid item xs={12} >
              <InputLabel required>DIRECTOR</InputLabel>
              <TextField
                required
                fullWidth
                id="director"
                name="director"                
                autoComplete="director"
                size="small"
                value={textFieldDirector}
                onChange={(e) => {
                  setTextFieldDirector(e?.target?.value);
                }}                
                disabled={
                  props?.modoDialogUpdateCarrera === "DELETE"
                    ? true
                    : false
                    
                }
              />
            </Grid>   
            <Grid item xs={12} >
              <InputLabel >FACULTAD</InputLabel>
              <Select
                    variant="outlined"
                    size="small"
                    id="facultad"
                    name="facultad"
                    fullWidth
                value={facultadSeleccionada}
                onChange={e => {
                  setFacultadSeleccionada(e?.target?.value)
                }}
                    disabled={
                      props?.modoDialogUpdateCarrera === "DELETE"
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
                {props?.modoDialogUpdateFacultad === "ADD"
                  ? "GUARDAR"
                  : props?.modoDialogUpdateFacultad === "EDIT"
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

export default DialogUpdateCarrera;
