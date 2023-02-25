

function FormularioLogin() {
 
  return (
    <div>
      <div className="container py-5  text-center ">
        <div className="card-header py-5">
          <h3>Iniciar Sesión</h3>
        </div>
        <div className="card-body">
          <div>
            
              <div className="form-group  d-flex justify-content-center align-items-center py-4">
                <label className="col-sm-2 col-form-label"> Usuario: </label>
                <div className="col-sm-3">
                <input type="email" id="username" name="username"  className="form-control" placeholder="ejemplo@uce.edu.ec" />
                </div>
              </div>

              <div className="form-group d-flex justify-content-center align-items-center">
                <label className="col-sm-2 col-form-label"> Contraseña: </label>
                <div className="col-sm-3">
                <input type="password" required={true} id="password" name="password" className="form-control" placeholder="Contraseña" />
                </div>
              </div>
                            
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioLogin;
