import { Outlet } from "react-router-dom"
import "../styles.css"
function layout() {
  return (
    <div>
      <div>
        <header className="header">
          <div className=" text-right">
            <div className="mask">
              <div className="d-flex justify-content-end align-items-center ">
                <div className="text-white">
                  <h3 className="mb-3 text-white">UNIVERSIDAD CENTRAL DEL ECUADOR </h3>
                  <h4 className="mb-3">Sistema de seguimiento a Devengamiento</h4>

                </div>
              </div>
            </div>
          </div>
        </header>
        <Outlet />

        <footer className="bg-light text-center text-lg-start footer m-2">
        
        
          <div className="text-left p-3 ">
           <h4 className="text-white ">© 2020 Copyright: Universidad Central del Ecuador</h4>
                 </div>
         
        </footer>
      </div>
    </div>
  )
}

export default layout
