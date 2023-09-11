import "./App.css";
import { useEffect, useState } from "react";
import Landing from "./component/pantalla/Landing";
import Dashboard from "./component/pantalla/Dashboard";
import PaginaNoEncontrada from "./component/pantalla/PaginaNoEncontrada";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import * as React from "react";
import { useCookies } from "react-cookie";

const App = () => {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState(undefined);
  const [message, setMessage] = useState(undefined);
  const [cookies] = useCookies(null);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={
              !cookies?.EMAIL &&
              !cookies?.TOKEN &&
              !cookies?.ALIAS &&
              !cookies?.ROL_ID ? (
                <Landing
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              ) : (
                <Dashboard
                  seccion="SeccionInicio"
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              )
            }
          />
          <Route
            index
            element={
              cookies?.EMAIL && cookies?.TOKEN ? (
                <Dashboard
                  seccion="SeccionInicio"
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              ) : (
                <Landing
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              )
            }
            path="dashboard/inicio"
          ></Route>
          <Route
            index
            element={
              cookies?.EMAIL && cookies?.TOKEN ? (
                <Dashboard
                  seccion="SeccionSorteo"
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              ) : (
                <Landing
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              )
            }
            path="dashboard/sorteo"
          ></Route>
          <Route
            index
            element={
              cookies?.EMAIL && cookies?.TOKEN ? (
                <Dashboard
                  seccion="SeccionProfesores"
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              ) : (
                <Landing
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              )
            }
            path="dashboard/profesores"
          ></Route>
          <Route
            index
            element={
              cookies?.EMAIL && cookies?.TOKEN ? (
                <Dashboard
                  seccion="SeccionRegalos"
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              ) : (
                <Landing
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              )
            }
            path="dashboard/regalos"
          ></Route>
          <Route
            index
            element={
              cookies?.EMAIL && cookies?.TOKEN ? (
                <Dashboard
                  seccion="SeccionUsuarios"
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              ) : (
                <Landing
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              )
            }
            path="dashboard/usuarios"
          ></Route>
          <Route
            index
            element={
              cookies?.EMAIL && cookies?.TOKEN ? (
                <Dashboard
                  seccion="SeccionSorteos"
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              ) : (
                <Landing
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              )
            }
            path="dashboard/sorteos"
          ></Route>
          <Route
            index
            element={
              cookies?.EMAIL && cookies?.TOKEN ? (
                <Dashboard
                  seccion="SeccionCatalogo"
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              ) : (
                <Landing
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              )
            }
            path="dashboard/catalogo"
          ></Route>
          <Route
            index
            element={
              cookies?.EMAIL && cookies?.TOKEN ? (
                <Dashboard
                  seccion="SeccionFacultades"
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              ) : (
                <Landing
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              )
            }
            path="dashboard/facultades"
          ></Route>
          <Route
            index
            element={
              cookies?.EMAIL && cookies?.TOKEN ? (
                <Dashboard
                  seccion="SeccionCarreras"
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              ) : (
                <Landing
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              )
            }
            path="dashboard/carreras"
          ></Route>
          <Route
            index
            element={
              cookies?.EMAIL && cookies?.TOKEN ? (
                <Dashboard
                  seccion="SeccionTipoDonacion"
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              ) : (
                <Landing
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              )
            }
            path="dashboard/tipoDonacion"
          ></Route>
          <Route
            path="dashboard/*"
            element={
              cookies?.EMAIL && cookies?.TOKEN ? (
                <Dashboard
                  seccion="SeccionInicio"
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              ) : (
                <Landing
                  setSeverity={setSeverity}
                  setMessage={setMessage}
                  setOpenSnackBar={setOpenSnackBar}
                />
              )
            }
          ></Route>
        </Routes>
      </BrowserRouter>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        key={"top right"}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default App;
