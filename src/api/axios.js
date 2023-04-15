import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default axios.create({
  baseURL: BASE_URL,
});

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json", "env": "test" },
  withCredentials: true,
});

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_PATH = "/admin";
const CHAT_PATH = "/chat";
const BUSINESS_PATH = "admin/business";
const USER_PATH = "admin/user";
const USER_LOCATION = "/user";
const SOCIAL_MEDIA_PATH = "/socials"

const AUTH_API_URL = {
  login: path(ROOTS_PATH, "/login"),
  register: path(ROOTS_PATH, "/register"),
  refreshToken: path(ROOTS_PATH, "/refreshToken"),
  logout: path(ROOTS_PATH, "/logout"),
};

const INDIVIDUAL_API_URL = {
  profile: path(ROOTS_PATH, "/profile"),
  profileUpload: path(ROOTS_PATH, "/upload"),
  documentUpload: path(ROOTS_PATH, "/file/upload"),
  idVerify: path(ROOTS_PATH, "/profile/document"),
  permission: path(ROOTS_PATH, "/profile/setting"),
  reference: path(ROOTS_PATH, "/profile/reference"),
};

const BUSINESS_API_URL = {
  getBusinessList: path(BUSINESS_PATH, "/list"),
  getBusiness: path(ROOTS_PATH, "/businesses/lists/"),
  businessApprove: path(BUSINESS_PATH, "/approve/"),
  categoryList: path(BUSINESS_PATH, "/category"),
  uploadFile: path(BUSINESS_PATH, "/upload/image"),
  addBusiness: path(BUSINESS_PATH, ""),
  businessIdVerify: path(BUSINESS_PATH, "/verify/document"),
  businessPermission: path(BUSINESS_PATH, "/setting"),
  businessReference: path(BUSINESS_PATH, "/references"),
  businessUpdate: path(BUSINESS_PATH, "/"),
  addBusinessAddress: path(BUSINESS_PATH, "/addresses"),
  getBusinessAddress: path(BUSINESS_PATH, "/address/"),
  updateBusinessAddress: path(BUSINESS_PATH, "/address"),
  deteleBusinessAddress: path(BUSINESS_PATH, "/address/"),
  businessBulkAddress: path(BUSINESS_PATH, "/mul/address")
};


const USER_API_URL = {
  dashboard: path(ROOTS_PATH, "/dashboard"),
  allEvents: path(ROOTS_PATH, "/all/events"),
  getBusinessList: path(BUSINESS_PATH, "/"),
  userList: path(ROOTS_PATH, "/users"),
  getidVerifyCountList: path(ROOTS_PATH, "/idVerifyCountList"),
  idVerifyCountUpdate: path(ROOTS_PATH, "/idVerifyCountUpdate"),
  userDocList: path(USER_PATH, "/pending/document"),
  userEdit: path(USER_PATH, "/edit"),
  userLocation: path(ROOTS_PATH, "/user/location/"),
  userUpdate: path(USER_PATH, "/profile"),
  userRejected: path(USER_PATH, "/rejected/"),
  //user buisness status update
  updateUserBuisnessStatus: path(USER_PATH, "/buisness/status"),
  deleteUserBusiness: path(USER_PATH, "/buisness/delete/"),
  adminInactive: path(ROOTS_PATH, "/inactive/"),
  adminList: path(ROOTS_PATH, "/"),
  adminGetData: path(ROOTS_PATH, "/profile"),
  adminProfileUpdate: path(ROOTS_PATH, "/setting"),
  subAdmin: path(ROOTS_PATH, "/register"),
  subAdminUpdate: path(ROOTS_PATH, "/update"),
  deleteAdmin: path(ROOTS_PATH, "/"),
  categoryList: path(ROOTS_PATH, "/category"),
  chatCategoryList: path(ROOTS_PATH, "/chat/category"),
  selectCategoryList: path(ROOTS_PATH, "/category/list"),
  selectChatCategoryList: path(ROOTS_PATH, "/chat/category/list"),
  trustLevelList: path(ROOTS_PATH, "/trust/list"),
  trustLevelAdd: path(ROOTS_PATH, "/trust"),
  trustLevelUpdate: path(ROOTS_PATH, "/trust/"),
  userTrustLevelUpdate: path(ROOTS_PATH, "/user/trust/"),
  deleteCategory: path(ROOTS_PATH, "/category/"),
  deleteSubCategory: path(ROOTS_PATH, "/subcategory/"),
  deleteChatCategory: path(ROOTS_PATH, "/chat/category/"),
  categoryUpdate: path(ROOTS_PATH, "/category/"),
  friendList: path(USER_PATH, "/friends/action"),
  friendRequest: path(USER_PATH, "/friends/"),

  getLocation: path(USER_LOCATION, "/location/list"),
  getLocationAdmin: path(USER_LOCATION, "/location/list/admin"),
  linkedRequest: path(ROOTS_PATH, "/link/"),
  employeeList: path(ROOTS_PATH, "/employee/"),
  eventList: path(ROOTS_PATH, "/events"),
  userEventList: path(ROOTS_PATH, '/events/user'),
  eventInactive: path(ROOTS_PATH, '/event/disable/'),
  eventBlockUser: path(ROOTS_PATH, '/event/user/block/'),
  updateUserRequest: path(USER_PATH, "/document/approve"),
  getUserTraceHistory: path(USER_PATH, "/trace/history/"),
  getUserTrace: path(ROOTS_PATH, "/trace/list/"),
  deleteUserTrace: path(ROOTS_PATH, "/trace/delete/"),






  getUserDeleteReqList: path(ROOTS_PATH, "/delete/request"),
  deleteUser: path(ROOTS_PATH, "/user/"),
  deleteBusiness: path(ROOTS_PATH, "/business/"),
  removeArchiveUser: path(ROOTS_PATH, "/restore"),
  getDeletedReqList: path(ROOTS_PATH, "/deleted-req"),

  deleteBusinessView: path(ROOTS_PATH, "/delete-request/business/view/"),

  getRestoreUser: path(ROOTS_PATH, "/restoreUserView"),
  cancelRequest: path(ROOTS_PATH, "/request/cancel/"),
  getDirection: path(USER_LOCATION, "/google/direction"),
  getUserIdVerification: path(USER_PATH, "/idVerifyList"),
  updateUserIdVerification: path(ROOTS_PATH, "/id/verify"),
  updateIdVerificationList: path(USER_PATH, "/idVerifyUpdateList"),
  updateIsMark: path(USER_PATH, "/isMark"),
  getChatGroup: path(ROOTS_PATH, "/group/chat/list"),
  sendNotification: path(ROOTS_PATH, "/user/notify"),
  sendBulkNotification: path(ROOTS_PATH, "/all/users/notification"),
  eventUpdate: path(ROOTS_PATH, "/event/update"),
  eventInvitedUser: path(ROOTS_PATH, "/events/invited/user/")
}

const TRACE_API_URL = {
  getTraceRequest: path(ROOTS_PATH, "/trace/request/pending"),
  getTraceHistory: path(ROOTS_PATH, "/trace/request"),
  updatePandingRequest: path(ROOTS_PATH, "/trace/request/approve/"),
}

const EMPLOYEE_API_URL = {
  getEmployeeRequest: path(ROOTS_PATH, "/request/pending"),
  updateRejectEmpRequest: path(ROOTS_PATH, "/employee/request/approve/"),
  getEmployeeHistory: path(ROOTS_PATH, "/business/employee/history"),
}

const CATEGORY_API_URL = {
  addCategory: path(ROOTS_PATH, "/category"),
  addChatCategory: path(ROOTS_PATH, "/chat/category"),
}

const ROLE_API_URL = {
  getRoleList: path(ROOTS_PATH, "/role"),
  addRole: path(ROOTS_PATH, "/role"),
  updateRole: path(ROOTS_PATH, "/role/"),
}

const SOCIAL_API_URL = {
  getSocialList: path(ROOTS_PATH, "/socials/allPost"),
  getUserSocialList: path(USER_PATH, "/socials/post/"),
  getSocialCommentList: path(ROOTS_PATH, "/socials/post/comment/list"),
  removeComment: path(ROOTS_PATH, "/socials/comment/remove"),
  reportPostUser: path(ROOTS_PATH, "/socials/post/report/"),
  postInactive: path(ROOTS_PATH, "/post/disable/"),


}

const CONFIG_FIELD = {
  configurableFields: path(ROOTS_PATH, "/"),
  getConfigFields: path(ROOTS_PATH, "/configurable/field"),
  addConfigFields: path(ROOTS_PATH, "/configurable/field"),
}


const EVENT_API_URL = {
  // multipleImageUpload: path(USER_LOCATION, "/multiple/image/upload"),
  // createEvent: path(USER_LOCATION, "/event"),
  getAllEvent: path(USER_LOCATION, "/allEvent"),
  getEventStatusFilter: path(USER_LOCATION, "/event/status/list"),
  getSignleEventDetails: path(USER_LOCATION, "/event/"),
  videoImageUpload: path(SOCIAL_MEDIA_PATH, '/multiple/video/upload'),
  // cancelEvent: path(USER_LOCATION, "/event/cancel/"),
  // eventInvitation: path(USER_LOCATION, "/event/invitation"),
}

const CHAT_API_URL = {
  inactiveGroup: path(ROOTS_PATH, "/group/:groupid/inactive"),
  deleteGroup: path(ROOTS_PATH, "/group/:groupid"),
  updateGroup: path(CHAT_PATH, '/group/:groupId'),
  uploadImage: path(CHAT_PATH, "/upload/image"),
  deleteGroupMembers: path(CHAT_PATH, '/admin/group/:groupid/members/:memberId'),
}

const POST_API_URL = {
  postList: path(ROOTS_PATH, "/socials/allPost"),
  postDelete: path(ROOTS_PATH, "/post/delete/"),
  fetchComments: path(SOCIAL_MEDIA_PATH, '/post/:id/comment'),
  getPostComments: path(ROOTS_PATH, "/socials/post/comment/"),
  fetchPosts: path(SOCIAL_MEDIA_PATH, '/post'),
  postGetLikes: path(SOCIAL_MEDIA_PATH, '/post/like/:postId'),

}
const CONTACT_US_API_URL = {
  contactUsList: path(ROOTS_PATH, '/contact-us'),
}
export {
  axiosPrivate,
  AUTH_API_URL,
  INDIVIDUAL_API_URL,
  BUSINESS_API_URL,
  USER_API_URL,
  CATEGORY_API_URL,
  TRACE_API_URL,
  EMPLOYEE_API_URL,
  ROLE_API_URL,
  CONFIG_FIELD,
  SOCIAL_API_URL,
  EVENT_API_URL,
  CHAT_API_URL,
  POST_API_URL,
  CONTACT_US_API_URL
}