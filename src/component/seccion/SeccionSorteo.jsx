import Paper from "@mui/material/Paper";
import { useEffect, useState, useRef, useCallback } from "react";
import Carga from "../Carga";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { CoPresentOutlined, SetMealRounded } from "@mui/icons-material";

const SeccionSorteo = (props) => {
  const [facultades, setFacultades] = useState(undefined);
  const [regalos, setRegalos] = useState(undefined);
  const [tiposDeDonaciones, setTiposDeDonaciones] = useState(undefined);
  const [sorteos, setSorteos] = useState(undefined);
  const [cargando, setCargando] = useState(false);
  const [empezarSorteo, setEmpezarSorteo] = useState(undefined);
  const [tipoDeDonacionSeleccinado, setTipoDeDonacionSeleccionado] =
    useState(undefined);

  const getFacultades = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/facultades`
      );
      const facultades = await response.json();
      if (facultades?.length) {
        setFacultades(facultades);
      } else {
        setFacultades([]);
      }
    } catch (err) {
      console.log(err);
      setFacultades([]);
    }
    setCargando(false);
  }, []);

  const getRegalos = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/regalos`
      );
      const regalos = await response.json();

      if (regalos?.length) {
        setRegalos(regalos);
      } else {
        setRegalos([]);
      }
    } catch (err) {
      console.log(err);
      setRegalos([]);
    }
  }, []);

  const getTiposDeDonaciones = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/tiposDeDonaciones`
      );
      const tiposDeDonaciones = await response.json();

      if (tiposDeDonaciones?.length) {
        setTiposDeDonaciones(tiposDeDonaciones);
      } else {
        setTiposDeDonaciones([]);
      }
    } catch (err) {
      console.log(err);
      setTiposDeDonaciones([]);
    }
  }, []);

  useEffect(() => {
    setCargando(true);
    getRegalos();
    getTiposDeDonaciones();
    getFacultades();
  }, [getFacultades, getRegalos, getTiposDeDonaciones]);

  useEffect(() => {
    if (tiposDeDonaciones?.length && facultades?.length && regalos?.length) {
      setEmpezarSorteo(true);
    }
  }, [regalos, tiposDeDonaciones, facultades]);

  useEffect(() => {
    if (empezarSorteo && tiposDeDonaciones && regalos && facultades) {
      setSorteos(
        tiposDeDonaciones?.map((tipoDeDonacion) => ({
          nombreSorteo: tipoDeDonacion?.nombre,
          regalos: regalos?.filter(
            (regalo) => regalo?.tipo_donacion_id === tipoDeDonacion?.id
          ),
          facultades,
        }))
      );
    }
  }, [empezarSorteo, tiposDeDonaciones, regalos, facultades]);

  useEffect(() => {
    if ((tipoDeDonacionSeleccinado, facultades)) {
      console.log("tipoDeDonacionSeleccionado: ");
      console.log(tipoDeDonacionSeleccinado);

      console.log(facultades);
      console.log(
        regalos?.filter(
          (regalo) => regalo?.tipo_donacion_id === tipoDeDonacionSeleccinado
        )
      );
    }
  }, [tipoDeDonacionSeleccinado, facultades]);

  return (
    <>
      <Paper
        style={{
          width: "100%",
          height: "100%",
          padding: "2.5vh 1.5vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 20,
          overflow: "scroll",
        }}
      >
        <Grid width={"100%"} container justifyContent={"center"}>
          <Typography fontSize={30}>
            Seleccione que regalos desea empezar a sortear
          </Typography>
        </Grid>
        {tiposDeDonaciones?.length &&
          tiposDeDonaciones?.map((tipoDeDonacion) => {
            return (
              <Button
                type="submit"
                style={{
                  backgroundColor: "#990000",
                  color: "white",
                  width: "50%",
                  fontSize: 17.5,
                  padding: "20",
                }}
                key={tipoDeDonacion?.id}
                onClick={(e) => {
                  setTipoDeDonacionSeleccionado(tipoDeDonacion?.id);
                }}
              >
                {tipoDeDonacion?.nombre}
              </Button>
            );
          })}
      </Paper>
      <Carga cargando={cargando} />
    </>
  );
};

export default SeccionSorteo;
