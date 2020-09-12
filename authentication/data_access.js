

//== Authentication Data Access ================================================

//-- Dependencies --------------------------------
import bcrypt from 'bcryptjs';
import database from '../database.js';

//------------------------------------------------
const TABLE_USER = 'user';
const FIELD_USERNAME = 'username';
const FIELD_PASSWORD = 'password';
const FIELD_EMAIL = 'email';

//-- Project Constants ---------------------------
const SALT_ROUNDS = 10;
export const ERROR_USERNAME_BAD = 'Invalid User Name: name is empty or non-alphanumeric';
export const ERROR_USERNAME_COLLISION = 'Invalid User Name: already taken';
export const ERROR_PASSWORD_BAD = 'Invalid Password: password missing';
export const ERROR_EMAIL_BAD = 'Invalid Email: email missing';

//------------------------------------------------
export function userNameCanonical(nameRaw) {
    if(!nameRaw) {
        throw ERROR_USERNAME_BAD;
    }
    let nameStripped = nameRaw.replace(/[^a-z0-9]/gi,'');
    if(nameStripped !== nameRaw) {
        throw ERROR_USERNAME_BAD;
    }
    return nameStripped.toLowerCase();
}
export function emailCanonical(emailRaw) {
    if(!emailRaw) { 
        throw ERROR_EMAIL_BAD;
    }
    return emailRaw.toLowerCase();
}

//-- Registration --------------------------------
export async function authRegister(userNameRequested, passwordRaw, emailRaw) {
    // Cancel if password is bad (absent)
    if(!passwordRaw) { throw ERROR_PASSWORD_BAD;}
    // Convert to canonical forms; cancel on bad input
    const username = userNameCanonical(userNameRequested);
    const email = emailCanonical(emailRaw);
    // Cancel if the name is already taken
    const userCurrent = await database(TABLE_USER)
        .select(FIELD_USERNAME)
        .where({[FIELD_USERNAME]: username})
        .orWhere({[FIELD_EMAIL]: email})
        .first();
    if(userCurrent) { throw ERROR_USERNAME_COLLISION;}
    // Create the user in the database
    // Store password (hashed)
    await database(TABLE_USER).insert({
        [FIELD_USERNAME]: username,
        [FIELD_PASSWORD]: await bcrypt.hash(passwordRaw, SALT_ROUNDS),
        [FIELD_EMAIL]: email,
    });
    // Return the new user's name
    return username;
}

//-- Change Password -----------------------------
// export async function credentialAssociate(userNameRaw, passwordRaw) {
//     // Calculate userId for given name; this should throw, as the user should
//         // already exist by the time this function is called.
//     const userId = userNameCanonical(userNameRaw);
//     // Calculate hash from password
//     const hash = await bcrypt.hash(passwordRaw, SALT_ROUNDS);
//     await database_fake.credentialCreate(userId, hash);
//     // Return actual userId
//     return userId;
// }

//-- Login (check password) ----------------------
export async function credentialValidate(userNameRaw, passwordRaw) {
    // Calculate userId for requested name, cancel on bad usernames
    let username;
    try {
        username = userNameCanonical(userNameRaw);
    }
    catch(error) {
        if(error === ERROR_USERNAME_BAD) {
            return false;
        }
    }
    // Retrieve password hash from database, cancel if non-exists
    const userCredentials = await database(TABLE_USER)
        .select(FIELD_USERNAME, FIELD_PASSWORD)
        .where({[FIELD_USERNAME]: username})
        .first();
    const hash = userCredentials? userCredentials[FIELD_PASSWORD] : '';
    // Compare password to hash, cancel if they don't match
    const result = await bcrypt.compare(passwordRaw, hash);
    if(!result) { return false;}
    // On validation, return actual userId
    return userCredentials[FIELD_USERNAME];
}
