import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DialogUpdateProfesor from "../dialog/DialogUpdateProfesor";
import Carga from "../Carga";
import DialogUsarArchivoProfesor from "../dialog/DialogUsarArchivoProfesor";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import PublishIcon from "@mui/icons-material/Publish";
import Visualizador from "../Visualizador";
import imagenNoDisponible from "../../resources/imagen/imagen no disponible.jpg"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const SeccionInicio = () => {
  const [bitacora, setBitacora] = useState(undefined)
  const [hoveredCell, setHoveredCell] = useState(undefined);
  const [cargando, setCargando] = useState(false);



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
    getBitacora()
  }, [getBitacora])

  useEffect(() => {
    console.log('bitacora')
    console.log(bitacora)
  }, [bitacora])

  return (
    <>
    <Grid
          item
          xs={12}
          style={{            
            overflow: bitacora?.length ? "scroll" : "hidden",
          }}
        >
          {bitacora?.length ? (
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
                      Fecha
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bitacora.map((row, i) => {
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
                        <TableCell>{row?.fecha }</TableCell>
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
          <Carga cargando={cargando} /></>

  )
}

export default SeccionInicio