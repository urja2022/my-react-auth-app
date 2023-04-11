import { Button, Card, CardActions, CardContent, CardHeader, TextField } from "@mui/material"
import { Form, FormikProvider, useFormik } from "formik";
import { CONFIG_FIELD } from "src/api/axios";
import { useMutation, useQuery } from 'react-query';
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import LoadingScreen from "src/components/LoadingScreen";
import useStore from 'src/contexts/AuthProvider'

const ConfigurableFields = () => {
   const axiosPrivate = useAxiosPrivate();
   const { enqueueSnackbar } = useSnackbar();
   const [configField, setConfigField] = useState([]);
   // const [type, setType] = useState('');
   const [loding, setLoding] = useState(true);
   const permissionsData = useStore(state => state.permissions);

   async function getConfigField() {
      const response = await axiosPrivate.get(CONFIG_FIELD.getConfigFields)
      setConfigField(response.data)
   }

   useEffect(() => {
      //CHAT SET FIELD VALUE
      setFieldValue("chat_voiceNote", configField?.chats?.voiceNote);
      setFieldValue("chat_images", configField?.chats?.images);
      setFieldValue("chat_files", configField?.chats?.files);
      setFieldValue("chat_video", configField?.chats?.video);

      //POST SET FIELD VALUE
      setFieldValue("post_images", configField?.posts?.images);
      setFieldValue("post_video", configField?.posts?.video);
      setFieldValue('post_attachment', configField?.posts?.attachments)
      setFieldValue('post_dailyAddPost', configField?.posts?.dailyAddPost)
      setFieldValue('post_discriptionLength', configField?.posts?.discriptionLength)
      setFieldValue('post_delete', configField?.posts?.deletePost)
      setFieldValue('post_automaticallyDelete', configField?.posts?.automaticallyDelete)

      //ADS SET FIELD VALUE
      setFieldValue("ads_images", configField?.ads?.images);
      setFieldValue("ads_video", configField?.ads?.video);
      setFieldValue("ads_audio", configField?.ads?.audio);

      // SET STEAMING FIELD VALUE
      setFieldValue("stre_video", configField?.streaming?.video);
      setFieldValue("stre_audio", configField?.streaming?.audio);

      // SET TRACE FIELD VALUE
      setFieldValue("traceRequest", configField?.trace?.traceRequest);

      //SET EVENT FIELD VALUE
      setFieldValue('event_image', configField?.event?.images)
      setFieldValue('event_video', configField?.event?.video)

      // SET PERSONAL FEED VALUE
      setFieldValue('personal_no_of_feed', configField?.personalFeed?.noOfFeed)
      setFieldValue('personal_no_of_attachment', configField?.personalFeed?.noOfAttachment)
      setFieldValue('personal_character_limit_for_title', configField?.personalFeed?.limitForTitle)
      setFieldValue('personal_character_limit_for_discription', configField?.personalFeed?.limitForDiscription)
      setFieldValue('personal_auto_delete_after', configField?.personalFeed?.autoDeleteAfter)
      setFieldValue('personal_system_may_delete_after', configField?.personalFeed?.systemMayDeleteAfter)
      setFieldValue('no_of_personal_loc', configField?.personalFeed?.noOfLocation)

      // SET BUSINESS FEED VALUE
      setFieldValue('business_no_of_feed', configField?.businessFeed?.noOfFeed)
      setFieldValue('business_no_of_attachment', configField?.businessFeed?.noOfAttachment)
      setFieldValue('business_character_limit_for_title', configField?.businessFeed?.limitForTitle)
      setFieldValue('business_character_limit_for_discription', configField?.businessFeed?.limitForDiscription)
      setFieldValue('business_auto_delete_after', configField?.businessFeed?.autoDeleteAfter)
      setFieldValue('business_system_may_delete_after', configField?.businessFeed?.systemMayDeleteAfter)
      setFieldValue('no_of_business_loc', configField?.businessFeed?.noOfLocation)

      // SET PERSONAL EVENT VALUE
      setFieldValue('personal_no_of_event', configField?.personalEvent?.noOfEvent)
      setFieldValue('personal_no_of_attachmnet', configField?.personalEvent?.noOfAttachment)
      setFieldValue('personal_event_char_limit_title', configField?.personalEvent?.limitForTitle)
      setFieldValue('personal_char_limit_for_desc', configField?.personalEvent?.limitForDiscription)
      setFieldValue('personal_no_of_guest', configField?.personalEvent?.noOfGuest)
      setFieldValue('personal_no_of_location', configField?.personalEvent?.noOfLocation)

      // SET BUSINESS EVENT VALUE
      setFieldValue('business_no_of_event', configField?.businessEvent?.noOfEvent)
      setFieldValue('business_no_of_attachmnet', configField?.businessEvent?.noOfAttachment)
      setFieldValue('business_event_char_limit_title', configField?.businessEvent?.limitForTitle)
      setFieldValue('business_char_limit_for_desc', configField?.businessEvent?.limitForDiscription)
      setFieldValue('business_no_of_guest', configField?.personalEvent?.noOfGuest)
      setFieldValue('business_no_of_location', configField?.personalEvent?.noOfLocation)

      //business rule
      setFieldValue('number_of_emp_business', configField?.businessRules?.noOfEmpOrBusiness)

      // personal profile 
      setFieldValue('no_of_personal_photo', configField?.personal?.noOfPersonalPhotos)
      setFieldValue('profile_size', configField?.personal?.photoSize)

      //proproximityAlert
      setFieldValue('proximity_alert', configField?.proximityAlert)

      setTimeout(() => {
         setLoding(false);
      }, 1800);
   }, [configField])

   useEffect(() => {
      getConfigField()
   }, [])
   const { isLoading, data: subAdminList, refetch } = useQuery(['subAdminList'], () => getConfigField(), { keepPreviousData: true, })

   const completedSchema = Yup.object().shape({
      //Chat   
      chat_voiceNote: Yup.string().required("voice notes limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      chat_images: Yup.string().required("images limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      chat_files: Yup.string().required("files limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      chat_video: Yup.string().required("video limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),

      //Post
      post_images: Yup.string().required("images limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      post_video: Yup.string().required("video limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),

      // Ads
      ads_images: Yup.string().required("images limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      ads_video: Yup.string().required("video limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      ads_audio: Yup.string().required("audio limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),

      // streaming
      stre_video: Yup.string().required("video limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      stre_audio: Yup.string().required("audio limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),

      // trace reqst
      traceRequest: Yup.string().required("trace request limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),

      //event
      event_image: Yup.string().required("image limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      event_video: Yup.string().required("video limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),

      // personal feed setting
      personal_no_of_feed: Yup.string().required("number of feed is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      personal_no_of_attachment: Yup.string().required("number of attachment is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      personal_character_limit_for_title: Yup.string().required("character limit for title is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      personal_character_limit_for_discription: Yup.string().required("character limit for description is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      personal_auto_delete_after: Yup.string().required("auto delete is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      personal_system_may_delete_after: Yup.string().required("system delete is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      no_of_personal_loc: Yup.string().required("number of location is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),

      // business feed setting
      business_no_of_feed: Yup.string().required("number of feed is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      business_no_of_attachment: Yup.string().required("number of attachment is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      business_character_limit_for_title: Yup.string().required("character limit for title is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      business_character_limit_for_discription: Yup.string().required("character limit for description is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      business_auto_delete_after: Yup.string().required("auto delete is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      business_system_may_delete_after: Yup.string().required("system delete is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),

      no_of_business_loc: Yup.string().required("number of location is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),

      // personal event setting
      personal_no_of_event: Yup.string().required("number of event is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      personal_no_of_attachmnet: Yup.string().required("number of attachment is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      personal_event_char_limit_title: Yup.string().required("event character limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      personal_char_limit_for_desc: Yup.string().required("event description limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      personal_no_of_guest: Yup.string().required("number of guest is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      personal_no_of_location: Yup.string().required("number of location is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      
      // business event setting
      business_no_of_event: Yup.string().required("number of event is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      business_no_of_attachmnet: Yup.string().required("number of attachment is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      business_event_char_limit_title: Yup.string().required("event character limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      business_char_limit_for_desc: Yup.string().required("event description limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      number_of_emp_business: Yup.string().required("number of employee or business is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      business_no_of_guest: Yup.string().required("number of guest is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      business_no_of_location: Yup.string().required("number of location is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      
      //personla profile limit 
      no_of_personal_photo: Yup.string().required("personal profile limit is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
      profile_size: Yup.string().required("personal profile size is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),

      // proximityAlert
      proximity_alert: Yup.string().required("personal profile size is required").matches(/^\d+(?:\.\d+)?$/, "enter only vaild number"),
   });

   const formik = useFormik({
      initialValues: {
         //chat
         chat_voiceNote: configField?.chats?.voiceNote ? configField?.chats?.voiceNote : '',
         chat_images: configField?.chats?.images ? configField?.chats?.images : '',
         chat_files: configField?.chats?.files ? configField?.chats?.files : '',
         chat_video: configField?.chats?.video ? configField?.chats?.video : '',

         //post
         post_images: configField?.posts?.images ? configField?.posts?.images : '',
         post_video: configField?.posts?.video ? configField?.posts?.video : '',

         //ads
         ads_images: configField?.ads?.images ? configField?.ads?.images : '',
         ads_video: configField?.ads?.video ? configField?.ads?.video : '',
         ads_audio: configField?.ads?.audio ? configField?.ads?.audio : '',

         //streaming
         stre_video: configField?.streaming?.video ? configField?.streaming?.video : '',
         stre_audio: configField?.streaming?.audio ? configField?.streaming?.audio : '',

         //trace
         traceRequest: configField?.trace?.traceRequest ? configField?.trace?.traceRequest : '',

         //event 
         event_image: configField?.event?.images ? configField?.event?.images : '',
         event_video: configField?.event?.video ? configField?.event?.video : '',

         // personal feed
         personal_no_of_feed: configField?.personalFeed?.noOfFeed ? configField?.personalFeed?.noOfFeed : '',
         personal_no_of_attachment: configField?.personalFeed?.noOfAttachment ? configField?.personalFeed?.noOfAttachment : '',
         personal_character_limit_for_title: configField?.personalFeed?.limitForTitle ? configField?.personalFeed?.limitForTitle : '',
         personal_character_limit_for_discription: configField?.personalFeed?.limitForDiscription ? configField?.personalFeed?.limitForDiscription : '',
         personal_auto_delete_after: configField?.personalFeed?.autoDeleteAfter ? configField?.personalFeed?.autoDeleteAfter : '',
         personal_system_may_delete_after: configField?.personalFeed?.systemMayDeleteAfter ? configField?.personalFeed?.systemMayDeleteAfter : '',
         no_of_personal_loc: configField?.personalFeed?.noOfLocation ? configField?.personalFeed?.noOfLocation : '',

         // business feed
         business_no_of_feed: configField?.businessFeed?.noOfFeed ? configField?.businessFeed?.noOfFeed : '',
         business_no_of_attachment: configField?.businessFeed?.noOfAttachment ? configField?.businessFeed?.noOfAttachment : '',
         business_character_limit_for_title: configField?.businessFeed?.limitForTitle ? configField?.businessFeed?.limitForTitle : '',
         business_character_limit_for_discription: configField?.businessFeed?.limitForDiscription ? configField?.businessFeed?.limitForDiscription : '',
         business_auto_delete_after: configField?.businessFeed?.autoDeleteAfter ? configField?.businessFeed?.autoDeleteAfter : '',
         business_system_may_delete_after: configField?.businessFeed?.systemMayDeleteAfter ? configField?.businessFeed?.systemMayDeleteAfter : '',
         no_of_business_loc: configField?.businessFeed?.noOfLocation ? configField?.businessFeed?.noOfLocation : '',

         // personal event
         personal_no_of_event: configField?.personalEvent?.noOfEvent ? configField?.personalEvent?.noOfEvent : '',
         personal_no_of_attachmnet: configField?.personalEvent?.noOfAttachment ? configField?.personalEvent?.noOfAttachment : '',
         personal_event_char_limit_title: configField?.personalEvent?.limitForTitle ? configField?.personalEvent?.limitForTitle : '',
         personal_char_limit_for_desc: configField?.personalEvent?.limitForDiscription ? configField?.personalEvent?.limitForDiscription : '',
         personal_no_of_guest: configField?.personalEvent?.noOfEvent ? configField?.personalEvent?.noOfEvent : '',
         personal_no_of_location: configField?.personalEvent?.noOfLocation ? configField?.personalEvent?.noOfLocation : '',

         //Business Rule
         number_of_emp_business: configField?.businessRules?.noOfEmpOrBusiness ? configField?.businessRules?.noOfEmpOrBusiness : '',

         //personal profile limit
         no_of_personal_photo: configField?.personal?.noOfPersonalPhotos ? configField?.personal?.noOfPersonalPhotos : '',
         profile_size: configField?.personal?.photoSize ? configField?.personal?.photoSize : '',

         // proximityAlert
         proximity_alert: configField?.proximityAlert ? configField?.proximityAlert : '',

      },
      validationSchema: completedSchema,
      onSubmit: async (values, { setFieldError, setSubmitting }) => {
         var obj = {
            id: configField?._id
         };
         obj.chats = {
            voiceNote: values.chat_voiceNote,
            images: values.chat_images,
            files: values.chat_files,
            video: values.chat_video,
         }
         obj.posts = {
            images: values.post_images,
            video: values.post_video,
            // attachments: values.attachments,
            // dailyAddPost: values.post_dailyAddPost,
            // discriptionLength: values.post_discriptionLength,
            // automaticallyDelete: values.post_automaticallyDelete,
            // deletePost: values.post_delete,
         }

         obj.ads = {
            images: values.ads_images,
            video: values.ads_video,
            audio: values.ads_audio,
         }
         obj.streaming = {
            video: values.stre_video,
            audio: values.stre_audio,
         }
         obj.trace = {
            traceRequest: values.traceRequest
         }
         obj.event = {
            images: values.event_image,
            video: values.event_video,
            // dailyAddEvent: values.event_daily,
            // discriptionLength: values.event_desciption_length
         }
         obj.personalFeed = {
            noOfFeed: values.personal_no_of_feed,
            noOfAttachment: values.personal_no_of_attachment,
            limitForTitle: values.personal_character_limit_for_title,
            limitForDiscription: values.personal_character_limit_for_discription,
            autoDeleteAfter: values.personal_auto_delete_after,
            systemMayDeleteAfter: values.personal_system_may_delete_after,
            noOfLocation: values.no_of_personal_loc,
         }
         obj.businessFeed = {
            noOfFeed: values.business_no_of_feed,
            noOfAttachment: values.business_no_of_attachment,
            limitForTitle: values.business_character_limit_for_title,
            limitForDiscription: values.business_character_limit_for_discription,
            autoDeleteAfter: values.business_auto_delete_after,
            systemMayDeleteAfter: values.business_system_may_delete_after,
            noOfLocation: values.no_of_business_loc,
         }
         obj.personalEvent = {
            noOfEvent: values.personal_no_of_event,
            noOfAttachment: values.personal_no_of_attachmnet,
            limitForTitle: values.personal_event_char_limit_title,
            limitForDiscription: values.personal_char_limit_for_desc,
            noOfGuest: values.personal_no_of_guest,
            noOfLocation: values.personal_no_of_location,
         }
         obj.businessEvent = {
            noOfEvent: values.business_no_of_event,
            noOfAttachment: values.business_no_of_attachmnet,
            limitForTitle: values.business_event_char_limit_title,
            limitForDiscription: values.business_char_limit_for_desc,
            noOfGuest: values.business_no_of_guest,
            noOfLocation: values.business_no_of_location,
         }
         obj.businessRules = {
            noOfEmpOrBusiness: values.number_of_emp_business
         }

         obj.personal = {
            noOfPersonalPhotos: values.no_of_personal_photo,
            photoSize: values.profile_size
         }
         obj.proximityAlert = values.proximity_alert

         await configFiledUpdate(obj)
         setSubmitting(false);
      },
   })

   const { mutateAsync: configFiledUpdate } = useMutation(
      async (data) => {
         return await axiosPrivate.put(CONFIG_FIELD.addConfigFields, JSON.stringify(data))
      },
      {
         onSuccess: ({ data }) => {
            enqueueSnackbar("configurable fields update successfully", {
               variant: "success",
               anchorOrigin: { vertical: "top", horizontal: "right" },
               autoHideDuration: 2000,
            });
            refetch();
         },
         onError: (error) => {
            const errorData = error.response.data.errors;
            Object.keys(errorData).forEach((key) => {
            });
         },
      }
   );

   const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;

   return (
      <>
         {loding ? <LoadingScreen /> : <>
            <h4 className="app_text_20_semibold mb-0 d-flex align-items-center">configurable fields</h4>
            <div className="container-fluid mt-4 p-0">
               <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                     <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 g-4">
                        {/* Feed */}
                        <div className="col">
                           <Card sx={{ minWidth: '100%' }}>

                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">personal feed settings</span>
                                    {/* <span className="app_text_12_fw500 app_text_gray ms-1">(per user limit)</span> */}
                                 </div>
                              } />
                              <CardContent>
                                 <TextField margin="normal" fullWidth label="no of feed / day" {...getFieldProps("personal_no_of_feed")} variant="outlined" error={Boolean(touched.personal_no_of_feed && errors.personal_no_of_feed)} helperText={touched.personal_no_of_feed && errors.personal_no_of_feed} />

                                 <TextField margin="normal" fullWidth label="no of attachment / post" {...getFieldProps("personal_no_of_attachment")} variant="outlined" error={Boolean(touched.personal_no_of_attachment && errors.personal_no_of_attachment)} helperText={touched.personal_no_of_attachment && errors.personal_no_of_attachment} />

                                 <TextField margin="normal" fullWidth label="character limit for title" {...getFieldProps("personal_character_limit_for_title")} variant="outlined" error={Boolean(touched.personal_character_limit_for_title && errors.personal_character_limit_for_title)} helperText={touched.personal_character_limit_for_title && errors.personal_character_limit_for_title} />

                                 <TextField margin="normal" fullWidth label="character limit for description" {...getFieldProps("personal_character_limit_for_discription")} variant="outlined" error={Boolean(touched.personal_character_limit_for_discription && errors.personal_character_limit_for_discription)} helperText={touched.personal_character_limit_for_discription && errors.personal_character_limit_for_discription} />

                                 <TextField margin="normal" fullWidth label="auto delete after (in days)" {...getFieldProps("personal_auto_delete_after")} variant="outlined" error={Boolean(touched.personal_auto_delete_after && errors.personal_auto_delete_after)} helperText={touched.personal_auto_delete_after && errors.personal_auto_delete_after} />

                                 <TextField margin="normal" fullWidth label="system may delete after (in days)" {...getFieldProps("personal_system_may_delete_after")} variant="outlined" error={Boolean(touched.personal_system_may_delete_after && errors.personal_system_may_delete_after)} helperText={touched.personal_system_may_delete_after && errors.personal_system_may_delete_after} />

                                 <TextField margin="normal" fullWidth label="number of Location" {...getFieldProps("no_of_personal_loc")} variant="outlined" error={Boolean(touched.no_of_personal_loc && errors.no_of_personal_loc)} helperText={touched.no_of_personal_loc && errors.no_of_personal_loc} />

                              </CardContent>
                           </Card>
                        </div>
                        <div className="col">
                           <Card sx={{ minWidth: '100%' }}>

                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">business feed settings</span>
                                    {/* <span className="app_text_12_fw500 app_text_gray ms-1">(per user limit)</span> */}
                                 </div>
                              } />
                              <CardContent>
                                 <TextField margin="normal" fullWidth label="no of feed / day" {...getFieldProps("business_no_of_feed")} variant="outlined" error={Boolean(touched.business_no_of_feed && errors.business_no_of_feed)} helperText={touched.business_no_of_feed && errors.business_no_of_feed} />

                                 <TextField margin="normal" fullWidth label="no of attachment / post" {...getFieldProps("business_no_of_attachment")} variant="outlined" error={Boolean(touched.business_no_of_attachment && errors.business_no_of_attachment)} helperText={touched.business_no_of_attachment && errors.business_no_of_attachment} />

                                 <TextField margin="normal" fullWidth label="character limit for title" {...getFieldProps("business_character_limit_for_title")} variant="outlined" error={Boolean(touched.business_character_limit_for_title && errors.business_character_limit_for_title)} helperText={touched.business_character_limit_for_title && errors.business_character_limit_for_title} />

                                 <TextField margin="normal" fullWidth label="character limit for description" {...getFieldProps("business_character_limit_for_discription")} variant="outlined" error={Boolean(touched.business_character_limit_for_discription && errors.business_character_limit_for_discription)} helperText={touched.business_character_limit_for_discription && errors.business_character_limit_for_discription} />

                                 <TextField margin="normal" fullWidth label="auto delete after (in days)" {...getFieldProps("business_auto_delete_after")} variant="outlined" error={Boolean(touched.business_auto_delete_after && errors.business_auto_delete_after)} helperText={touched.business_auto_delete_after && errors.business_auto_delete_after} />

                                 <TextField margin="normal" fullWidth label="system may delete after (in days)" {...getFieldProps("business_system_may_delete_after")} variant="outlined" error={Boolean(touched.business_system_may_delete_after && errors.business_system_may_delete_after)} helperText={touched.business_system_may_delete_after && errors.business_system_may_delete_after} />

                                 <TextField margin="normal" fullWidth label="number of Location" {...getFieldProps("no_of_business_loc")} variant="outlined" error={Boolean(touched.no_of_business_loc && errors.no_of_business_loc)} helperText={touched.no_of_business_loc && errors.no_of_business_loc} />
                              </CardContent>
                           </Card>
                        </div>
                        <div className="col">
                           <Card sx={{ minWidth: '100%' }}>

                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">Feed</span>
                                    <span className="app_text_12_fw500 app_text_gray ms-1">(set size limit in mb)</span>
                                 </div>
                              } />
                              <CardContent>
                                 <TextField margin="normal" fullWidth label="image size limit" {...getFieldProps("post_images")} variant="outlined" error={Boolean(touched.post_images && errors.post_images)} helperText={touched.post_images && errors.post_images} />

                                 <TextField margin="normal" fullWidth label="video size limit" {...getFieldProps("post_video")} variant="outlined" error={Boolean(touched.post_video && errors.post_video)} helperText={touched.post_video && errors.post_video} />

                                 {/* <TextField margin="normal" fullWidth label="attachments limit" {...getFieldProps("post_attachment")} variant="outlined" error={Boolean(touched.post_attachment && errors.post_attachment)} helperText={touched.post_attachment && errors.post_attachment} />

                                 <TextField margin="normal" fullWidth label="daily post limit" {...getFieldProps("post_dailyAddPost")} variant="outlined" error={Boolean(touched.post_dailyAddPost && errors.post_dailyAddPost)} helperText={touched.post_dailyAddPost && errors.post_dailyAddPost} />

                                 <TextField margin="normal" fullWidth label="discription length limit"
                                    {...getFieldProps("post_discriptionLength")} variant="outlined" error={Boolean(touched.post_discriptionLength && errors.post_discriptionLength)} helperText={touched.post_discriptionLength && errors.post_discriptionLength} />

                                 <TextField margin="normal" fullWidth label="delete post limit" {...getFieldProps("post_delete")} variant="outlined" error={Boolean(touched.post_delete && errors.post_delete)} helperText={touched.post_delete && errors.post_delete} />

                                 <TextField margin="normal" fullWidth label="automatic delete post limit"
                                    {...getFieldProps("post_automaticallyDelete")} variant="outlined" error={Boolean(touched.post_automaticallyDelete && errors.post_automaticallyDelete)} helperText={touched.post_automaticallyDelete && errors.post_automaticallyDelete} /> */}
                              </CardContent>
                           </Card>
                        </div>


                        {/* Event */}
                        <div className="col">
                           <Card sx={{ minWidth: '100%' }}>

                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">personal event settings</span>
                                    {/* <span className="app_text_12_fw500 app_text_gray ms-1">(per user limit)</span> */}
                                 </div>
                              } />
                              <CardContent>
                                 <TextField margin="normal" fullWidth label="no of event / day" {...getFieldProps("personal_no_of_event")} variant="outlined" error={Boolean(touched.personal_no_of_event && errors.personal_no_of_event)} helperText={touched.personal_no_of_event && errors.personal_no_of_event} />

                                 <TextField margin="normal" fullWidth label="no of attachment / event" {...getFieldProps("personal_no_of_attachmnet")} variant="outlined" error={Boolean(touched.personal_no_of_attachmnet && errors.personal_no_of_attachmnet)} helperText={touched.personal_no_of_attachmnet && errors.personal_no_of_attachmnet} />

                                 <TextField margin="normal" fullWidth label="character limit for title" {...getFieldProps("personal_event_char_limit_title")} variant="outlined" error={Boolean(touched.personal_event_char_limit_title && errors.personal_event_char_limit_title)} helperText={touched.personal_event_char_limit_title && errors.personal_event_char_limit_title} />

                                 <TextField margin="normal" fullWidth label="character limit for description" {...getFieldProps("personal_char_limit_for_desc")} variant="outlined" error={Boolean(touched.personal_char_limit_for_desc && errors.personal_char_limit_for_desc)} helperText={touched.personal_char_limit_for_desc && errors.personal_char_limit_for_desc} />

                                 <TextField margin="normal" fullWidth label="number of guest" {...getFieldProps("personal_no_of_guest")} variant="outlined" error={Boolean(touched.personal_no_of_guest && errors.personal_no_of_guest)} helperText={touched.personal_no_of_guest && errors.personal_no_of_guest} />

                                 <TextField margin="normal" fullWidth label="number of location" {...getFieldProps("personal_no_of_location")} variant="outlined" error={Boolean(touched.personal_no_of_location && errors.personal_no_of_location)} helperText={touched.personal_no_of_location && errors.personal_no_of_location} />
                              </CardContent>
                           </Card>
                        </div>
                        <div className="col">
                           <Card sx={{ minWidth: '100%' }}>

                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">business event settings</span>
                                    {/* <span className="app_text_12_fw500 app_text_gray ms-1">(per user limit)</span> */}
                                 </div>
                              } />
                              <CardContent>
                                 <TextField margin="normal" fullWidth label="no of event / day" {...getFieldProps("business_no_of_event")} variant="outlined" error={Boolean(touched.business_no_of_event && errors.business_no_of_event)} helperText={touched.business_no_of_event && errors.business_no_of_event} />

                                 <TextField margin="normal" fullWidth label="no of attachment / event" {...getFieldProps("business_no_of_attachmnet")} variant="outlined" error={Boolean(touched.business_no_of_attachmnet && errors.business_no_of_attachmnet)} helperText={touched.business_no_of_attachmnet && errors.business_no_of_attachmnet} />

                                 <TextField margin="normal" fullWidth label="character limit for title" {...getFieldProps("business_event_char_limit_title")} variant="outlined" error={Boolean(touched.business_event_char_limit_title && errors.business_event_char_limit_title)} helperText={touched.business_event_char_limit_title && errors.business_event_char_limit_title} />

                                 <TextField margin="normal" fullWidth label="character limit for description" {...getFieldProps("business_char_limit_for_desc")} variant="outlined" error={Boolean(touched.business_char_limit_for_desc && errors.business_char_limit_for_desc)} helperText={touched.business_char_limit_for_desc && errors.business_char_limit_for_desc} />

                                 <TextField margin="normal" fullWidth label="number of guest" {...getFieldProps("business_no_of_guest")} variant="outlined" error={Boolean(touched.business_no_of_guest && errors.business_no_of_guest)} helperText={touched.business_no_of_guest && errors.business_no_of_guest} />

                                 <TextField margin="normal" fullWidth label="number of location" {...getFieldProps("business_no_of_location")} variant="outlined" error={Boolean(touched.business_no_of_location && errors.business_no_of_location)} helperText={touched.business_no_of_location && errors.business_no_of_location} />
                              </CardContent>
                           </Card>
                        </div>
                        <div className="col">
                           <Card sx={{ minWidth: '100%' }}>

                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">event</span>
                                    <span className="app_text_12_fw500 app_text_gray ms-1">(per user limit)</span>
                                 </div>
                              } />
                              <CardContent>
                                 <TextField margin="normal" fullWidth label="event video limit" {...getFieldProps("event_video")} variant="outlined" error={Boolean(touched.event_video && errors.event_video)} helperText={touched.event_video && errors.event_video} />

                                 <TextField margin="normal" fullWidth label="event image limit" {...getFieldProps("event_image")} variant="outlined" error={Boolean(touched.event_image && errors.event_image)} helperText={touched.event_image && errors.event_image} />

                                 {/* <TextField margin="normal" fullWidth label="daily event limit" {...getFieldProps("event_daily")} variant="outlined" error={Boolean(touched.event_daily && errors.event_daily)} helperText={touched.event_daily && errors.event_daily} />

                                 <TextField margin="normal" fullWidth label="desciption length limit" {...getFieldProps("event_desciption_length")} variant="outlined" error={Boolean(touched.event_desciption_length && errors.event_desciption_length)} helperText={touched.event_desciption_length && errors.event_desciption_length} /> */}
                              </CardContent>
                           </Card>
                        </div>

                        {/* Chat */}
                        <div className="col">
                           <Card sx={{ minWidth: '100%' }}>

                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">chats</span>
                                    <span className="app_text_12_fw500 app_text_gray ms-1">(set size limit in mb)</span>
                                 </div>
                              } />
                              <CardContent>
                                 <TextField label="voice notes limit" margin="normal" fullWidth {...getFieldProps("chat_voiceNote")} variant="outlined" error={Boolean(touched.chat_voiceNote && errors.chat_voiceNote)} helperText={touched.chat_voiceNote && errors.chat_voiceNote} />
                                 <TextField margin="normal" fullWidth label="images limit" {...getFieldProps("chat_images")} variant="outlined" error={Boolean(touched.chat_images && errors.chat_images)} helperText={touched.chat_images && errors.chat_images} />
                                 <TextField margin="normal" fullWidth label="files limit" {...getFieldProps("chat_files")} variant="outlined" error={Boolean(touched.chat_files && errors.chat_files)} helperText={touched.chat_files && errors.chat_files} />
                                 <TextField margin="normal" fullWidth label="video limit" {...getFieldProps("chat_video")} variant="outlined" error={Boolean(touched.chat_video && errors.chat_video)} helperText={touched.chat_video && errors.chat_video} />
                              </CardContent>
                           </Card>
                        </div>


                        {/* ads */}
                        <div className="col">
                           <Card sx={{ minWidth: '100%' }}>
                              <FormikProvider value={formik}>
                                 <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                    <CardHeader sx={{ pb: 0 }} title={
                                       <div className="d-flex align-items-center">
                                          <span className="app_text_16_semibold">ads</span>
                                          <span className="app_text_12_fw500 app_text_gray ms-1">(Set Size Limit in mb)</span>
                                       </div>
                                    } />
                                    <CardContent>
                                       <TextField margin="normal" fullWidth label="images limit" {...getFieldProps("ads_images")} variant="outlined" error={Boolean(touched.ads_images && errors.ads_images)} helperText={touched.ads_images && errors.ads_images} />
                                       <TextField margin="normal" fullWidth label="files limit" {...getFieldProps("ads_video")} variant="outlined" error={Boolean(touched.ads_video && errors.ads_video)} helperText={touched.ads_video && errors.ads_video} />
                                       <TextField margin="normal" fullWidth label="video limit" {...getFieldProps("ads_audio")} variant="outlined" error={Boolean(touched.ads_audio && errors.ads_audio)} helperText={touched.ads_audio && errors.ads_audio} />
                                    </CardContent>
                                 </Form>
                              </FormikProvider>
                           </Card>
                        </div>


                        {/* Feed  */}


                        {/* streaming */}
                        <div className="col">
                           <Card sx={{ minWidth: '100%' }}>

                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">streaming</span>
                                    <span className="app_text_12_fw500 app_text_gray ms-1">(set size limit in  max minutes)</span>
                                 </div>
                              } />
                              <CardContent>
                                 <TextField margin="normal" fullWidth label="video limit" {...getFieldProps("stre_video")} variant="outlined" error={Boolean(touched.stre_video && errors.stre_video)} helperText={touched.stre_video && errors.stre_video} />
                                 <TextField margin="normal" fullWidth label="audio limit" {...getFieldProps("stre_audio")} variant="outlined" error={Boolean(touched.stre_audio && errors.stre_audio)} helperText={touched.stre_audio && errors.stre_audio} />
                              </CardContent>
                           </Card>
                        </div>

                        {/* trace request */}
                        <div className="col">
                           <Card sx={{ minWidth: '100%' }}>

                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">trace request</span>
                                    <span className="app_text_12_fw500 app_text_gray ms-1">(per user limit)</span>
                                 </div>
                              } />
                              <CardContent>
                                 <TextField margin="normal" fullWidth label="request limit" {...getFieldProps("traceRequest")} variant="outlined" error={Boolean(touched.traceRequest && errors.traceRequest)} helperText={touched.traceRequest && errors.traceRequest} />
                              </CardContent>
                           </Card>
                        </div>

                        {/* Business rules */}
                        <div className="col">
                           <Card sx={{ minWidth: '100%' }}>

                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">business rules</span>

                                 </div>
                              } />
                              <CardContent>
                                 <TextField margin="normal" fullWidth label=" no of employee / business" {...getFieldProps("number_of_emp_business")} variant="outlined" error={Boolean(touched.number_of_emp_business && errors.number_of_emp_business)} helperText={touched.number_of_emp_business && errors.number_of_emp_business} />
                              </CardContent>


                           </Card>
                        </div>

                        {/* proximityAlert */}

                        <div className="col">
                           <Card sx={{ minWidth: '100%' }}>

                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">proximity alert </span>

                                 </div>
                              } />
                              <CardContent>
                                 <TextField margin="normal" fullWidth label="proximity alert" {...getFieldProps("proximity_alert")} variant="outlined" error={Boolean(touched.proximity_alert && errors.proximity_alert)} helperText={touched.proximity_alert && errors.proximity_alert} />

                              </CardContent>
                           </Card>
                        </div>

                        {/* Personal profile */}
                        <div className="col">
                           <Card sx={{ minWidth: '100%' }}>

                              <CardHeader sx={{ pb: 0 }} title={
                                 <div className="d-flex align-items-center">
                                    <span className="app_text_16_semibold">personal Profile</span>

                                 </div>
                              } />
                              <CardContent>
                                 <TextField margin="normal" fullWidth label="no of photos / profile" {...getFieldProps("no_of_personal_photo")} variant="outlined" error={Boolean(touched.no_of_personal_photo && errors.no_of_personal_photo)} helperText={touched.no_of_personal_photo && errors.no_of_personal_photo} />

                                 <TextField margin="normal" fullWidth label="photo size limit" {...getFieldProps("profile_size")} variant="outlined" error={Boolean(touched.profile_size && errors.profile_size)} helperText={touched.profile_size && errors.profile_size} />

                              </CardContent>
                           </Card>
                        </div>


                     </div>
                     {permissionsData?.configurable_fields?.substring(3, 4) == "1"
                        ? <CardActions sx={{ px: '16px', mb: 2 }}><Button type="submit" style={{ borderRadius: '8px', padding: "14px 18px" }} fullWidth className="theme_button" variant="contained">save limits</Button></CardActions> : ''}
                  </Form>
               </FormikProvider>
            </div>
         </>
         }
      </>
   )
}

export default ConfigurableFields