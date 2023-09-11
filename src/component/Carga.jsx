import CircularProgress from '@mui/material/CircularProgress';

const Carga = (props) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 1000000,
        display: props?.cargando ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default Carga;
