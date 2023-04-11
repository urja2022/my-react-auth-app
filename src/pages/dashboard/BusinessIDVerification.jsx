import { Button, FormHelperText, TextField } from "@mui/material";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import LocationPopup from "src/components/dashboard/LocationPopup";
import AddImageIcon from "src/svgComponents/AddImageIcon";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { BUSINESS_API_URL } from "src/api/axios";
import { PATH_DASHBOARD } from "src/routes/paths";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";

const IDVerification = () => {
  const [selfie, setSelfie] = useState();
  const [phoneSecondary, setPhoneSecondary] = useState();
  const [phoneFocus, setPhoneFocus] = useState(false);
  const [phoneErrorText, setPhoneErrorText] = useState(null);
  const [documentData, setDocumentData] = useState();
  const axiosPrivate = useAxiosPrivate({type:"business"});
  const [lattitudeData, setLattitudeData] = useState("");
  const [longitudeData, setLongitudeData] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const hadnleLocationPopup = () => {
    const locationPopup = document.getElementById("locationPopup");
    locationPopup.classList.add("show");
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "0px";
  };

  const handleSelfieOnChange = (ev) => {
    if (ev.type.includes("image")) {
      let userImgSrc = URL.createObjectURL(ev);
      setSelfie(userImgSrc);
      const formData = new FormData();
      formData.append("image", ev);
      axiosPrivate
        .post(BUSINESS_API_URL.uploadFile, formData)
        .then((response) => {
            setDocumentData(response.data.image);
        })
        .catch((error) => {
          const errorData = error.response.data;
          Object.keys(errorData).forEach((key) => {
            setFieldError("image", errorData[key]);
          });
        });
    } else {
      enqueueSnackbar("Accept Only Images.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
    }
  };

  const completedSchema = Yup.object().shape({
    registrationNumber: Yup.string().required("Registration Number is required"),
    address: Yup.string().required("Please Selact a location"),
    image: Yup.mixed().required("Document is required"),
  });

  const formik = useFormik({
    initialValues: {
      registrationNumber: "",
      address: "",
      image: "",
      remember: true,
    },
    validationSchema: completedSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const idVerifyObj = {
        registrationNumber: values.registrationNumber,
        image: documentData,
        secondaryNumber: "+" + phoneSecondary,
        address: {
          name: values.address,
          longitude: longitudeData,
          latitude: lattitudeData ,        
        },
      };
      mutateAsync(idVerifyObj);
      setSubmitting(false);
    },
  });

  const { mutateAsync } = useMutation(
    async (data) => {
      await axiosPrivate.post(
        BUSINESS_API_URL.businessIdVerify,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (res) => {
        enqueueSnackbar("Verification Complete.", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        navigate(PATH_DASHBOARD.general.businessPermission);
      },
      onError: (error) => {
        const errorMessge = error?.response?.data?.message;
        if(errorMessge){
            enqueueSnackbar(errorMessge, {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
                autoHideDuration: 2000,
            });
        }
        const errorData = error?.response?.data?.errors;
        if(errorData){
            Object.keys(errorData).forEach((key) => {
                if (key === "secondaryNumber") {
                    setPhoneErrorText(errorData[key]);
                }else if(key === "address.name"){
                    setFieldError("address", errorData[key]);
                } else {
                    setFieldError(key, errorData[key]);
                }
            });
        }
      },
    }
  );

  const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;
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
                <h4 className="app_text_18_semibold">Verification</h4>
                <h4 className="app_text_16 app_text_gray">Verify business documents</h4>
                <div className="row row-cols-1 g-4 mt-4">
                  <div className="col">
                    <div className="col-md-8">
                      <h4 className="app_text_14 app_text_black">
                        {selfie ? "Document" : "Upload business document"}
                      </h4>
                      {selfie ? (
                        <div className="d-flex align-items-end mb-2">
                          <div className="img_preview_circle">
                            <img src={selfie} alt="profile" />
                          </div>
                          <Button
                            className="ms-4 app_bg_primary"
                            variant="contained"
                            component="label"
                          >
                            Change Document
                            <input
                              hidden
                              accept="image/*"
                              onChange={(event) => {
                                const files = event.target.files[0];
                                handleSelfieOnChange(files);
                                formik.setFieldValue("image", files);
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
                            <span className="mt-2">Upload photo</span>
                            <input
                              name="image"
                              hidden
                              accept="image/*"
                              type="file"
                              onChange={(event) => {
                                const files = event.target.files[0];
                                handleSelfieOnChange(files);
                                formik.setFieldValue("image", files);
                              }}
                            />
                          </Button>
                        </div>
                      )}
                      <FormHelperText error>
                        {touched.image && errors.image}
                      </FormHelperText>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Home Address"
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
                      <PhoneInput
                        inputProps={{
                          style: { width: "100%" },
                          name: "phoneSecondary",
                          required: true,
                          onFocus: () => setPhoneFocus(true),
                          onBlur: () => setPhoneFocus(false),
                        }}
                        isValid={(inputNumber, country) => {
                          if (
                            phoneFocus &&
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
                        specialLabel="Secondary Phone Number"
                        onChange={(phone) => setPhoneSecondary(phone)}
                      />
                      <FormHelperText error={phoneErrorText ? true : false}>
                        {phoneErrorText}
                      </FormHelperText>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Business Registration Number"
                        {...getFieldProps("registrationNumber")}
                        error={Boolean(touched.registrationNumber && errors.registrationNumber)}
                        helperText={touched.registrationNumber && errors.registrationNumber}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="my-3 text-lowercase text-white app_bg_primary app_text_16_semibold app_btn_lg"
                      >
                        Next
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

export default IDVerification;
