import { Button, Card, CardActions, CardContent, CardHeader, TextField } from "@mui/material"
import { useEffect, useState } from "react";
import { USER_API_URL, INDIVIDUAL_API_URL } from "src/api/axios";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup";
import { Field, Form, FormikProvider, useFormik } from "formik";
import PhoneInputs from './input/PhoneInputs';
import { useSnackbar } from "notistack";
import LoadingScreen from 'src/components/LoadingScreen'

const Settings = () => {
   const axiosPrivate = useAxiosPrivate();
   const [profilePic, setProfilePic] = useState("");
   const [userProfile, setUserProfile] = useState("");
   const [loding, setLoding] = useState(true);
   const { enqueueSnackbar } = useSnackbar();

   const { data: adminData, refetch: userLocation } = useQuery(
      "userLocation",
      async ({ signal }) => {
         return await axiosPrivate
            .get(USER_API_URL.adminGetData, { signal })
            .then((res) => res.data);
      },
      { refetchOnWindowFocus: false }
   );

   const handleProfilePicOnChange = async (ev) => {
      if (ev.type.includes("image")) {
         let userImgSrc = URL.createObjectURL(ev);
         const formData = new FormData();
         formData.append('image', ev)
         const imageData = await axiosPrivate.post(INDIVIDUAL_API_URL.profileUpload, formData)
         setUserProfile(imageData?.data?.imageName)
         setProfilePic(userImgSrc);
      }
   };

   useEffect(() => {
      setFieldValue("username", adminData?.name);
      setFieldValue("email", adminData?.email);
      setTimeout(() => {
         setLoding(false);
      }, 1800);
   }, [adminData])

   const completedSchema = Yup.object().shape({
      username: Yup.string()
         .min(2, "user name can set of between 2 and 50 characters!")
         .max(50, "user name can set of between 2 and 50 characters!")
         .required("user name is required"),
      email: Yup.string()
         .email("email must be a valid email address")
         .required("email is required"),
      // mobile: Yup.string()
      //    .required("Mobile is required"),
   });

   const formik = useFormik({
      initialValues: {
         username: adminData?.name ? adminData?.name : "",
         email: adminData?.email ? adminData?.email : "",
         mobile: adminData?.mobile ? adminData?.mobile : "",
      },
      validationSchema: completedSchema,
      onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {

         const informationObj = {
            username: values.username,
            email: values.email,
            mobile: values.mobile ? values.mobile.includes("+") ? values.mobile : "+" + values.mobile : adminData?.mobile,
            old_password: values.old_password,
            new_password: values.new_password,
         };

         if (userProfile != "") {
            informationObj.image = userProfile
         }
         await adminUpdate(informationObj);
         setSubmitting(false);
      },
   });
   const { mutateAsync: adminUpdate } = useMutation(
      async (data) => {
         return await axiosPrivate.put(USER_API_URL.adminProfileUpdate, JSON.stringify(data))
      },
      {
         onSuccess: ({ data }) => {
            enqueueSnackbar("profile update successfully", {
               variant: "success",
               anchorOrigin: { vertical: "top", horizontal: "right" },
               autoHideDuration: 2000,
            });
         },
         onError: (error) => {
            if (error.response.data.message != undefined) {
               enqueueSnackbar(error.response.data.message, {
                  variant: "error",
                  anchorOrigin: { vertical: "top", horizontal: "right" },
                  autoHideDuration: 2000,
               });
            }
            const errorData = error.response.data.errors;
            Object.keys(errorData).forEach((key) => {
               if (key === "email") {
                  setFieldError("email", errorData[key]);
               } else if (key === "userName") {
                  setFieldError("userName", errorData[key]);
               } else if (key === "mobile") {
                  setFieldError("mobile", errorData[key]);
               } else if (key === "old_password") {
                  setFieldError("old_password", errorData[key]);
               } else if (key === "new_password") {
                  setFieldError("new_password", errorData[key]);
               } else {
                  setFieldError(key, errorData[key]);
               }
            });
         },
      }
   );
   const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;

   return (
      <>
         {loding ? <LoadingScreen /> : <>
            <h4 className="app_text_20_semibold mb-0 d-flex align-items-center">settings</h4>
            <div className="container-fluid mt-4 p-0">
               <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 g-4">
                  <div className="col">
                     <Card sx={{ minWidth: '100%' }}>
                        <FormikProvider value={formik}>
                           <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">general</span>
                                 </div>
                              } />
                              <CardContent>
                                 <div className="d-flex align-items-end mt-4">
                                    <div className="img_preview_circle">
                                       <img src={profilePic == "" ? process.env.REACT_APP_PROFILE_URL + adminData?.image : profilePic} alt="profile" />
                                    </div>
                                    <Button
                                       className="ms-4 app_bg_primary text-lowercase"
                                       variant="contained"
                                       component="label"
                                    >
                                       change pic
                                       <input
                                          hidden
                                          accept="image/*"
                                          onChange={(event) => {
                                             const files = event.target.files[0];
                                             handleProfilePicOnChange(files);
                                          }}
                                          type="file"
                                       />
                                    </Button>
                                 </div>

                                 <TextField
                                    margin="normal"
                                    fullWidth
                                    id="chat_config_field2"
                                    label="admin user"
                                    variant="outlined"
                                    {...getFieldProps("username")}
                                    error={Boolean(touched.username && errors.username)}
                                    helperText={touched.username && errors.username} />
                              </CardContent>
                              <CardActions sx={{ px: '16px', mb: 2 }}><Button style={{ borderRadius: '8px', padding: "14px 18px" }} fullWidth className="theme_button" type="submit" variant="contained">Save Changes</Button></CardActions>
                           </Form>
                        </FormikProvider>
                     </Card>
                  </div>
                  <div className="col">
                     <Card sx={{ minWidth: '100%' }}>
                        <FormikProvider value={formik}>
                           <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">other details</span>
                                 </div>
                              } />
                              <CardContent>
                                 <TextField
                                    margin="normal"
                                    fullWidth
                                    type="email"
                                    id="email"
                                    label="change email"
                                    variant="outlined"
                                    {...getFieldProps("email")}
                                    error={Boolean(touched.email && errors.email)}
                                    helperText={touched.email && errors.email}
                                 />
                                 <Field
                                    customeName="mobile"
                                    name="mobile"
                                    label="alternative mobile number"
                                    errors={errors.mobile}
                                    component={PhoneInputs}
                                    data={adminData?.mobile ? adminData?.mobile : ""}
                                 />
                                 <TextField
                                    margin="normal"
                                    fullWidth
                                    id="old_password"
                                    label="current password"
                                    variant="outlined"
                                    {...getFieldProps("old_password")}
                                    error={Boolean(touched.old_password && errors.old_password)}
                                    helperText={touched.old_password && errors.old_password}
                                 />
                                 <TextField
                                    margin="normal"
                                    fullWidth
                                    id="new_password"
                                    label="new password"
                                    variant="outlined"
                                    {...getFieldProps("new_password")}
                                    error={Boolean(touched.new_password && errors.new_password)}
                                    helperText={touched.new_password && errors.new_password}
                                 />

                              </CardContent>
                              <CardActions sx={{ px: '16px', mb: 2 }}><Button style={{ borderRadius: '8px', padding: "14px 18px" }} fullWidth type="submit"
                                 className="theme_button" variant="contained">save changes</Button></CardActions>

                           </Form>
                        </FormikProvider>
                     </Card>
                  </div>
               </div>
            </div>
         </>
         }
      </>
   )
}

export default Settings