import "./App.css";
import { useEffect, useState } from "react";
import IniciarSesion from "./component/pantalla/IniciarSecion";
import Dashboard from "./component/pantalla/Dashboard";
import PaginaNoEncontrada from "./component/pantalla/PaginaNoEncontrada";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const getUsuarios = async () => {
      //console.log("getting usuarios");
      try {
        /*
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/usuarios`
        );
        
        //console.log(`${process.env.REACT_APP_SERVERURL}/usuarios`);
        const json = await response.json();
        //console.log(json);
        if (response.status === 200) {
          setUsuarios(json);
        } else {
          setUsuarios([]);
        }
        */
      } catch (err) {
        //console.log(err);
        //console.log("para la proxima campeon");
        setUsuarios([]);
      }
    };

    getUsuarios();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<IniciarSesion />} path="/"></Route>
          <Route
            index
            element={<Dashboard seccion="SeccionInicio" />}
            path="dashboard/inicio"
          ></Route>
          <Route
            index
            element={<Dashboard seccion="SeccionSorteo" />}
            path="dashboard/sorteo"
          ></Route>
          <Route
            index
            element={<Dashboard seccion="SeccionProfesores" />}
            path="dashboard/profesores"
          ></Route>
          <Route
            index
            element={<Dashboard seccion="SeccionRegalos" />}
            path="dashboard/regalos"
          ></Route>
          <Route
            index
            element={<Dashboard seccion="SeccionUsuarios" />}
            path="dashboard/usuarios"
          ></Route>
          <Route
            index
            element={<Dashboard seccion="SeccionSorteos" />}
            path="dashboard/sorteos"
          ></Route>
          <Route
            index
            element={<Dashboard seccion="SeccionCatalogo" />}
            path="dashboard/catalogo"
          ></Route>
          <Route path="*" element={<PaginaNoEncontrada />} />
          <Route
            path="dashboard/*"
            element={<Dashboard seccion="SeccionInicio" />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
