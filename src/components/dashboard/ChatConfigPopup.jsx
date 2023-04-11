import React from "react";
import { useState } from "react";
import { CloseOutlined } from "@mui/icons-material";
import Check from "@mui/icons-material/Check";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputBase,
} from "@mui/material";

import UserAvatar from "../common/UserAvatar";
import { Box } from "@mui/system";
import EditPencilCircle from "src/svgComponents/EditPencilCircle";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Switch } from "@material-ui/core";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { CHAT_API_URL } from "src/api/axios";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import LocationPopupWithSearchbar from "./LocationPopupWithSearchbar";
import files from "src/helpers/helpers";

const ChatConfigPopup = (props) => {
  const { onClose, open, groupData } = props;
  const axiosPrivate = useAxiosPrivate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [isPopupContentScrolling, setIsPopupContentScrolling] = useState(false);
  const [isGroupImageHover, setIsGroupImageHover] = useState(false);
  const [editGroupName, setEditGroupName] = useState(false);
  const [editGroupDescription, setEditGroupDescription] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [groupStatus, setGroupStatus] = useState(groupData?.private);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [goTagData, setGeoTagData] = useState("");
  const [lattitudeData, setLattitudeData] = useState(-26.204444);
  const [longitudeData, setLongitudeData] = useState(28.045556);
  const handleClose = () => {
    onClose();
    setEditGroupName(false);
    setEditGroupDescription(false);
    setEditAddress(false);
  }
  const callErrMessage = (message) => {
    enqueueSnackbar(message, {
      variant: "error",
      anchorOrigin: { vertical: "top", horizontal: "right" },
      autoHideDuration: 2000,
    });
  };
  const { mutateAsync: imageUpload } = useMutation(async (formData) => {
    return await axiosPrivate
      .post(CHAT_API_URL.uploadImage, formData)
      .then((res) => res.data)
      .catch((err) => callErrMessage("please try again!"));
  });

  useEffect(() => {
    if(groupData){
      setGroupName(groupData?.name);
      setGroupStatus(groupData?.private);
      setGroupDesc(groupData?.description)
      setGeoTagData(groupData?.address)
      setLattitudeData(groupData.location.coordinates[0])
      setLongitudeData(groupData.location.coordinates[1])
    }
  },[groupData])
  const handlePopupContentOnScroll = (e) => {
    let contentScrollTop = e.target.scrollTop;
    if (contentScrollTop > 100) {
      setIsPopupContentScrolling(true);
    } else {
      setIsPopupContentScrolling(false);
    }
  };
  const { mutateAsync: updateGroup } = useMutation(
    async (data, signal) => {
    return await axiosPrivate.put(CHAT_API_URL.updateGroup.replace(":groupId", groupData?._id), data, {signal })
  },
  {
    onSuccess: ({ res }) => {
      enqueueSnackbar("group information successfull", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
      handleClose();
      queryClient.invalidateQueries(['chatGroupList'])
    },
    onError: (error) => {
      callErrMessage("please try again!")
    },
  }
  );
  const handleGroupNameOnEditClick = () => {
    setEditGroupName(true);
  };
  const editGroupNameInput = (e) => {
    setGroupName(e.target.value);
  };
  const submitGroupName = async () => {
    const updateObj = {
      title: groupName,
      admin:true
    }
    await updateGroup(updateObj);
  };

  const handleGroupDescriptionOnEditClick = () => {
    setEditGroupDescription(true);
  };
  const updateGroupDesc = async () => {
    const updateObj = {
      description: groupDesc,
      admin:true
    }
    await updateGroup(updateObj);
  };

  const editGroupGeoDataInput = (e) => {
    setGeoTagData(e.target.value);
  };

  const handleGroupGeoDataOnEditClick = async () => {
    const geoDataObj = {
      name: goTagData,
      location: { coordinates: [lattitudeData, longitudeData] },
    };
    const updateObj = {
      geoTag: geoDataObj,
      admin:true
    }
    await updateGroup(updateObj);
  };
  const groupStatusRadio = async () => {
    if (groupStatus) {
      setGroupStatus(false);
      const updateObj = {
        isPrivate: false,
        admin:true
      }
      await updateGroup(updateObj);
    } else {
      setGroupStatus(true);
      const updateObj = {
        isPrivate: true,
        admin:true
      }
      await updateGroup(updateObj);
    }
  };

  const handleGroupChatPicOnChange = async (ev) => {
    try {
      const file = ev.target.files[0];
      if (!file) return false;
      if (file.type.includes("image")) {

        const formData = new FormData();
        formData.append("image", file);

        const response = await imageUpload(formData);
        if (response) {
          const updateObj = {
            image: response.image,
            admin:true
          }
          await updateGroup(updateObj);
        }
      } else {
        enqueueSnackbar(props.t("only jpg,png,jpeg Images accepted"), {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
      }
    } catch (er) {
    }
  };

  const addressData = (data) => {
    setGeoTagData(data.address);
    setLattitudeData(data.lat);
    setLongitudeData(data.lng);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} className="chat_popup_wrapper">
        <DialogTitle
          className={`${
            isPopupContentScrolling ? "contentScrolling" : ""
          } chat_config_popup_header`}
        >
          <IconButton className="chat_config_popup_close_btn" onClick={handleClose}>
            <CloseOutlined style={{ color: "#fff" }} />
          </IconButton>
          <div
            onMouseEnter={() => setIsGroupImageHover(true)}
            onMouseLeave={() => setIsGroupImageHover(false)}
            className={`${
              isPopupContentScrolling ? "contentScrolling" : ""
            } chat_popup_avatar_wrapper`}
          >
            <UserAvatar
              diameter={120}
              alternateSrc={groupData?.name}
              imgSrc={files(groupData?.image,"image")}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                zIndex: 5,
                background: "rgba(0,0,0,0.8)",
                height: "100%",
                width: "100%",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                visibility: isGroupImageHover ? "visible" : "hidden",
              }}
            >
              <IconButton
                sx={{
                  "&:hover": { backgroundColor: "transparent" },
                  p: 0,
                  height: "fit-content",
                  width: "fit-content",
                  display: "flex",
                }}
                component={"label"}
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(ev) => handleGroupChatPicOnChange(ev)}
                />
                <EditOutlinedIcon style={{ fontSize: 48, color: "#fff" }} />
              </IconButton>
            </Box>
          </div>
        </DialogTitle>
        <DialogContent onScroll={handlePopupContentOnScroll}>
          <div className="mt-5 d-flex flex-column">
            <div className="chat_config_popup_chatName_container">
              {editGroupName ? (
                <>
                  <InputBase
                    sx={{
                      paddingInlineStart: 2,
                      border: "thin solid gainsboro",
                      borderRadius: "12px",
                    }}
                    className="app_text_16_semibold"
                    fullWidth
                    value={groupName}
                    onChange={editGroupNameInput}
                    endAdornment={
                      <IconButton
                        sx={{
                          "&:hover": { backgroundColor: "transparent" },
                        }}
                        disabled={groupName ? false : true}
                        onClick={submitGroupName}
                      >
                        <Check />
                      </IconButton>
                    }
                  />
                </>
              ) : (
                <div className="d-flex align-items-center">
                  <h4 className="app_text_20_semibold d-flex justify-content-center">
                    {groupData?.name ?? ""}
                  </h4>
                  <IconButton
                    onClick={() => handleGroupNameOnEditClick()}
                    sx={{
                      "&:hover": { backgroundColor: "transparent" },
                      p: 0,
                      marginInlineStart: 1.5,
                    }}
                  >
                    <EditPencilCircle w={15} h={15} />
                  </IconButton>
                </div>
              )}
            </div>

            <div className="chat_config_popup_chatName_container mt-3">
              {editGroupDescription ? (
                <>
                  <InputBase
                    sx={{
                      paddingInlineStart: 2,
                      border: "thin solid gainsboro",
                      borderRadius: "12px",
                    }}
                    className="app_text_16_semibold"
                    fullWidth
                    value={groupDesc}
                    onChange={(e) => setGroupDesc(e.target.value)}
                    endAdornment={
                      <IconButton
                        sx={{
                          "&:hover": { backgroundColor: "transparent" },
                        }}
                        disabled={groupDesc ? false : true}
                        onClick={updateGroupDesc}
                      >
                        <Check />
                      </IconButton>
                    }
                  />
                </>
              ) : (
                <div className="d-flex align-items-center">
                  <h4 className="app_text_20_semibold d-flex justify-content-center">
                    {groupData?.description ?? ""}
                  </h4>
                  <IconButton
                    onClick={() => handleGroupDescriptionOnEditClick()}
                    sx={{
                      "&:hover": { backgroundColor: "transparent" },
                      p: 0,
                      marginInlineStart: 1.5,
                    }}
                  >
                    <EditPencilCircle w={15} h={15} />
                  </IconButton>
                </div>
              )}
            </div>

            <div className="mt-4">
              {editAddress ? (
                <InputBase
                  sx={{
                    paddingInlineStart: 2,
                    border: "thin solid gainsboro",
                    borderRadius: "12px",
                  }}
                  className="app_text_16_semibold"
                  fullWidth
                  onChange={editGroupGeoDataInput}
                  value={goTagData}
                  endAdornment={
                    <IconButton
                      sx={{
                        "&:hover": { backgroundColor: "transparent" },
                      }}
                      disabled={goTagData ? false : true}
                      onClick={() => handleGroupGeoDataOnEditClick()}
                    >
                      <Check />
                    </IconButton>
                  }
                />
              ) : (
                <>
                  <InputBase
                    sx={{
                      paddingInlineStart: 2,
                      border: "thin solid gainsboro",
                      borderRadius: "12px",
                    }}
                    className="app_text_16_semibold"
                    fullWidth
                    disabled
                    value={groupData?.address}
                    endAdornment={
                      <IconButton
                        sx={{
                          "&:hover": { backgroundColor: "transparent" },
                        }}
                        onClick={()=>setEditAddress(true)}
                      >
                        <EditPencilCircle w={22} h={22} />
                      </IconButton>
                    }
                  />
                </>
              )}
              {editAddress ? 
                <div className="mt-2">
                  <LocationPopupWithSearchbar
                    label={"test"}
                    popupFiled
                    priviousData={""}
                    addressData={addressData}
                    latData={""}
                    longData={""}
                  />
                </div>
                :
                <></>
              }
            </div>

            <div className="mt-3">
              <Box
                display={"flex"}
                justifyContent="space-between"
                alignItems={"center"}
              >
                <FormControlLabel
                  control={
                    <Switch onChange={groupStatusRadio} checked={groupStatus} />
                  }
                  label={
                    <span className="app_text_14_semibold">
                      make this group private
                    </span>
                  }
                />
              </Box>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatConfigPopup;
