import { Box, Button, FormHelperText, TextField } from "@mui/material";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import LinearProgress from "@mui/material/LinearProgress";
import LocationPopup from "src/components/dashboard/LocationPopup";
import AddImageIcon from "src/svgComponents/AddImageIcon";
import UploadIcon from "src/svgComponents/UploadIcon";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { INDIVIDUAL_API_URL } from "src/api/axios";
import { PATH_DASHBOARD } from "src/routes/paths";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";

const IDVerification = () => {
  const [selfie, setSelfie] = useState();
  const [userDoc, setUserDoc] = useState("");
  const [phoneSecondary, setPhoneSecondary] = useState();
  const [phoneFocus, setPhoneFocus] = useState(false);
  const [phoneErrorText, setPhoneErrorText] = useState(null);
  const [selfieData, setSelfieData] = useState();
  const [documentData, setDocumentData] = useState();
  const [documentLoder, setDocumentLoder] = useState(false);
  const axiosPrivate = useAxiosPrivate();
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
      formData.append("file", ev);
      axiosPrivate
        .post(INDIVIDUAL_API_URL.documentUpload, formData)
        .then((response) => {
          setSelfieData(response.data.file);
        })
        .catch((error) => {
          const errorData = error.response.data;
          Object.keys(errorData).forEach((key) => {
            setFieldError("selfie", errorData[key]);
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

  const handleDocumentOnChange = (ev) => {
    if (ev.type.includes("image") || ev.type.includes("pdf") || ev.type.includes("doc") || ev.type.includes("docx")) {
      setUserDoc(ev.name);
      const formData = new FormData();
      formData.append("file", ev);
      setDocumentLoder(true);
      axiosPrivate
        .post(INDIVIDUAL_API_URL.documentUpload, formData)
        .then((response) => {
          setDocumentData(response.data.file);
          setDocumentLoder(false);
        })
        .catch((error) => {
          setDocumentLoder(false);
          const errorData = error.response.data;
          Object.keys(errorData).forEach((key) => {
            setFieldError(
              "document",
              errorData[key] +
              "Accpted ( .pdf,  .doc,  .docx ,  .png,  .jpg,  .jpeg)"
            );
          });
        });
    } else {
      enqueueSnackbar(
        "Accpted ( .pdf,  .doc,  .docx ,  .png,  .jpg,  .jpeg).",
        {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        }
      );
    }
  };

  const completedSchema = Yup.object().shape({
    idNumber: Yup.string().required("Id Number is required"),
    selfie: Yup.mixed().required("idVerifyImage is required."),
    address: Yup.string().required("Please Select a location"),
    document: Yup.mixed().required("Document is required"),
  });

  const formik = useFormik({
    initialValues: {
      idNumber: "",
      selfie: "",
      address: "",
      document: "",
      remember: true,
    },
    validationSchema: completedSchema,

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const idVerifyObj = {
        idNumber: values.idNumber,
        idVerifyImage: selfieData,
        image: documentData,
        secondaryNumber: "+" + phoneSecondary,
        homeAddress: {
          name: values.address,
          longitude: longitudeData,
          latitude: lattitudeData,
        },
      };
      mutateAsync(idVerifyObj);
      setSubmitting(false);
    },
  });

  const { mutateAsync } = useMutation(
    async (data) => {
      await axiosPrivate.post(
        INDIVIDUAL_API_URL.idVerify,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (data) => {
        enqueueSnackbar("ID Verification Complete", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        navigate(PATH_DASHBOARD.general.permission);
      },
      onError: (error) => {
        const errorData = error.response.data.errors;
        Object.keys(errorData).forEach((key) => {
          if (key === "homeAddress.name") {
            setFieldError("address", "The Home Address is required");
          } else if (key === "idVerifyImage") {
            setFieldError("selfie", errorData[key]);
          } else if (key === "image") {
            setFieldError("document", errorData[key]);
          } else if (key === "secondaryNumber") {
            setPhoneErrorText(errorData[key]);
          } else {
            setFieldError(key, errorData[key]);
          }
        });
      },
    }
  );

  const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;
  const addressData = (data) => {
    setFieldValue("address", data.address);
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
                <h4 className="app_text_18_semibold">ID Verification</h4>
                <h4 className="app_text_16 app_text_gray">Verify your id</h4>
                <div className="row row-cols-1 g-4 mt-4">
                  <div className="col">
                    <div className="col-md-8">
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Id Number"
                        {...getFieldProps("idNumber")}
                        error={Boolean(touched.idNumber && errors.idNumber)}
                        helperText={touched.idNumber && errors.idNumber}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <h4 className="app_text_14 app_text_black">
                        {selfie ? "Selfie" : "Upload Selfie for verification"}
                      </h4>
                      {selfie ? (
                        <div className="d-flex align-items-end mb-2">
                          <div className="img_preview_circle">
                            <img src={selfie} alt="profile" />
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
                                handleSelfieOnChange(files);
                                formik.setFieldValue("selfie", files);
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
                              name="selfie"
                              hidden
                              accept="image/*"
                              type="file"
                              onChange={(event) => {
                                const files = event.target.files[0];
                                handleSelfieOnChange(files);
                                formik.setFieldValue("selfie", files);
                              }}
                            />
                          </Button>
                        </div>
                      )}
                      <FormHelperText error>
                        {touched.selfie && errors.selfie}
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
                      <Button
                        endIcon={<UploadIcon />}
                        fullWidth
                        variant="outlined"
                        className="app_btn_lg text-lowercase d-flex justify-content-between"
                        component="label"
                      >
                        {documentLoder ? (
                          <Box sx={{ width: "100%" }}>
                            <LinearProgress />
                          </Box>
                        ) : (
                          <>
                            {userDoc ? userDoc : "Upload your ID"}
                            <input
                              hidden
                              name="document"
                              accept=" .pdf,.doc,.docx ,.png,.jpg,.jpeg"
                              onChange={(event) => {
                                const files = event.target.files[0];
                                handleDocumentOnChange(files);
                                formik.setFieldValue("document", files);
                              }}
                              type="file"
                            />
                          </>
                        )}
                      </Button>
                      <FormHelperText error>
                        {touched.document && errors.document}
                      </FormHelperText>
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
                      <Button
                        disabled={documentLoder ? true : false}
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="my-3 text-lowercase text-white app_bg_primary app_text_16_semibold app_btn_lg"
                      >
                        Verify Me
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <LocationPopup addressData={addressData} />
          </div>
        </Form>
      </FormikProvider>
    </>
  );
};

export default IDVerification;
