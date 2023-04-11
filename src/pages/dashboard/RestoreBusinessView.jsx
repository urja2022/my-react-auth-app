import React from 'react'
import { useLocation } from 'react-router-dom';
import { Box, Card, CardMedia, List, ListItem, ListItemIcon, ListItemText, Stack } from "@mui/material"
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import { USER_API_URL } from 'src/api/axios';
import { useQuery } from 'react-query';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import moment from "moment";

const RestoreBusinessView = () => {

   const axiosPrivate = useAxiosPrivate();
   const { state } = useLocation();
   const { data: restoreUserBusinessData, refetch } = useQuery(
      "userLocation",
      async ({ signal }) => {
         return await axiosPrivate
            .get(USER_API_URL.getRestoreBusiness, { params: { id: state?.id } })
            .then((res) => res.data);
      },
      { refetchOnWindowFocus: false }
   );
   const userData = restoreUserBusinessData;

   return (
      <>
         <div className="dashboard_header mb-4">
            <h4 className="app_text_20_semibold mb-0 d-flex align-items-center">Business view</h4>
         </div>
         <Card sx={{ display: 'flex', paddingLeft: '5px', py: 1, mt: 5, width: '100%' }}>
            <CardMedia
               component="img"
               sx={{ width: 200, height: 200, objectFit: 'cover', overflow: 'hidden', borderRadius: 4, flexShrink: 0, objectPosition: 'center', boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;' }}
               image={`${process.env.REACT_APP_PROFILE_URL}${userData?.image}`}
               // image="https://mymodernmet.com/wp/wp-content/uploads/2021/04/Nature-Sounds-For-Well-Being-03.jpg"
               alt="business img"
            />
            <Box>
               <List disablePadding>
                  <ListItem sx={{ pt: 0 }}>
                     <Stack>
                        <span className='business_view_title'>{userData?.name ? userData?.name : 'null'}</span>
                        <span className='app_text_14_500'>user status</span>
                     </Stack>
                  </ListItem>
                  <ListItem>
                     <Stack spacing={2} direction={"row"}>
                        <span className='app_text_14'>description</span>
                        <p className='app_text_14 app_text_gray mb-0 pe-2'>{userData?.bio ? userData?.bio : '-'}</p>
                     </Stack>
                  </ListItem>
                  {/* <ListItem>
                     <Stack direction={"row"} spacing={2}>
                        <span className='app_text_14'>category</span>
                        <span className='app_text_14 app_text_gray'>{businessData?.category?.name ? businessData?.category?.name : '-'}</span>
                     </Stack>
                  </ListItem> */}
               </List>
            </Box>
         </Card>
         <Box sx={{ mt: 4 }}>
            <h4 className="app_text_20_semibold ps-3 d-flex align-items-center mb-0">document</h4>
            <Card sx={{ display: 'flex', paddingLeft: '5px', py: 1, mt: 1, width: 'fit-content' }}>
               <CardMedia
                  component="img"
                  sx={{ width: 200, height: 200, overflow: 'hidden', objectFit: 'cover', borderRadius: 4, flexShrink: 0, objectPosition: 'center', boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;' }}
                  image={`${process.env.REACT_APP_PROFILE_URL}${userData?.document?.image}`}
                  alt="business img"
               />
               <Box>
                  <List disablePadding>
                     <ListItem>
                        <Stack spacing={1}>
                           <Stack direction={"row"} spacing={4}>
                              <span className='app_text_14'>name</span>
                              <span className='app_text_14 app_text_gray'>{userData?.document?.docName ? userData?.document?.docName : '-'}</span>
                           </Stack>
                           <Stack direction={"row"} spacing={4}>
                              <span className='app_text_14'>registrationNumber</span>
                              <span className='app_text_14 app_text_gray'>{userData?.document?.idNumber ? userData?.document?.idNumber : '-'}</span>
                           </Stack>
                           <Stack direction={"row"} spacing={4}>
                              <span className='app_text_14'>dob</span>
                              <span className='app_text_14 app_text_gray'>{moment(userData?.document?.dateOfBirth).format('DD-MM-YYYY')}</span>
                           </Stack>
                           <Stack direction={"row"} spacing={4}>
                              <span className='app_text_14'>address</span>
                              {/* <span className='app_text_14 app_text_gray'>{businessData?.document?.address?.name ? businessData?.document?.address?.name : '-'}</span> */}
                           </Stack>
                        </Stack>
                     </ListItem>
                  </List>
               </Box>
            </Card>
         </Box>

         <Card className='shadow border border-1 mt-4'>
            <List>
               <ListItem>
                  <ListItemIcon><LocalPhoneOutlinedIcon style={{ fontSize: 20, color: '#6200ee' }} /></ListItemIcon>
                  <span>{userData?.mobile ? userData?.mobile : '-'}</span>
               </ListItem>
               <ListItem>
                  <ListItemIcon><EmailOutlinedIcon style={{ fontSize: 20, color: '#6200ee' }} /></ListItemIcon>
                  <span>{userData?.email ? userData?.email : '-'}</span>
               </ListItem>
               <ListItem>
                  <ListItemIcon><FmdGoodOutlinedIcon style={{ fontSize: 20, color: '#6200ee' }} /></ListItemIcon>
                  <span>{userData?.address?.name ? userData?.address?.name : '-'}</span>
               </ListItem>
            </List>
         </Card>
         <h4 className='app_text_16_semibold ps-3 mt-4'>optional details</h4>
         <Card className='shadow border border-1'>
            <List>
               <ListItem>
                  <ListItemText>alternative contact</ListItemText>
                  <ListItemText>{userData?.optionalMobile?.alternative ? userData?.optionalMobile?.alternative : ' -'}</ListItemText>
               </ListItem>
               <ListItem>
                  <ListItemText>secondary contact</ListItemText>
                  <ListItemText>{userData?.optionalMobile?.secondary ? userData?.optionalMobile?.secondary : ' -'}</ListItemText>
               </ListItem>
            </List>
         </Card>
      </>
   )
}

export default RestoreBusinessView