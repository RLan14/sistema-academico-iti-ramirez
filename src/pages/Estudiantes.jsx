import { useState } from "react";

const estudianteInicial = {
  cedula: "",
  fechaNacimiento: "",
  nombres: "",
  apellidos: "",
  correo: "",
  carrera: "",
  estado: "Activo",
};

function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([
    {
      cedula: "0940160690",
      fechaNacimiento: "1997-08-14",
      nombres: "Roberto Rodolfo",
      apellidos: "Ramírez Ayala",
      correo: "roberto.ramirez@iti.edu.ec",
      carrera: "Desarrollo de Software",
      estado: "Activo",
    },
  ]);
  const [estudiante, setEstudiante] = useState(estudianteInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const obtenerFechaMaximaPermitida = () => {
    const hoy = new Date();
    const anio = hoy.getFullYear() - 18;
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
  };

  const fechaMaxima = obtenerFechaMaximaPermitida();

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setEstudiante({
      ...estudiante,
      [name]: value,
    });
  };

  const abrirModalRegistro = () => {
    setEstudiante(estudianteInicial);
    setModoEdicion(false);
    setError("");
    setMostrarModal(true);
  };

  const abrirModalEdicion = (est) => {
    setEstudiante(est);
    setModoEdicion(true);
    setError("");
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEstudiante(estudianteInicial);
    setModoEdicion(false);
    setError("");
  };

  const esMayorDeEdad = (fechaNac) => {
    const [anio, mes, dia] = fechaNac.split("-").map(Number);
    const hoy = new Date();
    let edad = hoy.getFullYear() - anio;
    const diferenciaMes = hoy.getMonth() + 1 - mes;
    if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < dia)) {
      edad--;
    }
    return edad >= 18;
  };

  const guardarEstudiante = (e) => {
    e.preventDefault();
    setError("");

    const cedulaLimpia = estudiante.cedula.trim();
    const nombresLimpios = estudiante.nombres.trim();
    const apellidosLimpios = estudiante.apellidos.trim();
    const correoLimpio = estudiante.correo.trim().toLowerCase();

    if (
      !cedulaLimpia ||
      !estudiante.fechaNacimiento ||
      !nombresLimpios ||
      !apellidosLimpios ||
      !correoLimpio ||
      !estudiante.carrera.trim()
    ) {
      setError("Todos los campos son obligatorios y no pueden contener solo espacios.");
      return;
    }

    if (!/^\d{10}$/.test(cedulaLimpia)) {
      setError("La cédula debe contener exactamente 10 dígitos numéricos sin espacios.");
      return;
    }

    if (/\s/.test(correoLimpio) || !correoLimpio.includes("@")) {
      setError("Ingrese un correo electrónico válido sin espacios.");
      return;
    }

    if (!esMayorDeEdad(estudiante.fechaNacimiento)) {
      setError("No se puede registrar: el estudiante debe ser mayor de 18 años.");
      return;
    }

    if (!modoEdicion) {
      if (estudiantes.some((item) => item.cedula === cedulaLimpia)) {
        setError("Ya existe un estudiante registrado con esa cédula.");
        return;
      }

      if (estudiantes.some((item) => item.correo.toLowerCase() === correoLimpio)) {
        setError("Ya existe un estudiante registrado con ese correo electrónico.");
        return;
      }

      const nuevoEstudiante = {
        ...estudiante,
        cedula: cedulaLimpia,
        nombres: nombresLimpios,
        apellidos: apellidosLimpios,
        correo: correoLimpio,
      };

      setEstudiantes([...estudiantes, nuevoEstudiante]);
      setMensaje("Estudiante registrado correctamente.");
    } else {
      if (
        estudiantes.some(
          (item) =>
            item.cedula !== cedulaLimpia &&
            item.correo.toLowerCase() === correoLimpio
        )
      ) {
        setError("Ese correo electrónico ya pertenece a otro estudiante.");
        return;
      }

      const listaActualizada = estudiantes.map((item) =>
        item.cedula === cedulaLimpia
          ? {
              ...estudiante,
              nombres: nombresLimpios,
              apellidos: apellidosLimpios,
              correo: correoLimpio,
            }
          : item
      );

      setEstudiantes(listaActualizada);
      setMensaje("Estudiante actualizado correctamente.");
    }

    cerrarModal();
  };

  return (
    <div className="container-fluid px-2">
      <div className="mb-4">
        <h2 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: "#1e293b" }}>
          <i className="bi bi-people"></i>
          <span>Estudiantes</span>
        </h2>
        <p className="text-secondary mb-0">
          Administración y registro de estudiantes
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
            <span>Estudiantes registrados</span>
          </h5>
          <button
            type="button"
            className="btn btn-login px-3 py-2 fw-semibold d-flex align-items-center gap-2"
            onClick={abrirModalRegistro}
          >
            <i className="bi bi-person-plus"></i>
            <span>Agregar</span>
          </button>
        </div>

        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Correo</th>
                  <th>Carrera</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No hay estudiantes registrados
                    </td>
                  </tr>
                ) : (
                  estudiantes.map((est) => (
                    <tr key={est.cedula}>
                      <td>{est.cedula}</td>
                      <td>{est.nombres}</td>
                      <td>{est.apellidos}</td>
                      <td>{est.correo}</td>
                      <td>{est.carrera}</td>
                      <td>{est.estado}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-warning btn-sm"
                          onClick={() => abrirModalEdicion(est)}
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
                    <i className={`bi ${modoEdicion ? "bi-pencil-square" : "bi-person-plus"}`}></i>
                    <span>
                      {modoEdicion ? "Actualizar estudiante" : "Registrar nuevo estudiante"}
                    </span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={cerrarModal}
                  ></button>
                </div>

                <form onSubmit={guardarEstudiante}>
                  <div className="modal-body p-4">
                    {error && (
                      <div className="alert alert-danger d-flex align-items-center" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <div>{error}</div>
                      </div>
                    )}

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Cédula</label>
                        <input
                          type="text"
                          name="cedula"
                          maxLength="10"
                          className="form-control"
                          value={estudiante.cedula}
                          onChange={manejarCambio}
                          disabled={modoEdicion}
                          placeholder="Ingrese la cédula"
                        />
                        {modoEdicion && (
                          <small className="text-muted">
                            La cédula no puede modificarse durante la actualización.
                          </small>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium">Fecha de nacimiento</label>
                        <input
                          type="date"
                          name="fechaNacimiento"
                          max={fechaMaxima}
                          className="form-control"
                          value={estudiante.fechaNacimiento}
                          onChange={manejarCambio}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium">Nombres</label>
                        <input
                          type="text"
                          name="nombres"
                          className="form-control"
                          value={estudiante.nombres}
                          onChange={manejarCambio}
                          placeholder="Ingrese los nombres"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium">Apellidos</label>
                        <input
                          type="text"
                          name="apellidos"
                          className="form-control"
                          value={estudiante.apellidos}
                          onChange={manejarCambio}
                          placeholder="Ingrese los apellidos"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium">Correo electrónico</label>
                        <input
                          type="email"
                          name="correo"
                          className="form-control"
                          value={estudiante.correo}
                          onChange={manejarCambio}
                          placeholder="correo@ejemplo.com"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium">Carrera</label>
                        <select
                          name="carrera"
                          className="form-select"
                          value={estudiante.carrera}
                          onChange={manejarCambio}
                        >
                          <option value="">Seleccione una carrera</option>
                          <option value="Desarrollo de Software">Desarrollo de Software</option>
                          <option value="Redes y Telecomunicaciones">Redes y Telecomunicaciones</option>
                          <option value="Administración">Administración</option>
                          <option value="Contabilidad">Contabilidad</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium">Estado</label>
                        <select
                          name="estado"
                          className="form-select"
                          value={estudiante.estado}
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

export default Estudiantes;