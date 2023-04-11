import React from "react";
import { Button, Checkbox } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import { Form, FormikProvider, useFormik } from "formik";
import { useMutation } from "react-query";
import { BUSINESS_API_URL } from "src/api/axios";
import { PATH_DASHBOARD } from "src/routes/paths";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

const Permissions = () => {
  const axiosPrivate = useAxiosPrivate({type:"business"});
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      publicly: false,
      linked_user: false,
      with_beemz: false,
      not_shared: false,
      pic_visibility: true,
      status_visibility: false,
      post_visibility: true,
      accept_message_public: true,
      accept_message_phone: true,
      accept_marketing: true,
    },
    onSubmit: async (values, { setSubmitting }) => {
      const permissionObj = {
        location: {
          whileUsingApp: values.with_beemz,
          withLinkedContact: values.linked_user,
          withPublic: values.publicly,
          notShared: values.not_shared,
        },
        visibility: {
          picture: values.pic_visibility,
          status: values.status_visibility,
          post: values.pic_visibility,
        },
        acceptMessage: {
          public: values.accept_message_public,
          contact: values.accept_message_phone,
          marketing: values.accept_marketing,
        },
      };
      mutateAsync(permissionObj);
      setSubmitting(false);
    },
  });

  const { mutateAsync } = useMutation(
    async (data) => {
      await axiosPrivate.post(
        BUSINESS_API_URL.businessPermission,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (data) => {
        enqueueSnackbar("Business Permission settings Updated.", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        navigate(PATH_DASHBOARD.general.businessReferences);
      },
      onError: (error) => {
        const errorData = error.response.data.message;
        enqueueSnackbar(errorData, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
      },
    }
  );

  const { handleSubmit } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-11 col-xl-6">
                <h4 className="app_text_18_semibold">
                  Business permission settings
                </h4>
                <h4 className="app_text_16 app_text_gray">
                  what is shared/not shared
                </h4>
                <div className="row row-cols-1 g-4 mt-4">
                  <div className="col">
                    <h4 className="app_text_14_semibold app_text_black">
                      Location Sharing with?
                    </h4>
                    <FormGroup sx={{ flexDirection: "row" }}>
                      <FormControlLabel
                        onChange={formik.handleChange}
                        name="publicly"
                        control={
                          <Checkbox checked={formik.values.publicly === true} />
                        }
                        className="me-4 app_text_gray"
                        label="Publicly"
                      />
                      <FormControlLabel
                        onChange={formik.handleChange}
                        name="linked_user"
                        control={
                          <Checkbox
                            checked={formik.values.linked_user === true}
                          />
                        }
                        className="me-4 app_text_gray"
                        label="Linked Users"
                      />
                      <FormControlLabel
                        onChange={formik.handleChange}
                        name="with_beemz"
                        control={
                          <Checkbox
                            checked={formik.values.with_beemz === true}
                          />
                        }
                        className="me-4 app_text_gray"
                        label="With Beemz"
                      />
                      <FormControlLabel
                        onChange={formik.handleChange}
                        name="not_shared"
                        control={
                          <Checkbox
                            checked={formik.values.not_shared === true}
                          />
                        }
                        className="me-4 app_text_gray"
                        label="Not Shared"
                      />
                    </FormGroup>
                  </div>
                  <div className="col">
                    <div className="col-12">
                      <h4 className="app_text_14_semibold app_text_black">
                        Pic visibility to the public?
                      </h4>
                    </div>
                    <div className="col-12">
                      <FormControl>
                        <RadioGroup
                          name="pic-visibility"
                          sx={{ display: "flex", flexDirection: "row" }}
                        >
                          <FormControlLabel
                            onChange={(event) => {
                              formik.setFieldValue("pic_visibility", true);
                            }}
                            name="pic_visibility"
                            control={
                              <Radio
                                checked={formik.values.pic_visibility === true}
                              />
                            }
                            className="app_text_gray"
                            label="Yes"
                          />
                          <FormControlLabel
                            onChange={(event) => {
                              formik.setFieldValue("pic_visibility", false);
                            }}
                            name="pic_visibility"
                            control={
                              <Radio
                                checked={formik.values.pic_visibility === false}
                              />
                            }
                            className="ms-3 app_text_gray"
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-12">
                      <h4 className="app_text_14_semibold app_text_black">
                        Status visibility to the public?
                      </h4>
                    </div>
                    <div className="col-12">
                      <FormControl>
                        <RadioGroup
                          name="status-visibility"
                          sx={{ display: "flex", flexDirection: "row" }}
                        >
                          <FormControlLabel
                            onChange={(event) => {
                              formik.setFieldValue("status_visibility", true);
                            }}
                            name="status_visibility"
                            control={
                              <Radio
                                checked={
                                  formik.values.status_visibility === true
                                }
                              />
                            }
                            className="app_text_gray"
                            label="Yes"
                          />
                          <FormControlLabel
                            onChange={(event) => {
                              formik.setFieldValue("status_visibility", false);
                            }}
                            name="status_visibility"
                            control={
                              <Radio
                                checked={
                                  formik.values.status_visibility === false
                                }
                              />
                            }
                            className="ms-3 app_text_gray"
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-12">
                      <h4 className="app_text_14_semibold app_text_black">
                        Posts visibility to the public?
                      </h4>
                    </div>
                    <div className="col-12">
                      <FormControl>
                        <RadioGroup
                          name="post-visibility"
                          sx={{ display: "flex", flexDirection: "row" }}
                        >
                          <FormControlLabel
                            onChange={(event) => {
                              formik.setFieldValue("post_visibility", true);
                            }}
                            name="post_visibility"
                            control={
                              <Radio
                                checked={formik.values.post_visibility === true}
                              />
                            }
                            className="app_text_gray"
                            label="Yes"
                          />
                          <FormControlLabel
                            onChange={(event) => {
                              formik.setFieldValue("post_visibility", false);
                            }}
                            name="post_visibility"
                            control={
                              <Radio
                                checked={
                                  formik.values.post_visibility === false
                                }
                              />
                            }
                            className="ms-3 app_text_gray"
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-12">
                      <h4 className="app_text_14_semibold app_text_black">
                        Accept chats/messages from public/unknown users?
                      </h4>
                    </div>
                    <div className="col-12">
                      <FormControl>
                        <RadioGroup
                          name="chat-permission"
                          sx={{ display: "flex", flexDirection: "row" }}
                        >
                          <FormControlLabel
                            onChange={(event) => {
                              formik.setFieldValue(
                                "accept_message_public",
                                true
                              );
                            }}
                            name="accept_message_public"
                            control={
                              <Radio
                                checked={
                                  formik.values.accept_message_public === true
                                }
                              />
                            }
                            className="app_text_gray"
                            label="Yes"
                          />
                          <FormControlLabel
                            onChange={(event) => {
                              formik.setFieldValue(
                                "accept_message_public",
                                false
                              );
                            }}
                            name="accept_message_public"
                            control={
                              <Radio
                                checked={
                                  formik.values.accept_message_public === false
                                }
                              />
                            }
                            className="ms-3 app_text_gray"
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-12">
                      <h4 className="app_text_14_semibold app_text_black">
                        Accept chats/messages from users on their phone contact
                        list?
                      </h4>
                    </div>
                    <div className="col-12">
                      <FormControl>
                        <RadioGroup
                          name="chat-from-contact-permission"
                          sx={{ display: "flex", flexDirection: "row" }}
                        >
                          <FormControlLabel
                            onChange={(event) => {
                              formik.setFieldValue(
                                "accept_message_phone",
                                true
                              );
                            }}
                            name="accept_message_phone"
                            control={
                              <Radio
                                checked={
                                  formik.values.accept_message_phone === true
                                }
                              />
                            }
                            className="app_text_gray"
                            label="Yes"
                          />
                          <FormControlLabel
                            onChange={(event) => {
                              formik.setFieldValue(
                                "accept_message_phone",
                                false
                              );
                            }}
                            name="accept_message_phone"
                            control={
                              <Radio
                                checked={
                                  formik.values.accept_message_phone === false
                                }
                              />
                            }
                            className="ms-3 app_text_gray"
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-12">
                      <h4 className="app_text_14_semibold app_text_black">
                        Accept all marketing and 3rd party advertisements?
                      </h4>
                    </div>
                    <div className="col-12">
                      <FormControl>
                        <RadioGroup
                          name="ad-permission"
                          sx={{ display: "flex", flexDirection: "row" }}
                        >
                          <FormControlLabel
                            onChange={(event) => {
                              formik.setFieldValue("accept_marketing", true);
                            }}
                            name="accept_marketing"
                            control={
                              <Radio
                                checked={
                                  formik.values.accept_marketing === true
                                }
                              />
                            }
                            className="app_text_gray"
                            label="Yes"
                          />
                          <FormControlLabel
                            onChange={(event) => {
                              formik.setFieldValue("accept_marketing", false);
                            }}
                            name="accept_marketing"
                            control={
                              <Radio
                                checked={
                                  formik.values.accept_marketing === false
                                }
                              />
                            }
                            className="ms-3 app_text_gray"
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="mt-5 app_btn_lg app_bg_primary app_text_16_semibold"
                  sx={{ textTransform: "none", maxWidth: "550px" }}
                  variant="contained"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </FormikProvider>
    </>
  );
};

export default Permissions;
