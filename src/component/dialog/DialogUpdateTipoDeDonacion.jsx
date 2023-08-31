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

const DialogUpdateTipoDeDonacion = (props) => {  
  const [textFieldNombre, setTextFieldNombre] = useState(undefined);
  const [textFieldNombreError, setTextFieldNombreError] = useState(false);
  const [textFieldDescripcion, setTextFieldDescripcion] = useState(undefined);
 
  const handleSubmit = (event) => {      
    const crearTipoDeDonacion = async () => {
      try {             
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/tipoDeDonacion`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: textFieldNombre,
              descripcion: textFieldNombreError         
            })
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateTipoDeDonacion(false);
          props?.getTiposDeDonaciones();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const actualizarTipoDeDonacion = async () => {      
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/tipoDeDonacion/${props?.tipoDeDonacionSeleccionada?.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: textFieldNombre,
              descripcion: textFieldNombreError       
            }),
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateTipoDeDonacion(false);
          props?.getTiposDeDonaciones();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const borrarTipoDeDonacion = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/tipoDeDonacion/${props?.tipoDeDonacionSeleccionada?.id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateTipoDeDonacion(false);
          props?.getTiposDeDonaciones();
        }
      } catch (err) {
        console.log(err);
      }
    };

    event.preventDefault();

    props?.setCargando(true);
    console.log('empezando')
    if (props?.modoDialogUpdateTipoDeDonacion === "ADD") crearTipoDeDonacion();
    else if (props?.modoDialogUpdateTipoDeDonacion  === "EDIT") actualizarTipoDeDonacion();
    else if (props?.modoDialogUpdateTipoDeDonacion  === "DELETE") borrarTipoDeDonacion();
  };

  useEffect(() => {
    console.log('props:')
    console.log(props)
  }, [props])

  return (
    <Dialog fullWidth maxWidth={"sm"} open={props.mostrarDialogUpdateTipoDeDonacion}>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {props?.modoDialogUpdateTipoDeDonacion === "ADD" ? (
            <Typography>{`AÑADIR NUEVO TIPO DE DONACION`}</Typography>
          ) : props?.modoDialogUpdateTipoDeDonacion === "EDIT" ? (
            <Typography>EDITAR TIPO DE DONACION</Typography>
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
                EL TIPO DE DONACION SERÁ ELIMINADA
              </Typography>
            </div>
          )}
        </div>
        <Button
          onClick={(e) => {
            props?.setMostrarDialogUpdateTipoDeDonacion(false);
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
                      props?.modoDialogUpdateTipoDeDonacion  === "DELETE"
                        ? true
                        : false
                        
                    }
              />
            </Grid>
            <Grid item xs={12} >
              <InputLabel required>DESCRIPCION</InputLabel>
              <TextField
                required
                fullWidth
                id="descripcion"
                name="decripcion"                
                autoComplete="descripcion"
                size="small"
                value={textFieldDescripcion}
                onChange={(e) => {
                  setTextFieldDescripcion(e?.target?.value);
                }}                
                disabled={
                  props?.modoDialogUpdateTipoDeDonacion  === "DELETE"
                    ? true
                    : false
                    
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
                {props?.modoDialogUpdateTipoDeDonacion === "ADD"
                  ? "GUARDAR"
                  : props?.modoDialogUpdateTipoDeDonacion === "EDIT"
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

export default DialogUpdateTipoDeDonacion;
