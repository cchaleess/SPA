import UserTable from "../components/tables/UserTable";
import UsuarioService from "../services/UsuarioService";
import { useEffect, useState } from "react";
import { MsalAuthenticationTemplate, useMsal, useAccount } from "@azure/msal-react";
import { InteractionRequiredAuthError, InteractionType } from "@azure/msal-browser";
import { loginRequest, protectedResources } from "../authConfig";
import InsertUserModal from '../components/modal/insertUser';
import UpdateUserModal from "../components/modal/updateUser";
import DeleteUserModal from "../components/modal/deleteUser";

export const Usuarios = () => {

    // Autenticacion
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
      
  //Modales CRUD
  const [modalInsert, setModalInsert] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const modalOnOffInsert = () => { setModalInsert(!modalInsert); };
  const modalOnOffEdit = () => { setModalEdit(!modalEdit); };
  const modalOnOffDelete = () => { setModalDelete(!modalDelete); }; 
 
  const [userInert, setInsertUser] = useState({
    nombre: "",
    email: "",    
  });

  const [user, setUser] = useState({
    id: 0,
    nombre: "",
    email: "",    
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
    setInsertUser({
      ...userInert,
      [name]: value,
    });
  };
 
  const seleccionaEmp = (accion) => (event) => {
    var rowid = parseInt(
      event.target.parentNode.parentNode.firstElementChild.innerHTML
        .replace("td", "")
        .replace("/td"),
      10
    );
    user.id = rowid;
    user.name = event.target.parentNode.parentNode.innerHTML
      .split("td")[3]
      .replace("</", "")
      .replace(">", "");
      user.email = 
      event.target.parentNode.parentNode.innerHTML
        .split("td")[5]
        .split(">")[1]
        .split("<");
    accion === "Editar" ? modalOnOffEdit() : modalOnOffDelete();
  }

  useEffect(() => {
    if (account && inProgress === "none" && !data) {
        instance.acquireTokenSilent({
            scopes: protectedResources.apiHello.scopes,
            account: account
        }).then((response) => {            
            console.log(response.accessToken);
            setToken(response.accessToken);
            }).catch((error) => {
            // in case if silent token acquisition fails, fallback to an interactive method
            if (error instanceof InteractionRequiredAuthError) {
                if (account && inProgress === "none") {
                    instance.acquireTokenPopup({
                        scopes: protectedResources.apiHello.scopes,
                    }).then((response) => {
                        setToken(response.accessToken);
                    }).catch(error => console.log(error));
                }
            }            
        });
        GetUsers();
    }
  }, [data, inProgress, account, token]);

  function deleteRow(rowid)  
  {   
      var row = document.getElementById(rowid);
      var table = row.parentNode;
      while ( table && table.tagName != 'TABLE' )
          table = table.parentNode;
      if ( !table )
          return;
      table.deleteRow(row.rowIndex);
   }

   const GetUsers = async () => {
    debugger;
   await new UsuarioService().getUserList(token,protectedResources.apiHello.endpoint).then((response) => {
   if (response && response != null) {
     setData(response);
   }
 });
};


  const InsertUser = async () => {    
    debugger;    
    await new UsuarioService().insertUser(protectedResources.apiHello.endpoint, userInert,token).then((response) => {
      if (response && response != null) {        
        console.log("InsertUser = ", response);
        modalOnOffInsert();
        GetUsers();
      }
    });
  };

  const UpdateUser = async () => {
    await new UsuarioService().updateUser(protectedResources.apiHello.endpoint, user,token).then((response) => {
      if (response && response != null) {
        //modalOnOffEdit();
        //GetEmployees();
        console.log("UpdateUser = ", response);
      }
    });
  };

  
  const DeleteUser = async () => {
    await new UsuarioService().deleteUser(protectedResources.apiHello.endpoint, user.id,token)
      .then((response) => {
        if (response && response != null) {
          console.log("Usuario borrado" + response);
          modalOnOffDelete();
          deleteRow(user.id);
        }
      });
  };

  return (  
            <>
          { data ? 
                  <div className = "container">
                       <UserTable dataprops= {data} selectionPopup={seleccionaEmp} />
                       <button className="btn btn-success" onClick={() => modalOnOffInsert()}>Agregar Empleado</button>     
                  </div>                           
          : null }    

          <InsertUserModal 
                    OpenModalUserInsert={modalInsert} 
                    modalOnOffInsertUserFunction={modalOnOffInsert}
                    InsertUser = {InsertUser}
                    handleChange = {handleChange}
                    />
          <UpdateUserModal 
                    OpenModalUserUpdate={modalEdit} 
                    modalOnOffEditUserFunction={modalOnOffEdit}
                    UpdateUser = {UpdateUser}
                    handleChange = {handleChange}
                    />
          <DeleteUserModal 
                    DeleteUserFunction={DeleteUser}
                    modalOnOffDeleteUserFunction={modalOnOffDelete}
                    OpenModalUserDelete={modalDelete}
                    Name={user.nombre}
                    userSelection={seleccionaEmp}
                    />  
          </>
        );
  }

  export const Hello = () => {
  const authRequest = {
      ...loginRequest
  };

  return (

      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect} authenticationRequest={authRequest} >
          
          <Usuarios />          
      
      </MsalAuthenticationTemplate>
    )
}
 

