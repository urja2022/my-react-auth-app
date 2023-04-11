import { Button, TextField } from "@mui/material";
import * as Yup from "yup";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import AddImageIcon from "src/svgComponents/AddImageIcon";
import { useMutation, useQuery } from "react-query";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { BUSINESS_API_URL } from "src/api/axios";
import { useEffect } from "react";
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { PATH_DASHBOARD } from "src/routes/paths";
import { useNavigate } from "react-router";
import useStore from "src/contexts/AuthProvider";
import LocationPopup from "src/components/dashboard/LocationPopup";

const CreateBusiness = () => {
  const [phoneFocus1, setPhoneFocus1] = useState(false);
  const [phoneErrorText, setPhoneErrorText] = useState(null);
  const [phoneErrorAlternative, setPhoneErrorAlternative] = useState(null);
  const [phoneErrorSecondary, setPhoneErrorSecondary] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState();
  const [phoneSecondary, setPhoneSecondary] = useState();
  const [phoneAlternate, setPhoneAlternate] = useState();
  const [fileData, setFileData] = useState();
  const [businessLogo, setBusinessLogo] = useState();
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [lattitudeData, setLattitudeData] = useState("");
  const [longitudeData, setLongitudeData] = useState("");
  const businessID = useStore(state => state.businessId);
  const axiosPrivate = useAxiosPrivate();
  const [categoryData, setCategoryData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    axiosPrivate.get(BUSINESS_API_URL.categoryList).then((res) => {
      setCategoryData(res.data);
    });
  }, []);

  const handleBuisnessOptionsOnChange = (event) => {
    setSelectedBusiness(event.target.value);
  };

  const handleBusinessLogoOnChange = (ev) => {
    if (ev.type.includes("image")) {
      let userImgSrc = URL.createObjectURL(ev);
      setBusinessLogo(userImgSrc);
      const formData = new FormData();
      formData.append("image", ev);
      axiosPrivate
      .post(BUSINESS_API_URL.uploadFile, formData)
      .then((response) => {
        setFileData(response.data.image);
      })
      .catch((error) => {
        const errorData = error.response.data;
        Object.keys(errorData).forEach((key) => {
          setFieldError("logo", errorData[key]);
        });
      });
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
    name: Yup.string()
      .min(2, "Business Name can set of between 2 and 50 characters!")
      .max(50, "Business Name can set of between 2 and 50 characters!")
      .required("Business Name is required"),
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    bio: Yup.string()
      .max(50, "User Bio can set of between 2 and 50 characters!")
      .required("User Bio is required"),
    businessStatus: Yup.string().required("User Status is required"),
    address: Yup.string().required("Please Seleact a location"),
    logo: Yup.mixed().required("Business Logo is required"),
    categories: Yup.string().required("Categorie is required"),
  });
  //TODO:Change validation in category
  const formik = useFormik({
    initialValues: {
        name: "",
        email: "",
        bio: "",
        businessStatus: "",
        address: "",
        logo: "",
        categories:"",
        remember: true,
      },
      validationSchema: completedSchema,
      onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
        const informationObj = {
          categoryId:values.categories,
          name:values.name,
          image:fileData,
          mobile: "+" + phoneNumber,
          email:values.email,
          address:{
            name:values.address,
            longitude: longitudeData,
            latitude: lattitudeData,
          },
          bio:values.bio,
          businessStatus:values.businessStatus,
          secondary:phoneSecondary ? "+" + phoneSecondary : null,
          alternative:phoneAlternate ? "+" + phoneAlternate : null,
        }
        mutateAsync(informationObj);
        setSubmitting(false);  
      },
  });
  const { errors, touched, handleSubmit, setFieldError,setFieldValue, setFieldTouched, getFieldProps } = formik;

  const { mutateAsync } = useMutation(
    async (data) => {
      return await axiosPrivate.post(
        BUSINESS_API_URL.addBusiness,
        JSON.stringify(data)
      );
    },
    {
      onSuccess:(res) => {
        businessID(res.data._id);
        enqueueSnackbar("Business Profile Add Completed.", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        navigate(PATH_DASHBOARD.general.businessIdVerify);
      },
      onError: (error) => {
        const errorData = error.response.data.errors;
        Object.keys(errorData).forEach((key) => {
          if (key === "address.name") {
            setFieldError("address", "The Home Address is required");
          } else if(key === "mobile"){
            setPhoneErrorText(errorData[key])
          } else if(key === "alternative"){
            setPhoneErrorAlternative(errorData[key]);
          } else if(key === "secondary") {
            setPhoneErrorSecondary(errorData[key]); 
          } else if(key === "message") {
            enqueueSnackbar(errorData[key], {
              variant: "error",
              anchorOrigin: { vertical: "top", horizontal: "right" },
              autoHideDuration: 2000,
            });
          } else {
            setFieldError(key, errorData[key]);
          }
        });
      },
    }
  );

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
                <h4 className="app_text_18_semibold">Create Your Business</h4>
                <h4 className="app_text_16 app_text_gray">
                  Complete your profile
                </h4>
                <div className="row row-cols-1 g-4 mt-4">
                  <div className="col">
                    <div className="col-md-8">
                      <h4 className="app_text_14 app_text_black">
                        Business Logo
                      </h4>
                      {businessLogo ? (
                        <div className="d-flex align-items-end mb-2">
                          <div className="img_preview_circle">
                            <img src={businessLogo} alt="profile" />
                          </div>
                          <Button
                            className="ms-4 app_bg_primary"
                            variant="contained"
                            component="label"
                          >
                            Change Logo
                            <input
                              id="file"
                              name="logo"
                              hidden
                              accept="image/*"
                              onChange={(event) => {
                                const files = event.target.files[0];
                                handleBusinessLogoOnChange(files);
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
                              id="file"
                              name="logo"
                              hidden
                              accept="image/*"
                              onChange={(event) => {
                                const files = event.target.files[0];
                                handleBusinessLogoOnChange(files);
                                formik.setFieldValue("logo", files);
                              }}
                              type="file"
                            />
                          </Button>
                        </div>
                      )}
                      <FormHelperText error>
                        {touched.logo && errors.logo}
                      </FormHelperText>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <FormControl fullWidth>
                        <InputLabel id="businessCat">
                          Business Categories
                        </InputLabel>
                        <Select
                          labelId="businessCat"
                          name="categories"
                          value={selectedBusiness}
                          label="Business Categories"
                          onChange={(event) => {
                            handleBuisnessOptionsOnChange(event);
                            setFieldTouched("categories", true);
                            setFieldValue("categories", event.target.value);
                          }}
                        >
                          {categoryData.map((item) => (
                            <MenuItem key={item._id} value={item._id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText error>
                          {errors.categories}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <TextField
                        id="businessname"
                        label="Business Name"
                        varient="outlined"
                        fullWidth
                        {...getFieldProps("name")}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
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
                        {...getFieldProps("bio")}
                        error={Boolean(touched.bio && errors.bio)}
                        helperText={touched.bio && errors.bio}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8">
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="User Status"
                        {...getFieldProps("businessStatus")}
                        error={Boolean(
                          touched.businessStatus && errors.businessStatus
                        )}
                        helperText={
                          touched.businessStatus && errors.businessStatus
                        }
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
                      <FormHelperText error={phoneErrorSecondary ? true : false} >
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
                    <FormHelperText error={phoneErrorAlternative ? true : false} >
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
                        Create Business
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

export default CreateBusiness;
