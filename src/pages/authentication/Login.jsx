import React, { useState } from 'react'
import * as Yup from 'yup';
import IconButton from '@mui/material/IconButton';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import AuthBoxHeader from '../../components/authentication/AuthBoxHeader'
import { Button } from '@mui/material';
import AuthLayout from 'src/layouts/AuthLayout';
import { Form, FormikProvider, useFormik } from 'formik';
import authStores from '../../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { PATH_AUTH } from "src/routes/paths";

const Login = () => {
  const authStore = authStores();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [passwordInput, setPasswordInput] = useState({
    password: '',
    showPassword: false,
  });

  // Password Input Functionality
  const handleChange = (prop) => (event) => {
    setPasswordInput({ ...passwordInput, [prop]: event.target.value });
  };
  const handleClickShowPassword = () => {
    setPasswordInput({
      ...passwordInput,
      showPassword: !passwordInput.showPassword,
    });
  };

  const LoginByMailSchema = Yup.object().shape({
    email: Yup.string().email('email must be a valid email address').required('email is required'),
    password: Yup.string().required('password is required')
  });

  const formik = useFormik({
    initialValues: {
      phone: "",
      email: "",
      password: "",
      remember: true,
    },
    validationSchema: LoginByMailSchema,
    onSubmit: async (values, { resetForm }) => {
      const loginObj = {
        email: values.email,
        password: values.password,
        device: 3,
        pushToken: "test",
      };
      const [success, error] = await authStore.login(loginObj);
      const userData = {
        userId: { 2: values.email },
        userName: values.email,
        verify: "signUp"
      };
      if (success) {
        if (success.isVerify === 0) {
          navigate(PATH_AUTH.verification, { state: { userData } });
          enqueueSnackbar("user is not verify", {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: 2000,
          });
        } else {
          resetForm();
          enqueueSnackbar("login successfully.", {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: 2000,
          });
          navigate('/dashboard/');
        }
      } else {
        enqueueSnackbar(error, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;
  return (
    <>
      <AuthLayout>
        <FormikProvider value={formik}>
          <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
            <div className='auth_box'>
              <AuthBoxHeader title={"Welcome,"} instruction={"log in to continue!"} />
              <TextField
                id='inputEmail'
                label='email'
                type='email'
                autoComplete='off'
                fullWidth
                variant='outlined'
                margin='normal'
                {...getFieldProps("email")}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                id='outlined-adornment-password'
                fullWidth
                autoComplete='current-password'
                type={passwordInput.showPassword ? "text" : "password"}
                label='password'
                margin='normal'
                value={passwordInput.password}
                onChange={handleChange("password")}
                {...getFieldProps("password")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        sx={{ "&:hover": { bgcolor: "transparent" } }}
                        disableRipple
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        edge='end'>
                        {!passwordInput.showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                className='mt-5 text-lowercase text-white app_bg_primary app_text_16_semibold app_btn_lg'>
                log in
              </Button>
            </div>
          </Form>
        </FormikProvider>
      </AuthLayout>
    </>
  );
}

export default Login