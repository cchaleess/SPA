import React, { Fragment } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function UpdateUserModal({showModalEditUserFunction , OpenModalUserUpdate, UpdateUser, handleChange, currentUser}) {
  
   return (
    <Fragment>
        <Modal isOpen={OpenModalUserUpdate}>
          <ModalHeader>Modifica datos</ModalHeader>
          <ModalBody>
          <label>ID: </label>
              <br />
              <input
                type="text"
                className="form-control"
                readOnly
                value={currentUser.id}
              />
            <div className="form-group">
              <label>Nuevo nombre: </label>
              <br />
              <input
                type="text"
                className="form-control"
                name="nombre"
                onChange={handleChange}
              />
           <label>Nuevo correo: </label>
              <br />
              <input
                type="text"
                className="form-control"
                name="email"
                onChange={handleChange}
              />             
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={() => UpdateUser()}>Modifica</button>{" "}
            <button className="btn btn-danger" onClick={() => showModalEditUserFunction()}>Cancelar</button>
          </ModalFooter>
        </Modal>
    </Fragment>
  );
}
export default UpdateUserModal;