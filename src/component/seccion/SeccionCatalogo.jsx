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

const SeccionCatalogo = (props) => {
  const gridBotones = useRef(undefined)
  const [modoDialogUpdateProfesor, setModoDialogUpdateProfesor] = useState(undefined)
  const [today, setToday] = useState(undefined)
  const [hoveredCell, setHoveredCell] = useState(undefined)
  const [mostrarDialogUpdateProfesor, setMostrarDialogUpdateProfesor] = useState(false)
  const [dataProfesor, setDataProfesor] = useState(undefined)
  
  useEffect(() => {
    console.log('getting catalogos: ')
    const getCatalogos = async () => {
      console.log(`${process.env.REACT_APP_SERVERURL}/catalogos`)
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/catalogos`)
      const catalogos = await response.json()
      console.log(catalogos)
    }

    getCatalogos()
  }, [])

  function createProfesor(cedula, nombreCompleto, facultad, creadoPor) {
    return { cedula, nombreCompleto, facultad, creadoPor, today };
  }

  const rows = [
    createProfesor('0000000000', 'profesor0', 'facultad1', 'admin'),
    createProfesor('0000000001', 'profesor1', 'facultad1', 'admin'),
    createProfesor('0000000002', 'profesor2', 'facultad2', 'admin'),
    createProfesor('0000000003', 'profesor3', 'facultad2', 'admin'),
    createProfesor('0000000004', 'profesor4', 'facultad3', 'admin'),
    createProfesor('0000000005', 'profesor5', 'facultad1', 'admin'),
    createProfesor('0000000006', 'profesor6', 'facultad1', 'admin'),
    createProfesor('0000000007', 'profesor7', 'facultad1', 'admin'),
    createProfesor('0000000008', 'profesor8', 'facultad2', 'admin'),
  ];

  return (     
    <>
      <Paper
        style={{        
          width: '100%',
          height: '100%',
          padding: '2.5vh 1.5vw'
        }}
      >
        <Grid ref={gridBotones}>
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
                      Cédula
                    </TableCell>
                    <TableCell
                    style={{
                        backgroundColor: 'rgb(153, 0, 0)',
                        color: 'white'                      
                      }}  
                    >
                      Nombre completo
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: 'rgb(153, 0, 0)',
                        color: 'white'                      
                      }}  
                    >
                      Facultad
                    </TableCell>
                    <TableCell
                    style={{
                        backgroundColor: 'rgb(153, 0, 0)',
                        color: 'white'                      
                      }}  
                    >
                      CreadoPor
                    </TableCell>
                    <TableCell
                    style={{
                        backgroundColor: 'rgb(153, 0, 0)',
                        color: 'white'                      
                      }}  
                    >
                      FechaCreacion
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
                  {rows.map((row, i) => (
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
                        {row.cedula}
                      </TableCell>
                      <TableCell>{row.nombreCompleto}</TableCell>
                      <TableCell>{row.facultad}</TableCell>
                      <TableCell>{row.creadoPor}</TableCell>
                      <TableCell>{row.today}</TableCell>
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

export  default SeccionCatalogo