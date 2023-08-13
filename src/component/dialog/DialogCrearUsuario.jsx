import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import {useEffect} from 'react'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const DialogCrearUsuario = (props) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <Dialog
      fullWidth
      maxWidth={'sm'}
      open={props.mostrarDialogCrearUsuario} 
    >
      <DialogTitle style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>      
        <Button onClick={e => {
          props.setMostrarDialogCrearUsuario(false)
        }}><CloseIcon /></Button>      
      </DialogTitle>      
      <DialogContent>        
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 0.5 }}>
            <Grid container spacing={2} >              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField                  
                  fullWidth
                  id="alias"
                  label="nombre de usuario"
                  name="alias"
                  autoComplete="alias"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="pwd"
                  label="contraseña"
                  type="pwd"
                  id="pwd"
                  autoComplete="new-pwd"
                />
              </Grid> 
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="pwd_confirm"
                  label="confirmar contraseña"
                  type="pwd_confirm"
                  id="pwd_confirm"
                  autoComplete="confirm-pwd"
                />
              </Grid> 
              <Grid item xs={12} sm={12} style={{display: 'flex'}}>                
                  <Tooltip title="Se creará un usuario con rol (gestor de sorteo), los usuarios con rol(administrador) solo pueden ser creados por otro usuario con rol(administrador)" sm={1} style={{alignItems: 'left'}}>
                    
                    <IconButton>
                      <PriorityHighIcon />
                    </IconButton>
                  </Tooltip>                                                  
                  <Button sm={11}
                    type="submit"                    
                    style={{
                      backgroundColor: '#990000',
                      color: 'white',    
                      width: '100%'                
                    }}                        
                  >
                    Crear Usuario
                  </Button>              
              </Grid>                                             
            </Grid>
          </Box>      
      </DialogContent>
    </Dialog>
  )
}

export default DialogCrearUsuario