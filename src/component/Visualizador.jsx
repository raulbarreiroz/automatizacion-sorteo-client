import Button from '@mui/material/Button';
import CloseIcon from "@mui/icons-material/Close";

const Visualizador = (props) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        zIndex: 1000000,
        display: props?.openVisualizador ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={props?.imagen || require('../resources/imagen/imagen no disponible.jpg')}
        alt="cargando"
        style={{
          transform: "scale(1.05)",
        }}        
      />
      <Button
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}
        onClick={(e) => {
          props?.setOpenVisualizador(false)        
        }}
      >
        <CloseIcon
          sx={{
            transform: 'scale(2)'
          }}
        />
      </Button>
    </div>
  );
};

export default Visualizador
