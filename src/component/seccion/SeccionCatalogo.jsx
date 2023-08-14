import { useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DialogUpdateProfesor from '../dialog/DialogUpdateProfesor';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField';

const SeccionCatalogo = (props) => {
  const gridBotones = useRef(undefined)
  const [modoDialogUpdateProfesor, setModoDialogUpdateProfesor] = useState(undefined)
  const [today, setToday] = useState(undefined)
  const [hoveredCell, setHoveredCell] = useState(undefined)
  const [mostrarDialogUpdateProfesor, setMostrarDialogUpdateProfesor] = useState(false)
  const [dataProfesor, setDataProfesor] = useState(undefined)
  const [catalogos, setCatalogos] = useState(undefined)
  const [cabeceras, setCabeceras] = useState(undefined)
  const [detalles, setDetalles] = useState(undefined)
  const [cabeceraSeleccionada, setcabeceraSeleccionada] = useState(-1)

  useEffect(() => {
    const getCatalogos = async () => {
      try {
        console.log(`${process.env.REACT_APP_SERVERURL}/catalogos`)
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/catalogos`)
        const catalogos = await response.json()
        setCatalogos(catalogos || [])
        setCabeceras(catalogos?.map((cabecera) => ({
          nombre: cabecera?.nombre,
          id: cabecera?.id
        })))
        setcabeceraSeleccionada(catalogos[0]?.id)
      } catch(err) {
        console.log(err)
        setCatalogos([])
        setCabeceras(-1)
        setcabeceraSeleccionada([])
      }
    }

    getCatalogos()
  }, [])

  useEffect(() => {
    const catalogosFiltrados = catalogos?.filter(catalogo => catalogo?.id === cabeceraSeleccionada)
    if (catalogosFiltrados?.length) {
      setDetalles(catalogosFiltrados[0]?.detalles)
    } else {
      setDetalles([])
    }
  }, [cabeceraSeleccionada, catalogos])

  useEffect(() => {
    console.log('detalles')
    console.log(detalles)
  }, [detalles])

  return (     
    <>
      <Paper
        style={{        
          width: '100%',
          height: '100%',
          padding: '2.5vh 1.5vw'
        }}
      >
        <Grid ref={gridBotones} container
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >                                
          <Select    
            sx={{
              p: 0,
              m: 0,
              mb: 2,
              ml: -3,
              transform: 'scale(0.9)',
              width: '40%'
            }}
            variant="outlined" size='small'              
            id="facultad-select"                                               
            value={cabeceraSeleccionada}
          >
            {cabeceras?.map((cabecera) => {
              return (
                <MenuItem key={cabecera?.id} value={cabecera?.id}>{cabecera?.nombre}</MenuItem>
              )
            })}             
          </Select>                                            
          <Button variant="outlined" 
            startIcon={<SchoolIcon />} endIcon={<AddIcon />}
            sx={{mb: 2,}}
            onClick={e => {
              setMostrarDialogUpdateProfesor(true)
              setModoDialogUpdateProfesor('ADD')
              setDataProfesor(undefined)
            }}
          >
            Catalogo
          </Button>                                                             
        </Grid>
        <Grid 
          item xs={12}
          style={{          
            maxHeight: `calc(100% - ${gridBotones?.current?.clientHeight}px)`,
            overflow: 'scroll'
          }}
        >        
            <TableContainer 
              component={Paper}            
              style={{
                overflowX: 'initial'
              }}
            >
              <Table 
                aria-label="tabla de profesores"
                stickyHeader
              >
                <TableHead>
                  <TableRow >
                    <TableCell
                      style={{
                        backgroundColor: 'rgb(153, 0, 0)',
                        color: 'white',
                        borderStartStartRadius: '5px'                      
                      }}
                    >
                      Nombre
                    </TableCell>
                    <TableCell
                    style={{
                        backgroundColor: 'rgb(153, 0, 0)',
                        color: 'white'                      
                      }}  
                    >
                      Descripcion
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: 'rgb(153, 0, 0)',
                        color: 'white'                      
                      }}  
                    >
                      Creado por
                    </TableCell>
                    <TableCell
                    style={{
                        backgroundColor: 'rgb(153, 0, 0)',
                        color: 'white'                      
                      }}  
                    >
                      Fecha de Creacion
                    </TableCell>                  
                    <TableCell
                    style={{
                        backgroundColor: 'rgb(153, 0, 0)',
                        color: 'white'                      
                      }}                      
                      width='20px'
                    >
                      Editar
                    </TableCell>
                    <TableCell
                    style={{
                        backgroundColor: 'rgb(153, 0, 0)',
                        color: 'white',
                        borderStartEndRadius: '5px'
                      }}                    
                      width='20px'  
                    >
                      Borrar
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detalles?.length && detalles.map((row, i) => (
                    <TableRow
                      key={row.cedula}
                      sx={{ 
                        '&:last-child td, &:last-child th': { 
                          border: 0 
                        },
                        backgroundColor: hoveredCell !== undefined ? 
                          hoveredCell === i ? 'rgba(153, 0, 0, 0.2)' : 'white' : 
                          'white'
                      }}
                      onMouseEnter={e => {
                        setHoveredCell(i)
                      }}
                      onMouseLeave={e => {                      
                        setHoveredCell(undefined)
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.nombre}
                      </TableCell>
                      <TableCell>{row.descripcion}</TableCell>
                      <TableCell>{row.creado_por}</TableCell>
                      <TableCell>{row.fecha_creacion}</TableCell>                      
                      <TableCell>
                        <EditIcon 
                          style={{
                            cursor: 'pointer'
                          }}
                          onClick={e => {
                            setMostrarDialogUpdateProfesor(true)
                            setModoDialogUpdateProfesor('EDIT')                            
                            setDataProfesor(row)
                          }}
                        />
                      </TableCell> 
                      <TableCell>
                        <DeleteForeverIcon 
                          style={{
                            cursor: 'pointer'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>        
        </Grid>        
      </Paper>  
      <DialogUpdateProfesor 
        mostrarDialogUpdateProfesor={mostrarDialogUpdateProfesor} 
        setMostrarDialogUpdateProfesor={setMostrarDialogUpdateProfesor}
        modoDialogUpdateProfesor={modoDialogUpdateProfesor}
        setModoDialogUpdateProfesor={setModoDialogUpdateProfesor}
        dataProfesor={dataProfesor}
        setDataProfesor={setDataProfesor}
      />
    </>  
  )
}

export default SeccionCatalogo


/**
 * TODO:
 * arreglar select y boton
 */