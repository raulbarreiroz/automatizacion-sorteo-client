const mensajeCampoObligatorio =
  "El campo es obligatorio (no puede ser vacío) *";
const mensajeSoloNúmeros = "El campo no permite letras (sólo números)";
const mensajeSoloLetras = "El campo no permite números (solo letras)";
const mensajeLongitudDeCampo = (longitud) =>
  `El campo debe tener ${longitud} caracteres numéricos`;
const mensajeSeleccionarFacultadCorrecta =
  "Debe seleccionar una facultad existente *";
const mensajeCedulaRegistradaConOtroProfesor =
  "El número de cédula no debe estar registrado con otro profesor";
const mensajeCedulaRegistradaEnOtraFila =
  "El número de cédula no debe estar registrada en otra fila";
const validadorCampoObligatorio = (campo) => campo && campo?.trim() !== "";
const validadorCampoConLongitudDeCampo = (campo, longitud) =>
  campo && campo?.trim()?.length === longitud;
const validadorCampoSoloNumeros = (campo) =>
  campo?.split("")?.filter((c) => isNaN(c))?.length === 0;
const validadorCampoSoloLetras = (campo) => {
  return (
    campo
      ?.split("")
      ?.filter((c) => isNaN(c))
      ?.join("")
      ?.trim()
      ?.toLowerCase() === campo?.trim()?.toLowerCase() && campo?.trim() !== ""
  );
};
const validadorCampoEnLista = (id, lista) =>
  !lista?.length || !id ? false : lista?.filter((el) => el === id);

export const mensajesPorCampoProfesor = [
  {
    campo: "cedula",
    titulo: "cédula",
    mensajes: [
      {
        nombre: mensajeCampoObligatorio,
        validador: validadorCampoObligatorio,
        id: 0,
      },
      {
        nombre: mensajeLongitudDeCampo(10),
        validador: validadorCampoConLongitudDeCampo,
        id: 1,
      },
      {
        nombre: mensajeSoloNúmeros,
        validador: validadorCampoSoloNumeros,
        id: 2,
      },
      {
        nombre: mensajeCedulaRegistradaConOtroProfesor,
        validador: validadorCampoEnLista,
        id: 4,
      },
      {
        nombre: mensajeCedulaRegistradaEnOtraFila,
        validador: validadorCampoEnLista,
        id: 5,
      },
    ],
  },
  {
    campo: "nombre1",
    titulo: "nombre1",
    mensajes: [
      {
        nombre: mensajeCampoObligatorio,
        validador: validadorCampoObligatorio,
        id: 0,
      },
      {
        nombre: mensajeSoloLetras,
        validador: validadorCampoSoloLetras,
        id: 3,
      },
    ],
  },
  {
    campo: "nombre2",
    titulo: "nombre2",
    mensajes: [
      {
        nombre: mensajeCampoObligatorio,
        validador: validadorCampoObligatorio,
        id: 0,
      },
      {
        nombre: mensajeSoloLetras,
        validador: validadorCampoSoloLetras,
        id: 3,
      },
    ],
  },
  {
    campo: "apellido1",
    titulo: "apellido1",
    mensajes: [
      {
        nombre: mensajeCampoObligatorio,
        validador: validadorCampoObligatorio,
        id: 0,
      },
      {
        nombre: mensajeSoloLetras,
        validador: validadorCampoSoloLetras,
        id: 3,
      },
    ],
  },
  {
    campo: "apellido2",
    titulo: "apellido2",
    mensajes: [
      {
        nombre: mensajeCampoObligatorio,
        validador: validadorCampoObligatorio,
        id: 0,
      },
      {
        nombre: mensajeSoloLetras,
        validador: validadorCampoSoloLetras,
        id: 3,
      },
    ],
  },
  {
    campo: "facultad",
    titulo: "facultad",
    mensajes: [
      {
        nombre: mensajeSeleccionarFacultadCorrecta,
        validador: validadorCampoEnLista,
        id: 4,
      },
    ],
  },
];

export const mensajesPorCampoRegalo = [
  {
    campo: "nombre",
    titulo: "nombre",
    mensajes: [
      {
        nombre: mensajeCampoObligatorio,
        validador: validadorCampoObligatorio,
        id: 0,
      },
    ],
  },
  {
    campo: "auspiciante",
    titulo: "auspiciante",
    mensajes: [],
  },
];
