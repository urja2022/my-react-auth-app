// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = "/";
const ROOTS_DASHBOARD = "/dashboard";

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, "login"),
  register: path(ROOTS_AUTH, "register"),
  verification: path(ROOTS_AUTH, "verification"),
  resetPassword: path(ROOTS_AUTH, "reset-password"),
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    dashboard: path(ROOTS_DASHBOARD, "/"),
    users: path(ROOTS_DASHBOARD, "/users"),
   

    chatGroup: path(ROOTS_DASHBOARD, "/chat-group"),



   
    

 
  

    admin: path(ROOTS_DASHBOARD, "/admin"),
    
  
    

   
    profileSetting: path(ROOTS_DASHBOARD, "/profile-settings"),
    idVerify: path(ROOTS_DASHBOARD, "/id-verify"),
    permission: path(ROOTS_DASHBOARD, "/permission"),
    reference: path(ROOTS_DASHBOARD, "/reference"),
  
    general: path(ROOTS_DASHBOARD, "/general"),
    ads: path(ROOTS_DASHBOARD, "/ads"),

    employee: path(ROOTS_DASHBOARD, "/employee"),
    businessIdVerify: path(ROOTS_DASHBOARD, "/business-id-verify"),
    businessPermission: path(ROOTS_DASHBOARD, "/business-permission"),



    rolesPermissions: path(ROOTS_DASHBOARD, "/role-permission"),

    settings: path(ROOTS_DASHBOARD, "/settings"),

    social: path(ROOTS_DASHBOARD, "/social"),
    userSocial: path(ROOTS_DASHBOARD, "/users/social"),
    socialComment: path(ROOTS_DASHBOARD, "/social/comments"),
 


  
    restoreDeletedReq: path(ROOTS_DASHBOARD, "/restore-deleted-user"),

    deleteBusinessReqView: path(ROOTS_DASHBOARD, "/delete-req-business"),
   

   
    feedDetail: path(ROOTS_DASHBOARD, "/feed-detail"),

 
   
  
   
   

  },
};

export const HOME_PAGE_PATH = {
  root: ROOTS_AUTH,
};

export const PATH_DOCS = "https://docs-minimals.vercel.app/introduction";
