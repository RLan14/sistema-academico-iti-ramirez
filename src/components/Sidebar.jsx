import { NavLink } from "react-router-dom";

function Sidebar() {
  const opciones = [
    { ruta: "/inicio", icono: "bi-house-door", nombre: "Inicio" },
    { ruta: "/estudiantes", icono: "bi-people", nombre: "Estudiantes" },
    { ruta: "/materias", icono: "bi-book", nombre: "Materias" },
    { ruta: "/matriculas", icono: "bi-journal-check", nombre: "Matrículas" },
  ];

  return (
    <aside className="sidebar bg-white border-end p-3">
      <div className="text-uppercase text-muted fw-bold small mb-3 px-2">
        MENÚ PRINCIPAL
      </div>
      <ul className="nav nav-pills flex-column gap-2">
        {opciones.map((opcion, index) => (
          <li className="nav-item" key={index}>
            <NavLink
              to={opcion.ruta}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${
                  isActive ? "active-menu text-white fw-semibold" : "text-dark"
                }`
              }
            >
              <i className={`bi ${opcion.icono} fs-5`}></i>
              <span>{opcion.nombre}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;