import ILoginAPI from "../interfaces/ILoggingAPI"


const login = (login: ILoginAPI) => {
    const LOGIN_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/login`
    return fetch(LOGIN_URL,{ 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": login.email,
          "password": login.password
        })
        }
    )
}


export default { login }