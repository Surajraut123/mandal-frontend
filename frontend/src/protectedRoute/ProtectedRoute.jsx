import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({allowedRoles}) => {
    
    const roleId = useSelector((state) => state.role.roleId);

    let currentRole = "";
    if(roleId === "3") {
        currentRole = "Member";
    } else if(roleId === "4") {
        currentRole = "Treasurer";
    } else{
        currentRole = "Admin";
    }
    // will check later for roles
    // if(!roleId || !allowedRoles.includes(currentRole)) {
    //     console.log("what happened")
    //     return <Navigate to="/login" replace/>
    // }
    return <Outlet/>;
}

export default ProtectedRoute