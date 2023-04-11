import { Box, Button, Dialog, List, ListItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import files from "src/helpers/helpers";
import "@lottiefiles/lottie-player";
import { authStore } from "src/contexts/AuthProvider";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { useMutation, useQueryClient } from "react-query";
import UserAvatar from "src/components/common/UserAvatar";

const PostLikesPopup = (props) => {
  const {
    LikePopuponClose,
    LikePopupOpen,
    postLikesData,
    lottiPlayerLikeLoder,
  } = props;

  // const [dataNotFound, setDataNotFound] = useState()
  const LikePopUphandleClose = (event, reason) => {
    LikePopuponClose();
  };

  // useEffect(() => {
  //   if (!postLikesData) {
  //     setDataNotFound("No likes found")
  //   }
  // }, [postLikesData])

  return (
    <Dialog
      onClose={LikePopUphandleClose}
      open={LikePopupOpen}
      PaperProps={{
        sx: {
          maxWidth: "400px",
          width: "100%",
          height: "500px",
          backgroundColor: "#fff",
          "&.MuiDialog-paper": {
            borderRadius: "5px",
          },
        },
      }}
    >
      {lottiPlayerLikeLoder ? (
        <lottie-player
          autoplay
          loop
          mode="normal"
          src="https://assets6.lottiefiles.com/packages/lf20_f1dhzsnx.json"
        ></lottie-player>
      ) : (
        <Box sx={{ width: "100%", height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "10px 20px",
              backgroundColor: "#6e3fc6",
            }}
          >
            <Typography
              component={"p"}
              className="app_text_14_semibold"
              sx={{ color: "#fff" }}
            >
              liked by
            </Typography>
            <Typography
              component={"p"}
              className="app_text_14_500"
              sx={{ color: "#fff" }}
            >
              {postLikesData?.length} likes
            </Typography>
          </Box>
          <Box sx={{ width: "100%", height: "435px", overflowY: "auto" }}>
            {postLikesData?.length > 0 ? (
              <List sx={{ padding: "20px" }}>
                {postLikesData.map((user, index) => {
                  return (
                    <ListItem
                      sx={{ padding: "0px", marginBottom: "15px" }}
                      key={index}
                    >
                      <UserAvatar
                        diameter={50}
                        alternateSrc={user?.fullNam}
                        imgSrc={
                          user?.Permission?.visibility?.picture
                            ? files(user?.userImage, "image")
                            : ""
                        }
                      />
                      <Box sx={{ marginLeft: "15px", flex: "1" }}>
                        <Typography className="app_text_transform app_text_14_500">
                          {user?.fullName}
                        </Typography>
                        {user?.userName ? (
                          <Typography className="app_text_transform app_text_14">
                            @{user?.userName}
                          </Typography>
                        ) : (
                          <></>
                        )}
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <></>
            )}
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default withTranslation()(PostLikesPopup);
