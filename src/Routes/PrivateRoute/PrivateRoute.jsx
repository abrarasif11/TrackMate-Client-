import React from 'react'

import Loader from '../../Shared/Loader/Loader';
import { Navigate } from 'react-router';
import useAuth from '../../hooks/useAuth';

const PrivateRoute = ({children}) => {
   const { user,loading } = useAuth();
   if(loading){
    return <Loader/>
   }
  if(!user) {
    <Navigate to='/login'></Navigate>
  }

  return children;
}

export default PrivateRoute
