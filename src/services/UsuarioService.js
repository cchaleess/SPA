import axios from "axios";

class UsuarioService {

   getUserList = async (accessToken, apiEndpoint) => {
       
        return await axios
           .get(apiEndpoint, { headers: { Authorization: `Bearer ${accessToken}` } })
          .then(response => {
            return response.data;
          })
          .catch(function (error) {
               console.log(error);
          });
      };

    insertUser = async (apiEndpoint,user,accessToken ) => {

        return await axios
           .post(apiEndpoint, user,{ headers: { Authorization: `Bearer ${accessToken}` } })
          .then(response => {
            return response.data;
          })
          .catch(function (error) {
               console.log(error);
          });
      };

    deleteUser = async ( apiEndpoint, userId, accessToken) => {
        debugger;
        return await axios
           .delete(apiEndpoint + '/' +userId ,{ headers: { Authorization: `Bearer ${accessToken}` } })
          .then(response => {
            return response.data;
          })
          .catch(function (error) {
               console.log(error);
          });
      };

   updateUser = async (apiEndpoint,userSelected,accessToken) => {
        debugger;

        return await axios
           .put(apiEndpoint + '/' +userSelected.id, userSelected,{ headers: { Authorization: `Bearer ${accessToken}` } })
          .then(response => {
            return response.data;
          })
          .catch(function (error) {
               console.log(error);
          });
      };
  } 
 
export default UsuarioService;