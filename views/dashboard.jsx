import React from 'react'
import { WrapperBox } from 'admin-bro/components'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const Child = ({ match }) => (
  <div>
    <h3>ID: {match.params.id}</h3>
  </div>
)

const ParamsExample = () => (
  <Router>
    <div>
      <h2>Admin</h2>
  

      <Route path="/:id" component={Child}/>
    </div>
  </Router>
)

export default ParamsExample