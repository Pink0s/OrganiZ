import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'
import React from 'react'
import IProtectedRoute from '../interfaces/IProtectedRoute.ts'

const ProtectedRoute: React.FC<IProtectedRoute> = ({ children }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [authorized, setAuthorized] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      setAuthorized(true)
    }
  })

  return authorized ? children : null
}

export default ProtectedRoute
