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
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Visualizador from "../Visualizador";

const DialogUpdateAutoridad = (props) => {
  const inputRef = useRef(undefined);
  const [imagenSeleccionada, setImagenSeleccionda] = useState(undefined);
  const [textFieldNombre, setTextFieldNombre] = useState(undefined);
  const [facultades, setFacultades] = useState(undefined);
  const [facultadSeleccionada, setFacultadSeleccionada] = useState("");
  const [carreras, setCarreras] = useState(undefined);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
  const [base64, setBase64] = useState(undefined);
  const [openVisualizador, setOpenVisualizador] = useState(false);
  const [tipoDeAutoridadSeleccionada, setTipoDeAutoridadSeleccionada] =
    useState(false);

  useEffect(() => {
    if (props?.mostrarDialogUpdateAutoridad) {
      console.log("props");
      console.log(props);

      console.log("modoDialog: ");
      console.log(props?.modoDialogUpdateAutoridad);

      setTipoDeAutoridadSeleccionada(props?.tipoDeAutoridadSeleccionada || "");
      setTextFieldNombre(props?.autoridadSeleccionada?.nombre || "");
      setImagenSeleccionda(
        props?.autoridadSeleccionada?.imagen_seleccionada || ""
      );
      setBase64(props?.autoridadSeleccionada?.imagen || "");
      let facultades = props?.facultades || [];
      const carreras = props?.carreras || [];
      setCarreras(carreras);

      if (facultades?.length > 0) {
        const autoridadesFiltradas = props?.autoridadesFiltradas;

        if (autoridadesFiltradas?.length > 0) {
          const facultadesFiltradas = autoridadesFiltradas?.map(
            (autoridad) => autoridad?.institucion_id
          );

          let facultadesDisponibles = facultades?.filter(
            (facultad) => !facultadesFiltradas?.includes(facultad?.id)
          );

          if (
            props?.modoDialogUpdateAutoridad === "EDIT" ||
            props?.modoDialogUpdateAutoridad === "DELETE"
          ) {
            console.log("autoridadSeleccionada, facultadId");
            const facultadAutoridadSeleccionada =
              props?.autoridadSeleccionada?.institucion_id || -1;
            facultadesDisponibles = [
              ...facultadesDisponibles,
              ...facultades?.filter(
                (facultad) => facultad?.id === facultadAutoridadSeleccionada
              ),
            ];
          }

          facultades = [...facultadesDisponibles];
        }

        setFacultades(facultades);

        if (facultades?.length > 0) {
          setFacultadSeleccionada(facultades[0].id);
          console.log('a filtrar carreras ')
          console.log(carreras?.filter())

        } else {
          setFacultadSeleccionada("");
          setCarreras([])
        }
      } else {
        setFacultades([]);
        setFacultadSeleccionada("");
      }

      if (carreras?.length > 0) {
        setCarreraSeleccionada(carreras[0]?.id);
      } else {
        setCarreraSeleccionada("");
      }
    } else {
      setTextFieldNombre(undefined);
      setImagenSeleccionda(undefined);
      setBase64("");
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
      const base64 = await resizeFile(imagenSeleccionada);

      setBase64(base64);
    };

    if (imagenSeleccionada) {
      generateBase64();
    }
  }, [imagenSeleccionada]);

  const handleSubmit = (event) => {
    props?.setMostrarDialogUpdateAutoridad(false);
    props?.setCargando(true);
    const crearAutoridad = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/autoridad_detalle`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: textFieldNombre,
              imagen: base64,
              institucionId:
                tipoDeAutoridadSeleccionada === 1
                  ? facultadSeleccionada
                  : carreraSeleccionada,
              autoridadCabeceraId: tipoDeAutoridadSeleccionada,
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
          `${process.env.REACT_APP_SERVERURL}/autoridad_detalle/${props?.autoridadSeleccionada?.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: textFieldNombre,
              imagen: base64,
              institucionId:
                tipoDeAutoridadSeleccionada === 1
                  ? facultadSeleccionada
                  : carreraSeleccionada,
              estado: props?.autoridadSeleccionada?.estado,
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
          `${process.env.REACT_APP_SERVERURL}/autoridad_detalle/${props?.autoridadSeleccionada?.id}`,
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

  const capitalizarCadena = (cadena) => {
    let cadenaModificada = cadena;
    if (cadena === 1) {
      cadenaModificada = cadena?.charAt(0)?.toUpperCase();
    } else {
      cadenaModificada = `${cadena?.charAt(0)?.toUpperCase()}${cadena
        ?.slice(1, cadena?.length)
        ?.toLowerCase()}`;
    }
    return cadenaModificada;
  };

  return (
    <>
      <Dialog width={"md"} open={props.mostrarDialogUpdateAutoridad}>
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
              setImagenSeleccionda(undefined);
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
            <Grid container rowGap={2}>
              <Grid item xs={12}>
                <InputLabel required>NOMBRE</InputLabel>
                <TextField
                  required
                  fullWidth
                  size="small"
                  value={textFieldNombre}
                  onChange={(e) => {
                    if (e?.target?.value?.length <= 50) {
                      setTextFieldNombre(capitalizarCadena(e?.target?.value));
                    }
                  }}
                  disabled={
                    props?.modoDialogUpdateAutoridad === "DELETE" ? true : false
                  }
                />
              </Grid>
              <Grid container width="100%" flexDirection={"row"}>
                <InputLabel required>FACULTADES</InputLabel>
                <Grid item xs={12}>
                  {facultades?.length > 0 && facultadSeleccionada ? (
                    <Select
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={facultadSeleccionada}
                      onChange={(e) => {
                        const value = e?.target?.value
                        setFacultadSeleccionada(value);
                      }}
                    >
                      {facultades?.map((facultad) => {
                        return (
                          <MenuItem key={facultad?.id} value={facultad?.id}>
                            {facultad?.nombre}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  ) : (
                    "NO EXISTEN FACULTADES DISPONIBLES"
                  )}
                </Grid>
              </Grid>
              {(tipoDeAutoridadSeleccionada === 2 ||
                tipoDeAutoridadSeleccionada === 3) &&
              facultadSeleccionada &&
              carreraSeleccionada ? (
                <Grid container width="100%">
                  <InputLabel required>FACULTADES</InputLabel>
                  <Grid item xs={12}>
                    {carreras?.length > 0 && carreraSeleccionada ? (
                      <Select
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={carreraSeleccionada}
                        onChange={(e) => {
                          const value= e?.target?.value
                          setCarreraSeleccionada(value);
                        }}
                      >
                        {facultades?.map((carrera) => {
                          return (
                            <MenuItem key={carrera?.id} value={carrera?.id}>
                              {carrera?.nombre}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    ) : (
                      "NO EXISTEN CARRERAS DISPONIBLES"
                    )}
                  </Grid>
                </Grid>
              ) : (
                ""
              )}
              <Grid item xs={12}>
                <Grid
                  sx={{
                    width: "100%",
                    display: "flex",
                    columnGap: "2%",
                  }}
                >
                  <InputLabel>IMAGEN</InputLabel>
                  {base64 && (
                    <RemoveRedEyeIcon
                      onClick={(e) => {
                        setOpenVisualizador(true);
                      }}
                      disabled={
                        props?.modoDialogUpdateFacultad === "DELETE"
                          ? true
                          : false
                      }
                      sx={{ cursor: "pointer" }}
                    />
                  )}
                </Grid>
                {!base64 && (
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
                )}
                {base64 && (
                  <Grid
                    flexDirection={"row"}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      columnGap: "1%",
                    }}
                  >
                    <Grid sx={{ width: "88%" }}>
                      <TextField
                        size="small"
                        style={{ width: "100%" }}
                        required
                        disabled
                        value={
                          base64 && imagenSeleccionada?.name
                            ? imagenSeleccionada?.name
                            : "IMAGEN DE AUTORIDAD"
                        }
                      />
                    </Grid>
                    <Grid sx={{ width: "10%" }}>
                      <Button
                        disabled={props?.modoDialogUpdateAutoridad === "DELETE"}
                      >
                        <CloseIcon
                          onClick={(e) => {
                            setImagenSeleccionda(undefined);
                            setBase64(undefined);
                          }}
                          sx={{ cursor: "pointer" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                )}
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
                    props?.modoDialogUpdateAutoridad !== "DELETE"
                      ? textFieldNombre !== ""
                        ? false
                        : true
                      : false
                  }
                >
                  {props?.modoDialogUpdateAutoridad === "ADD"
                    ? textFieldNombre !== ""
                      ? "GUARDAR"
                      : "DEBE LLENAR TODOS LOS CAMPOS OBLIGATORIOS"
                    : props?.modoDialogUpdateAutoridad === "EDIT"
                    ? textFieldNombre !== ""
                      ? "EDITAR"
                      : "DEBE LLENAR TODOS LOS CAMPOS OBLIGATORIOS"
                    : "ELIMINAR"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
      {openVisualizador && (
        <Visualizador
          imagen={base64}
          openVisualizador={openVisualizador}
          setOpenVisualizador={setOpenVisualizador}
        />
      )}
    </>
  );
};

export default DialogUpdateAutoridad;
