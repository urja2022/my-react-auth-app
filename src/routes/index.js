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
import EventDetails from "src/pages/dashboard/Event/EventDetails";
import BusinessEvent from "src/pages/dashboard/BusinessEvent";
import UserEventEdit from "src/pages/dashboard/UserEventEdit";
import EventInvitedUser from "src/pages/dashboard/Event/EventInvitedUsers";



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
          path: "/delete-request",
          element: permissionsData?.users?.substring(0, 1) == "1" ? <UserDeleteReq /> : <Dashboard />,
        },
        {
          path: "/restore-deleted-user",
          element: permissionsData?.users?.substring(0, 1) == "1" ? <RestoreUserDeleteReq /> : <Dashboard />,
        },
        
       
      
        {
          path: "restore-user-view",
          element: permissionsData?.users?.substring(0, 1) == "1" ? <RestoreUserView /> : <Dashboard />,
        },
        {
          path: "/users",
          element: permissionsData?.users?.substring(0, 1) == "1" ? <UsersList /> : <Dashboard />,
        },
        {
          path: "/user-location",
          element: permissionsData?.users?.substring(0, 1) == "1" ? <UserLocation /> : <Dashboard />,
        },
       
        
        {
          path: "/chat-group",
          element: permissionsData?.users?.substring(0, 1) == "1" ? <ChatGroupAdmin /> : <Dashboard />,
        },
        
        
        {
          path: "/admin",
          element: permissionsData?.sub_admin?.substring(0, 1) == "1" ? <SubAdmin /> : <Dashboard />,
        },
        { path: "business", element: <Business /> },
        { path: "profile-settings", element: <ProfileSettings /> },
     
        { path: "permission", element: <Permissions /> },
       
        { path: "create-business", element: <CreateBusiness /> },
        { path: "business-id-verify", element: <BusinessIDVerification /> },
        { path: "business-permission", element: <BusinessPermissions /> },
        { path: "business-references", element: <BusinessReferences /> },
        { path: "user-edit", element: <UserEdit /> },
        { path: "user-view", element: <UserView /> },
      
        {
          path: "role-permission",
          element: permissionsData?.roles?.substring(0, 1) == "1" ? <RolesPermissions /> : <Dashboard />,
        },
     
       
        { path: "settings", element: <Settings /> },
        { path: "business-View", element: <BusinessView /> },
        { path: "business-edit", element: <BusinessEdit /> },
        { path: "business-update", element: <BusinessUpdate /> },
        
        { path: "business-address-add", element: <BusinessAddressAdd /> },
        { path: "business-address", element: <BusinessAddress /> },
        { path: "event", element: <Event /> },
        { path: "event/details", element: <EventDetails /> },
        { path: "users/event", element: <UserEvent /> },
      
       
      
       
      
    
        { path: "/users/notification", element: <Notification /> },
        { path: "business/event", element: <BusinessEvent /> },
        { path: "event/edit", element: <UserEventEdit /> },
        { path: "invited/users", element: <EventInvitedUser /> },
        { path: "/contact-us", element: <ContactUs />},
        { path: "/contact-us/view", element: <ContactUsView />}
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
const ChatGroupAdmin = Loadable(lazy(() => import("../pages/dashboard/ChatGroupAdmin")));
const ProfileSettings = Loadable(lazy(() => import("../pages/dashboard/ProfileSettings")));
const UsersList = Loadable(lazy(() => import("../pages/dashboard/UsersList")));
const UserView = Loadable(lazy(() => import("../pages/dashboard/UserView")));

const SubAdmin = Loadable(lazy(() => import("../pages/dashboard/SubAdmin")));

const Permissions = Loadable(lazy(() => import("../pages/dashboard/Permissions")));

const CreateBusiness = Loadable(lazy(() => import("../pages/dashboard/CreateBusiness")));
const BusinessIDVerification = Loadable(lazy(() => import("../pages/dashboard/BusinessIDVerification")));
const BusinessPermissions = Loadable(lazy(() => import("../pages/dashboard/BusinessPermissions")));
const BusinessReferences = Loadable(lazy(() => import("../pages/dashboard/BusinessReferences")));
const RolesPermissions = Loadable(lazy(() => import("../pages/dashboard/RolesPermissions")));
const Business = Loadable(lazy(() => import("../pages/dashboard/Business")));
const BusinessView = Loadable(lazy(() => import("../pages/dashboard/BusinessView")));
const BusinessEdit = Loadable(lazy(() => import("../pages/dashboard/BusinessEdit")));
const BusinessUpdate = Loadable(lazy(() => import("../pages/dashboard/BusinessUpdate")));

const BusinessAddressAdd = Loadable(lazy(() => import("../pages/dashboard/BusinessAddressAdd")));
const BusinessAddress = Loadable(lazy(() => import("../pages/dashboard/BusinessAddress")));
const Event = Loadable(lazy(() => import("../pages/dashboard/Event/Event")));
const UserEvent = Loadable(lazy(() => import("../pages/dashboard/UserEvent")));
const UserEdit = Loadable(lazy(() => import("../pages/dashboard/UserEdit")));




const UserDeleteReq = Loadable(lazy(() => import("../pages/dashboard/UserDeleteReq")));
const RestoreUserDeleteReq = Loadable(lazy(() => import("../pages/dashboard/RestoreUserDeleteReq")));


const RestoreUserView = Loadable(lazy(() => import("../pages/dashboard/RestoreUserView")));


const UserLocation = Loadable(lazy(() => import("../pages/dashboard/UserLocation")));

//Post 




//Notification
const Notification = Loadable(lazy(() => import("../pages/dashboard/Notification")));

//contact us
const ContactUs = Loadable(lazy(() => import("../pages/dashboard/ContactUs")));
const ContactUsView = Loadable(lazy(() => import("../pages/dashboard/ContactUsView")));


