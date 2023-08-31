
const Visualizador = (props) => {
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
        display: props?.mostrarVisualizador ? "flex" : "none",
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
    </div>
  );
};

export default Visualizador
