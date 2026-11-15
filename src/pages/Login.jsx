import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const iniciarSesion = (e) => {
    e.preventDefault();

    if (correo.trim() === "" || clave.trim() === "") {
      setError("Por favor complete todos los campos");
      return;
    }

    if (correo === "admin@iti.edu.ec" && clave === "12345") {
      navigate("/inicio");
    } else {
      setError("Usuario o contraseña inválidas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-wrapper">
          <i className="bi bi-mortarboard-fill"></i>
        </div>
        <h3 className="text-center fw-bold login-title mb-1">
          Sistema Académico
        </h3>
        <h6 className="text-center text-muted mb-3">
          Instituto Tecnológico ITI
        </h6>
        <p className="text-center text-secondary small mb-4">
          Ingrese sus credenciales para continuar
        </p>

        <form onSubmit={iniciarSesion}>
          <div className="mb-3">
            <label htmlFor="correo" className="form-label fw-medium">
              Correo electrónico
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-secondary">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                id="correo"
                placeholder="correo@iti.edu.ec"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="clave" className="form-label fw-medium">
              Contraseña
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-secondary">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                id="clave"
                placeholder="Ingrese su contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <div>{error}</div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-login w-100 mt-2 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
          >
            <i className="bi bi-box-arrow-in-right fs-5"></i>
            <span>Ingresar al sistema</span>
          </button>
        </form>

        <p className="text-center text-muted small mt-4 mb-0">
          2026 ITI - Sistema Académico
        </p>
      </div>
    </div>
  );
}

export default Login;