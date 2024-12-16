import React from 'react'
import { UserContext } from '../contexts/authContext'
import IUserContext from '../interfaces/IUserContext'

export const useAuth = (): IUserContext => React.useContext(UserContext)
