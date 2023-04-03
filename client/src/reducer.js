import jwt_decode from "jwt-decode";
var myState = { isLoggedIn : false }
const storedJwt = localStorage.getItem('user_token');
if (storedJwt) {
    const obj = jwt_decode(storedJwt);
    obj["isLoggedIn"] = true;
    obj["token"] = storedJwt;
    myState = obj;
}

export const userInitialState = myState

const userReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return action.item;

        case 'LOGOUT':
            const storedJwt = localStorage.getItem('user_token');
            if (storedJwt) {
                localStorage.removeItem('user_token');
            }

            return { isLoggedIn: false }
        default:
            return state;

    }
}


export default userReducer