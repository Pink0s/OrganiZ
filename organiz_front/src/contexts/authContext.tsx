import { jwtDecode } from 'jwt-decode'
import React from 'react'
import IUserContext from '../interfaces/IUserContext'
import IUser from '../interfaces/IUser'
import IUserProvider from '../interfaces/IUserProvider'
import IJwtPayload from '../interfaces/IJwtPayload'

export const UserContext = React.createContext<IUserContext>({})

export const UserProvider = ({ children }: IUserProvider) => {
  const [isReady, setIsReady] = React.useState(false)
  const [token, setToken] = React.useState<string | undefined>()
  const [isLogin, setIsLogin] = React.useState(false)
  const [user, setUser] = React.useState<undefined | IUser>()

  React.useEffect(() => {
    const token_payload: string | null = getCookie('jwtToken')
    if (token_payload !== null) {
      const decoded: IJwtPayload = jwtDecode(token_payload)

      const user: IUser = {
        id: decoded.id,
        email: decoded.email,
        firstname: decoded.firstname,
        lastname: decoded.lastname,
        role: decoded.role,
      }

      setUser(user)
      setToken(token_payload)
      setIsLogin(true)
    }
    setIsReady(true)
  }, [])

  React.useEffect(() => {
    if (isLogin) {
      const interval = setInterval(() => {
        if (getCookie('jwtToken') === undefined) {
          window.location.reload()
        }
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [isLogin])

  const setCookie = (name: string, value: string, expires: Date) => {
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`
  }

  const setTokenCookie = (token: string) => {
    const decoded: IJwtPayload = jwtDecode(token)
    const expires = new Date(decoded.exp * 1000)
    setCookie('jwtToken', token, expires)
  }

  const getCookie = (name: string): string | null => {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  const login = (token: string) => {
    setTokenCookie(token)
    const decoded: IJwtPayload = jwtDecode(token)

    const user: IUser = {
      id: decoded.id,
      email: decoded.email,
      firstname: decoded.firstname,
      lastname: decoded.lastname,
      role: decoded.role,
    }

    setUser(user)
    setToken(token)
    setIsLogin(true)
  }

  const logout = () => {
    deleteCookie('jwtToken')
    setUser(undefined)
    setToken(undefined)
    setIsLogin(false)
    window.location.reload()
  }

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`
  }

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  )
}
