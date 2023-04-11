import { Button, TextField } from '@material-ui/core'
import { Form, FormikProvider, useFormik } from 'formik'
import * as Yup from "yup";
import React from 'react'
import { useMutation } from 'react-query';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { useSnackbar } from 'notistack';
import { USER_API_URL } from 'src/api/axios';

const Notification = () => {
    const { enqueueSnackbar } = useSnackbar();
    const axiosPrivate = useAxiosPrivate();

    // send notificatoion 
    const { mutateAsync: notifyAllUser } = useMutation(
        async (data) => {
            return await axiosPrivate.post(USER_API_URL.sendBulkNotification, JSON.stringify(data))
        },
        {
            onSuccess: ({ data }) => {
                enqueueSnackbar("Notofocation send successfully", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                    autoHideDuration: 2000,
                });
            },
            onError: (error) => {
                const errorData = error.response.data.errors;
                if (errorData) {
                    Object.keys(errorData).forEach((key) => {
                        enqueueSnackbar(errorData[key], {
                            variant: "error",
                            anchorOrigin: { vertical: "top", horizontal: "right" },
                            autoHideDuration: 2000,
                        });
                    });
                } else {
                    enqueueSnackbar(error.response?.data?.message, {
                        variant: "error",
                        anchorOrigin: { vertical: "top", horizontal: "right" },
                        autoHideDuration: 2000,
                    });
                }
            },
        }
    );

    const completedSchema = Yup.object().shape({

        title: Yup.string()
            .required("title is required"),
        description: Yup.string()
            .required("description is required"),

    });
    const formik = useFormik({
        initialValues: {
            title: "",
            description: ""
        },
        validationSchema: completedSchema,
        onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
            const data = {
                title: values.title,
                description: values.description,
            }
            await notifyAllUser(values);
            resetForm();
            setSubmitting(false);


        },
    });


    const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;
    return (
        <div>   <div className="modal_card_body">
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <div className="row">
                        <div className='col-12'>
                            <div className='user_edit_header mb-4'>
                                <h4 className="app_text_14_semibold mb-0">send notification</h4>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="form-group mb-4">
                                <TextField
                                    label='title'
                                    autoComplete='off'
                                    fullWidth
                                    variant='outlined'
                                    {...getFieldProps("title")}
                                    error={Boolean(touched.title && errors.title)}
                                    helperText={touched.title && errors.title}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <TextField
                                    label='description'
                                    autoComplete='off'
                                    fullWidth
                                    variant='outlined'
                                    {...getFieldProps("description")}
                                    error={Boolean(touched.description && errors.description)}
                                    helperText={touched.description && errors.description}
                                />

                            </div>
                        </div>

                    </div>
                    <div className="col">
                        <div className="col-md-6 ">
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
        </div></div>
    )
}

export default Notification