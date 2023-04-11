import React, { useEffect, useState } from 'react'
import * as Yup from "yup";
import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Field, Form, FormikProvider, useFormik } from "formik";
import { useLocation } from 'react-router-dom';
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { BUSINESS_API_URL } from "src/api/axios";
import { useMutation, useQuery } from 'react-query';
import { INDIVIDUAL_API_URL } from "src/api/axios";
import { useSnackbar } from "notistack";
import PhoneInputs from './input/PhoneInputs';
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from 'src/routes/paths';

const BusinessUpdate = () => {
    const [businessUserData, setBusinessUserData] = useState();
    const axiosPrivate = useAxiosPrivate();
    const [userProfile, setUserProfile] = useState("");
    const [chatPermissions, setChatPermissions] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { state } = useLocation();

    const { data: businessListData, refetch } = useQuery(
        "businessListData",
        async ({ signal }) => {
            return await axiosPrivate
                .get(BUSINESS_API_URL.getBusiness + state?.businessId, { signal })
                .then((res) => res.data);
        },
        { refetchOnWindowFocus: false }
    );
    useEffect(() => {
        if (businessListData) {
            setBusinessUserData(businessListData)
        }
    }, [businessListData])

    useEffect(() => {
        if (businessUserData) {
            setFieldValue("name", businessUserData?.name ? businessUserData?.name : "");
            setFieldValue("user_name", businessUserData?.userName ? businessUserData?.userName : "");
            setFieldValue("email", businessUserData?.email ? businessUserData?.email : "");
            setFieldValue("mobile", businessUserData?.mobile ? businessUserData?.mobile : "");
            setFieldValue("home_address", businessUserData?.document?.address?.name ? businessUserData?.document?.address?.name : "");
            setFieldValue("bio", businessUserData?.bio ? businessUserData?.bio : "");
            setFieldValue("secondaryNumber", businessUserData?.optionalMobile?.secondary ? businessUserData?.optionalMobile?.secondary : "");
            setFieldValue("alternativeNumber", businessUserData?.optionalMobile?.alternative ? businessUserData?.optionalMobile?.alternative : "");
            setChatPermissions(businessUserData?.chatPermissions);
        }
    }, [businessUserData])

    const completedSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, "user name can set of between 2 and 50 characters!")
            .max(50, "user name can set of between 2 and 50 characters!")
            .required("user name is required"),
        bio: Yup.string()
            .min(2, "user bio can set of between 2 and 255 characters!")
            .max(255, "user bio can set of between 2 and 255 characters!")
            .required("user bio is required"),
        // home_address: Yup.string()
        //     .min(2, "home address can set of between 2 and 255 characters!")
        //     .max(255, "home address can set of between 2 and 255 characters!")
        //     .required("home address is required"),
    });
    const formik = useFormik({
        initialValues: {
            name: businessUserData?.name ? businessUserData?.name : "",
            user_name: businessUserData?.userName ? businessUserData?.userName : "",
            email: businessUserData?.email ? businessUserData?.email : "",
            mobile: businessUserData?.mobile ? businessUserData?.mobile : "",
            home_address: businessUserData?.document?.address?.name ? businessUserData?.document?.address?.name : "",
            bio: businessUserData?.bio ? businessUserData?.bio : "",

            secondaryNumber: businessUserData?.optionalMobile?.secondary ? businessUserData?.optionalMobile?.secondary : "",
            alternativeNumber: businessUserData?.optionalMobile?.alternative ? businessUserData?.optionalMobile?.alternative : "",
            userTrace: businessUserData?.userTrace ? businessUserData?.userTrace : ""
        },
        validationSchema: completedSchema,
        onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {

            const informationObj = {
                categoryId: businessUserData?._id,
                bio: values.bio,
                name: values.name,
                secondary: values.secondaryNumber ? values.secondaryNumber.includes("+") ? values.secondaryNumber : "+" + values.secondaryNumber : "",
                alternative: values.alternativeNumber ? values.alternativeNumber.includes("+") ? values.alternativeNumber : "+" + values.alternativeNumber : "",
                // address: {
                //     name: values.home_address,
                //     longitude: businessUserData?.document?.address?.location?.coordinates?.[0] ?? 1,
                //     latitude: businessUserData?.document?.address?.location?.coordinates?.[1] ?? 1
                // },
                chatPermissions: chatPermissions
            };
            if (userProfile != "") {
                informationObj.image = userProfile
            }

            await userUpdate(informationObj);
            setSubmitting(false);
        },
    });

    const { mutateAsync: userUpdate } = useMutation(
        async (data) => {
            return await axiosPrivate.put(BUSINESS_API_URL.businessUpdate + businessUserData?._id, JSON.stringify(data))
        },
        {
            onSuccess: ({ data }) => {
                enqueueSnackbar("Business Update successfully", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                    autoHideDuration: 2000,
                });
                navigate(PATH_DASHBOARD.general.users);
            },
            onError: (error) => {
                const errorData = error.response.data.errors;
                if (error.response?.data?.message) {
                    enqueueSnackbar(error.response?.data?.message, {
                        variant: "error",
                        anchorOrigin: { vertical: "top", horizontal: "right" },
                        autoHideDuration: 2000,
                    });
                }
                Object.keys(errorData).forEach((key) => {

                    if (key === "bio") {
                        setFieldError("user_bio", errorData[key]);
                    } else if (key === "address.name") {
                        setFieldError("address", errorData[key]);
                    } else if (key === "secondary") {
                        setFieldError("secondaryNumber", errorData[key]);
                    } else if (key === "alternative") {
                        setFieldError("alternativeNumber", errorData[key]);
                    } else if (key === "name") {
                        setFieldError("user_name", errorData[key]);
                    } else {
                        setFieldError(key, errorData[key]);
                    }
                });
            },
        }
    );

    const handleSelfieOnChange = async (ev) => {
        if (ev.type.includes("image")) {
            const formData = new FormData();
            formData.append('image', ev)
            const imageData = await axiosPrivate.post(INDIVIDUAL_API_URL.profileUpload, formData)
            setUserProfile(imageData?.data?.imageName)
        }
    };

    const chatPermissionsChnage = (val) => {
        if (chatPermissions.includes(val)) {
            setChatPermissions((prev) => {
                return prev.filter((value) => {
                    return value !== val;
                });
            });
        } else {
            setChatPermissions((prev) => [...prev, val]);
        }
    }

    const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className='col'>
                                <div className='user_edit_header'>
                                    <h4 className="app_text_14_semibold mb-0">general information</h4>
                                </div>
                                <div className="d-flex align-items-end mt-4">
                                    <div className="img_preview_circle">
                                        <img src={userProfile == "" ? process.env.REACT_APP_PROFILE_URL + businessUserData?.image : process.env.REACT_APP_PROFILE_URL + userProfile} alt="profile" />
                                    </div>
                                    <Button
                                        className="ms-4 app_bg_primary"
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
                                            }}
                                            type="file"
                                        />
                                    </Button>
                                </div>
                                <div className="d-flex mt-4">
                                    <TextField
                                        label="name"
                                        varient="outlined"
                                        fullWidth
                                        // disabled={true}
                                        autoComplete="off"
                                        {...getFieldProps("name")}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                </div>
                                <div className='d-flex row mt-4'>
                                    <div className='col'>
                                        <Field
                                            customeName="mobile"
                                            name="mobile"
                                            label="mobile number"
                                            disabled={true}
                                            component={PhoneInputs}
                                            data={businessUserData?.mobile ? businessUserData?.mobile : ""}
                                        />
                                    </div>
                                    <div className='col'>
                                        <TextField
                                            label='email'
                                            type='email'
                                            autoComplete='off'
                                            fullWidth
                                            disabled={true}
                                            variant='outlined'
                                            {...getFieldProps("email")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <div className="row">
                            <div className='col'>
                                <div className='user_edit_header'>
                                    <h4 className="app_text_14_semibold mb-0">id verification</h4>
                                </div>
                                <div className='d-flex row mt-4'>
                                    <div className='col'>
                                        <TextField
                                            label='home address'
                                            type='text'
                                            autoComplete='off'
                                            fullWidth
                                            variant='outlined'
                                            {...getFieldProps("home_address")}
                                            error={Boolean(touched.home_address && errors.home_address)}
                                            helperText={touched.home_address && errors.home_address}
                                        />
                                    </div>

                                </div>
                                <div className="d-flex mt-4">
                                    <TextField
                                        label="bio"
                                        varient="outlined"
                                        fullWidth
                                        autoComplete="off"
                                        {...getFieldProps("bio")}
                                        error={Boolean(touched.bio && errors.bio)}
                                        helperText={touched.bio && errors.bio}
                                    />
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <div className="row">
                            <div className='col'>
                                <div className='user_edit_header'>
                                    <h4 className="app_text_14_semibold mb-0">optional information</h4>
                                </div>
                                <div className='d-flex row mt-4'>
                                    <div className='col'>
                                        <Field
                                            customeName="secondaryNumber"
                                            name="secondaryNumber"
                                            label="secondary mobile number"
                                            errors={errors.secondaryNumber}
                                            component={PhoneInputs}
                                            data={businessUserData?.optionalMobile?.secondary ? businessUserData?.optionalMobile?.secondary : ""}
                                        />
                                    </div>
                                    <div className='col'>
                                        <Field
                                            customeName="alternativeNumber"
                                            name="alternativeNumber"
                                            label="alternative mobile number"
                                            errors={errors.alternativeNumber}
                                            component={PhoneInputs}
                                            data={businessUserData?.optionalMobile?.alternative ? businessUserData?.optionalMobile?.alternative : ""}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <div className="row">
                            <div className='col'>
                                <div className='user_edit_header'>
                                    <h4 className="app_text_14_semibold mb-0">message option</h4>
                                </div>
                                <div className='d-flex row mt-4'>
                                    <Box sx={{ display: 'flex', gap: 3 }}>
                                        <FormControlLabel label="delete"
                                            onChange={() => chatPermissionsChnage(3)} control={<Checkbox
                                                checked={chatPermissions ? chatPermissions?.includes(3) : false} />} />
                                        <FormControlLabel label="edit/update"
                                            onChange={() => chatPermissionsChnage(1)} control={<Checkbox
                                                checked={chatPermissions ? chatPermissions?.includes(1) : false} />} />
                                        <FormControlLabel label="forward"
                                            onChange={() => chatPermissionsChnage(2)} control={<Checkbox
                                                checked={chatPermissions ? chatPermissions?.includes(2) : false} />} />
                                    </Box>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <div className="col">
                            <div className="col-md-8 m-auto">
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    className="my-3 text-lowercase text-white app_bg_primary app_text_16_semibold app_btn_lg"
                                >
                                    update business
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </FormikProvider></>
    )
}

export default BusinessUpdate