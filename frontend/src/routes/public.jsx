import { Route } from 'react-router-dom'
import Home from '../pages/Home'

const Public = (
  <>
    <Route path="/" element={<Home/>} />
  </>
)

export default Public