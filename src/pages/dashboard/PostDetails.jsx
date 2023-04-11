import { Box } from '@mui/material'
import React from 'react'
import { useQuery } from 'react-query';
// import SocialPost from 'src/components/social/SocialPost'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
// import { SOCIAL_MEDIA_URL } from "src/api/axios";
import { useParams } from 'react-router';
import { POST_API_URL } from 'src/api/axios';
import SocialPost from './social/SocialPost';

const PostDetails = () => {


   const axiosPrivate = useAxiosPrivate();
   const { id: id } = useParams();

   const { data: postDetailsData, refetch } = useQuery(
      "postDetailsData",
      async ({ signal }) => {
         return await axiosPrivate.get(POST_API_URL.fetchPosts + "/" + id, { signal }).then((res) => res.data);
      },
      { refetchOnWindowFocus: false }
   );

   return (
      <Box sx={{ width: "100%", display: 'flex', alignItems: "center", justifyContent: 'center' }} className="post_detail_basedonid_wrapper">
         <Box sx={{ maxWidth: "800px", height: "auto", width: "100%", padding: "5px", backgroundColor: "#6e3fc6", borderRadius: "10px", boxShadow: "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px" }}>
            <SocialPost postsData={postDetailsData} />
         </Box>
      </Box>
   )
}

export default PostDetails