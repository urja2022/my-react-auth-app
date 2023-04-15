import { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
// layouts
// import MainLayout from '../layouts/main';
import MasterLayout from "src/layouts/MasterLayout";
import MapLayout from "src/layouts/MapLayout";
// import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";
// import RoleBasedGuard from "../guards/RoleBasedGuard";
// components
import LoadingScreen from "../components/LoadingScreen";

import Settings from "src/pages/dashboard/Settings";
import Dashboard from "src/pages/dashboard/Dashboard";
import useStore from "src/contexts/AuthProvider";






//enum
// import { AdminRole, UserRole } from "src/utils/enum";

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...{
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: "fixed",
            },
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  const permissionsData = useStore((state) => state.permissions);

  return useRoutes([
    //auth routes
    {
      path: "login",
      element: (
        <GuestGuard>
          <Login />
        </GuestGuard>
      ),
    },
    {
      path: "dashboard",
      element: (
        <AuthGuard>
          <MasterLayout />
        </AuthGuard>
      ),
      children: [
        { path: "/", element: <Dashboard /> },
       
        
       
      
       
       
       
       
        
      
        
        
        {
          path: "/admin",
          element: permissionsData?.sub_admin?.substring(0, 1) == "1" ? <SubAdmin /> : <Dashboard />,
        },
       
        { path: "profile-settings", element: <ProfileSettings /> },
     
        { path: "permission", element: <Permissions /> },
       
       
       
       
       
       
        
      
        {
          path: "role-permission",
          element: permissionsData?.roles?.substring(0, 1) == "1" ? <RolesPermissions /> : <Dashboard />,
        },
     
       
        { path: "settings", element: <Settings /> },
      
        
       
        
 
        
      
        
      
       
      
       
      
    
        { path: "/users/notification", element: <Notification /> },
       
      
        
      
        
      ],
    },

    {
      path: "/",
      element: (
        <AuthGuard>
          <MasterLayout />
        </AuthGuard>
      ),
      children: [{ path: "/", element: <Dashboard /> }],
    },
    {
      path: "map",
      element: (
        <AuthGuard>
          <MapLayout />
        </AuthGuard>
      ),
      children: [{ path: "/", element: <Map /> }],
    },
  ]);
}

// IMPORT COMPONENTS
//Home
const Map = Loadable(lazy(() => import("../pages/home/Map")));

// Authentication
const Login = Loadable(lazy(() => import("../pages/authentication/Login")));

// Dashboard

const ProfileSettings = Loadable(lazy(() => import("../pages/dashboard/ProfileSettings")));



const SubAdmin = Loadable(lazy(() => import("../pages/dashboard/SubAdmin")));

const Permissions = Loadable(lazy(() => import("../pages/dashboard/Permissions")));





const RolesPermissions = Loadable(lazy(() => import("../pages/dashboard/RolesPermissions")));




















//Post 




//Notification
const Notification = Loadable(lazy(() => import("../pages/dashboard/Notification")));

//contact us




