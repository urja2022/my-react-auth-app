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
    // userIdVerification: path(ROOTS_DASHBOARD, "/user-id-verification"),
    // updateIdVerification: path(ROOTS_DASHBOARD, "/update-id-verification"),

    chatGroup: path(ROOTS_DASHBOARD, "/chat-group"),
    userEdit: path(ROOTS_DASHBOARD, "/user-edit"),
    userView: path(ROOTS_DASHBOARD, "/user-view"),
    userLocation: path(ROOTS_DASHBOARD, "/user-location"),
    businessAddress: path(ROOTS_DASHBOARD, "/business-address"),
    businessEdit: path(ROOTS_DASHBOARD, "/business-edit"),
    businessUpdate: path(ROOTS_DASHBOARD, "/business-update"),
 
    businessAddressAdd: path(ROOTS_DASHBOARD, "/business-address-add"),
  

    admin: path(ROOTS_DASHBOARD, "/admin"),
    event: path(ROOTS_DASHBOARD, "/event"),
    eventDetails: path(ROOTS_DASHBOARD, "/event/details"),
    userEvent: path(ROOTS_DASHBOARD, "/users/event"),
    business: path(ROOTS_DASHBOARD, "/business"),
    businessView: path(ROOTS_DASHBOARD, "/business-View"),
    profileSetting: path(ROOTS_DASHBOARD, "/profile-settings"),
    idVerify: path(ROOTS_DASHBOARD, "/id-verify"),
    permission: path(ROOTS_DASHBOARD, "/permission"),
    reference: path(ROOTS_DASHBOARD, "/reference"),
    createBusiness: path(ROOTS_DASHBOARD, "/create-business"),
    general: path(ROOTS_DASHBOARD, "/general"),
    ads: path(ROOTS_DASHBOARD, "/ads"),

    employee: path(ROOTS_DASHBOARD, "/employee"),
    businessIdVerify: path(ROOTS_DASHBOARD, "/business-id-verify"),
    businessPermission: path(ROOTS_DASHBOARD, "/business-permission"),
    businessReferences: path(ROOTS_DASHBOARD, "/business-references"),


    rolesPermissions: path(ROOTS_DASHBOARD, "/role-permission"),

    settings: path(ROOTS_DASHBOARD, "/settings"),

    social: path(ROOTS_DASHBOARD, "/social"),
    userSocial: path(ROOTS_DASHBOARD, "/users/social"),
    socialComment: path(ROOTS_DASHBOARD, "/social/comments"),
 


    userDeleteReq: path(ROOTS_DASHBOARD, "/delete-request"),
    restoreDeletedReq: path(ROOTS_DASHBOARD, "/restore-deleted-user"),

    deleteBusinessReqView: path(ROOTS_DASHBOARD, "/delete-req-business"),
   
    restoreUserView: path(ROOTS_DASHBOARD, "/restore-user-view"),
   
    feedDetail: path(ROOTS_DASHBOARD, "/feed-detail"),

    businessEvent: path(ROOTS_DASHBOARD, "/business/event"),
    userEventEdit: path(ROOTS_DASHBOARD, "/event/edit"),
    eventInvitedUserList: path(ROOTS_DASHBOARD, "/invited/users"),
    contactUs : path(ROOTS_DASHBOARD, "/contact-us"),
    contactUsView : path(ROOTS_DASHBOARD, "/contact-us/view")

  },
};

export const HOME_PAGE_PATH = {
  root: ROOTS_AUTH,
};

export const PATH_DOCS = "https://docs-minimals.vercel.app/introduction";
