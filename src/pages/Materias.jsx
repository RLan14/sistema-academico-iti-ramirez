import { useState } from "react";

const materiaInicial = {
  codigo: "",
  nombre: "",
  descripcion: "",
  creditos: "",
  estado: "Activo",
};

function Materias() {
  const [materias, setMaterias] = useState([
    {
      codigo: "SW-301",
      nombre: "Aplicaciones Web y Móviles",
      descripcion: "Desarrollo de interfaces modernas con React.js y Bootstrap",
      creditos: 4,
      estado: "Activo",
    },
  ]);
  const [materia, setMateria] = useState(materiaInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setMateria({
      ...materia,
      [name]: value,
    });
  };

  const abrirModalRegistro = () => {
    setMateria(materiaInicial);
    setModoEdicion(false);
    setError("");
    setMostrarModal(true);
  };

  const abrirModalEdicion = (mat) => {
    setMateria({
      ...mat,
      creditos: String(mat.creditos),
    });
    setModoEdicion(true);
    setError("");
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setMateria(materiaInicial);
    setModoEdicion(false);
    setError("");
  };

  const guardarMateria = (e) => {
    e.preventDefault();
    setError("");

    const codigoLimpio = materia.codigo.trim().toUpperCase();
    const nombreLimpio = materia.nombre.trim();
    const descripcionLimpia = materia.descripcion.trim();
    const creditosNumero = Number(materia.creditos);

    if (!codigoLimpio || !nombreLimpio || !descripcionLimpia || materia.creditos === "") {
      setError("Todos los campos son obligatorios y no pueden contener solo espacios.");
      return;
    }

    if (!/^[A-Za-z0-9-]+$/.test(codigoLimpio)) {
      setError("El código debe ser alfanumérico (letras, números o guiones, sin espacios).");
      return;
    }

    if (!Number.isInteger(creditosNumero) || creditosNumero <= 0) {
      setError("El número de créditos debe ser un número entero mayor que cero.");
      return;
    }

    if (!modoEdicion) {
      if (materias.some((item) => item.codigo.toUpperCase() === codigoLimpio)) {
        setError("Ya existe una materia registrada con ese código.");
        return;
      }

      const nuevaMateria = {
        codigo: codigoLimpio,
        nombre: nombreLimpio,
        descripcion: descripcionLimpia,
        creditos: creditosNumero,
        estado: materia.estado,
      };

      setMaterias([...materias, nuevaMateria]);
      setMensaje("Materia registrada correctamente.");
    } else {
      const listaActualizada = materias.map((item) =>
        item.codigo === codigoLimpio
          ? {
              ...item,
              nombre: nombreLimpio,
              descripcion: descripcionLimpia,
              creditos: creditosNumero,
              estado: materia.estado,
            }
          : item
      );

      setMaterias(listaActualizada);
      setMensaje("Materia actualizada correctamente.");
    }

    cerrarModal();
  };

  return (
    <div className="container-fluid px-2">
      <div className="mb-4">
        <h2 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: "#1e293b" }}>
          <i className="bi bi-book"></i>
          <span>Materias</span>
        </h2>
        <p className="text-secondary mb-0">
          Administración y registro de asignaturas del Sistema Académico
        </p>
      </div>

      {mensaje && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle me-2"></i>
          {mensaje}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMensaje("")}
          ></button>
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2" style={{ color: "#1e293b" }}>
            <i className="bi bi-list-ul"></i>
            <span>Materias registradas</span>
          </h5>
          <button
            type="button"
            className="btn btn-login px-3 py-2 fw-semibold d-flex align-items-center gap-2"
            onClick={abrirModalRegistro}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Agregar</span>
          </button>
        </div>

        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th className="text-center">Créditos</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {materias.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No hay materias registradas
                    </td>
                  </tr>
                ) : (
                  materias.map((mat) => (
                    <tr key={mat.codigo}>
                      <td className="fw-medium">{mat.codigo}</td>
                      <td>{mat.nombre}</td>
                      <td>{mat.descripcion}</td>
                      <td className="text-center">{mat.creditos}</td>
                      <td>{mat.estado}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-warning btn-sm"
                          onClick={() => abrirModalEdicion(mat)}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Actualizar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content border-0 shadow">
                <div className="modal-header text-white" style={{ backgroundColor: "#1e3a5f" }}>
                  <h5 className="modal-title fw-semibold d-flex align-items-center gap-2">
                    <i className={`bi ${modoEdicion ? "bi-pencil-square" : "bi-journal-plus"}`}></i>
                    <span>
                      {modoEdicion ? "Actualizar materia" : "Registrar nueva materia"}
                    </span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={cerrarModal}
                  ></button>
                </div>

                <form onSubmit={guardarMateria}>
                  <div className="modal-body p-4">
                    {error && (
                      <div className="alert alert-danger d-flex align-items-center" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <div>{error}</div>
                      </div>
                    )}

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Código</label>
                        <input
                          type="text"
                          name="codigo"
                          className="form-control"
                          value={materia.codigo}
                          onChange={manejarCambio}
                          disabled={modoEdicion}
                          placeholder="Ej: SW-302"
                        />
                        {modoEdicion && (
                          <small className="text-muted">
                            El código de la materia no puede modificarse.
                          </small>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium">Nombre</label>
                        <input
                          type="text"
                          name="nombre"
                          className="form-control"
                          value={materia.nombre}
                          onChange={manejarCambio}
                          placeholder="Ingrese el nombre de la materia"
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
                          placeholder="Ingrese una breve descripción de la asignatura"
                        ></textarea>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium">Número de créditos</label>
                        <input
                          type="number"
                          name="creditos"
                          min="1"
                          step="1"
                          className="form-control"
                          value={materia.creditos}
                          onChange={manejarCambio}
                          placeholder="Ej: 3"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium">Estado</label>
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
                  </div>

                  <div className="modal-footer bg-light px-4 py-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-3"
                      onClick={cerrarModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-login px-4 fw-semibold"
                    >
                      {modoEdicion ? "Guardar cambios" : "Guardar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Materias;