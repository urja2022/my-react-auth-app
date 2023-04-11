import React, { useState } from "react";
import * as Yup from "yup";
import { FormHelperText, Button, TextField } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import UploadIcon from "src/svgComponents/UploadIcon";
import AddImageIcon from "src/svgComponents/AddImageIcon";
import useStore from "src/contexts/AuthProvider";
import { Form, FormikProvider, useFormik } from "formik";
import LocationPopup from "src/components/dashboard/LocationPopup";
import { useMutation } from "react-query";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { INDIVIDUAL_API_URL } from "src/api/axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
const _ = require('lodash'); 

const ProfileSettings = () => {
  const [phoneFocus1, setPhoneFocus1] = useState(false);
  const [phoneErrorText, setPhoneErrorText] = useState(null);
  const [phoneErrorAlternative, setPhoneErrorAlternative] = useState(null);
  const [phoneErrorSecondary, setPhoneErrorSecondary] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState();
  const [phoneSecondary, setPhoneSecondary] = useState();
  const [phoneAlternate, setPhoneAlternate] = useState();
  const [profilePic, setProfilePic] = useState();
  const [lattitudeData, setLattitudeData] = useState("");
  const [longitudeData, setLongitudeData] = useState("");
  const userData = useStore();
  const updateData = useStore(state => state.updateUserProfile);
  const axiosPrivate = useAxiosPrivate();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleProfilePicOnChange = (ev) => {
    if(ev.type.includes("image") === true){
      let userImgSrc = URL.createObjectURL(ev);
      setProfilePic(userImgSrc);
    }else{
      enqueueSnackbar("Accept Only Images.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
    }
  };

  const hadnleLocationPopup = () => {
    const locationPopup = document.getElementById("locationPopup");
    locationPopup.classList.add("show");
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "0px";
  };

  const completedSchema = Yup.object().shape({
    user_name: Yup.string()
      .min(2, "User Name can set of between 2 and 50 characters!")
      .max(50, "User Name can set of between 2 and 50 characters!")
      .required("User Name is required"),
    full_name: Yup.string()
      .min(2, "Full Name can set of between 2 and 50 characters!")
      .max(50, "Full Name can set of between 2 and 50 characters!")
      .required("Full Name is required"),
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    user_bio: Yup.string()
      .max(50, "User Bio can set of between 2 and 50 characters!")
      .required("User Bio is required"),
    user_status: Yup.string().required("User Status is required"),
    address: Yup.string().required("Please Select a location"),
    profile: Yup.mixed().required("Profile Picture is required"),
  });

  const formik = useFormik({
    initialValues: {
      user_name: "",
      full_name: userData?.user?.displayName ? userData?.user?.displayName : "",
      email: userData?.user?.email ? userData?.user?.email : "",
      user_bio: "",
      user_status: "",
      address: "",
      profile: "",
      remember: true,
    },
    validationSchema: completedSchema,
    onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
      const informationObj = {
        address: {
          name: values.address,
          longitude: longitudeData,
          latitude: lattitudeData,
        },
        bio: values.user_bio,
        userStatus: values.user_status,
        fullName: values.full_name,
        userName: values.user_name,
        email: values.email,
        mobile: userData?.user?.mobile ? userData?.user?.mobile : "+" + phoneNumber,        
        secondary: phoneSecondary ? "+" + phoneSecondary : null,
        alternative: phoneAlternate ? "+" + phoneAlternate : null,
      };
      const profiles = {
        image: values.profile,
      }
      await profile(informationObj);
      await profileUpload(profiles);
      setSubmitting(false);
    },
  });

  const { mutateAsync:profile } = useMutation(
    async (data) => {
      return await axiosPrivate.post(INDIVIDUAL_API_URL.profile, JSON.stringify(data))
    },
    {
      onSuccess: ({data}) => {
        updateData(data.users);
        enqueueSnackbar("Complete your profile", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        navigate(PATH_DASHBOARD.general.idVerify);
      },
      onError: (error) => {
        const errorData = error.response.data.errors;
        Object.keys(errorData).forEach((key) => {
          if (key === "mobile") {
            setPhoneErrorText(errorData[key]);
          }else if(key === "alternative"){
            setPhoneErrorAlternative(errorData[key]);
          }else if(key === "secondary"){
            setPhoneErrorSecondary(errorData[key]);
          }else if(key === "bio"){
            setFieldError("user_bio", errorData[key]);
          }else if(key === "address.name"){
            setFieldError("address", errorData[key]);
          }else if(key === "userName"){
            setFieldError("user_name", errorData[key]);
          }else{
            setFieldError(key, errorData[key]);
          }
        });
      },
    }
  );

  const { mutateAsync:profileUpload } = useMutation(
    async (data) => {
      const formData = new FormData();
      formData.append('image', data.image)
      formData.append('type', 2)
      await axiosPrivate.post(INDIVIDUAL_API_URL.profileUpload, formData)
    },
    {
      onSuccess: (data) => data,
      onError: (error) => {
        const errorData = error.response.data;
        Object.keys(errorData).forEach((key) => {
          setFieldError("profile", errorData[key]);
        });
      },
    }
  );

  const { errors, touched,setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;

  const addressData = (data) => {
    setFieldValue("address",data.address);
    setLattitudeData(data.lat);
    setLongitudeData(data.lng);
  }
  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-11 col-xl-10 col-xxl-8">
                <h4 className="app_text_18_semibold">Primary information</h4>
                <h4 className="app_text_16 app_text_gray">
                  Complete your profile
                </h4>
                <div className="row row-cols-1 g-4 mt-4">
                  <div className="col">
                    <div className="col-md-8">
                      <h4 className="app_text_14 app_text_black">
                        Profile Picture
                      </h4>
                      {profilePic ? (
                        <div className="d-flex align-items-end mb-2">
                          <div className="img_preview_circle">
                            <img src={profilePic} alt="profile" />
                          </div>
                          <Button
                            className="ms-4 app_bg_primary text-lowercase"
                            variant="contained"
                            component="label"
                          >
                            change pic
                            <input
                              id="file"
                              name="profile"
                              hidden
                              accept="image/*"
                              onChange={(event) => {
                                const files = event.target.files[0];
                                handleProfilePicOnChange(files);
                                formik.setFieldValue("profile", files);
                              }}
                              type="file"
                            />
                          </Button>
                        </div>
                      ) : (
                        <div className="img_preview_container">
                          <Button
                            className="py-5 app_text_14_500 app_text_gray text-lowercase d-flex flex-column"
                            component="label"
                          >
                            <AddImageIcon />
                            <span className="mt-2">Upload profile photo</span>
                            <input
                              id="file"
                              name="profile"
                              hidden
                              accept="image/*"
                              onChange={(event) => {
                                const files = event.target.files[0];
                                handleProfilePicOnChange(files);
                                formik.setFieldValue("profile", files);
                              }}
                              type="file"
                            />
                          </Button>
                        </div>
                      )}
                      <FormHelperText error>
                        {touched.profile && errors.profile}
                      </FormHelperText>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <TextField
                        id="username"
                        label="User Name"
                        varient="outlined"
                        fullWidth
                        {...getFieldProps("user_name")}
                        error={Boolean(touched.user_name && errors.user_name)}
                        helperText={touched.user_name && errors.user_name}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <TextField
                        id="fullname"
                        label="Full Name"
                        varient="outlined"
                        fullWidth
                        {...getFieldProps("full_name")}
                        error={Boolean(touched.full_name && errors.full_name)}
                        helperText={touched.full_name && errors.full_name}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <PhoneInput
                        inputProps={{
                          style: { width: "100%" },
                          name: "phone1",
                          required: true,
                          onFocus: () => setPhoneFocus1(true),
                          onBlur: () => setPhoneFocus1(false),
                        }}
                        disabled={userData?.user?.mobile ? true : false}
                        value={
                          userData?.user?.mobile ? userData?.user?.mobile : ""
                        }
                        isValid={(inputNumber, country) => {
                          if (
                            phoneFocus1 &&
                            country.countryCode === inputNumber
                          ) {
                            setPhoneErrorText(
                              (state) => "Please enter a number"
                            );
                            return false;
                          }
                          setPhoneErrorText(null);
                          return true;
                        }}
                        country={"au"}
                        specialLabel="Enter Your Phone Number"
                        onChange={(phone) => setPhoneNumber(phone)}
                      />
                      <FormHelperText error={phoneErrorText ? true : false}>
                        {phoneErrorText}
                      </FormHelperText>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <TextField
                        id="profileEmail"
                        label="Email"
                        type="email"
                        autoComplete="off"
                        fullWidth
                        variant="outlined"
                        disabled={userData?.user?.email ? true : false}
                        {...getFieldProps("email")}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="col-md-8">
                      <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Address"
                        {...getFieldProps("address")}
                        error={Boolean(touched.address && errors.address)}
                        helperText={touched.address && errors.address}
                      />
                    </div>
                    <div className="col-md-8 my-2 d-flex justify-content-center">
                      <span className="app_text_gray">- OR -</span>
                    </div>
                    <div className="col-md-8">
                      <Button
                        onClick={() => hadnleLocationPopup()}
                        fullWidth
                        className="text-lowercase app_btn_lg"
                        variant="outlined"
                      >
                        Select Address From Map
                      </Button>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <TextField
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        label="User Bio (Max 200 Character)"
                        {...getFieldProps("user_bio")}
                        error={Boolean(touched.user_bio && errors.user_bio)}
                        helperText={touched.user_bio && errors.user_bio}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="User Status"
                        {...getFieldProps("user_status")}
                        error={Boolean(
                          touched.user_status && errors.user_status
                        )}
                        helperText={touched.user_status && errors.user_status}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <h4 className="app_text_18_semibold">
                      Optional information
                    </h4>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <PhoneInput
                        inputProps={{
                          style: { width: "100%" },
                          name: "phoneSecondary1",
                          required: true,
                        }}
                        country={"au"}
                        specialLabel="Secondary Phone Number"
                        onChange={(phone) => setPhoneSecondary(phone)}
                      />
                      <FormHelperText error={phoneErrorSecondary ? true : false}>
                        {phoneErrorSecondary}
                      </FormHelperText>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <PhoneInput
                        inputProps={{
                          style: { width: "100%" },
                          name: "phoneAlternate",
                          required: true,
                        }}
                        country={"au"}
                        onChange={(phone) => setPhoneAlternate(phone)}
                        specialLabel="Alternative Phone Number"
                      />
                    </div>
                      <FormHelperText error={phoneErrorAlternative ? true : false}>
                        {phoneErrorAlternative}
                      </FormHelperText>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="my-3 text-lowercase text-white app_bg_primary app_text_16_semibold app_btn_lg"
                      >
                        Save Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <LocationPopup addressData={addressData}/>
          </div>
        </Form>
      </FormikProvider>
    </>
  );
};

export default ProfileSettings;
