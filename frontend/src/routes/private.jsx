import { Route, Navigate } from 'react-router-dom'
import Profile from '../pages/Profile'
import Home from '../pages/Home'

const connect = () => {
  // return localStorage.getItem('token') !== null
  return "oui"
}

const Private = (
  <>
    <Route
      path="/profile"
      element={ connect() ? <Profile /> : <Navigate to="/" /> }
    />
  </>
)

export default Private