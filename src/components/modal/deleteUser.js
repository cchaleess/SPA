import React, { useState ,Fragment } from "react";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import UsuarioService from "../../services/UsuarioService";
import {protectedResources} from "../../authConfig";

function DeleteUserModal({DeleteUserFunction, modalOnOffDeleteUserFunction, OpenModalUserDelete,name }) {
    return (
    <Fragment>
        <Modal isOpen={OpenModalUserDelete }>
            <ModalBody>
                Estas seguro que desea eliminar el usuario  : {name && name} ? 
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-danger"  onClick={() => DeleteUserFunction ()} >Si</button>
                <button className="btn btn-secundary" onClick={()=> modalOnOffDeleteUserFunction()}>No</button>
            </ModalFooter>
        </Modal>
    </Fragment>
  );
}
export default DeleteUserModal;