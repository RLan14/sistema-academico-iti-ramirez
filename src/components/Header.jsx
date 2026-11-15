function Header() {
  return (
    <header className="header text-white d-flex justify-content-between align-items-center px-4 shadow-sm">
      <div className="d-flex align-items-center gap-3">
        <i className="bi bi-mortarboard-fill fs-2"></i>
        <div>
          <div className="fw-bold fs-5 lh-1">Sistema Académico ITI</div>
          <small className="text-white-50">Plataforma de gestión académica</small>
        </div>
      </div>
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-person-circle fs-5"></i>
        <span className="fw-medium">Administrador</span>
      </div>
    </header>
  );
}

export default Header;