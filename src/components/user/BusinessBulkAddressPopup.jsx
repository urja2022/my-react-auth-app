import React from "react";
import { Box } from "@material-ui/core";
import { Button, Modal } from "@mui/material";
import * as Yup from "yup";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Field,
  Form,
  FieldArray,
  FormikProvider,
  useFormik,
} from "formik";
import PhoneInputs from 'src/pages/dashboard/input/PhoneInputs';
import _ from "lodash";
import DeleteIcon from "@mui/icons-material/Delete";
import AppTooltip from "../common/AppTooltip";
import { FormHelperText, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { BUSINESS_API_URL } from "src/api/axios";
import { useSnackbar } from "notistack";

//TODO::Filed Warning Solve to @nikunj
const BusinessBulkAddressPopup = (props) => {
  const { onClose, open, addressData, businessId, userId } = props;
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const handleClose = () => {
    onClose();
  };

  const addressSchema = Yup.object().shape({
    addressDetails: Yup.array().of(
      Yup.object().shape({
        email: Yup.string()
          .email("email must be a valid email address")
          .required("email is required"),
        mobile: Yup.string().matches(
          /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{2,50})?$/,
          "invalid mobile number!."
        ).min(10, "invalid Mobile Number!").required("mobile number is required"),
        businessName: Yup.mixed().required("businessName is required"),
        businessLocationName: Yup.mixed().required(
          "busibess locationname is required"
        ),
        physicalAddress: Yup.mixed().required("physical address is required"),
        description: Yup.mixed().required("description is required"),
        longitude: Yup.string()
          .matches(
            /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{2,50})?$/,
            "not valid."
          )
          .required("longitude is required"),
        latitude: Yup.string()
          .matches(
            /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{2,50})?$/,
            "not valid."
          )
          .required("latitude is required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      addressDetails: addressData,
    },
    validationSchema: addressSchema,
    onSubmit: async (values) => {
      await new Promise((r) => setTimeout(r, 500));
      values.addressDetails.map((val) => {
        return val.mobile = val.mobile.includes("+") ? val.mobile : "+" + val.mobile
      })
      const obj = {
        addressDetails: values.addressDetails,
        businessId: businessId,
        userId: userId
      }
      await mutateAsync(obj);
    },
  });

  const { mutateAsync } = useMutation(
    async (data) => {
      return await axiosPrivate.post(
        BUSINESS_API_URL.businessBulkAddress,
        JSON.stringify(data)
      );
    },
    {
      onSuccess: ({ data }) => {
        onClose();
        enqueueSnackbar("bulk address add successfully", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        queryClient.invalidateQueries(["businessAddressList"]);
      },
      onError: (error) => {
        const errorData = error.response.data.errors;
        Object.keys(errorData).forEach((key) => {
          setFieldError(key, errorData[key]);
        });
      },
    }
  );

  const {
    errors,
    touched,
    handleSubmit,
    setFieldError,
    values,
  } = formik;

  return (
    <>
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box className="modal_card modal_lg">
          <div className="modal_card_header">
            <div className="left_part">
              <h4>add bulk address</h4>
            </div>
            <div className="right_part">
              <Button className="dashboard_light_bg_icon_btn" onClick={handleClose} aria-label="delete">
                <CloseIcon />
              </Button>
            </div>
          </div>
          <div className="modal_card_body custom_scrollbar max_hight500">
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <FieldArray name="addressDetails">
                  {({ remove }) => (
                    <div>
                      {values.addressDetails.length > 0 &&
                        values.addressDetails.map((friend, index) => (
                          <div key={index}>
                            <br></br>
                            <span className="app_text_grey">
                              address {index + 1}
                            </span>
                            <AppTooltip
                              title={"delete address"}
                              placement={"bottom"}
                            >
                              <IconButton
                                aria-label="delete"
                                sx={{ color: "red" }}
                                onClick={() => remove(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </AppTooltip>
                            <div className="row row-cols-1 g-4">
                              <div className="col">
                                <Field
                                  customeName={`addressDetails.${index}.mobile`}
                                  name={`addressDetails.${index}.mobile`}
                                  label="enter your mobile number"
                                  component={PhoneInputs}
                                  error={Boolean(_.get(touched, `addressDetails.${index}.mobile`, false) &&
                                    _.get(errors, `addressDetails.${index}.mobile`, false)
                                  )}
                                  helperText={
                                    _.get(touched, `addressDetails.${index}.mobile`, false) &&
                                    _.get(errors, `addressDetails.${index}.mobile`, false)
                                  }
                                  data={addressData[index].mobile && Number(addressData[index].mobile) ? "+" + addressData[index].mobile : null}
                                />
                                <FormHelperText error>
                                  {_.get(touched,
                                    `addressDetails.${index}.mobile`,
                                    false
                                  ) &&
                                    _.get(
                                      errors,
                                      `addressDetails.${index}.mobile`,
                                      false
                                    )}
                                </FormHelperText>
                              </div>
                              <div className="col">
                                <div className="d-flex">
                                  <Field
                                    name={`addressDetails.${index}.businessName`}
                                    render={({ field, form }) => (
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="business name"
                                        {...field}
                                        error={Boolean(
                                          _.get(touched, field.name, false) &&
                                          _.get(errors, field.name, false)
                                        )}
                                        helperText={
                                          _.get(touched, field.name, false) &&
                                          _.get(errors, field.name, false)
                                        }
                                      />
                                    )}
                                  />
                                  <Field
                                    name={`addressDetails.${index}.email`}
                                    render={({ field, form }) => (
                                      <TextField
                                        fullWidth
                                        label="email"
                                        className="ms-2"
                                        variant="outlined"
                                        {...field}
                                        error={Boolean(
                                          _.get(touched, field.name, false) &&
                                          _.get(errors, field.name, false)
                                        )}
                                        helperText={
                                          _.get(touched, field.name, false) &&
                                          _.get(errors, field.name, false)
                                        }
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <Field
                                  name={`addressDetails.${index}.businessLocationName`}
                                  render={({ field, form }) => (
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      label="business address"
                                      {...field}
                                      error={Boolean(
                                        _.get(touched, field.name, false) &&
                                        _.get(errors, field.name, false)
                                      )}
                                      helperText={
                                        _.get(touched, field.name, false) &&
                                        _.get(errors, field.name, false)
                                      }
                                    />
                                  )}
                                />
                              </div>
                              <div className="col">
                                <Field
                                  name={`addressDetails.${index}.physicalAddress`}
                                  render={({ field, form }) => (
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      label="physical address"
                                      {...field}
                                      error={Boolean(
                                        _.get(touched, field.name, false) &&
                                        _.get(errors, field.name, false)
                                      )}
                                      helperText={
                                        _.get(touched, field.name, false) &&
                                        _.get(errors, field.name, false)
                                      }
                                    />
                                  )}
                                />
                              </div>
                              <div className="col">
                                <div className="d-flex">
                                  <Field
                                    name={`addressDetails.${index}.longitude`}
                                    render={({ field, form }) => (
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="longitude"
                                        {...field}
                                        error={Boolean(
                                          _.get(touched, field.name, false) &&
                                          _.get(errors, field.name, false)
                                        )}
                                        helperText={
                                          _.get(touched, field.name, false) &&
                                          _.get(errors, field.name, false)
                                        }
                                      />
                                    )}
                                  />
                                  <Field
                                    name={`addressDetails.${index}.latitude`}
                                    render={({ field, form }) => (
                                      <TextField
                                        className="ms-2"
                                        fullWidth
                                        variant="outlined"
                                        label="latitude"
                                        {...field}
                                        error={Boolean(
                                          _.get(touched, field.name, false) &&
                                          _.get(errors, field.name, false)
                                        )}
                                        helperText={
                                          _.get(touched, field.name, false) &&
                                          _.get(errors, field.name, false)
                                        }
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <Field
                                  name={`addressDetails.${index}.description`}
                                  render={({ field, form }) => (
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      label="description"
                                      {...field}
                                      error={Boolean(
                                        _.get(touched, field.name, false) &&
                                        _.get(errors, field.name, false)
                                      )}
                                      helperText={
                                        _.get(touched, field.name, false) &&
                                        _.get(errors, field.name, false)
                                      }
                                    />
                                  )}
                                />
                              </div>

                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </FieldArray>
                <div className="col">
                  <div className="col-md-8 m-auto">
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      className="my-3 text-lowercase text-white app_bg_primary app_text_16_semibold app_btn_lg"
                    >
                      submit
                    </Button>
                  </div>
                </div>
              </Form>
            </FormikProvider>
          </div>
          <div className="modal_card_footer"></div>
        </Box>
      </Modal>
    </>
  );
};

BusinessBulkAddressPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default BusinessBulkAddressPopup;
