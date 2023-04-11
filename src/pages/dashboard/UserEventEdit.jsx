import React, { useEffect, useState } from 'react'
import * as Yup from "yup";
import { Button, TextField, FormControl, Box, FormHelperText, MenuItem, InputLabel, Select } from '@mui/material';
import { Form, FormikProvider, useFormik } from "formik";
import { useLocation } from 'react-router-dom';
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { EVENT_API_URL, USER_API_URL, CONFIG_FIELD } from "src/api/axios";
import { useMutation, useQuery } from 'react-query';
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import moment from 'moment'
import CloseIcon from "@mui/icons-material/Close";
import AddImageIconPlaceHolder from "src/svgComponents/AddImageIconPlaceHolder";
import _ from "lodash";
import files from 'src/helpers/helpers';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from '@mui/lab';

const UserEventEdit = () => {
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const { state } = useLocation();
	const eventData = state?.eventData;
	const [imageArray, setImageArray] = useState([]);
	const [videoArray, setVideoArray] = useState([]);
	const [eventMediaFiles, setEventMediaFiles] = useState([]);
	const [eventStartDateTime, setEventStartDateTime] = useState(null);
	const [eventEndDateTime, setEventEndDateTime] = useState(null);
	const [imageFile, setImageFile] = useState([]);
	const [videoFile, setVideoFile] = useState([]);
	const currentDate = new Date();
	const [buttonLoading, setButtonLoding] = useState(false);
	const nextDate = currentDate.setDate(currentDate.getDate() + 1);

	useEffect(() => {
		if (state) {
			setImageArray(state.eventData.image)
			setVideoArray(state.eventData.video)
			setEventStartDateTime(state.eventData.eventDate)
			const evDateFormat = moment(state.eventData.eventDate).format('YYYY-MM-DD')
			const evDateTime = moment(evDateFormat + ' ' + state.eventData?.time)
			setEventEndDateTime(evDateTime);
		}
	}, [state])

	useEffect(() => {
		if (!_.isEmpty(state?.eventData?.eventDate && eventStartDateTime && eventEndDateTime)) {
			setFieldValue("startDate", moment(eventStartDateTime).format("YYYY-MM-DD"));
			setFieldValue("endDate", moment(eventEndDateTime).format("HH:mm:ss"));
		}
	}, [eventStartDateTime, eventEndDateTime]);

	const { data: configurableFieldData, refetch: configurableField } = useQuery(
		["configurablefields"],
		async ({ signal }) => {
			return await axiosPrivate
				.get(CONFIG_FIELD.getConfigFields, { signal })
				.then((res) => res.data);
		},
		{ refetchOnWindowFocus: false }
	);

	const { mutateAsync: videoImageUpload } = useMutation(async (formData) => {
		return await axiosPrivate
			.post(EVENT_API_URL.videoImageUpload, formData)
			.then((res) => res.data);
	});

	const handleRemoveFile = (id) => {
		setEventMediaFiles(
			eventMediaFiles.filter((ele) => {
				return ele.id !== id;
			})
		);
	};

	const handleRemoveFileUpdate = (name, type) => {
		if (type === 'image') {
			setImageArray(
				imageArray.filter((ele) => {
					return ele !== name;
				})
			)
		} else {
			setVideoArray(
				videoArray.filter((ele) => {
					return ele !== name;
				})
			)
		}
	};

	const Uid = () => {
		return "_" + Math.random().toString(36).substring(2, 9);
	};

	const handleEventMediaOnChange = (ev) => {
		const fileTypes = [...ev.target.files];
		if ((imageArray.length + videoArray.length + eventMediaFiles.length + fileTypes.length <= configurableFieldData?.personalEvent?.noOfAttachment) ?? 5) {
			fileTypes?.map((files) => {
				if (files?.type.includes("image") || files?.type.includes("video")) {
					let userSelectedfiles = [files];
					userSelectedfiles.map((file) => {
						file.id = Uid();
						return file;
					});
					setEventMediaFiles((prev) => [...prev, ...userSelectedfiles]);
					ev.target.value = "";
				} else {
					enqueueSnackbar("successfully", {
						variant: "error",
						anchorOrigin: { vertical: "top", horizontal: "right" },
						autoHideDuration: 2000,
					});
				}
			});
		} else {
			enqueueSnackbar("video and images must be at least " + configurableFieldData?.personalEvent?.noOfAttachment + " limit! ", {
				variant: "error",
				anchorOrigin: { vertical: "top", horizontal: "right" },
				autoHideDuration: 2000,
			});
		}
	};

	useEffect(() => {
		if (!_.isEmpty(eventMediaFiles)) {
			let imageArrays = [];
			let videoArrays = [];
			eventMediaFiles.map((file, index) => {
				if (file?.type.includes("image")) {
					imageArrays.push(file);
					setImageFile(imageArrays);
				} else if (file?.type.includes("video")) {
					videoArrays.push(file);
					setVideoFile(videoArrays);
				} else {
					setVideoFile([])
					setImageFile([])
				}
			});
		}
	}, [eventMediaFiles]);

	const completedSchema = Yup.object().shape({
		title: Yup.string().trim()
			.max(configurableFieldData?.personalEvent?.limitForTitle ?? 100, "title must be at least " + configurableFieldData?.personalEvent?.limitForTitle + " characters!")
			.required("title is required"),
		description: Yup.string()
			.trim()
			.max(configurableFieldData?.personalEvent?.limitForDiscription ?? 1000, "description must be at least " + configurableFieldData?.personalEvent?.limitForDiscription + " characters!")
			.required("description is required"),
		startDate: Yup.mixed().required("event date is required"),
		endDate: Yup.mixed().required("event time is required"),
		guest: Yup.number()
			.max(configurableFieldData?.personalEvent?.noOfGuest, "must be at least maximum " + configurableFieldData?.personalEvent?.noOfGuest + " guest")
			.required("total number of guest is required")
			.min(1, "total number of guest must be greater than 1"),
		duration: Yup.mixed().required("duration is required"),
	});
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			title: eventData?.title ?? "",
			description: eventData?.description ?? "",
			guest: eventData?.noOfGuest ?? "",
			startDate: "",
			endDate: "",
			duration: eventData?.duration ?? ""
		},
		validationSchema: completedSchema,
		onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
			let images = [];
			let videos = [];
			if (!_.isEmpty(imageFile) || !_.isEmpty(videoFile)) {
				const formData = new FormData();
				imageFile.map((image) => {
					formData.append("images", image);
				});
				videoFile.map((video) => {
					formData.append("videos", video);
				});
				try {
					const response = await videoImageUpload(formData);
					images = response?.images;
					videos = response?.video;
				} catch ({ response: { data } }) {
					enqueueSnackbar("please try again", {
						variant: "error",
						anchorOrigin: { vertical: "top", horizontal: "right" },
						autoHideDuration: 2000,
					});
				}
			}
			imageArray?.map((result, i) => {
				images?.push(result)
			})
			videoArray?.map((result, i) => {
				videos?.push(result)
			})
			const informationObj = {
				title: values.title,
				description: values.description,
				guest: values.guest,
				image: images,
				video: videos,
				eventDate: values.startDate,
				time: values.endDate,
				duration: values.duration,
				eventId: eventData._id
			};
			setButtonLoding(true)
			await eventUpdate(informationObj);
			setSubmitting(false);
		},
	});
	const { mutateAsync: eventUpdate } = useMutation(
		async (data) => {
			return await axiosPrivate.put(USER_API_URL.eventUpdate, JSON.stringify(data))
		},
		{
			onSuccess: ({ data }) => {
				enqueueSnackbar("event Update successfully", {
					variant: "success",
					anchorOrigin: { vertical: "top", horizontal: "right" },
					autoHideDuration: 2000,
				});
				setButtonLoding(false)
				navigate(-1);
			},
			onError: (error) => {
				setButtonLoding(false)
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
	const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps, values } = formik;
	const changeEventStartDateTime = (startData) => {
		setEventStartDateTime(startData);
		const start = new Date(startData);
		setFieldValue("startDate", moment(start).format("YYYY-MM-DD"));
	};
	const changeEventEndDateTime = (endData) => {
		setEventEndDateTime(endData);
		const end = new Date(endData);
		setFieldValue("endDate", moment(end).format("HH:mm:ss"));
	};
	return (
		<>
			<Box className="create_event_wrapper">
				<FormikProvider value={formik}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<Box className="container-fluid">
							<Box className="row">
								<Box className="col-md-12 col-lg-10 col-xl-10 col-xxl-8">
									<Box className="row row-cols-1 g-4 mt-1">
										<Box className="col">
											<Box className="col-xl-8">
												<Box className="d-flex align-items-center justify-content-between mb-3">
													<h4 className="app_text_14 app_text_black app_text_transform">
														event image/video
													</h4>
												</Box>
												<Box className="" style={{ width: "100%" }}>
													<Box className="row g-2">
														{imageArray?.map((imageName, i) => {
															return (
																<>
																	<Box className="col-6" key={i}>
																		<Box className="img_video_wrapper">
																			<span onClick={() => handleRemoveFileUpdate(imageName, 'image')} className="remove_icon" >
																				<CloseIcon style={{ fontSize: 16, color: "#000" }} />
																			</span>
																			<img src={files(imageName, "attachments")} alt="" />
																		</Box>
																	</Box>
																</>
															)
														})}
														{videoArray?.map((videoName, i) => {
															return (
																<>
																	<Box className="col-6" key={i}>
																		<Box className="img_video_wrapper">
																			<span onClick={() => handleRemoveFileUpdate(videoName, 'video')} className="remove_icon" >
																				<CloseIcon style={{ fontSize: 16, color: "#000" }} />
																			</span>
																			<video src={files(videoName?.video, "attachments")} autoPlay controls poster={files(videoName?.thumbnail, "thumb")} loop />
																		</Box>
																	</Box>
																</>
															)
														})}
														{eventMediaFiles && eventMediaFiles.map((ele, i) => {
															return ele?.type.includes("image") ? (
																<Box className="col-6" key={i}>
																	<Box className="img_video_wrapper">
																		<span
																			onClick={() => handleRemoveFile(ele.id)}
																			className="remove_icon"
																		>
																			<CloseIcon
																				style={{
																					fontSize: 16,
																					color: "#000",
																				}}
																			/>
																		</span>
																		<img
																			src={URL.createObjectURL(ele)}
																			alt=""
																		/>
																	</Box>
																</Box>
															) : ele?.type.includes("video") ? (
																<Box className="col-6">
																	<Box className="img_video_wrapper">
																		<span
																			onClick={() => handleRemoveFile(ele.id)}
																			className="remove_icon"
																		>
																			<CloseIcon
																				style={{
																					fontSize: 16,
																					color: "#000",
																				}}
																			/>
																		</span>
																		<video
																			src={URL.createObjectURL(ele)}
																			alt=""
																			autoPlay
																			loop
																		/>
																	</Box>
																</Box>
															) : (
																<></>
															)
														})}
														{imageArray?.length + videoArray?.length + eventMediaFiles?.length < configurableFieldData?.personalEvent?.noOfAttachment ?
															<Box className="col-6">
																<Box
																	className={`img_video_wrapper d-flex align-items-center ${eventMediaFiles.length > 0
																		? "justify-content-center"
																		: "justify-content-start"
																		}`}
																>
																	<Button className="" component="label">
																		<input
																			onChange={(e) =>
																				handleEventMediaOnChange(e)
																			}
																			hidden
																			accept="image/*, video/*"
																			type="file"
																			multiple
																			style={{ display: "none" }}
																		/>
																		<AddImageIconPlaceHolder />
																	</Button>
																</Box>
															</Box>
															:
															<></>
														}
													</Box>
												</Box>
												<FormHelperText error>
													{touched.image && errors.image}
												</FormHelperText>
											</Box>
										</Box>
										<Box className="col">
											<Box className="col-xl-8">
												<TextField
													className="app_text_transform"
													id="title"
													label="title"
													varient="outlined"
													{...getFieldProps("title")}
													error={Boolean(touched.title && errors.title)}
													helperText={touched.title && errors.title}
													fullWidth
												/>
											</Box>
										</Box>
										<Box className="col">
											<Box className="col-xl-8">
												<TextField
													className="app_text_transform"
													id="outlined-multiline-static"
													label="description"
													varient="outlined"
													multiline
													rows={4}
													fullWidth
													{...getFieldProps("description")}
													error={Boolean(
														touched.description && errors.description
													)}
													helperText={touched.description && errors.description}
												/>
											</Box>
										</Box>
										{/* <Box className="col">
											<Box className="col-xl-8">
												<TextField
													className="app_text_transform"
													inputProps={{ className: "text-capitalize" }}
													id="color"
													disabled
													label="event color picker"
													varient="outlined"
													fullWidth
													{...getFieldProps("color")}
													InputProps={{
														endAdornment: (
															<InputAdornment position="end">
																<AppTooltip
																	title="select status"
																	placement={"bottom"}
																>
																	<IconButton
																		onClick={() => setColorPopup(true)}
																		sx={{ padding: "0px" }}
																	>
																		<ColorLensIcon
																			style={{
																				color: "#757575",
																				fontSize: 26,
																			}}
																		/>
																	</IconButton>
																</AppTooltip>
															</InputAdornment>
														),
														startAdornment: (
															<InputAdornment position="start">
																<RectangleIcon
																	style={{
																		color: values.color,
																		fontSize: 40,
																	}}
																/>
															</InputAdornment>
														),
													}}
													error={Boolean(touched.color && errors.color)}
													helperText={touched.color && errors.color}
												/>
											</Box>
										</Box> */}
										<Box className="col">
											<Box className="col-xl-8">
												<FormControl sx={{ width: "100%" }}>
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<DatePicker
															label="event date"
															value={eventStartDateTime}
															minDate={nextDate}
															onChange={(newValue) => {
																changeEventStartDateTime(newValue);
																setEventEndDateTime(null);
															}}
															renderInput={(params) => (
																<TextField {...params} />
															)}
															error={Boolean(
																touched.startDate && errors.startDate
															)}
														/>
														<FormHelperText error className="app_text_transform">
															{touched.startDate && errors.startDate}
														</FormHelperText>
													</LocalizationProvider>
												</FormControl>
											</Box>
										</Box>
										<Box className="col">
											<Box className="col-xl-8">
												<FormControl sx={{ width: "100%" }}>
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<TimePicker
															label="event time"
															value={eventEndDateTime}
															onChange={(newValue) => {
																changeEventEndDateTime(newValue);
															}}
															renderInput={(params) => (
																<TextField {...params} />
															)}
															error={Boolean(touched.endDate && errors.endDate)}
														/>
														<FormHelperText
															error
															className="app_text_transform"
														>
															{touched.endDate && errors.endDate}
														</FormHelperText>
													</LocalizationProvider>
												</FormControl>
											</Box>
										</Box>
										<Box className="col">
											<Box className="col-xl-8">
												<TextField
													type="number"
													// InputProps={{ inputProps: { min: 1, max: configurableFieldData?.personalEvent?.noOfGuest } }}
													className="app_text_transform"
													id="guest"
													label="total number of guest"
													varient="outlined"
													{...getFieldProps("guest")}
													error={Boolean(touched.guest && errors.guest)}
													helperText={touched.guest && errors.guest}
													fullWidth
												/>
											</Box>
										</Box>
										<Box className="col">
											<Box className="col-xl-8">
												<FormControl sx={{ width: "100%" }}>
													<InputLabel id="demo-simple-select-helper-label">
														duration (approx)
													</InputLabel>
													<Select
														labelId="duration"
														value={values?.duration}
														id="duration"
														onChange={(e) =>
															setFieldValue("duration", e.target.value)
														}
														label="duration (approx)"
														{...getFieldProps("duration")}
														error={Boolean(touched.duration && errors.duration)}
													>
														<MenuItem value={3}> {"3 hour"} </MenuItem>
														<MenuItem value={5}> {"5 hour"} </MenuItem>
														<MenuItem value={8}> {"8 hour"} </MenuItem>
														<MenuItem value={10}> {"10 hour"} </MenuItem>
													</Select>
													<FormHelperText error>
														{touched.duration && errors.duration}
													</FormHelperText>
												</FormControl>
											</Box>
										</Box>
										<Box className="col">
											<Box className="col-xl-8">
												<LoadingButton
													type="submit"
													loading={buttonLoading}
													fullWidth
													loadingPosition="end"
													// disabled={buttonDisable}
													variant="contained"
													className="my-3 app_text_transform text-white app_bg_primary app_text_16_semibold app_btn_lg"
												>
													edit event
												</LoadingButton>
											</Box>
										</Box>
									</Box>
								</Box>
							</Box>
						</Box>
					</Form>
				</FormikProvider>
			</Box>
		</>
	)
}

export default UserEventEdit