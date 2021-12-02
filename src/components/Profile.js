import { useEffect, useState } from "react";
import { MsalAuthenticationTemplate, useMsal, useAccount } from "@azure/msal-react";
import { InteractionRequiredAuthError, InteractionType } from "@azure/msal-browser";
import { loginRequest, protectedResources } from "../authConfig";
import UserService from "../services/UserService";

const ProfileContent = () => {
   
    const { instance, accounts, inProgress } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [graphData, setGraphData] = useState(null);

    useEffect(() => {
        if (account && inProgress === "none" && !graphData) {
            instance.acquireTokenSilent({
                scopes: protectedResources.graphMe.scopes,
                account: account
            }).then((response) => {   
                console.log(response.accessToken); 
                new UserService().getUserList(response.accessToken,protectedResources.graphMe.endpoint )
                    .then(response =>setGraphData(response));
            }).catch((error) => {
                // in case if silent token acquisition fails, fallback to an interactive method
                if (error instanceof InteractionRequiredAuthError) {
                    if (account && inProgress === "none") {
                        instance.acquireTokenPopup({
                            scopes: protectedResources.graphMe.scopes,
                        }).then((response) => {
                        new UserService().getUserList(response.accessToken,protectedResources.graphMe.endpoint )
                                .then(response => setGraphData(response));
                        }).catch(error => console.log(error));
                    }
                }
            });
        }
    }, [account, inProgress, instance]);
  
    return (
        <>           
            { graphData ? <ProfileData  graphData={graphData} /> : null }
        </>
    );
};

const ProfileData = (graphData) => {
    const tableRows = Object.entries(graphData).map((entry, index) => {
        return (<tr key={index}>
            <ul>
                <li><b>CURRENT USER NAME:</b>{entry[1].displayName}</li>           
                <li><b>ID:</b>{entry[1].id}</li>
                <li><b>EMAIL:</b>{entry[1].mail}</li>
                <li><b>PRINCIPAL USER:</b>{entry[1].userPrincipalName}</li>
            </ul>
            </tr>)
    });

    return (
        <>
        <div className="data-area-div">
            <p>Calling <strong>Microsoft Graph API</strong>...</p>
            <p>Contents of the <strong>response</strong> is below:</p>
        </div>
        <div className="data-area-div">
            <table>
                <thead>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        </div>
        </>
    );
}
/**
 * The `MsalAuthenticationTemplate` component will render its children if a user is authenticated 
 * or attempt to sign a user in. Just provide it with the interaction type you would like to use 
 * (redirect or popup) and optionally a [request object](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md)
 * to be passed to the login API, a component to display while authentication is in progress or a component to display if an error occurs. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
export const Profile = () => {
    const authRequest = {
        ...loginRequest
    };

    return (
        <MsalAuthenticationTemplate 
            interactionType={InteractionType.Redirect} 
            authenticationRequest={authRequest}
        >
            <ProfileContent />
        </MsalAuthenticationTemplate>
      )
};
export default ProfileContent;