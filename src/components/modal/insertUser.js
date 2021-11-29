import React, {Fragment, useState} from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import UsuarioService from "../../services/UsuarioService";
import {protectedResources} from "../../authConfig";

function InsertUserModal({modalOnOffInsertUserFunction ,OpenModalUserInsert, handleChange, InsertUser}){

   return (
    <Fragment>
        <Modal isOpen={OpenModalUserInsert}>
          <ModalHeader>Insertar</ModalHeader>
          <ModalBody>
            <div className="form-group">           
              <label>Nombre: </label>
              <br />
              <input
                type="text"
                className="form-control"
                name="nombre"
                onChange={handleChange}
              />
              <br />
              <label>Correo electrónico: </label>
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
            <button className="btn btn-primary" onClick = {()=> InsertUser()}>Insertar</button>
            <button className="btn btn-danger" onClick = {()=> modalOnOffInsertUserFunction()}>Cancelar</button>
          </ModalFooter>
        </Modal>
    </Fragment>
  );
}
export default InsertUserModal;