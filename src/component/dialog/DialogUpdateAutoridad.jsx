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
import { decode as base64_decode, encode as base64_encode } from 'base-64';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Visualizador from "../Visualizador";

const DialogUpdateAutoridad = (props) => {
  const inputRef = useRef(undefined);
  const [imagenSeleccionada, setImagenSeleccionda] = useState(undefined);
  const [textFieldNombre, setTextFieldNombre] = useState(undefined)  
  const [textFieldDescripcion, setTextFieldDescripcion] = useState(undefined)
  const [facultades, setFacultades] = useState(undefined)
  const [base64, setBase64] = useState(undefined)
  const [openVisualizador, setOpenVisualizador] = useState(false)
  const [tipoDeAutoridadSeleccionada, setTipoDeAutoridadSeleccionada] = useState(undefined)

  useEffect(() => {            
    if (props?.mostrarDialogUpdateAutoridad) {       
      setTextFieldNombre(props?.autoridadSeleccionada?.nombre1 || "");      
      setImagenSeleccionda(props?.autoridadSeleccionada?.imagen_seleccionada || "")
      setBase64(props?.autoridadSeleccionada?.imagen || '')
      const facultades = props?.facultades || []      
    } else {
      setTextFieldNombre(undefined)
      setImagenSeleccionda(undefined)
      setBase64('')                 
    }
  }, [props]);
   
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
    
      setBase64(base64)
    }
    
    if (imagenSeleccionada) {
      generateBase64()
    }
  }, [imagenSeleccionada])


  const handleSubmit = (event) => {
    props?.setMostrarDialogUpdateAutoridad(false);
    const crearAutoridad = async () => {      
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/autoridad`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: textFieldNombre,
              descripcion: textFieldDescripcion,
              imagen: base64
            }),
          }
        );
        if (response.status === 200) {          
          props?.getAutoridades();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const actualizarAutoridad = async () => {    
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/autoridad/${props?.autoridadSeleccionada?.cedula}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: textFieldNombre,
              descripcion: textFieldDescripcion,              
              imagen: base64,              
              asistio: props?.autoridadSeleccionada?.asistio
            }),
          }
        );
        if (response.status === 200) {
          props?.getAutoridades();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const borrarAutoridad = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/autoridad/${props?.autoridadSeleccionada?.cedula}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 200) {
          props?.getAutoridades();
        }
      } catch (err) {
        console.log(err);
      }
    };

    event.preventDefault();

    props?.setCargando(true);
    if (props?.modoDialogUpdateAutoridad === "ADD") crearAutoridad();
    else if (props?.modoDialogUpdateAutoridad === "EDIT") actualizarAutoridad();
    else if (props?.modoDialogUpdateAutoridad === "DELETE") borrarAutoridad();
  };    

  return (
    <>
      <Dialog fullWidth maxWidth={"lg"} open={props.mostrarDialogUpdateAutoridad}>
        <DialogTitle
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            {props?.modoDialogUpdateAutoridad === "ADD" ? (
              <Typography>{`AÑADIR NUEVA AUTORIDAD`}</Typography>
            ) : props?.modoDialogUpdateAutoridad === "EDIT" ? (
              <Typography>EDITAR AUTORIDAD</Typography>
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
                  LA AUTORIDAD SERÁ ELIMINADO
                </Typography>
              </div>
            )}
          </div>
          <Button
            onClick={(e) => {
              props?.setMostrarDialogUpdateAutoridad(false);
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
                <InputLabel required>NOMBRE</InputLabel>
                <TextField
                  required
                  fullWidth                  
                  size="small"
                  value={textFieldNombre}
                  onChange={(e) => {                  
                    if (e?.target?.value?.length <= 50) {                    
                      setTextFieldNombre(e?.target?.value);
                    }
                  }}                                    
                  disabled={
                        props?.modoDialogUpdateAutoridad === "DELETE" 
                          ? true                        
                          : false                          
                      }
                />
              </Grid>
              <Grid item xs={12} sm={6}> 
                <Grid sx={{
                  width: '100%',
                  display: 'flex',
                  columnGap: '2%'
                      }}>
                        <InputLabel>IMAGEN</InputLabel>
                  {base64 &&
                    <RemoveRedEyeIcon
                      onClick={e => {
                        setOpenVisualizador(true)
                      }}
                      disabled={
                        props?.modoDialogUpdateFacultad === "DELETE"
                          ? true
                          : false
                                    
                      }
                      sx={{ cursor: 'pointer' }}
                    />} 
                  </Grid>
                { !base64 &&
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
                        disabled={
                          props?.modoDialogUpdateAutoridad === "DELETE"
                            ? true                        
                            : false
                            
                        }
                      >
                        SELECCIONAR
                      </Button>
                    </label>                  
                  </Grid>
                }
                { base64 &&
                  <Grid
                    flexDirection={'row'}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      columnGap: '1%'
                    }}
                  >                    
                    <Grid sx={{width:'88%'}}>
                      <TextField size="small" style={{ width: '100%' }} required disabled value={base64 && imagenSeleccionada?.name ? imagenSeleccionada?.name : 'IMAGEN DE AUTORIDAD'} />
                    </Grid>
                    <Grid sx={{width: '10%'}}>
                    <CloseIcon
                      onClick={e => {                    
                        setImagenSeleccionda(undefined)
                        setBase64(undefined)
                        }}
                        sx={{cursor: 'pointer'}}
                      disabled={
                        props?.modoDialogUpdateFacultad === "DELETE"
                          ? true
                          : false
                          
                      }
                      /> 
                    </Grid>  
                  </Grid>
                }
              </Grid>                                              
              <Grid item xs={12}>
                <InputLabel required>DESCRIPCION</InputLabel>
                <TextField
                  size="small"
                  fullWidth  
                  multiline                  
                  value={textFieldDescripcion}
                  onChange={e => {
                    const value = e?.target?.value
                    if (value?.length <= 250)
                      setTextFieldDescripcion(value)
                  }}
                  disabled={
                    props?.modoDialogUpdateAutoridad === "DELETE" ? true : false
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <InputLabel required>TIPO DE AUTORIDADES</InputLabel>
                  <Grid container>
                  {props?.tiposDeAutoridades?.length > 0 ?
                    <Grid item xs={12}>
                      {props?.tiposDeAutoridades && props?.tiposDeAutoridades?.length > 0 &&
                        <Select
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={tipoDeAutoridadSeleccionada}
                          onChange={e => {
                            setTipoDeAutoridadSeleccionada
                              (e?.target?.value)
                          }}
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
                        </Select>}
                    </Grid> : 'NO EXISTEN TIPOS DE AUTORIDADES REGISTRADAS'
                  }
                  </Grid>
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
                  disabled={
                    props?.modoDialogUpdateAutoridad !== 'DELETE' ?                                        
                      textFieldNombre !== ''                      
                    ? false : true                     
                  : false}
                >
                  {props?.modoDialogUpdateAutoridad === "ADD"
                    ? 
                      textFieldNombre !== ''                      
                    ?  "GUARDAR" : 'DEBE LLENAR TODOS LOS CAMPOS OBLIGATORIOS' 
                    : props?.modoDialogUpdateAutoridad === "EDIT"
                    ? textFieldNombre !== ''                    
                  ?  "GUARDAR" : 'DEBE LLENAR TODOS LOS CAMPOS OBLIGATORIOS' 
                    : "ELIMINAR"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
      {
        openVisualizador &&
        <Visualizador
          imagen={base64}
          openVisualizador={openVisualizador}
          setOpenVisualizador={setOpenVisualizador}
        />
      }
    </>
  );
};

export default DialogUpdateAutoridad;
