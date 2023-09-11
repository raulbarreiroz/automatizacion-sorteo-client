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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";


const DialogUpdateUsuario = (props) => {
  const [, setCookie] = useCookies(null);
  const navigate = useNavigate();



  const handleSubmit = (event) => {
    const crearUsuario = async () => {
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const pwd = data?.get("pwd");
      const alias = data?.get("alias");
      const rol = data?.get("rol");

      console.log('email', email)
      console.log('pwd', pwd)
      console.log('alias', alias)
      console.log('rol', rol)
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/gestor`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              pwd,
              alias,                                        
            }),
          }
        );
        if (response.status === 200) {
          console.log('hola')
          const usuario = await response?.json()
          
          console.log('usuario')
          console.log(usuario)
          
          if (usuario) {
            console.log(usuario?.severity)
            console.log(usuario?.message)

            if (usuario?.email && usuario?.token) {
              setCookie('EMAIL', usuario?.email)
              setCookie('TOKEN', usuario?.token)
              setCookie('ALIAS', usuario?.alias)
              setCookie('ROL_ID', usuario?.rolId)
              navigate('/dashboard/inicio')
            }

            props?.setSeverity(usuario?.severity)
            props?.setMessage(usuario?.message)
          }

          props?.setMostrarDialogUpdateUsuario(false);
          props?.getUsuarios();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const actualizarUsuario = async () => {
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const pwd = data?.get("pwd");
      const alias = data?.get("alias");
      const rol = data?.get("rol");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/usuario/${props?.usuarioSeleccionado?.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              pwd: props?.modoDialogUpdateUsuario === "EDIT" ? undefined : pwd,
              hashedPwd:
                props?.modoDialogUpdateUsuario !== "EDIT"
                  ? props?.usuarioSeleccionado?.hashed_pwd
                  : undefined,
              alias,
              cabeceraId: props?.cabeceraId,
              detalleId: rol,
            }),
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateUsuario(false);
          props?.getUsuarios();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const borrarUsuario = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/usuario/${props?.usuarioSeleccionado?.id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 200) {
          props?.setMostrarDialogUpdateUsuario(false);
          props?.getUsuarios();
        }
      } catch (err) {
        console.log(err);
      }
    };

    event.preventDefault();

    props?.setCargando(true);
    if (props?.modoDialogUpdateUsuario === "ADD") crearUsuario();
    else if (props?.modoDialogUpdateUsuario === "EDIT") actualizarUsuario();
    else if (props?.modoDialogUpdateUsuario === "DELETE") borrarUsuario();
  };

  return (
    <Dialog fullWidth maxWidth={"sm"} open={props.mostrarDialogUpdateUsuario}>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {props?.modoDialogUpdateUsuario === "ADD" ? (
            <Typography>{`AÑADIR NUEVO USUARIO`}</Typography>
          ) : props?.modoDialogUpdateUsuario === "EDIT" ? (
            <Typography>EDITAR USUARIO</Typography>
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
                EL USUARIO SERÁ ELIMINADO
              </Typography>
            </div>
          )}
        </div>
        <Button
          onClick={(e) => {
            props?.setMostrarDialogUpdateUsuario(false);
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
              <InputLabel required>EMAIL</InputLabel>
              <TextField
                size="small"
                fullWidth
                name="email"
                type="email"
                id="email"
                defaultValue={props?.usuarioSeleccionado?.email || ""}
                disabled={
                  props?.modoDialogUpdateUsuario === "DELETE" ? true : false
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>CONTRASEÑA</InputLabel>
              <TextField
                fullWidth
                size="small"
                name="pwd"
                type={
                  props?.modoDialogUpdateUsuario === "EDIT"
                    ? "password"
                    : "text"
                }
                id="pwd"
                defaultValue={props?.usuarioSeleccionado?.hashed_pwd || ""}
                disabled={
                  props?.modoDialogUpdateUsuario === "DELETE" ||
                  props?.modoDialogUpdateUsuario === "EDIT"
                    ? true
                    : false
                }
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputLabel>ALIAS</InputLabel>
              <TextField
                fullWidth
                size="small"
                name="alias"
                type="alias"
                id="alias"
                defaultValue={props?.usuarioSeleccionado?.alias || ""}
                disabled={
                  props?.modoDialogUpdateUsuario === "DELETE" ? true : false
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
                {props?.modoDialogUpdateUsuario === "ADD"
                  ? "GUARDAR"
                  : props?.modoDialogUpdateUsuario === "EDIT"
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

export default DialogUpdateUsuario;
