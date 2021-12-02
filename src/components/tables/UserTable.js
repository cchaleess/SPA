import React from "react";
import {protectedResources} from '../../authConfig';

function UserTable({dataprops, selectionPopup}){
  
  const datas= JSON.parse(dataprops);
  
  return (
     <>  
                <div className="data-area-div">
                <p>Calling <strong>custom protected web API</strong>...</p><br />
                    <ul>
                        <li><strong>endpoint:</strong> <mark>{protectedResources.apiHello.endpoint}</mark></li>
                        <li><strong>scope:</strong> <mark>{protectedResources.apiHello.scopes[0]}</mark></li>
                    </ul>
                    <br /><p>Contents of the <strong>response</strong> is below:</p>

                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>NOMBRE</th>
                          <th>CORREO</th>
                          <th>ADMINISTRACION</th>
                        </tr>                        
                      </thead>
                            <tbody >
                                {datas.map((user) => (  
                                    <tr id={user.iD} key={user.iD}>
                                        <td>{user.iD}</td>
                                        <td>{user.nOMBRE}</td>            
                                        <td>{user.eMAIL}</td> 
                                        <td><button className="btn btn-primary" onClick={selectionPopup("Editar")} >Editar</button>{" "}
                                            <button className="btn btn-danger"  onClick={selectionPopup("Eliminar")} >Eliminar</button></td>
                                    </tr>                
                        ))}
                          </tbody>                                
                          </table>
                    </div>
   </>
   );
 }
 export default UserTable;