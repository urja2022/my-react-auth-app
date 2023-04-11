import React, { useEffect, useState } from 'react'
import * as Yup from "yup";
import { Button, TextField } from '@mui/material';
import { Field, Form, FormikProvider, useFormik } from "formik";
import { useLocation } from 'react-router-dom';
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { BUSINESS_API_URL } from "src/api/axios";
import { useMutation } from 'react-query';
import { useSnackbar } from "notistack";
import PhoneInputs from './input/PhoneInputs';
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from 'src/routes/paths';
import { Autocomplete, LoadScript } from "@react-google-maps/api";

const BusinessAddressAdd = () => {
    const googleMapKey = process.env.REACT_APP_GOOGLE_MAP_LEY;
    const [libraries] = useState(["places"]);
    const [UserId, setUserId] = useState("");
    const [BusinessId, setBusinessId] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { state } = useLocation();
    const [autoComplete, setAutoComplete] = useState();
    const [addressMapData, setAddressMapData] = useState("");
    const [location, setLocation] = useState({});
    const [lattitudeData, setLattitudeData] = useState();
    const [longitudeData, setLongitudeData] = useState();

    useEffect(() => {
        setUserId(state?.data?.userId)
        setBusinessId(state?.data?.businessId)
    }, [state])

    const completedSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, "business name can set of between 2 and 50 characters!")
            .max(50, "business name can set of between 2 and 50 characters!")
            .required("business name is required"),
        description: Yup.string()
            .min(2, "user description can set of between 2 and 255 characters!")
            .max(255, "user description can set of between 2 and 255 characters!")
            .required("user description is required"),
        physicalAddress: Yup.string()
            .min(2, "physical address can set of between 2 and 255 characters!")
            .max(255, "physical address can set of between 2 and 255 characters!")
            .required("physical address is required"),
        businessLocationName: Yup.string()
            .min(2, "business location name can set of between 2 and 255 characters!")
            .max(255, "business location name can set of between 2 and 255 characters!")
            .required("business location name is required"),
        email: Yup.string()
            .email("email must be a valid email address")
            .required("email is required"),
        mobile: Yup.string()
            .min(11, "enter valid mobile number")
            .max(14, "enter valid mobile number")
            .required("mobile is required"),
    });
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            physicalAddress: "",
            businessLocationName: "",
            email: "",
            mobile: ""
        },
        validationSchema: completedSchema,
        onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
            const informationObj = {
                businessId: BusinessId,
                userId: UserId,
                description: values.description,
                businessName: values.name,
                physicalAddress: values.physicalAddress,
                longitude: longitudeData,
                latitude: lattitudeData,
                email: values.email,
                mobile: "+" + values.mobile,
                businessLocationName: values.businessLocationName
            };

            await addAddress(informationObj);
            setSubmitting(false);
        },
    });

    const { mutateAsync: addAddress } = useMutation(
        async (data) => {
            return await axiosPrivate.post(BUSINESS_API_URL.addBusinessAddress, JSON.stringify(data))
        },
        {
            onSuccess: ({ data }) => {
                enqueueSnackbar("business address add successfully", {
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

                    if (key === "businessName") {
                        setFieldError("name", errorData[key]);
                    } else if (key === "businessLocationName") {
                        setFieldError("businessLocationName", errorData[key]);
                    } else if (key === "physicalAddress") {
                        setFieldError("physicalAddress", errorData[key]);
                    } else if (key === "description") {
                        setFieldError("description", errorData[key]);
                    } else if (key === "email") {
                        setFieldError("email", errorData[key]);
                    } else if (key === "mobile") {
                        setFieldError("mobile", errorData[key]);
                    } else {
                        setFieldError(key, errorData[key]);
                    }
                });
            },
        }
    );

    const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;
    const onAutoCompleteIsLoad = (inputAutoComplete) => {
        setAutoComplete(inputAutoComplete);
    };
    const handleChange = (event) => {
        setAddressMapData(event.target.value);
    };
    const onAutoCompletePlaceIsChanged = () => {
        if (autoComplete !== null) {
            var place = autoComplete.getPlace();
            location.lat = place.geometry.location.lat();
            location.lng = place.geometry.location.lng();
            location.address = place.vicinity;
            setFieldValue('physicalAddress', place.vicinity)
            setAddressMapData(place.vicinity);
            setLongitudeData(location.lng);
            setLattitudeData(location.lat);
        }
    };

    return (
        <>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className='col'>
                                <div className='user_edit_header'>
                                    <h4 className="app_text_14_semibold mb-0">add business address</h4>
                                </div>

                                <div className="d-flex mt-4">
                                    <TextField
                                        label="business name"
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
                                            errors={errors.mobile}
                                            component={PhoneInputs}
                                            data={""}
                                        />
                                    </div>
                                    <div className='col'>
                                        <TextField
                                            label='email'
                                            type='email'
                                            autoComplete='off'
                                            fullWidth
                                            variant='outlined'
                                            {...getFieldProps("email")}
                                            error={Boolean(touched.email && errors.email)}
                                            helperText={touched.email && errors.email}
                                        />
                                    </div>
                                </div>
                                <div className='d-flex row mt-4'>
                                    <div className='col'>
                                        <TextField
                                            label='location name'
                                            type='text'
                                            autoComplete='off'
                                            fullWidth
                                            variant='outlined'
                                            {...getFieldProps("businessLocationName")}
                                            error={Boolean(touched.businessLocationName && errors.businessLocationName)}
                                            helperText={touched.businessLocationName && errors.businessLocationName}
                                        />
                                    </div>

                                </div>
                                <div className="d-flex mt-4">
                                    <TextField
                                        label="description"
                                        varient="outlined"
                                        fullWidth
                                        autoComplete="off"
                                        {...getFieldProps("description")}
                                        error={Boolean(touched.description && errors.description)}
                                        helperText={touched.description && errors.description}
                                    />
                                </div>
                                <div className="d-flex mt-4 w-100">
                                    <LoadScript googleMapsApiKey={googleMapKey} libraries={libraries}>
                                        <Autocomplete
                                            className='w-100'
                                            onLoad={onAutoCompleteIsLoad}
                                            onPlaceChanged={onAutoCompletePlaceIsChanged}
                                        >
                                            <TextField
                                                fullWidth
                                                defaultValue={addressMapData}
                                                onChange={handleChange}
                                                variant="outlined"
                                                label="physical address"
                                                {...getFieldProps("physicalAddress")}
                                                error={Boolean(touched.physicalAddress && errors.physicalAddress)}
                                                helperText={touched.physicalAddress && errors.physicalAddress}
                                            />
                                        </Autocomplete>
                                    </LoadScript>
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
                                    add business address
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </FormikProvider></>
    )
}

export default BusinessAddressAdd