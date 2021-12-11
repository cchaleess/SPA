import { NavigationBar } from "./NavigationBar";

export const PageLayout = (props) => {
    
    /**
     * Most applications will need to conditionally render certain components based on whether a user is signed in or not. 
     * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will 
     * only render their children if a user is authenticated or unauthenticated, respectively.
     */
    return (
        <>
            <NavigationBar />
            <br />
            <h5><center>Welcome API Users</center></h5>
            <br />
            {props.children}                 
        </>
    );
};