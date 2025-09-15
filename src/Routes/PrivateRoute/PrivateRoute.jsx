import React from 'react'
import useAuth from '../../Hooks/useAuth'
import Loader from '../../Shared/Loader/Loader';
import { Navigate } from 'react-router';

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
