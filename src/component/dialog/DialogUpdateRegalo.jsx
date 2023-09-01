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
import Resizer from "react-image-file-resizer";

const DialogUpdateRegalo = (props) => {
  const inputRef = useRef(undefined);
  const [imagenSeleccionada, setImagenSeleccionda] = useState(undefined);
  const [nombreDonador, setNombreDonador] = useState(undefined);
  const [tipoDonacionSeleccionada, setTipoDonacionSeleccionada] =
    useState(undefined);
  const [tipoDeAutoridadSeleccionada, setTipoDeAutoridadSeleccionada] = useState(1)
  const [sortearPor, setSortearPor] = useState(1)
  const [facultadSelccionada, setFacultadSeleccionada] = useState(undefined);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState('')
  const a = useRef(undefined);
  const [base64, setBase64] = useState(undefined)

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

  useEffect(() => {
    console.log('nombreDonador: ')
    console.log(nombreDonador)
  }, [nombreDonador])

  useEffect(() => {
    const facultades = props?.facultades
    const decanos = props?.decanos
    const carreras = props?.carreras
    const directores = props?.directores
    const tiposDeDonaciones = props?.tiposDeDonaciones
    
    if (tipoDonacionSeleccionada === 1) {      
      if (tipoDeAutoridadSeleccionada === 2 && facultades?.length && decanos?.length) {
        const decanoId = (facultades?.filter(facultad => facultad?.id === facultadSelccionada)[0]?.decano_id)
        const nombreDecano = decanos?.filter(decano => decano?.id === decanoId)[0]?.nombre
        if (nombreDecano) {
          setNombreDonador(nombreDecano)
        } else {
          setNombreDonador('')
        }
      } else if (tipoDeAutoridadSeleccionada === 1 && carreras?.length && directores?.length) {
        const directorId = carreras?.filter(carrera => carrera?.id === carreraSeleccionada)[0]?.director_id
        setNombreDonador(directores?.filter(director => director?.id === directorId)[0]?.nombre)
      }
    } else if (tipoDonacionSeleccionada > 1) {
      console.log(tiposDeDonaciones?.filter(tipoDonacion => tipoDonacion?.id === tipoDonacionSeleccionada)[0]?.nombre)      
      setNombreDonador(tiposDeDonaciones?.filter(tipoDonacion => tipoDonacion?.id === tipoDonacionSeleccionada)[0]?.nombre)
    }
  }, [tipoDonacionSeleccionada, facultadSelccionada, tipoDeAutoridadSeleccionada, carreraSeleccionada, props])

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

  
  const handleSubmit = (event) => {
    const crearRegalo = async (nombre, tipoDonacionId, facultadId, nombreDonador, imagen) => {                  
      console.log(
        JSON.stringify({
          nombre,
          tipoDonacionId,
          facultadId,
          nombreDonador,
          imagen
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
              tipoDonacionId,
              facultadId,
              nombreDonador,
              imagen
            }),
          }
        );
        if (response.status === 200) {
          ;
        }
      } catch (err) {
        console.log(err);
      }
    };

    const actualizarRegalo = async () => {
      const data = new FormData(event.currentTarget);
      const nombre = data.get("nombre");      
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

    const data = new FormData(event.currentTarget);
    const cantidad = data.get("cantidad");
    const nombre = data?.get("nombre")    

    const execCreate = async () => {
      if (tipoDonacionSeleccionada === 1) {
        for (let i = 0; i < cantidad; i++) {
          await crearRegalo(nombre, tipoDonacionSeleccionada, facultadSelccionada, nombreDonador, base64)
        }
      } else if (tipoDonacionSeleccionada === 2) {
        for (let facultad of props?.facultades) {
          const cantidad = data?.get(facultad?.nombre)
          for (let i = 0; i < cantidad; i++) {
            await crearRegalo(nombre, tipoDonacionSeleccionada, facultad?.id, nombreDonador, base64)
          }
        }
      } else {
        if (sortearPor === 1) {
          for (let facultad of props?.facultades) {
            const cantidad = data?.get(facultad?.nombre)
            for (let i = 0; i < cantidad; i++) {
              await crearRegalo(nombre, tipoDonacionSeleccionada, facultad?.id, nombreDonador, base64)
            }
          }
        } else {
          for (let i = 0; i < cantidad; i++) {
            await crearRegalo(nombre, tipoDonacionSeleccionada, facultadSelccionada, nombreDonador, base64)
          }
        }
      }

      props?.setMostrarDialogUpdateRegalo(false);
      props?.getRegalos();
    }

    if (props?.modoDialogUpdateRegalo === "ADD") {
      console.log(cantidad)

      execCreate()
      //crearRegalo();
    }
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
            {tipoDonacionSeleccionada === 1 &&
              <>
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
              <Grid item xs={12} sm={6}>
                <InputLabel>TIPO DE AUTORIDAD</InputLabel>
              
                <Select
                  variant="outlined"
                  size="small"
                  id="tipoDeAutoridad"
                  name="tipoDeAutoridad"
                  fullWidth
                  inputRef={a}
                  value={tipoDeAutoridadSeleccionada}
                  onChange={(e) => {
                    console.log(e?.target)
                    setTipoDeAutoridadSeleccionada(e?.target?.value);
                  }}
                  disabled={
                    props?.modoDialogUpdateRegalo === "DELETE" ? true : false
                  }
                >
                  {[{ id: 1, nombre: 'DIRECTOR' }, { id: 2, nombre: 'DECANO' }]?.map((tipoDeAutoridad) => {
                    return (
                      <MenuItem
                        key={tipoDeAutoridad?.id}
                        value={tipoDeAutoridad?.id}
                      >
                        {tipoDeAutoridad?.nombre}
                      </MenuItem>
                    );
                  })}
                </Select>
              
              </Grid>            
              <Grid item xs={12} sm={6}>
                <InputLabel>SELECCIONE CARRERA</InputLabel>
                {props?.carreras?.length && (
                  <Select
                    variant="outlined"
                    size="small"
                    id="carrera"
                    name="carrera"
                    fullWidth
                    value={carreraSeleccionada}
                    onChange={(e) => {
                      setCarreraSeleccionada(e?.target?.value);
                    }}
                    disabled={
                      tipoDeAutoridadSeleccionada === 2
                        ? true
                        : false
                    }
                  >
                    {props?.carreras?.length &&
                      props?.carreras?.filter(carrera => carrera?.facultad_id === facultadSelccionada)?.map((carrera) => {
                        return (
                          <MenuItem key={carrera?.id} value={carrera?.id}>
                            {carrera?.nombre}
                          </MenuItem>
                        );
                      })}
                  </Select>
                )}
              </Grid>
              </>
            }
            { tipoDonacionSeleccionada === 2 &&
              <Grid item xs={12} container justifyContent={'center'} borderBottom={'1px solid grey'}>
                <Typography>Cantidad de regalos por facultad</Typography>
              </Grid>
            }
            { tipoDonacionSeleccionada === 3 &&
              <Grid item xs={6} container justifyContent={'center'} style={{ paddingBottom: 5 }}>
                <InputLabel>SORTEAR POR</InputLabel>
               <Select
                  variant="outlined"
                  size="small"
                  id="sortearPor"
                  name="sortearPor"
                  fullWidth
                  inputRef={a}
                  value={sortearPor}
                  onChange={(e) => {
                    setSortearPor(e?.target?.value);
                  }}
                  disabled={
                    props?.modoDialogUpdateRegalo === "DELETE" ? true : false
                  }
                >
                  {[{ id: 1, nombre: 'FACULTAD' }, { id: 2, nombre: 'GENERAL' }]?.map((sortearPor) => {
                    return (
                      <MenuItem
                        key={sortearPor?.id}
                        value={sortearPor?.id}
                      >
                        {sortearPor?.nombre}
                      </MenuItem>
                    );
                  })}
                </Select>
                </Grid>
            }
            { (tipoDonacionSeleccionada === 3) &&
              (sortearPor === 2 ? props?.facultades?.length && props?.facultades?.map((facultad, id) => {
                return (<Grid item xs={12} sm={6}>
                  <InputLabel>Cantidad de objetos</InputLabel>
                  <TextField
                    size="small"
                    fullWidth                    
                    name={'cantidad'}
                    type={'cantidad'}
                    id={'cantidad'}
                    defaultValue={0}
                    disabled={
                      props?.modoDialogUpdateRegalo === "DELETE" ? true : false
                    }
                  />
                </Grid>)
              }) : props?.facultades?.length && props?.facultades?.map((facultad, id) => {
                return (<Grid item xs={12} sm={6}>
                  <InputLabel>{facultad?.nombre}</InputLabel>
                  <TextField
                    size="small"
                    fullWidth                    
                    name={facultad?.nombre}
                    type={facultad?.nombre}
                    id={facultad?.nombre}
                    defaultValue={0}
                    disabled={
                      props?.modoDialogUpdateRegalo === "DELETE" ? true : false
                    }
                  />
                </Grid>)
              }))
            }    
            { tipoDonacionSeleccionada === 2 &&
              props?.facultades?.length && props?.facultades?.map((facultad, id) => {
                return (<Grid item xs={12} sm={6}>
                  <InputLabel>{facultad?.nombre}</InputLabel>
                  <TextField
                    size="small"
                    fullWidth                    
                    name={facultad?.nombre}
                    type={facultad?.nombre}
                    id={facultad?.nombre}
                    defaultValue={0}
                    disabled={
                      props?.modoDialogUpdateRegalo === "DELETE" ? true : false
                    }
                  />
                </Grid>)
              })
            }
            { (tipoDonacionSeleccionada === 1) &&
              props?.facultades?.length && props?.facultades?.map((facultad, id) => {
                return (<Grid item xs={12} sm={6}>
                  <InputLabel>Cantidad de objetos</InputLabel>
                  <TextField
                    size="small"
                    fullWidth                    
                    name={'cantidad'}
                    type={'cantidad'}
                    id={'cantidad'}
                    defaultValue={0}
                    disabled={
                      props?.modoDialogUpdateRegalo === "DELETE" ? true : false
                    }
                  />
                </Grid>)
              })
            }                   
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
