import { Response, Request } from "express";
import request from "request";
import jwt from "jsonwebtoken";
import path from "path";
import { ConnectorStore } from "../connectorStore/store";
import { ConfigConstant } from "../constant/configConstant";

export function loginRedirect(res: Response) {
    res.redirect(
        "https://"+ConfigConstant.Login_URL+'/api/authentication/authenticate?tid=1234&redirect_uri=https://'+ConfigConstant.BASE_URL+'/callback'
        // //[Tenant ID] Can be "common" to support multi-tenant login (meaning every person with every Microsoft-Account can log into the app) or a specific tenant ID to only allow logins from that tenant
        // //[Version] Currently v1.0 and v2.0 exist. v1.0 only allows login from organizational accounts, v2.0 allows login from organizational and personal accounts
        // //[client_id] Enter the ID of the enterprise application or application registration you want to use
        // "client_id=" + process.env.CLIENT_ID +
        // //[response_type] Specifies what Active Directory will return after a successful login action. Must at least be "code" for the OAuth 2.0 flow and "id_token" for the OpenIdConnect flow and can have "token" as an additional value
        // "&response_type=code" +
        // //[redirect_uri] The URL which will be called with the registration code as a query parameter
        // //[response_mode] Specifies with which method the code should be returned to the application. Can be query, form_post or fragment
        // "&response_mode=query" +
        // //[state] The state parameter gets passed through the whole authorization workflow and can be used to store information that is important for your own application
        // "&state= " +
        // //[scope] The scope parameter specifies the permissions that the token received has to call different Microsoft services
        // "&scope=" + process.env.SCOPE
        // //Optional parameters
        // //[Prompt] Can has the values "login", "consent" and "none" and determines which prompt will be shown to the user when he logs in
        // //[Login_hint] Can be used to auto fill-in the email adress or user name of the user who wants to authenticate
        // //[Domain_hint] Can has the values "consumers" or "organizations" and determines which type of account can log in
    );
}

export function callbackHandler(req: Request, res: Response) {
    //The authentification code is passed to the redirect url as a query parameter called 'code'


    const authCode = req.query.token;
     
    if(authCode){
        ConnectorStore.setToken(authCode);
        res.render(path.join(__dirname,"..","..","views","callbackFrontend"), {
            successfulAuth: true
        })
    }else{
        res.status(500).send("There was no authorization code provided in the query. No Bearer token can be requested");
        return;
    }
   
}


function validateToken(token:string):boolean {
    let parsedToken = jwt.decode(token);

    //Here you can do whatever validation you want to do to make sure the token comes from a valid source

    return true;
}