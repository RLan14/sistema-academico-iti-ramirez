import { useState, useEffect } from "react";
import {
  obtenerMaterias,
  crearMateria,
  actualizarMateria,
  eliminarMateria,
} from "../services/materiasService";

const materiaInicial = {
  codigo: "",
  nombre: "",
  descripcion: "",
  creditos: "",
  estado: "Activo",
  carrera: "",
};

function Materias() {
  const [materias, setMaterias] = useState([]);
  const [materia, setMateria] = useState(materiaInicial);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarMaterias = async () => {
    setCargando(true);
    setError("");
    try {
      const data = await obtenerMaterias();
      setMaterias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al conectar con el servidor. Verifique su conexión o intente nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMaterias();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setMateria({
      ...materia,
      [name]: value,
    });
  };

  const abrirFormularioRegistro = () => {
    setMateria(materiaInicial);
    setModoEdicion(false);
    setError("");
    setMensaje("");
    setMostrarFormulario(true);
  };

  const abrirFormularioEdicion = (mat) => {
    setMateria({
      codigo: mat.codigo,
      nombre: mat.nombre,
      descripcion: mat.descripcion || "",
      creditos: String(mat.creditos),
      estado: mat.estado,
      carrera: mat.carrera || "",
    });
    setModoEdicion(true);
    setError("");
    setMensaje("");
    setMostrarFormulario(true);
  };

  const cancelarOperacion = () => {
    setMostrarFormulario(false);
    setMateria(materiaInicial);
    setModoEdicion(false);
    setError("");
  };

  const guardarMateria = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const codigoLimpio = materia.codigo.trim().toUpperCase();
    const nombreLimpio = materia.nombre.trim();
    const descripcionLimpia = materia.descripcion.trim();
    const carreraLimpia = materia.carrera.trim();
    const creditosNumero = Number(materia.creditos);

    if (!codigoLimpio) {
      setError("El código de la materia es obligatorio.");
      return;
    }

    if (!nombreLimpio) {
      setError("El nombre de la materia es obligatorio.");
      return;
    }

    if (
      materia.creditos === "" ||
      !Number.isInteger(creditosNumero) ||
      creditosNumero <= 0
    ) {
      setError("Los créditos deben ser un número entero mayor que cero.");
      return;
    }

    if (!["Activo", "Inactivo"].includes(materia.estado)) {
      setError("El estado debe seleccionarse entre Activo e Inactivo.");
      return;
    }

    if (!carreraLimpia) {
      setError("Debe seleccionar una carrera.");
      return;
    }

    if (!modoEdicion) {
      const existeCodigo = materias.some(
        (item) => item.codigo.trim().toUpperCase() === codigoLimpio
      );
      if (existeCodigo) {
        setError(`El código "${codigoLimpio}" ya se encuentra registrado.`);
        return;
      }
    }

    const payload = {
      codigo: codigoLimpio,
      nombre: nombreLimpio,
      descripcion: descripcionLimpia,
      creditos: creditosNumero,
      estado: materia.estado,
      carrera: carreraLimpia,
    };

    try {
      if (!modoEdicion) {
        await crearMateria(payload);
        setMensaje("Materia registrada correctamente en la base de datos.");
      } else {
        await actualizarMateria(codigoLimpio, payload);
        setMensaje("Materia actualizada correctamente.");
      }
      setMostrarFormulario(false);
      setMateria(materiaInicial);
      setModoEdicion(false);
      await cargarMaterias();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "No se pudo guardar la materia. Verifique la respuesta del servidor."
      );
    }
  };

  const confirmarEliminacion = async (mat) => {
    setError("");
    setMensaje("");

    const confirmado = window.confirm(
      `¿Está seguro de eliminar la materia "${mat.codigo} - ${mat.nombre}"? Esta acción no se puede deshacer.`
    );

    if (!confirmado) return;

    try {
      await eliminarMateria(mat.codigo);
      setMensaje(`Materia "${mat.codigo}" eliminada correctamente.`);
      await cargarMaterias();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al eliminar la materia. El servidor no respondió correctamente."
      );
    }
  };

  return (
    <div className="container-fluid px-2">
      <div className="mb-4">
        <h2
          className="fw-bold mb-1 d-flex align-items-center gap-2"
          style={{ color: "#1e293b" }}
        >
          <i className="bi bi-book"></i>
          <span>Materias</span>
        </h2>
        <p className="text-secondary mb-0">
          Gestión de asignaturas conectada a API REST
        </p>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      )}

      {mensaje && (
        <div
          className="alert alert-success alert-dismissible fade show d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          <div>{mensaje}</div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setMensaje("")}
          ></button>
        </div>
      )}

      {mostrarFormulario ? (
        <div className="card border-0 shadow-sm rounded-3">
          <div className="card-header bg-white border-bottom py-3 px-4">
            <h5
              className="mb-0 fw-semibold d-flex align-items-center gap-2"
              style={{ color: "#1e293b" }}
            >
              <i
                className={`bi ${
                  modoEdicion ? "bi-pencil-square" : "bi-journal-plus"
                }`}
              ></i>
              <span>
                {modoEdicion ? "Editar materia" : "Registrar nueva materia"}
              </span>
            </h5>
          </div>

          <div className="card-body p-4">
            <form onSubmit={guardarMateria}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Código *</label>
                  <input
                    type="text"
                    name="codigo"
                    className="form-control"
                    value={materia.codigo}
                    onChange={manejarCambio}
                    disabled={modoEdicion}
                    placeholder="Ej: MAT-RRA01"
                  />
                  {modoEdicion && (
                    <small className="text-muted">
                      El código no puede modificarse durante la edición.
                    </small>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={materia.nombre}
                    onChange={manejarCambio}
                    placeholder="Ej: Arquitectura de Software"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-medium">Descripción</label>
                  <textarea
                    name="descripcion"
                    rows="2"
                    className="form-control"
                    value={materia.descripcion}
                    onChange={manejarCambio}
                    placeholder="Descripción breve de la asignatura"
                  ></textarea>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium">Créditos *</label>
                  <input
                    type="number"
                    name="creditos"
                    min="1"
                    step="1"
                    className="form-control"
                    value={materia.creditos}
                    onChange={manejarCambio}
                    placeholder="Ej: 4"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium">Carrera *</label>
                  <select
                    name="carrera"
                    className="form-select"
                    value={materia.carrera}
                    onChange={manejarCambio}
                  >
                    <option value="">Seleccione una carrera</option>
                    <option value="Desarrollo de Software">
                      Desarrollo de Software
                    </option>
                    <option value="Redes y Telecomunicaciones">
                      Redes y Telecomunicaciones
                    </option>
                    <option value="Administración">Administración</option>
                    <option value="Contabilidad">Contabilidad</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium">Estado *</label>
                  <select
                    name="estado"
                    className="form-select"
                    value={materia.estado}
                    onChange={manejarCambio}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={cancelarOperacion}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-login px-4 fw-semibold d-flex align-items-center gap-2"
                >
                  <i className="bi bi-floppy"></i>
                  <span>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-3">
          <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
            <h5
              className="mb-0 fw-semibold d-flex align-items-center gap-2"
              style={{ color: "#1e293b" }}
            >
              <i className="bi bi-list-ul"></i>
              <span>Listado de materias</span>
            </h5>
            <button
              type="button"
              className="btn btn-login px-3 py-2 fw-semibold d-flex align-items-center gap-2"
              onClick={abrirFormularioRegistro}
            >
              <i className="bi bi-plus-circle"></i>
              <span>Nueva materia</span>
            </button>
          </div>

          <div className="card-body p-4">
            {cargando ? (
              <div className="text-center py-5 text-secondary">
                <div
                  className="spinner-border text-primary mb-2"
                  role="status"
                ></div>
                <div>Cargando materias desde el servidor...</div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th className="text-center">Créditos</th>
                      <th>Estado</th>
                      <th>Carrera</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materias.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-4">
                          No hay materias registradas en la base de datos
                        </td>
                      </tr>
                    ) : (
                      materias.map((mat) => (
                        <tr key={mat.codigo}>
                          <td className="fw-semibold">{mat.codigo}</td>
                          <td>{mat.nombre}</td>
                          <td>{mat.descripcion}</td>
                          <td className="text-center">{mat.creditos}</td>
                          <td>
                            <span
                              className={`badge ${
                                mat.estado === "Activo"
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {mat.estado}
                            </span>
                          </td>
                          <td>{mat.carrera}</td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                type="button"
                                className="btn btn-warning btn-sm"
                                onClick={() => abrirFormularioEdicion(mat)}
                              >
                                <i className="bi bi-pencil-square me-1"></i>
                                Editar
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => confirmarEliminacion(mat)}
                              >
                                <i className="bi bi-trash me-1"></i>
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Materias;