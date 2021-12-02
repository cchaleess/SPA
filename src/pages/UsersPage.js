import UserService from "../services/UserService";
import { useEffect, useState } from "react";
import { MsalAuthenticationTemplate, useMsal, useAccount } from "@azure/msal-react";
import { InteractionRequiredAuthError, InteractionType } from "@azure/msal-browser";
import { loginRequest, protectedResources } from "../authConfig";
import MaterialTable from "material-table";
import {Modal, TextField, Button, Box} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

const columns= [
  { title: 'Nombre', field: 'nombre', },
  { title: 'Email', field: 'email', },
  { title: 'Artista', field: 'artista', },
  { title: 'País de Origen', field: 'pais' },
  { title: 'Género(s)', field: 'genero' },
  { title: 'Ventas Estimadas (millones)', field: 'ventas', type: 'numeric'}, 
  ];

  const useStyles = makeStyles((theme) => ({
    modal: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    iconos:{
      cursor: 'pointer'
    }, 
    inputMaterial:{
      width: '100%'
    }
  }));
  

export const Users = () => {

  const baseUrl="https://localhost:44382/api/usuario";

    // Autenticacion
  const [token, setToken] = useState(null);
  const [data, setData] = useState([]);
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
    // Estilos tabla
  const styles= useStyles();

  //Modales CRUD
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [artistaSeleccionado, setArtistaSeleccionado]=useState({
    nombre: '',
    email: '',
    artista: "",
    genero: "",
    pais: "",
    ventas: ""
  })  
  
  

  const handleChange=e=>{
    const {name, value}=e.target;
    setArtistaSeleccionado(prevState=>({
      ...prevState,
      [name]: value
    }));
  }
  
  const authToken = () => {
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
  };

   const GetUsers = async () => {
    await axios.get(baseUrl).then(response=>{
      setData(response.data);
     }).catch(error=>{console.log(error);})
   }

   useEffect(() => {  
    GetUsers();
    authToken();
}, [data, inProgress, account, token]);
}
   const seleccionarArtista=(artista, caso)=>{
    setArtistaSeleccionado(artista);
    (caso==="Editar")?abrirCerrarModalEditar()
    :
    abrirCerrarModalEliminar()
  }
 
  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }
  
  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }


  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Nuevo Artista</h3>
      <TextField className={styles.inputMaterial} label="Nombre" name="nombre" onChange={handleChange}/><br />
      <TextField className={styles.inputMaterial} label="Email" name="email" onChange={handleChange}/><br />
      <TextField className={styles.inputMaterial} label="Artista" name="artista" onChange={handleChange}/><br />
      <TextField className={styles.inputMaterial} label="Género" name="genero" onChange={handleChange}/><br />
      <TextField className={styles.inputMaterial} label="País" name="pais" onChange={handleChange}/><br />          
      <TextField className={styles.inputMaterial} label="Ventas" name="ventas" onChange={handleChange}/><br /><br />

      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar Artista</h3>
      <TextField className={styles.inputMaterial} label="Nombre" name="nombre" onChange={handleChange} value={artistaSeleccionado&&artistaSeleccionado.nombre}/><br />   
      <TextField className={styles.inputMaterial} label="Email" name="email" onChange={handleChange} value={artistaSeleccionado&&artistaSeleccionado.email}/><br /> 
      <TextField className={styles.inputMaterial} label="Artista" name="artista" onChange={handleChange} value={artistaSeleccionado&&artistaSeleccionado.artista}/><br />   
      <TextField className={styles.inputMaterial} label="País" name="pais" onChange={handleChange} value={artistaSeleccionado&&artistaSeleccionado.pais}/><br /> 
      <TextField className={styles.inputMaterial} label="Ventas" name="ventas" onChange={handleChange} value={artistaSeleccionado&&artistaSeleccionado.ventas}/><br />
      <TextField className={styles.inputMaterial} label="Género" name="genero" onChange={handleChange} value={artistaSeleccionado&&artistaSeleccionado.genero}/><br /><br />
      
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar al artista <b>{artistaSeleccionado && artistaSeleccionado.artista}</b>? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()}>Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>
      </div>
    </div>
  )

  return (  
         <>   
         {/*  { data ? 
                  <div className = "container">
                       <UserTable dataprops= {data} selectionPopup={seleccionaEmp} />
                       <button className="btn btn-success" onClick={() => showModalInsert()}>Agregar Empleado</button>     
                  </div>                           
          : null } */}
                              <Box textAlign='center'>
                              <Button size="large" variant="outlined" onClick={()=>abrirCerrarModalInsertar()}>Insertar Artista</Button><br /><br />

              </Box>
                     <MaterialTable
                        columns={columns}
                        data={data}
                        title="Artistas Musicales"  
                        actions={[
                          {
                             icon: 'edit',
                             tooltip: 'Editar Artista',
                             onClick: (event, rowData) => seleccionarArtista(rowData, "Editar")
                          },
                          {
                             icon: 'delete',
                             tooltip: 'Eliminar Artista',
                             onClick: (event, rowData) => seleccionarArtista(rowData, "Eliminar")
                                },
                                 ]
                            }
                        options={{
                             actionsColumnIndex: -1,
                             headerStyle:{backgroundColor: '#777799', color: '#FFFFFF'},
                              }}
                        localization={{
                              header:{
                              actions: "Acciones"
                                }
                              }}
                            />
        
        <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}</Modal>
 
        <Modal open={modalEditar}  onClose={abrirCerrarModalEditar}>
          {bodyEditar}</Modal>

        <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
          {bodyEliminar}</Modal>



          {/* <InsertUserModal 
                    OpenModalUserInsert={modalInsert} 
                    showModalInsertUserFunction={showModalInsert}
                    InsertUser = {InsertUser}
                    handleChange = {handleChange}/>
          <UpdateUserModal 
                    OpenModalUserUpdate={modalEdit} 
                    showModalEditUserFunction={showModalEdit}
                    UpdateUser = {UpdateUser}
                    handleChange = {handleChange}
                    currentUser = {user}/>
          <DeleteUserModal 
                    DeleteUserFunction={DeleteUser}
                    showModalDeleteUserFunction={showModalDelete}
                    OpenModalUserDelete={modalDelete}
                    Name={user.nombre}
                    userSelection={seleccionaEmp}/>   */}
          </>
        );
  }

  const seleccionarArtista=(artista, caso)=>{
    setArtistaSeleccionado(artista);
    (caso==="Editar")?abrirCerrarModalEditar()
    :
    abrirCerrarModalEliminar()
  }

  export const Hello = () => {
  const authRequest = {
      ...loginRequest
  };

  return (

      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect} authenticationRequest={authRequest} >
          
          <Users />          
      
      </MsalAuthenticationTemplate>
    )
}
 

