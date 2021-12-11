import React,{ useEffect, useState } from "react";
import { MsalAuthenticationTemplate, useMsal, useAccount } from "@azure/msal-react";
import { InteractionRequiredAuthError, InteractionType } from "@azure/msal-browser";
import { loginRequest, protectedResources } from "../authConfig";
import MaterialTable from "material-table";
import Spinner from "../components/spinner";

import {Modal, TextField, Button, Box} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import swal from 'sweetalert';

const columns= [
  { title: 'Nombre', field: 'nombre' ,  width: "30%"},
  { title: 'Email', field: 'email', width: "20%"},
  { title: 'Artista', field: 'artista',width: "10%" },
  { title: 'País de Origen', field: 'pais', width: "10%"},
  { title: 'Género(s)', field: 'genero', width: "20%" },
  { title: 'Ventas Estimadas (millones)', field: 'ventas', type: 'numeric', width: "10%"}, 
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

const baseUrl="https://localhost:44382/api/usuario";

export const Users = () => {
    // Autenticacion
  const [token, setToken] = useState(null);
  const [data, setData] = useState([]);
  const data2= [{ nombre: 'prueba', email: 'prueba', artista: 'prueba', pais: 'prueba', genero: 'prueba', ventas: 'prueba' }];


  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
    // Estilos tabla
  const styles= useStyles();
  const [selectedRow, setSelectedRow] = useState(null);
  //Spinner
  const [spinner, setSpinner] = useState(true);

  //Modales CRUD
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [artistaSeleccionado, setArtistaSeleccionado]=useState({
    nombre: '',
    email: '',
    artista: '',
    genero: '',
    pais: '',
    ventas: ''
  })

  //useEffect(() => peticionGet());
  useEffect(() => { authToken();}, [ instance, accounts, inProgress ]);

  const handleChange=e=>{
    const {name, value}=e.target;
    setArtistaSeleccionado(prevState=>({
      ...prevState,
      [name]: value
    }));
  }

  const authToken = ()=>{
    if (account && inProgress === "none") {
      instance.acquireTokenSilent({
          scopes: protectedResources.apiUsers.scopes,
          account: account
      }).then((response) => {            
          console.log(response.accessToken);
          setToken(response.accessToken);
          }).catch((error) => {
          // in case if silent token acquisition fails, fallback to an interactive method
          if (error instanceof InteractionRequiredAuthError) {
              if (account && inProgress === "none") {
                  instance.acquireTokenPopup({
                      scopes: protectedResources.apiUsers.scopes,
                  }).then((response) => {
                      console.log(response.accessToken);
                  }).catch(error => console.log(error));
              }
          }            
      });
  }
  }
  
   const peticionGet = async () => {
    await axios.get(baseUrl).then(response=>{
      setData(response.data);
      setSpinner(false);
     }).catch(error=>{console.log(error);})
   }

   const peticionPost=async()=>{
    
    await axios.post(baseUrl, artistaSeleccionado)
    .then(response=>{
       if (response.status === 200)
        {
          artistaSeleccionado.id = parseInt(response.headers["content-type"]);
          setData(data.concat(artistaSeleccionado));
        } 
      else{
        swal("Error en BBDD", "No se ha podido insertar el usuario", "error");
      } 
      abrirCerrarModalInsertar();
      return response;
     
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    await axios.put(baseUrl+"/"+artistaSeleccionado.id, artistaSeleccionado)
    .then(response=>{
          var dataNueva= data;
          dataNueva.map(artista => {
              if(artista.id===artistaSeleccionado.id){
                artista.nombre=artistaSeleccionado.nombre;
                artista.email=artistaSeleccionado.email;
                artista.artista=artistaSeleccionado.artista;
                artista.genero=artistaSeleccionado.genero;
                artista.ventas=artistaSeleccionado.ventas;
                artista.pais=artistaSeleccionado.pais;
              }}              
              );
          setData(dataNueva);         
          abrirCerrarModalEditar();
    }).catch(error=>{
      if(error.response.status===500 || error.response.status===404){
        swal("Error en BBDD", "No se ha podido actualizar el registro", "error");
        abrirCerrarModalEditar();
      }
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+artistaSeleccionado.id)
    .then(response=>{
      setData(data.filter(artista=>artista.id!==artistaSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      if(error.response.status===500 || error.response.status===404){
        swal("Error en BBDD", "No se ha podido borrar el registro", "error");
        }if (error.response.status===424) {
          swal("Error de restricción en BBDD", "El registro tiene dependencias", "error"); 
        } 
          abrirCerrarModalEliminar();
      }
    )
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
        <Button onClick={()=>peticionPost()}>Insertar</Button>
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

  const seleccionarArtista=(artista, caso)=>{
    setArtistaSeleccionado(artista);
    (caso==="Editar")?abrirCerrarModalEditar()
    :
    abrirCerrarModalEliminar()
  }
  return (  
         <>
         <div className="container">
        {/*  {spinner ? <Spinner/> : null}  */}
            <Box textAlign='center'>
              <Button size="large" variant="outlined" onClick={()=>abrirCerrarModalInsertar()}>Insertar Artista</Button>         

            <MaterialTable
              columns={columns}
              data={data}
              title="Artistas Musicales"
              onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}              
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
              }]
              }
              options={{
                rowStyle: rowData => ({
                  backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
                }),              
                actionsColumnIndex: -1,
                headerStyle:{backgroundColor: '#777799', color: '#FFFFFF'},
                }}
                localization={{
                  header:{
                  actions: "Acciones"
                  }
                }}     
                />
                
            </Box>

            <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>{bodyInsertar}</Modal> 
            <Modal open={modalEditar}  onClose={abrirCerrarModalEditar}>{bodyEditar}</Modal>
            <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>{bodyEliminar}</Modal>         
        </div>
       </>
  );          
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
 

