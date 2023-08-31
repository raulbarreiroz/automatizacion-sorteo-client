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
import { useEffect, useState, useRef } from "react";
import Chip from '@mui/material/Chip';
import { SketchPicker } from 'react-color'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Resizer from "react-image-file-resizer";


const DialogUpdateFacultad = (props) => {
  const inputRef = useRef(undefined);
  const [imagenSeleccionada, setImagenSeleccionda] = useState(undefined);
  const [base64, setBase64] = useState(undefined)
  const [textFieldNombre, setTextFieldNombre] = useState(undefined);
  const [textFieldNombreError, setTextFieldNombreError] = useState(false);
  const [textFieldDecanoNombre, setTextFieldDecanoNombre] = useState(undefined);
  const [textFieldDecanoNombreError, setTextFieldDecanoNombreError] = useState(false);
  const [color, setColor] = useState({
    "hsl": {
      "h": 249.99999999999994,
      "s": 0.5494952029805223,
      "l": 0.585576,
      "a": 1
    },
    "hex": "#6f5bcf",
    "rgb": {
      "r": 111,
      "g": 91,
      "b": 207,
      "a": 1
    },
    "hsv": {
      "h": 249.99999999999994,
      "s": 0.56,
      "v": 0.8133,
      "a": 1
    },
    "oldHue": 249.99999999999994,
    "source": "hsv"
  })
  const [showSketchPicker, setShowSketchPicker] = useState(false)
  const [carreras, setCarreras] = useState(undefined)

  useEffect(() => {
    if (props) {
      const carreras = props?.carreras
      console.log(props)
      setTextFieldNombre(props?.facultadSeleccionado?.nombre || "");
      setTextFieldDecanoNombre('')
      if (carreras?.length) {
        setCarreras(carreras?.map((carrera) => ({
          ...carrera,
          seleccionada: false
        })))
      } else {
        setCarreras([])
      }
    } else {
      setTextFieldNombre('')
      setCarreras([])
    }
  }, [props]);

  useEffect(() => {
    const modoDialogUpdateFacultad = props?.modoDialogUpdateFacultad;
    const facultadSeleccionado = props?.facultadSeleccionado;

    if (modoDialogUpdateFacultad === "ADD") {
      if (
        props?.cedulas?.filter((cedula) => cedula === textFieldNombre)?.length >
        0
      ) {
        setTextFieldNombreError(true);
      } else {
        setTextFieldNombreError(false);
      }
    } else if (modoDialogUpdateFacultad === "EDIT") {
      if (
        props?.cedulas?.filter((cedula) => cedula === textFieldNombre)?.length >
        0
      ) {
        if (facultadSeleccionado?.cedula !== textFieldNombre) {
          setTextFieldNombreError(true);
        } else {
          setTextFieldNombreError(false);
        }
      } else {
        setTextFieldNombreError(false);
      }
    } else {
      setTextFieldNombreError(false);
    }
  }, [textFieldNombre, props]);

  useEffect(() => {
    console.log("textFieldNombreError:");
    console.log(textFieldNombreError);
  }, [textFieldNombreError]);

  useEffect(() => {
    //let encoded =
    //let decoded = base64_decode('YOUR_ENCODED_STRING');

    const resizeFile = (file) =>
      new Promise((resolve) => {
        Resizer.imageFileResizer(
          file,
          300,
          400,
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

  useEffect(() => {
    console.log('base64')
    console.log(base64)
  }, [base64])

  const handleSubmit = (event) => {      
    const crearFacultad = async () => {
      try {             
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/facultad`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              'nombre': textFieldNombre,
              'decanoNombre': textFieldDecanoNombre,
              'color': color?.hex,            
              'carreras': carreras?.filter(carrera => carrera?.seleccionada),
              logo: base64
            })
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateFacultad(false);
          props?.getFacultades();
          props?.getDecanos()
        }
      } catch (err) {
        console.log(err);
      }
    };

    const actualizarFacultad = async () => {      
      try {
        console.log(props?.facultadSeleccionado)
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/facultad/${props?.facultadSeleccionado?.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              'nombre': textFieldNombre,
              'decanoNombre': textFieldDecanoNombre,
              'color': color?.hex,            
              'carreras': carreras?.filter(carrera => carrera?.seleccionada),
            }),
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateFacultad(false);
          props?.getFacultades();
          props?.getDecanos()
        }
      } catch (err) {
        console.log(err);
      }
    };

    const borrarFacultad = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/facultad/${props?.facultadSeleccionado?.id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateFacultad(false);
          props?.getFacultades();
          props?.getDecanos()
        }
      } catch (err) {
        console.log(err);
      }
    };

    event.preventDefault();

    props?.setCargando(true);
    console.log('empezando')
    if (props?.modoDialogUpdateFacultad === "ADD") crearFacultad();
    else if (props?.modoDialogUpdateFacultad === "EDIT") actualizarFacultad();
    else if (props?.modoDialogUpdateFacultad === "DELETE") borrarFacultad();
  };

  return (
    <Dialog fullWidth maxWidth={"sm"} open={props.mostrarDialogUpdateFacultad}>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {props?.modoDialogUpdateFacultad === "ADD" ? (
            <Typography>{`AÑADIR NUEVO FACULTAD`}</Typography>
          ) : props?.modoDialogUpdateFacultad === "EDIT" ? (
            <Typography>EDITAR FACULTAD</Typography>
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
                LA FACULTAD SERÁ ELIMINADA
              </Typography>
            </div>
          )}
        </div>
        <Button
          onClick={(e) => {
            props?.setMostrarDialogUpdateFacultad(false);
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box
          enctype="multipart/form-data"
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
                      props?.modoDialogUpdateFacultad === "DELETE"
                        ? true
                        : false
                        
                    }
              />
            </Grid>
            <Grid item xs={12} >
              <InputLabel required>DECANO</InputLabel>
              <TextField
                required
                fullWidth
                id="decano"
                name="decano"
                autoComplete="decano"
                size="small"
                value={textFieldDecanoNombre}
                onChange={(e) => {
                  setTextFieldDecanoNombre(e?.target?.value);
                }}                
                disabled={
                  props?.modoDialogUpdateFacultad === "DELETE"
                    ? true
                    : false
                    
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>              
              <InputLabel required>COLOR</InputLabel>                   
              <Grid item xs={12} alignItems={'center'} justifyContent={'space-between'} style={{display: 'flex', paddingRight: 35}}>
                <TextField size="small" style={{ width: '80%', }} required disabled value={color?.hex} />    
                <TextField size="small" style={{ width: '20%', backgroundColor: color?.hex }} required disabled />
                {!showSketchPicker && <ExpandMoreIcon
                  onClick={e => {
                    setShowSketchPicker(!showSketchPicker)
                  }}
                  disabled={
                    props?.modoDialogUpdateFacultad === "DELETE"
                      ? true
                      : false
                      
                  }
                />}
                {showSketchPicker && <ExpandLessIcon
                  onClick={e => {
                    setShowSketchPicker(!showSketchPicker)
                  }}
                />}
              </Grid>              
              {showSketchPicker && <SketchPicker                
                color={color}
                onChange={e => {
                  setColor(e)
                  console.log(e)
                }}
              />}
            </Grid>
            <Grid item xs={12} sm={6}>              
              <InputLabel>LOGO</InputLabel>
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
            <Grid item xs={12}>
              <InputLabel style={{ textAlign: 'center' }}>{carreras?.length > 0 ? 'CARRERAS(click en carrera para seleccionar' : 'NO HAY CARRERAS REGISTRADAS'}</InputLabel>                
                <Grid item xs={12} >
                {carreras?.length > 0 &&
                  <Box sx={{
                    display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'space-between',
                    padding: 1, backgroundColor: '#F8F8FF', borderRadius: 5
                  }}
                    disabled={
                      props?.modoDialogUpdateFacultad === "DELETE"
                        ? true
                        : false
                    
                    }
                  >
                    {carreras?.map((carrera, i) => {
                      return (
                        <Chip
                          key={`${carrera?.id}-${i}`}
                          label={carrera?.nombre}
                          style={{
                            backgroundColor: carrera?.seleccionada ? 'lightgreen' : 'lightgray'
                          }}
                          onClick={e => {
                            console.log('hola')
                            console.log(carrera)                            
                            const carrerasModificadas = carreras?.map(c => {
                              if (carrera?.id === c?.id) {
                                carrera.seleccionada = !carrera?.seleccionada
                              }
                              return c
                            })
                            console.log(carrerasModificadas)
                            setCarreras(carrerasModificadas)
                          }}
                          
                        />
                      )
                    })}
                  </Box>
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

export default DialogUpdateFacultad;
