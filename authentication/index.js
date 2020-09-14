

/*== Authentication Router =====================================================

This module exports an express router with handles all authentication requests.

NOTE:
The auth api responds to most user errors with http status code 200 (ok). This
is because the communication between the user and the app is working correctly.
Non-application errors (in logic, database errors, etc.) are passed to upstream
handlers.

*/

//-- Dependencies --------------------------------
import express from 'express';
import * as dataAuth from './data_access.js';

//-- Project Constants ---------------------------
// const URL_USERID = '/userid';
const URL_REGISTRATION = '/register';
const URL_LOGIN = '/login';
const URL_LOGOUT = '/logout';
const ERROR_AUTH_COLLISION = 'Invalid Login: already logged in';
const ERROR_AUTH_INVALID = 'Invalid Login: The user name or password were incorrect';
const ERROR_AUTH_NOLOGIN = 'Cannot Log Out: You are not currently logged in'
// const ERROR_AUTH_UNAUTHENTICATED = 'Not Authenticated: user not logged in';

//-- Export Router -------------------------------
const router = express.Router();
export default router;


//== Route Handlers ============================================================

//-- Check Credentials ---------------------------
router.get(URL_LOGIN, async function (request, response, next) {
    const credentials = {username: request.session.username};
    response.json(credentials);
});

//-- Registration --------------------------------
router.post(URL_REGISTRATION, async function (request, response, next) {
    // Retrieve user submitted credentials
    let userNameRequested = request.body.username;
    let passwordRaw = request.body.password;
    let emailRaw = request.body.email;
    // Attempt to register a new user, using credentials
    let username;
    try {
        username = await dataAuth.authRegister(
            userNameRequested,
            passwordRaw,
            emailRaw,
        );
    }
    // Handle errors
    catch(error) {
        next(error);
        return;
    }
    // Generate session
    request.session.username = username;
    // Respond with username
    const responseData = {
        username: username,
    };
    response.json(responseData);
});

//-- Login ---------------------------------------
router.post(URL_LOGIN, async function (request, response, next) {
    let username;
    // Retrieve user submitted credentials
    let userNameRaw = request.body.username;
    let passwordRaw = request.body.password;
    // Cancel if already logged in
    try {
        if(request.session.username) {
            throw ERROR_AUTH_COLLISION;
        }
    // Attempt to login
        username = await dataAuth.credentialValidate(userNameRaw, passwordRaw);
        if(!username) {
            throw ERROR_AUTH_INVALID;
        }
    }
    // Handle errors
    catch(error) {
        next(error);
        return;
    }
    // Generate session
    request.session.username = username;
    // Respond with username
    const responseData = {
        username: username,
    };
    response.json(responseData);
});

//-- Logout --------------------------------------
router.get(URL_LOGOUT, async function (request, response, next) {
    // Cancel if not currently logged in
    if(!request.session.username) {
        next(ERROR_AUTH_NOLOGIN);
        return;
    }
    // Destroy session
    delete request.session.username;
    // Redirect home
    response.status(303);
    response.redirect('/');
});
router.post(URL_LOGOUT, async function (request, response, next) {
    // Cancel if not currently logged in
    if(!request.session.username) {
        next(ERROR_AUTH_NOLOGIN);
        return;
    }
    // Destroy session
    delete request.session.username;
    // Respond to http request
    response.status(200);
    response.json({'username': null});
});


//== Error Handling ============================================================

//-- Error Handling ------------------------------
router.use(function (error, request, response, next) {
    // Pass non-user errors upstream (logic, database, etc.)
    switch(error) { 
        case ERROR_AUTH_COLLISION:
        case ERROR_AUTH_INVALID:
        case ERROR_AUTH_NOLOGIN:
        case dataAuth.ERROR_USERNAME_COLLISION:
        case dataAuth.ERROR_USERNAME_BAD:
        case dataAuth.ERROR_PASSWORD_BAD:
            break;
        default: {
            next(error);
            return;
        }
    }
    // Respond with information about the user's authentication error.
    let responseData = {
        error: error,
    };
    response.json(responseData);
});
