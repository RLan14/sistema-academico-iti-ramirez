import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/materias`;

export const obtenerMaterias = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const obtenerMateriaPorCodigo = async (codigo) => {
  const response = await axios.get(`${API_URL}/${codigo}`);
  return response.data;
};

export const crearMateria = async (materia) => {
  const response = await axios.post(API_URL, materia);
  return response.data;
};

export const actualizarMateria = async (codigo, materia) => {
  const response = await axios.put(`${API_URL}/${codigo}`, materia);
  return response.data;
};

export const eliminarMateria = async (codigo) => {
  const response = await axios.delete(`${API_URL}/${codigo}`);
  return response.data;
};