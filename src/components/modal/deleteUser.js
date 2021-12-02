import React, { Fragment } from "react";
import { Modal, ModalBody, ModalFooter } from "reactstrap";


function DeleteUserModal({DeleteUserFunction, showModalDeleteUserFunction, OpenModalUserDelete,name }) {
    return (
    <Fragment>
        <Modal isOpen={OpenModalUserDelete }>
            <ModalBody>
                Estas seguro que desea eliminar el usuario  : {name && name} ? 
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-danger"  onClick={() => DeleteUserFunction ()} >Si</button>
                <button className="btn btn-secundary" onClick={()=> showModalDeleteUserFunction()}>No</button>
            </ModalFooter>
        </Modal>
    </Fragment>
  );
}
export default DeleteUserModal;