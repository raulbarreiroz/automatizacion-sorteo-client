import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Carga from "../Carga";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CasinoIcon  from '@mui/icons-material/Casino'
import XLSX from "sheetjs-style";
import React from "react";
import { Typography } from "@mui/material";

const SeccionInicio = () => {
  const [bitacora, setBitacora] = useState(undefined)
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const [cargando, setCargando] = useState(false);
  const gridBotones = useRef(undefined);
  const selectRef = useRef(undefined);
  const [fechasBitacora, setFechasBitacora] = useState(undefined)
  const [fechaBitacoraSeleccionada, setFechaBitacoraSeleccionada] = useState(undefined)
  const [bitacoraFiltrada, setBitacoraFiltrada] = useState(undefined)

  const getFechasBitacora = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/fechas-bitacora`
      );
      const fechasBitacora = await response.json();

      if (fechasBitacora?.length) {                     
        const fechasBitacoraEditada = fechasBitacora?.map(f => {          
          const dia = f?.dia
          const mes = f?.mes - 1
          const anio = f?.anio
          const fecha = new Date(anio, mes, dia)                    
          return fecha
        })?.sort((a, b) => a?.getTime() - b?.getTime());
        setFechasBitacora(fechasBitacoraEditada)
        setFechaBitacoraSeleccionada(fechasBitacoraEditada[0])
      } else {
        setFechasBitacora([]); 
        setFechaBitacoraSeleccionada('')
      }
    } catch (err) {
      console.log(err);
      setFechasBitacora([]);      
    }    
  }, []);
 

  const getBitacora = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/bitacora`
      );
      const bitacora = await response.json();

      if (bitacora?.length) {
        setBitacora(bitacora);        
      } else {
        setBitacora([]); 
      }
    } catch (err) {
      console.log(err);
      setBitacora([]);      
    }
    setCargando(false);
  }, []);
 
  useEffect(() => {
    setCargando(true)
    getFechasBitacora()
    getBitacora()
  }, [getBitacora, getFechasBitacora])

  useEffect(() => {   
    setCargando(true)
    if (fechaBitacoraSeleccionada && bitacora?.length) {
      const bitacoraFiltrada = bitacora?.filter(b => {                                
        const bSplitted = b?.fecha?.split('T')[0]?.split('-')
        let d, m, y, fechaIterada
        if (bSplitted?.length === 3) {
          d = bSplitted[2]
          m = bSplitted[1]
          y = bSplitted[0]
          fechaIterada = new Date(y, m - 1, d)                       
    } else {
      fechaIterada = {}
        }
      
        if (fechaIterada?.getDate() === fechaBitacoraSeleccionada?.getDate() && 
          fechaIterada?.getMonth() === fechaBitacoraSeleccionada?.getMonth() &&
          fechaIterada?.getFullYear() === fechaBitacoraSeleccionada?.getFullYear()
        ) {
          return true
        }

        return false
      })      
      setBitacoraFiltrada(bitacoraFiltrada)
    } else {
      setBitacoraFiltrada([])
    }
    setCargando(false)
  }, [fechaBitacoraSeleccionada, bitacora])

  const formatearHora = (stringDate) => {
    let fechaConError = false
    let h, min, s
    const splitted = stringDate?.split('T')
    if (splitted?.length === 2) {      
      const hora = splitted[1]?.split(':')            
      h = hora[0]
      min = hora[1]
      const sSplitted = hora[2]?.split('.')      
      if (sSplitted?.length === 2) {
        s = sSplitted[0]
      } else {
        s = ''
        fechaConError = true
      }     
    } else {
      fechaConError = true
    }
    
    if (fechaConError) {
      return 'HORA GUARDADA CON INCONSISTENCIAS'
    } else {
      return `${h}:${min}:${s}`
    }
  }

  const formatearFecha = (date) => {
    const dia = date?.getDate() < 10 ? `0${date?.getDate()}` : date?.getDate()
    const mes = (date?.getMonth() + 1) < 10 ? `0${date?.getMonth() + 1}` : date?.getMonth() + 1
    const anio = date?.getFullYear()
    return `${dia} / ${mes} / ${anio}`
  }

  const generarArchivoBitacora = (data, fechaSeleccionada) => {    
    let nombreArchivo = 'Sorteo'
    if (fechaSeleccionada) {      
      nombreArchivo += ` (${formatearFecha(fechaBitacoraSeleccionada)?.replaceAll(' / ', ' ')})`
    } else {
      nombreArchivo += '(fecha no definida)'
    }
    
    const worksheet = XLSX.utils.json_to_sheet(data?.map(d => {
      return {
        nombre_profesor: d?.nombre_profesor?.trim(),
        nombre_regalo: d?.nombre_regalo?.trim(),
        nombre_facultad: d?.nombre_facultad?.trim(),
        hora: formatearHora(d?.fecha),
        entregado: 'NO'
      }
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja 1");
    XLSX.writeFile(workbook, `${nombreArchivo}.xlsx`);
    setCargando(false)
  };

  return (
    <>
      <Paper
        style={{
          width: "100%",
          height: "100%",
          padding: "2.5vh 1.5vw",
        }}
      >
        <Grid  width={'100%'} ref={gridBotones}>          
          <Grid container item xs={12} justifyContent={'space-between'} alignItems={'center'}>            
            <Grid item xs={12} sm={6}>              
              {fechaBitacoraSeleccionada ?
                <Grid container width={'100%'}>
                  <Grid width='125px'><Typography>FECHA SORTEO</Typography></Grid>
                  <Grid width='calc(100% - 125px)'><Select
                    ref={selectRef}
                    sx={{
                      p: 0,
                      m: 0,
                      mb: 2,                  
                    }}
                    variant="outlined"
                    size="small"
                    id="cabecera-select"
                    value={fechaBitacoraSeleccionada}
                    onChange={e => {
                      console.log(e?.target?.value)
                      setFechaBitacoraSeleccionada(e?.target?.value)
                    }}
                  >
                    {
                      fechasBitacora?.length &&
                      fechasBitacora?.map((fecha, i) => {
                        return (
                          <MenuItem key={i} value={fecha}>
                            {formatearFecha(fecha)}
                          </MenuItem>
                        );
                      })
                    }
                    </Select></Grid>
                  </Grid>
                  : ''                
              }
            </Grid>
            {bitacoraFiltrada?.length > 0 &&
              <Grid item xs={12} sm={5} md={3} mb={2}>
                <Button
                  variant="outlined"
                  startIcon={<CasinoIcon />}
                  endIcon={<CloudDownloadIcon style={{
                    transform: 'scale(1.2)'
                  }} />}
                  fullWidth
                  onClick={e => {
                    e?.preventDefault()
                    setCargando(true)
                    generarArchivoBitacora(bitacoraFiltrada, fechaBitacoraSeleccionada)
                  }}
                >
                  EXPORTAR
                </Button>
              </Grid>
            }
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          style={{            
            maxHeight: `calc(100% - ${gridBotones?.current?.clientHeight}px)`,
            overflow: bitacoraFiltrada?.length ? "scroll" : "hidden",
          }}
      >
          {bitacoraFiltrada?.length ? (
            <TableContainer
              component={Paper}
              style={{
                overflowX: "initial",
              }}
            >
              <Table aria-label="tabla de bitacora" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                        borderStartStartRadius: "5px",
                      }}
                    >
                      Profesor
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Regalo
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Facultad
                  </TableCell> 
                  <TableCell
                      style={{
                        backgroundColor: "rgb(153, 0, 0)",
                        color: "white",
                      }}
                    >
                      Hora
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bitacoraFiltrada.map((row, i) => {
                    return (
                      <TableRow
                        key={`${row?.cedula}-${i}`}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                          backgroundColor:
                            hoveredCell !== undefined
                              ? hoveredCell === i
                                ? "rgba(153, 0, 0, 0.2)"
                                : "white"
                              : "white",
                        }}
                        onMouseEnter={(e) => {
                          setHoveredCell(i);
                        }}
                        onMouseLeave={(e) => {
                          setHoveredCell(undefined);
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.nombre_profesor}
                        </TableCell>
                        <TableCell>{row?.nombre_regalo}</TableCell>
                        <TableCell>{row?.nombre_facultad}</TableCell>                  
                        <TableCell>{formatearHora(row?.fecha)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div
              style={{
                textAlign: "center",
                margin: "10px 0",
              }}
            >
              La bitacora no tiene registros
            </div>
          )}
    </Grid>
      </Paper>
    
          <Carga cargando={cargando} /></>

  )
}

export default SeccionInicio