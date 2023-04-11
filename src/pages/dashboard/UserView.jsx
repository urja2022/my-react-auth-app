import React, { useEffect, useState } from 'react'
import * as Yup from "yup";
import { Button, TextField, FormControl, Select, InputLabel, MenuItem, Card, CardContent, CardMedia, List, ListItem, Stack, Box } from '@mui/material';
import { Field, Form, FormikProvider, useFormik } from "formik";
import { useLocation } from 'react-router-dom';
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { USER_API_URL } from "src/api/axios";
import { useMutation, useQuery } from 'react-query';
import { INDIVIDUAL_API_URL } from "src/api/axios";
import { useSnackbar } from "notistack";
import PhoneInputs from './input/PhoneInputs';
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from 'src/routes/paths';
import moment from 'moment'

const UserView = () => {
    const axiosPrivate = useAxiosPrivate();
    const [userProfile, setUserProfile] = useState("");
    const [docImage, setDocImage] = useState("");
    const [trustLevelImage, setTrustLevelImage] = useState("1");
    const [trustLevelIdNumber, setTrustLevelIdNumber] = useState("1");
    const [trustLevelReference, setTrustLevelReference] = useState("1");
    const [trustLevelHomeAddress, setTrustLevelHomeAddress] = useState("1");
    const [multipleImages, setMultipleImages] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [selfieImageArray, setSelfieImageArray] = useState([]);

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { state } = useLocation();

    const { data: userData, refetch } = useQuery(
        "userLocation",
        async ({ signal }) => {
            return await axiosPrivate
                .get(USER_API_URL.userEdit, {
                    signal,
                    params: { userId: state?.User_id },
                })
                .then((res) => res.data[0]);
        },
        { refetchOnWindowFocus: false }
    );

    useEffect(() => {
        if (userData) {
            setSelfieImageArray(userData.selfieData);
            setFieldValue("name", userData?.fullName ? userData?.fullName : "");
            setFieldValue("user_name", userData?.userName ? userData?.userName : "");
            setFieldValue("email", userData?.email ? userData?.email : "");
            setFieldValue("mobile", userData?.mobile ? userData?.mobile : "");
            setFieldValue("home_address", userData?.address?.name ? userData?.address?.name : "");
            setFieldValue("bio", userData?.bio ? userData?.bio : "");
            setFieldValue("userTrace", userData?.userTrace ? userData?.userTrace : "");
            setFieldValue("frist_reference_name", userData?.referenceUser?.[0] ? userData?.referenceUser[0]?.fullName : "");
            setFieldValue("frist_reference_email", userData?.referenceUser?.[0] ? userData?.referenceUser[0]?.email : "");
            setFieldValue("frist_reference_mobile", userData?.referenceUser?.[0] ? userData?.referenceUser[0]?.mobile : "");
            setFieldValue("sec_reference_name", userData?.referenceUser?.[1] ? userData?.referenceUser[1]?.fullName : "");
            setFieldValue("sec_reference_email", userData?.referenceUser?.[1] ? userData?.referenceUser[1]?.email : "");
            setFieldValue("sec_reference_mobile", userData?.referenceUser?.[1] ? userData?.referenceUser[1]?.mobile : "");
            setFieldValue("third_reference_name", userData?.referenceUser?.[2] ? userData?.referenceUser[2]?.fullName : "");
            setFieldValue("third_reference_email", userData?.referenceUser?.[2] ? userData?.referenceUser[2]?.email : "");
            setFieldValue("third_reference_mobile", userData?.referenceUser?.[2] ? userData?.referenceUser[2]?.mobile : "");
            setFieldValue("secondaryNumber", userData?.optionalMobile?.secondary ? userData?.optionalMobile?.secondary : "");
            setFieldValue("alternativeNumber", userData?.optionalMobile?.alternative ? userData?.optionalMobile?.alternative : "");
            setTrustLevelImage(userData?.trustLevel?.image ? userData?.trustLevel?.image : "1");
            setTrustLevelIdNumber(userData?.trustLevel?.id ? userData?.trustLevel?.id : "1");
            setTrustLevelReference(userData?.trustLevel?.reference ? userData?.trustLevel?.reference : "1");
            setTrustLevelHomeAddress(userData?.trustLevel?.address ? userData?.trustLevel?.address : "1");
        }
    }, [userData])

    const completedSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, "user name can set of between 2 and 50 characters!")
            .max(50, "user name can set of between 2 and 50 characters!"),
        user_name: Yup.string()
            .min(2, "user name can set of between 2 and 50 characters!")
            .max(50, "user name can set of between 2 and 50 characters!"),
        email: Yup.string()
            .email("email must be a valid email address"),
        bio: Yup.string()
            .min(2, "user bio can set of between 2 and 1000 characters!")
            .max(1000, "user bio can set of between 2 and 1000 characters!"),
        home_address: Yup.string()
            .min(2, "home address can set of between 2 and 255 characters!")
            .max(255, "home address can set of between 2 and 255 characters!"),
        userTrace: Yup.string()
            .required("trace request Limit is required")
            .matches(/^\d+(?:\.\d+)?$/, "enter Only vaild number"),
    });
    const formik = useFormik({
        initialValues: {
            name: userData?.fullName ? userData?.fullName : "",
            user_name: userData?.userName ? userData?.userName : "",
            email: userData?.email ? userData?.email : "",
            mobile: userData?.mobile ? userData?.mobile : "",
            home_address: userData?.document?.homeAddress?.name ? userData?.document?.homeAddress?.name : "",
            bio: userData?.bio ? userData?.bio : "",
            frist_reference_name: userData?.referenceUser?.[0] ? userData?.referenceUser[0]?.fullName : "",
            frist_reference_email: userData?.referenceUser?.[0] ? userData?.referenceUser[0]?.email : "",
            frist_reference_mobile: userData?.reference?.[0] ? userData?.reference[0]?.mobile : "",
            sec_reference_name: userData?.referenceUser?.[1] ? userData?.referenceUser[1]?.fullName : "",
            sec_reference_email: userData?.referenceUser?.[1] ? userData?.referenceUser[1]?.email : "",
            sec_reference_mobile: userData?.referenceUser?.[1] ? userData?.referenceUser[1]?.mobile : "",
            third_reference_name: userData?.referenceUser?.[2] ? userData?.referenceUser[2]?.fullName : "",
            third_reference_email: userData?.referenceUser?.[2] ? userData?.referenceUser[2]?.email : "",
            third_reference_mobile: userData?.referenceUser?.[2] ? userData?.referenceUser[2]?.mobile : "",
            secondaryNumber: userData?.optionalMobile?.secondary ? userData?.optionalMobile?.secondary : "",
            alternativeNumber: userData?.optionalMobile?.alternative ? userData?.optionalMobile?.alternative : "",
            userTrace: userData?.userTrace ? userData?.userTrace : ""
        },
        validationSchema: completedSchema,
        onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
            const informationObj = {
                user_id: userData?._id,
                bio: values.bio,
                fullName: values.name,
                secondaryNumber: values.secondaryNumber ? values.secondaryNumber.includes("+") ? values.secondaryNumber : "+" + values.secondaryNumber : "",
                alternativeNumber: values.alternativeNumber ? values.alternativeNumber.includes("+") ? values.alternativeNumber : "+" + values.alternativeNumber : "",
                homeAddress: {
                    name: values.home_address,
                    longitude: userData?.document?.homeAddress?.location?.coordinates?.[0] ?? 1,
                    latitude: userData?.document?.homeAddress?.location?.coordinates?.[1] ?? 1
                },
                userTrace: values.userTrace
            };
            if (docImage != "") {
                informationObj.image = docImage
            }
            if (userProfile != "") {
                informationObj.profilePic = userProfile
            }
            await userUpdate(informationObj);
            setSubmitting(false);
        },
    });

    const { mutateAsync: userUpdate } = useMutation(
        async (data) => {
            return await axiosPrivate.patch(USER_API_URL.userUpdate, JSON.stringify(data))
        },
        {
            onSuccess: ({ data }) => {
                enqueueSnackbar("User Update successfully", {
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
                    if (key === "secondaryNumber") {
                        setFieldError("secondaryNumber", errorData[key]);
                    } else if (key === "alternativeNumber") {
                        setFieldError("alternativeNumber", errorData[key]);
                    } else if (key === "userTrace") {
                        setFieldError("userTrace", errorData[key]);
                    } else {
                        setFieldError(key, errorData[key]);
                    }
                });
            },
        }
    );

    // async function updateIdMarkRequest(id) {
    //     const response = await axiosPrivate.put(USER_API_URL.updateIsMark, { userId: id })
    //     if (response.status == 200) {
    //         enqueueSnackbar("status change successfully ", {
    //             variant: "success",
    //             anchorOrigin: { vertical: "top", horizontal: "right" },
    //             autoHideDuration: 2000,
    //         });
    //     } else {
    //         enqueueSnackbar("something went wrong", {
    //             variant: "error",
    //             anchorOrigin: { vertical: "top", horizontal: "right" },
    //             autoHideDuration: 2000,
    //         });
    //     }
    //     refetch();
    // }

    const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;

    const EndorsedStatusBtn = ({ endorsedStatus }) => {
        switch (endorsedStatus) {
            case 1:
                return <Button className='app_text_transform app_text_12_semibold text-white mb-3' style={{ background: "#FFCB45", minWidth: "100%" }} variant="contained">pending</Button>;
            case 2:
                return <Button className='app_text_transform app_text_12_semibold text-white mb-3' style={{ background: "#00CF73", minWidth: "100%" }} variant="contained">endorsed</Button>;
            case 3:
                return <Button className='app_text_transform app_text_12_semibold text-white mb-3' style={{ background: "#FF5367", minWidth: "100%" }} variant="contained">rejected</Button>;
            default:
                return <Button className='app_text_transform app_text_12_semibold text-white mb-3' style={{ background: "#FF0000", minWidth: "100%" }} variant="contained">no reference</Button>;
        }
    }

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <div className="container-fluid">
                    <div className="row">
                        <div className='col'>
                            <div className='user_edit_header'>
                                <h4 className="app_text_14_semibold mb-0">general information</h4>
                            </div>
                            <Box className='mt-4'>
                                <Box className='row'>
                                    <Box className='col-md-12'>
                                        <Box className="mt-4">
                                            <div className='user_edit_header'>
                                                <h4 className="app_text_14_semibold mb-0">profile</h4>
                                            </div>
                                            <Box className="img_preview_circle mt-3">
                                                <img src={userProfile == "" ? process.env.REACT_APP_PROFILE_URL + userData?.image?.profilePic : process.env.REACT_APP_PROFILE_URL + userProfile} alt="profile" />
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box className='col-md-12'>
                                        <Box className="mt-4">
                                            <div className='user_edit_header'>
                                                <h4 className="app_text_14_semibold mb-0">banner</h4>
                                            </div>
                                            <Box className="img_preview_circle mt-3">
                                                <img src={process.env.REACT_APP_PROFILE_URL + userData?.image?.bannerImage} alt="profile" />
                                            </Box>
                                        </Box>
                                    </Box>
                                    {
                                        userData?.image?.photos !== undefined ? <>
                                            <Box className='col-md-12'>
                                                <Box className="mt-4">
                                                    <div className='user_edit_header'>
                                                        <h4 className="app_text_14_semibold mb-0">photos</h4>
                                                    </div>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                                                        {userData?.image?.photos?.map((result, i) => {
                                                            return (
                                                                <>
                                                                    <Box className="img_preview_circle mt-3" key={i}>
                                                                        <img src={userProfile == "" ? process.env.REACT_APP_PROFILE_URL + result : process.env.REACT_APP_PROFILE_URL + userProfile} alt="profile" />
                                                                    </Box>
                                                                </>
                                                            )
                                                        })}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </> : ''
                                    }
                                </Box>
                            </Box>

                            <div className="d-flex mt-4">
                                <TextField
                                    label="name"
                                    varient="outlined"
                                    fullWidth
                                    disabled={true}
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
                                        data={userData?.mobile ? userData?.mobile : ""}
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
                            <div className='d-flex row mt-4'>
                                <div className='col'>
                                    <TextField
                                        label='username'
                                        type='text'
                                        autoComplete='off'
                                        fullWidth
                                        disabled={true}
                                        variant='outlined'
                                        {...getFieldProps("user_name")}
                                        error={Boolean(touched.user_name && errors.user_name)}
                                        helperText={touched.user_name && errors.user_name}
                                    />
                                </div>
                            </div>
                            <div className="d-flex mt-4">
                                <TextField
                                    label="bio"
                                    varient="outlined"
                                    fullWidth
                                    disabled={true}
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
                                <h4 className="app_text_14_semibold mb-0">id verification</h4>
                            </div>
                            <Card sx={{ display: 'flex', px: 2, py: 1, mt: 5, width: 'fit-content' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 200, objectFit: 'cover', borderRadius: 4, objectPosition: 'center', boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;' }}
                                    image={process.env.REACT_APP_USER_DOC_URL + userData?.document?.image}
                                    // image="https://mymodernmet.com/wp/wp-content/uploads/2021/04/Nature-Sounds-For-Well-Being-03.jpg"
                                    alt="document img"
                                />
                                <CardContent sx={{ flex: '1 0 auto', pt: 0 }}>
                                    <List disablePadding>
                                        <ListItem>
                                            <Stack spacing={1}>
                                                <Stack direction={"row"} spacing={4}>
                                                    <span className='app_text_14' style={{ width: "110px" }}>date of birth</span>
                                                    <span className='app_text_14 app_text_gray'>{moment(userData?.document?.dateOfBirth).format("MMM DD YYYY h:mm A")}</span>
                                                </Stack>
                                                <Stack direction={"row"} spacing={4}>
                                                    <span className='app_text_14' style={{ width: "110px" }}>gender</span>
                                                    <span className='app_text_14 app_text_gray'>{userData?.document?.gender == 1 ? "male" : "female"}</span>
                                                </Stack>
                                                <Stack direction={"row"} spacing={4}>
                                                    <span className='app_text_14' style={{ width: "110px" }}>id number</span>
                                                    <span className='app_text_14 app_text_gray'>{userData?.document?.idNumber ?? '-'}</span>
                                                </Stack>
                                                <Stack direction={"row"} spacing={4}>
                                                    <span className='app_text_14' style={{ width: "110px" }}>country</span>
                                                    <span className='app_text_14 app_text_gray'>{userData?.document?.country ?? '-'}</span>
                                                </Stack>
                                                <Stack direction={"row"} spacing={4}>
                                                    <span className='app_text_14' style={{ width: "110px" }}>document name</span>
                                                    <span className='app_text_14 app_text_gray'>{userData?.document?.docName ?? '-'}</span>
                                                </Stack>
                                            </Stack>
                                        </ListItem>
                                    </List>
                                </CardContent>

                            </Card>

                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <Box className='col-md-12'>
                            <Box className="mt-4">
                                {selfieImageArray.length > 0 ?
                                    <div className='user_edit_header'>
                                        <h4 className="app_text_14_semibold mb-0">selfie verification</h4>
                                    </div> : ''}
                                <Box className='row'>
                                    {(showMore ? selfieImageArray : selfieImageArray.slice(0, 5)).map((imageName, i) => {
                                        return (
                                            <>
                                                <Box className='col-md-2'>
                                                    <Box className="img_preview_circle mt-3" key={i}>
                                                        <img src={process.env.REACT_APP_PROFILE_URL + imageName} alt="selfie img" />
                                                    </Box>
                                                </Box>
                                            </>
                                        )
                                    })}
                                    {
                                        selfieImageArray && selfieImageArray.length > 5 &&
                                        <Box className='col-md-2' sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Button className="app_bg_primary_light app_text_primary app_text_14_semibold mt-3" onClick={() => setShowMore(!showMore)} sx={{ width: "100%", textTransform: "lowercase", borderRadius: "8px", padding: "12px 16px" }}>
                                                {showMore ? 'view less' : 'view more'}
                                            </Button>
                                        </Box>
                                    }
                                </Box>
                            </Box>
                        </Box>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className='col'>
                            <div className='user_edit_header'>
                                <h4 className="app_text_14_semibold mb-0">home address</h4>
                            </div>
                            <div className="d-flex mt-4">
                                <TextField
                                    label='home address'
                                    type='text'
                                    autoComplete='off'
                                    fullWidth
                                    disabled={true}
                                    variant='outlined'
                                    {...getFieldProps("home_address")}
                                    error={Boolean(touched.home_address && errors.home_address)}
                                    helperText={touched.home_address && errors.home_address}
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
                                        disabled={true}
                                        component={PhoneInputs}
                                        data={userData?.optionalMobile?.secondary ? userData?.optionalMobile?.secondary : ""}
                                    />
                                </div>
                                <div className='col'>
                                    <Field
                                        customeName="alternativeNumber"
                                        name="alternativeNumber"
                                        label="alternative mobile number"
                                        errors={errors.alternativeNumber}
                                        component={PhoneInputs}
                                        disabled={true}
                                        data={userData?.optionalMobile?.alternative ? userData?.optionalMobile?.alternative : ""}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className="row">

                        <div className='user_edit_header'>
                            <h4 className="app_text_14_semibold mb-0">add references</h4>
                        </div>
                        <div className='d-flex col-md-4 flex-column mt-4'>
                            <EndorsedStatusBtn endorsedStatus={userData?.reference[0] ? userData?.reference[0]?.isEndorsed : 4} />
                            <div className='mb-4'>
                                <TextField
                                    label="1 references name"
                                    varient="outlined"
                                    fullWidth
                                    disabled
                                    autoComplete="off"
                                    {...getFieldProps("frist_reference_name")}
                                />
                            </div>
                            <div className='mb-4'>
                                <Field
                                    customeName="frist_reference_mobile"
                                    name="frist_reference_mobile"
                                    label="1 references mobile no."
                                    component={PhoneInputs}
                                    disabled={true}

                                    data={userData?.referenceUser?.[0] ? userData?.referenceUser[0]?.mobile : ""}
                                />
                            </div>
                            <div className='mb-4'>
                                <TextField
                                    label='1 references email'
                                    type='email'
                                    autoComplete='off'
                                    fullWidth
                                    disabled
                                    variant='outlined'
                                    {...getFieldProps("frist_reference_email")}
                                />
                            </div>
                        </div>
                        <div className='d-flex col-md-4 flex-column mt-4'>
                            <EndorsedStatusBtn endorsedStatus={userData?.reference[1] ? userData?.reference[1]?.isEndorsed : 4} />
                            <div className='mb-4'>
                                <TextField
                                    label="2 references name"
                                    varient="outlined"
                                    fullWidth
                                    disabled
                                    autoComplete="off"
                                    {...getFieldProps("sec_reference_name")}
                                />
                            </div>
                            <div className='mb-4'>
                                <Field
                                    customeName="sec_reference_mobile"
                                    name="sec_reference_mobile"
                                    label="2 references mobile no."
                                    component={PhoneInputs}
                                    disabled={true}
                                    data={userData?.referenceUser?.[1] ? userData?.referenceUser[1]?.mobile : ""}
                                />
                            </div>
                            <div className='mb-4'>
                                <TextField
                                    label='2 references email'
                                    type='email'
                                    autoComplete='off'
                                    fullWidth
                                    disabled
                                    variant='outlined'
                                    {...getFieldProps("sec_reference_email")}
                                />
                            </div>
                        </div>
                        <div className='d-flex col-md-4 flex-column mt-4'>
                            <EndorsedStatusBtn endorsedStatus={userData?.reference[2] ? userData?.reference[2]?.isEndorsed : 4} />
                            <div className='mb-4'>
                                <TextField
                                    label="3 references name"
                                    varient="outlined"
                                    fullWidth
                                    disabled
                                    autoComplete="off"
                                    {...getFieldProps("third_reference_name")}
                                />
                            </div>
                            <div className='mb-4'>
                                <Field
                                    customeName="third_reference_mobile"
                                    name="third_reference_mobile"
                                    label="3 references mobile no."
                                    component={PhoneInputs}
                                    disabled={true}
                                    data={userData?.referenceUser?.[2] ? userData?.referenceUser[2]?.mobile : ""}
                                />
                            </div>
                            <div className='mb-4'>
                                <TextField
                                    label='3 references email'
                                    type='email'
                                    autoComplete='off'
                                    fullWidth
                                    disabled
                                    variant='outlined'
                                    {...getFieldProps("third_reference_email")}
                                />
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className='col'>
                            <div className='user_edit_header'>
                                <h4 className="app_text_14_semibold mb-0"> trace request limit</h4>
                            </div>
                            <div className='d-flex row mt-4'>
                                <div className='col'>
                                    <TextField
                                        label='trace request limit'
                                        type='text'
                                        autoComplete='off'
                                        fullWidth
                                        variant='outlined'
                                        {...getFieldProps("userTrace")}
                                        error={Boolean(touched.userTrace && errors.userTrace)}
                                        helperText={touched.userTrace && errors.userTrace}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className='row'>
                        <div className="col-lg-3">
                            <div className="form-group mb-4">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">image</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Image"
                                        disabled
                                        value={trustLevelImage}
                                        onChange={(e) => setTrustLevelImage(e.target.value)}
                                    >
                                        <MenuItem value="1"> pending</MenuItem>
                                        <MenuItem value="2"> invalid</MenuItem>
                                        <MenuItem value="3"> accept</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="form-group mb-4">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">id number</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Id Number"
                                        disabled
                                        value={trustLevelIdNumber}
                                        onChange={(e) => setTrustLevelIdNumber(e.target.value)}
                                    >
                                        <MenuItem value="1"> pending</MenuItem>
                                        <MenuItem value="2"> invalid</MenuItem>
                                        <MenuItem value="3"> accept</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="form-group mb-4">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">reference</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Reference"
                                        disabled
                                        value={trustLevelReference}
                                        onChange={(e) => setTrustLevelReference(e.target.value)}
                                    >
                                        <MenuItem value="1"> pending</MenuItem>
                                        <MenuItem value="2"> invalid</MenuItem>
                                        <MenuItem value="3"> accept</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="form-group mb-4">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">home address</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Home Address"
                                        disabled
                                        value={trustLevelHomeAddress}
                                        onChange={(e) => setTrustLevelHomeAddress(e.target.value)}
                                    >
                                        <MenuItem value="1"> pending</MenuItem>
                                        <MenuItem value="2"> invalid</MenuItem>
                                        <MenuItem value="3"> accept</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>

                </div>
            </Form>
        </FormikProvider>
    )
}

export default UserView