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

const DialogUpdateDetalleCatalogo = (props) => {
  const handleSubmit = (event) => {
    const crearDetalle = async () => {
      const data = new FormData(event.currentTarget);
      const nombre = data?.get("nombre");
      const descripcion = data?.get("descripcion");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/catalogo_detalle`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre,
              descripcion,
              creadoPor: "admin@test.com",
              cabeceraId: props?.cabeceraSeleccionada?.id,
            }),
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateDetalleCatalogo(false);
          props?.getCatalogos();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const actualizarDetalle = async () => {
      const data = new FormData(event.currentTarget);
      const nombre = data?.get("nombre");
      const descripcion = data?.get("descripcion");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/catalogo_detalle/${props?.detalleSeleccionado?.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre,
              descripcion,
            }),
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateDetalleCatalogo(false);
          props?.getCatalogos();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const borrarDetalle = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/catalogo_detalle/${props?.detalleSeleccionado?.id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateDetalleCatalogo(false);
          props?.getCatalogos();
        }
      } catch (err) {
        console.log(err);
      }
    };

    event.preventDefault();

    props?.setCargando(true);
    if (props?.modoDialogUpdateDetalleCatalogo === "ADD") crearDetalle();
    else if (props?.modoDialogUpdateDetalleCatalogo === "EDIT")
      actualizarDetalle();
    else if (props?.modoDialogUpdateDetalleCatalogo === "DELETE")
      borrarDetalle();
  };

  return (
    <Dialog
      fullWidth
      maxWidth={"sm"}
      open={props.mostrarDialogUpdateDetalleCatalogo}
    >
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {props?.modoDialogUpdateDetalleCatalogo === "ADD" ? (
            <Typography>{`Añadir nuevo detalle ( ${props?.cabeceraSeleccionada?.nombre} )`}</Typography>
          ) : props?.modoDialogUpdateDetalleCatalogo === "EDIT" ? (
            <Typography>EDITAR DETALLE</Typography>
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
                EL REGISTRO SERÁ ELIMINADO
              </Typography>
            </div>
          )}
        </div>
        <Button
          onClick={(e) => {
            props?.setMostrarDialogUpdateDetalleCatalogo(false);
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
            <Grid item xs={12}>
              <InputLabel required>Nombre</InputLabel>
              <TextField
                fullWidth
                id="nombre"
                name="nombre"
                autoComplete="nombre"
                size="small"
                defaultValue={props?.detalleSeleccionado?.nombre || ""}
                disabled={
                  props?.modoDialogUpdateDetalleCatalogo === "DELETE"
                    ? true
                    : false
                }
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel required>Descripcion</InputLabel>
              <TextField
                multiline
                rows={4}
                size="small"
                fullWidth
                id="descripcion"
                name="descripcion"
                defaultValue={props?.detalleSeleccionado?.descripcion || ""}
                disabled={
                  props?.modoDialogUpdateDetalleCatalogo === "DELETE"
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
                {props?.modoDialogUpdateDetalleCatalogo === "ADD"
                  ? "GUARDAR"
                  : props?.modoDialogUpdateDetalleCatalogo === "EDIT"
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

export default DialogUpdateDetalleCatalogo;
