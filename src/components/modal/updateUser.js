import React, { Fragment } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function UpdateUserModal({modalOnOffEditUserFunction , OpenModalUserUpdate}) {
   return (
    <Fragment>
        <Modal isOpen={OpenModalUserUpdate}>
          <ModalHeader>Modifica datos</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Nombre: </label>
              <br />
              <input
                type="text"
                className="form-control"
                name="nombre"              
              />
           <label>Correo: </label>
              <br />
              <input
                type="text"
                className="form-control"
                name="email"              
              />             
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary">Modifica</button>{" "}
            <button className="btn btn-danger" onClick={() => modalOnOffEditUserFunction()}>Cancelar</button>
          </ModalFooter>
        </Modal>
    </Fragment>
  );
}
export default UpdateUserModal;