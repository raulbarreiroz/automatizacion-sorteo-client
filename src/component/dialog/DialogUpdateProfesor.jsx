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
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Visualizador from "../Visualizador";

const DialogUpdateProfesor = (props) => {
  const inputRef = useRef(undefined);
  const [imagenSeleccionada, setImagenSeleccionda] = useState(undefined);
  const [textFieldCedula, setTextFieldCedula] = useState(undefined);
  const [textFieldCedulaError, setTextFieldCedulaError] = useState(undefined)
  const [textFieldNombre1, setTextFieldNombre1] = useState(undefined)
  const [textFieldNombre2, setTextFieldNombre2] = useState(undefined)
  const [textFieldApellido1, setTextFieldApellido1] = useState(undefined)
  const [textFieldApellido2, setTextFieldApellido2] = useState(undefined)
  const [facultadSeleccionada, setFacultadSeleccionada] = useState(undefined)
  const [base64, setBase64] = useState(undefined)
  const [openVisualizador, setOpenVisualizador] = useState(false)  

  useEffect(() => {    
    if (props?.mostrarDialogUpdateProfesor) { 
      console.log(props)
      setTextFieldCedula(props?.profesorSeleccionado?.cedula || "");
      setTextFieldNombre1(props?.profesorSeleccionado?.nombre1 || "");
      setTextFieldNombre2(props?.profesorSeleccionado?.nombre2 || "");
      setTextFieldApellido1(props?.profesorSeleccionado?.apellido1 || "");
      setTextFieldApellido2(props?.profesorSeleccionado?.apellido2 || "");
      setImagenSeleccionda(props?.profesorSeleccionado?.imagen_seleccionada || "")
      setBase64(props?.profesorSeleccionado?.imagen || '')
      const facultades = props?.facultades || []
      setFacultadSeleccionada(facultades[0]?.id || '')
    } else {
      setTextFieldCedula("");
      setTextFieldNombre1("");
      setTextFieldNombre2("");
      setTextFieldApellido1("");
      setTextFieldApellido2("");
      setImagenSeleccionda(undefined)
      setBase64('')      
      setFacultadSeleccionada('')      
    }
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
    props?.setMostrarDialogUpdateProfesor(false);
    const crearProfesor = async () => {      
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/profesor`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cedula: textFieldCedula,
              facultadId: facultadSeleccionada,
              nombre1: textFieldNombre1,
              nombre2: textFieldNombre2,
              apellido1: textFieldApellido1,
              apellido2: textFieldApellido2,
              imagen: base64
            }),
          }
        );
        if (response.status === 200) {          
          props?.getProfesores();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const actualizarProfesor = async () => {    
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/profesor/${props?.profesorSeleccionado?.cedula}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cedula: textFieldCedula,
              facultadId: facultadSeleccionada,
              nombre1: textFieldNombre1,
              nombre2: textFieldNombre2,
              apellido1: textFieldApellido1,
              apellido2: textFieldApellido2,
              imagen: base64,              
              asistio: props?.profesorSeleccionado?.asistio
            }),
          }
        );
        if (response.status === 200) {
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
  
  const cadenaEsNumerica = (cadena) => {    
    let esNumerica = true
    const longitud = cadena?.length
    for (let i = 0; i < longitud; i++) {      
      if (isNaN(cadena?.charAt(i))) {
        esNumerica = false
      }
    }

    return esNumerica
  }

  const cadenaSoloLetras = (cadena) => {
    let soloLetras = true
    const longitud = cadena?.length
    for (let i = 0; i < longitud; i++) {
      if (!isNaN(cadena?.charAt(i))) {
        soloLetras = false
      }
    }
    return soloLetras
  }

  const capitalizarCadena = cadena => {
    let cadenaModificada = cadena    
    if (cadena === 1) {            
      cadenaModificada = cadena?.charAt(0)?.toUpperCase()
    } else {
      cadenaModificada = `${cadena?.charAt(0)?.toUpperCase()}${cadena?.slice(1, cadena?.length)?.toLowerCase()}`
    }
    return cadenaModificada
  }

  return (
    <>
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
                  size="small"
                  value={textFieldCedula}
                  onChange={(e) => {                  
                    if (e?.target?.value?.length <= 10 && cadenaEsNumerica(e?.target?.value)) {                    
                      setTextFieldCedula(e?.target?.value);
                    }
                  }}                  
                  helperText={
                    textFieldCedulaError
                      ? "OTRO PROFESOR YA TIENE REGISTRADA LA CÉDULA INGRESADA"
                      : ""
                  }
                  disabled={
                        props?.modoDialogUpdateProfesor === "DELETE" || props?.modoDialogUpdateProfesor === 'EDIT'
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
                          props?.modoDialogUpdateProfesor === "DELETE"
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
                      <TextField size="small" style={{ width: '100%' }} required disabled value={base64 && imagenSeleccionada?.name ? imagenSeleccionada?.name : 'IMAGEN DE PROFESOR'} />
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
              <Grid item xs={12} sm={6}>
                <InputLabel required>Primer nombre</InputLabel>
                <TextField
                  size="small"
                  fullWidth                  
                  value={textFieldNombre1}
                  onChange={e => {
                    const value = e?.target?.value
                    if (value?.length <= 50 && cadenaSoloLetras(value))
                      setTextFieldNombre1(capitalizarCadena(value))
                  }}
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
                  value={textFieldNombre2}
                  onChange={e => {
                    const value = e?.target?.value
                    if (value?.length <= 50 && cadenaSoloLetras(value))
                      setTextFieldNombre2(capitalizarCadena(value))
                  }}
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
                  value={textFieldApellido1}
                  onChange={e => {
                    const value = e?.target?.value
                    if (value?.length <= 50 && cadenaSoloLetras(value))
                      setTextFieldApellido1(capitalizarCadena(value))
                  }}
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
                  value={textFieldApellido2}
                  onChange={e => {
                    const value = e?.target?.value
                    if (value?.length <= 50 && cadenaSoloLetras(value))
                      setTextFieldApellido2(capitalizarCadena(value))
                  }}
                  disabled={
                    props?.modoDialogUpdateProfesor === "DELETE" ? true : false
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <InputLabel required>Facultad</InputLabel>
                  <Grid container>
                  {props?.facultades?.length > 0 ?
                    <Grid item xs={12}>
                      {props?.facultades && props?.facultades?.length > 0 &&
                        <Select
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={facultadSeleccionada}
                          onChange={e => {
                            setFacultadSeleccionada(e?.target?.value)
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
                    </Grid> : 'NO EXISTEN FACULTADES REGISTRADAS'
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
                    props?.modoDialogUpdateProfesor !== 'DELETE' ?                    
                    textFieldCedula?.length === 10 &&
                      textFieldNombre1 !== '' &&
                      textFieldApellido1 !== '' &&
                        textFieldApellido2 !== '' && 
                        facultadSeleccionada
                    ? false : true                     
                  : false}
                >
                  {props?.modoDialogUpdateProfesor === "ADD"
                    ? textFieldCedula?.length === 10 &&
                      textFieldNombre1 !== '' &&
                      textFieldApellido1 !== '' &&
                      textFieldApellido2 !== '' &&
                      facultadSeleccionada
                    ?  "GUARDAR" : 'DEBE LLENAR TODOS LOS CAMPOS OBLIGATORIOS' 
                    : props?.modoDialogUpdateProfesor === "EDIT"
                    ? textFieldNombre1 !== '' &&
                    textFieldApellido1 !== '' &&
                        textFieldApellido2 !== '' &&
                        facultadSeleccionada
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

export default DialogUpdateProfesor;
