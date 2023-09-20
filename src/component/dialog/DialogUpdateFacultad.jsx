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
import { SketchPicker } from 'react-color'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Resizer from "react-image-file-resizer";
import Avatar from "@mui/material/Avatar"

const DialogUpdateFacultad = (props) => {
  const inputRef = useRef(undefined);
  const [imagenSeleccionada, setImagenSeleccionda] = useState(undefined);
  const [base64, setBase64] = useState(undefined)
  const [textFieldNombre, setTextFieldNombre] = useState(undefined);  
  
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
      const facultadSeleccionada = props?.facultadSeleccionado
      const decanos = props?.decanos
      console.log(props)
      
      setTextFieldNombre(facultadSeleccionada?.nombre?.trim() || "");
     
      setBase64(facultadSeleccionada?.logo || '')
      
      if (facultadSeleccionada?.color)
        setColor({ hex: facultadSeleccionada?.color?.trim() })            

      if (facultadSeleccionada?.decano_id && decanos) {
       
        const decanosFiltrados = decanos?.filter(decano => decano?.id === facultadSeleccionada?.decano_id)[0]?.nombre
        console.log(decanosFiltrados)        
      }

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
              'color': color?.hex,            
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
      console.log(props?.facultadSeleccionado?.decano_id,)
      try {
        console.log(props?.facultadSeleccionado)
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/facultad/${props?.facultadSeleccionado?.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              'nombre': textFieldNombre,              
              'color': color?.hex,            
              'carreras': carreras?.filter(carrera => carrera?.seleccionada),              
              logo: base64
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
            <Typography>{`AÑADIR NUEVA FACULTAD`}</Typography>
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
                size="small"
                value={textFieldNombre}
                onChange={(e) => {
                  const value = e?.target?.value
                  if (value?.length <= 50) {
                    setTextFieldNombre(e?.target?.value);
                  }
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
            <Grid item xs={12} sm={6} >              
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
                      disabled={
                        props?.modoDialogUpdateFacultad === "DELETE"
                          ? true
                          : false
                          
                      }
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
                      setBase64(undefined)
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
            
            
            { base64 &&
              <Grid container item xs={12} justifyContent={'center'} style={{ padding: 0, height: '30%', marginTop: 5 }}>
                <Avatar
                  variant="rounded"
                  sx={{ width: "15vw", height: "15vw", borderRadius: '50%' }}                  src={base64}
                  alt="logo-aso"
                />
              </Grid>
            }            
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
