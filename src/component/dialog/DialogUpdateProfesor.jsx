import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import { useState, useEffect, useRef } from 'react';

const DialogUpdateProfesor = (props) => {    
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
      open={props.mostrarDialogUpdateProfesor}             
    >
      <DialogTitle style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography>{
            props?.modoDialogUpdateProfesor === 'ADD' ? 'Añadir nuevo profesor' :          
            'Editar profesor'
          }
        </Typography>
        <Button 
          onClick={e => {
            props?.setMostrarDialogUpdateProfesor(false)            
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>      
      <DialogContent>        
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 0.5 }}>
            <Grid container spacing={2} >                            
              <Grid item xs={12} sm={6}>                
                <InputLabel required>Cédula</InputLabel>
                <TextField                  
                  required
                  fullWidth
                  id="cedula"                  
                  name="cedula"
                  autoComplete="cedula"
                  size='small'
                  value={props?.dataProfesor?.cedula || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>                
                <InputLabel required>Facultad</InputLabel>
                <Select    
                  variant="outlined" size="small"              
                  id="facultad-select"
                  fullWidth                                  
                  value={props?.dataProfesor?.facultad || 'facultad1'}
                >
                  <MenuItem value={'facultad1'}>Facultad 1</MenuItem>
                  <MenuItem value={'facultad2'}>Facultad 2</MenuItem>
                  <MenuItem value={'facultad3'}>Facultad 3</MenuItem>                  
                </Select>  
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel required>Primer nombre</InputLabel>
                <TextField
                  size="small"                    
                  fullWidth
                  id="primerNombre"                  
                  name="primerNombre"
                  autoComplete="primerNombre"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Segundo nombre</InputLabel>
                <TextField                  
                  fullWidth
                  size="small"
                  id="segundoNombre"                  
                  name="segundoNombre"
                  autoComplete="segundoNombre"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel required>Primer apellido</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  name="primerApellido"                  
                  type="primerApellido"
                  id="primerApellido"
                  autoComplete="primerApellido"
                />
              </Grid> 
              <Grid item xs={12} sm={6}>
                <InputLabel required>Segundo apellido</InputLabel>
                <TextField                  
                  fullWidth size="small"
                  name="segundoApellido"                  
                  type="segundoApellido"
                  id="segundoApellido"
                  autoComplete="segundoApellido"
                />
              </Grid> 
              <Grid item xs={12} sm={12} style={{display: 'flex'}}>                                  
                  <Button sm={12}
                    type="submit"                    
                    style={{
                      backgroundColor: '#990000',
                      color: 'white',    
                      width: '100%'                
                    }}
                    onClick={e => {
                      console.log('props: ')
                      console.log(props)
                    }}
                  >
                    Guardar
                  </Button>              
              </Grid>                                             
            </Grid>
          </Box>      
      </DialogContent>
    </Dialog>
  )
}

export default DialogUpdateProfesor