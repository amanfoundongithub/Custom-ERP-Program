

const REQUEST_BASE_URL = "http://localhost:8000"


/**
 * Resources for the token request params to start a session
 */
export const getSessionTokenURLandBody = () => {
    const url =  REQUEST_BASE_URL + "/session/start"
    const body =  {
        method : "GET",
        credentials : "include"
    }

    return [url, body]
}


/**
 * Resources for the sign in page to start session
 */
export const getLoginURLandBody = (email, password) => {

    const url = REQUEST_BASE_URL + "/user/verify?email=" + email + "&password=" + password

    const body = {
        method : "GET",
        credentials : "include"
    }

    return [url, body]
}

