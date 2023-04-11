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
    userIdVerification: path(ROOTS_DASHBOARD, "/user-id-verification"),
    updateIdVerification: path(ROOTS_DASHBOARD, "/update-id-verification"),
    idVerifyLimit: path(ROOTS_DASHBOARD, "/id-verification-limit"),
    chatGroup: path(ROOTS_DASHBOARD, "/chat-group"),
    userEdit: path(ROOTS_DASHBOARD, "/user-edit"),
    userView: path(ROOTS_DASHBOARD, "/user-view"),
    userLocation: path(ROOTS_DASHBOARD, "/user-location"),
    businessAddress: path(ROOTS_DASHBOARD, "/business-address"),
    businessEdit: path(ROOTS_DASHBOARD, "/business-edit"),
    businessUpdate: path(ROOTS_DASHBOARD, "/business-update"),
    businessAddressUpdate: path(ROOTS_DASHBOARD, "/business-address-update"),
    businessAddressAdd: path(ROOTS_DASHBOARD, "/business-address-add"),
    categorys: path(ROOTS_DASHBOARD, "/category"),
    chatCategorys: path(ROOTS_DASHBOARD, "/chat-category"),
    admin: path(ROOTS_DASHBOARD, "/admin"),
    event: path(ROOTS_DASHBOARD, "/event"),
    eventDetails: path(ROOTS_DASHBOARD, "/event/details"),
    userEvent: path(ROOTS_DASHBOARD, "/users/event"),
    trustLevel: path(ROOTS_DASHBOARD, "/trust-level"),
    business: path(ROOTS_DASHBOARD, "/business"),
    businessView: path(ROOTS_DASHBOARD, "/business-View"),
    profileSetting: path(ROOTS_DASHBOARD, "/profile-settings"),
    idVerify: path(ROOTS_DASHBOARD, "/id-verify"),
    permission: path(ROOTS_DASHBOARD, "/permission"),
    reference: path(ROOTS_DASHBOARD, "/reference"),
    createBusiness: path(ROOTS_DASHBOARD, "/create-business"),
    general: path(ROOTS_DASHBOARD, "/general"),
    ads: path(ROOTS_DASHBOARD, "/ads"),
    report: path(ROOTS_DASHBOARD, "/report"),
    employee: path(ROOTS_DASHBOARD, "/employee"),
    businessIdVerify: path(ROOTS_DASHBOARD, "/business-id-verify"),
    businessPermission: path(ROOTS_DASHBOARD, "/business-permission"),
    businessReferences: path(ROOTS_DASHBOARD, "/business-references"),
    traceRequest: path(ROOTS_DASHBOARD, "/trace-request"),
    traceHistory: path(ROOTS_DASHBOARD, "/trace-history"),
    employeeRequest: path(ROOTS_DASHBOARD, "/employee-request"),
    employeeRequestHistory: path(ROOTS_DASHBOARD, "/employee-request-history"),
    rolesPermissions: path(ROOTS_DASHBOARD, "/role-permission"),
    configurableFields: path(ROOTS_DASHBOARD, "/configurable-fields"),
    settings: path(ROOTS_DASHBOARD, "/settings"),
    userDocument: path(ROOTS_DASHBOARD, "/user-document"),
    social: path(ROOTS_DASHBOARD, "/social"),
    userSocial: path(ROOTS_DASHBOARD, "/users/social"),
    socialComment: path(ROOTS_DASHBOARD, "/social/comments"),
    report: path(ROOTS_DASHBOARD, "/reports"),
    reportView: path(ROOTS_DASHBOARD, "/report/view"),
    reportSubject: path(ROOTS_DASHBOARD, "/report-subject"),
    userDeleteReq: path(ROOTS_DASHBOARD, "/delete-request"),
    restoreDeletedReq: path(ROOTS_DASHBOARD, "/restore-deleted-user"),
    ArchiveUserView: path(ROOTS_DASHBOARD, "/delete-req-user"),
    deleteBusinessReqView: path(ROOTS_DASHBOARD, "/delete-req-business"),
    restoreBusinessView: path(ROOTS_DASHBOARD, "/restore-business-view"),
    restoreUserView: path(ROOTS_DASHBOARD, "/restore-user-view"),
    postList: path(ROOTS_DASHBOARD, "/posts"),
    feedDetail: path(ROOTS_DASHBOARD, "/feed-detail"),
    bulkNotification: path(ROOTS_DASHBOARD, "/users/notification"),
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
