import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const DialogDeConfirmacion = (props) => {
  return (
    <Dialog
      open={props?.mostrarDialogDeConfirmacion}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"¿Está seguro de querer eliminar el registro seleccionado?"}
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={(e) => {
            props?.setBorrarRow(false);
            props?.setMostrarDialogDeConfirmacion(false);
          }}
        >
          NO
        </Button>
        <Button
          onClick={(e) => {
            props?.setBorrarRow(true);
            props?.setMostrarDialogDeConfirmacion(false);
          }}
          autoFocus
        >
          DE ACUERDO
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDeConfirmacion;
