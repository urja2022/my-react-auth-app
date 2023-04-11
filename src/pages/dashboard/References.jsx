import React, { useState } from "react";
import { Button, FormHelperText, TextField } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import { Form, FormikProvider, useFormik } from "formik";
import { useMutation } from "react-query";
import { INDIVIDUAL_API_URL } from "src/api/axios";
import { HOME_PAGE_PATH } from "src/routes/paths";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
const _ = require('lodash'); 

const References = () => {
  const [ref1PhoneNumber, setRef1PhoneNumber] = useState();
  const [ref2PhoneNumber, setRef2PhoneNumber] = useState();
  const [ref3PhoneNumber, setRef3PhoneNumber] = useState();
  const [phoneErrorRef1, setPhoneErrorRef1] = useState(null);
  const [phoneErrorRef2, setPhoneErrorRef2] = useState(null);
  const [phoneErrorRef3, setPhoneErrorRef3] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      ref1UserName: "",
      ref1Email: "",
      ref2UserName: "",
      ref2Email: "",
      ref3UserName: "",
      ref3Email: "",
    },
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const referaceData = [
        {
          name: values.ref1UserName,
          email: values.ref1Email,
          mobile: ref1PhoneNumber ? "+" + ref1PhoneNumber : "",
        },
        {
          name: values.ref2UserName,
          email: values.ref2Email,
          mobile: ref2PhoneNumber ? "+" + ref2PhoneNumber : "",
        },
        {
          name: values.ref3UserName,
          email: values.ref3Email,
          mobile: ref3PhoneNumber ? "+" + ref3PhoneNumber : "",
        },
      ];
      const referaceObj = referaceData.filter((item) => Object.keys(item).filter((key) => item[key] !== "" ).length === 3);
      mutateAsync(referaceObj);
      setSubmitting(false);
    },
  });

  const { mutateAsync } = useMutation(
    async (data) => {
      await axiosPrivate.post(
        INDIVIDUAL_API_URL.reference,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: (data) => {
        enqueueSnackbar("Reference Updated Successfully", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        navigate(HOME_PAGE_PATH.root);
      },
      onError: (error) => {
        const errorData = error.response.data.errors;
        Object.keys(errorData).forEach((key) => {
            if (key === "reference.0.mobile") {
                setPhoneErrorRef1(errorData[key]);
            }else if(key === "reference.1.mobile"){
                setPhoneErrorRef2(errorData[key]);
            }else if(key === "reference.2.mobile"){
                setPhoneErrorRef3(errorData[key]);
            }
        });
      },
    }
  );

  const { handleSubmit, getFieldProps } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-11 col-xl-6">
                <h4 className="app_text_18_semibold">References</h4>
                <h4 className="app_text_16 app_text_gray">
                  Add your References
                </h4>
                <div className="row row-cols-1 g-5 mt-4">
                  <div className="col">
                    <h4 className="app_text_14_semibold app_text_black text-lowercase">
                      1st reference
                    </h4>
                    <TextField
                      id="ref1UserName"
                      label="User Name"
                      type="text"
                      autoComplete="off"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      {...getFieldProps("ref1UserName")}
                    />
                    <>
                      <PhoneInput
                        containerClass="mt-3 mb-2"
                        inputProps={{
                          style: { width: "100%" },
                          name: "refPhone1",
                        }}
                        country={"au"}
                        onChange={(phone) => setRef1PhoneNumber(phone)}
                      />
                    <FormHelperText error={phoneErrorRef1 ? true : false}>
                        {phoneErrorRef1}
                    </FormHelperText>
                    </>
                    <TextField
                      id="ref1Email"
                      label="Email"
                      type="email"
                      autoComplete="off"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      {...getFieldProps("ref1Email")}
                    />
                  </div>
                  <div className="col">
                    <h4 className="app_text_14_semibold app_text_black text-lowercase">
                      2nd reference
                    </h4>
                    <TextField
                      id="ref2UserName"
                      label="User Name"
                      type="text"
                      autoComplete="off"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      {...getFieldProps("ref2UserName")}
                    />
                    <>
                      <PhoneInput
                        containerClass="mt-3 mb-2"
                        inputProps={{
                          style: { width: "100%" },
                          name: "refPhone2",
                        }}
                        country={"au"}
                        onChange={(phone) => setRef2PhoneNumber(phone)}
                      />
                    <FormHelperText error={phoneErrorRef2 ? true : false}>
                        {phoneErrorRef2}
                    </FormHelperText>
                    </>
                    <TextField
                      id="ref2Email"
                      label="Email"
                      type="email"
                      autoComplete="off"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      {...getFieldProps("ref2Email")}
                    />
                  </div>
                  <div className="col">
                    <h4 className="app_text_14_semibold app_text_black text-lowercase">
                      3rd reference
                    </h4>
                    <TextField
                      id="ref3UserName"
                      label="User Name"
                      type="text"
                      autoComplete="off"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      {...getFieldProps("ref3UserName")}
                    />
                    <>
                      <PhoneInput
                        containerClass="mt-3 mb-2"
                        inputProps={{
                          style: { width: "100%" },
                          name: "refPhone3",
                        }}
                        country={"au"}
                        onChange={(phone) => setRef3PhoneNumber(phone)}
                      />
                    <FormHelperText error={phoneErrorRef3 ? true : false}>
                        {phoneErrorRef3}
                    </FormHelperText>
                    </>
                    <TextField
                      id="ref3Email"
                      label="Email"
                      type="email"
                      autoComplete="off"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      {...getFieldProps("ref3Email")}
                    />
                  </div>
                  <div className="col">
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      className="my-3 text-lowercase text-white app_bg_primary app_text_16_semibold app_btn_lg"
                    >
                      Add References
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </FormikProvider>
    </>
  );
};

export default References;
