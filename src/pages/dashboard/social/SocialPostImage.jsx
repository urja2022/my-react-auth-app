import { Typography } from '@mui/material';
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import Slider from 'react-slick';
import files from 'src/helpers/helpers';
// import postImage from "../../assets/images/post_img1.png";
const SocialPostImage = (props) => {
  const { socialImage, socialVideo } = props;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows:false,
  };
  return (
    <div>
      <Box sx={{ width: "100%",height: "400px",position:"relative"}} className="socialpost_slider_wrapper">
        {/* <Typography component={"span"} sx={{position:"absolute",top:"15px",right:"15px",padding:"3px 10px",color:"#ffffff",backgroundColor:"#6f6f6f",borderRadius:"12px",fontSize:"14px",zIndex:"1"}}>
                  3/10 
        </Typography> */}
        <Slider {...settings}>
          {socialImage?.length > 0 && socialImage.map((image,index) => (
              <Box key={index} className='post_img_wrapper' >
                <img src={files(image,"attachments")} alt='' className='img-fluid'/>
              </Box>   
            ))
          } 
          {socialVideo?.length > 0 && socialVideo.map((videos,index) => (
               <Box key={index} className='post_img_wrapper'>
                <video src={files(videos?.video,"attachments")} autoPlay controls poster={files(videos?.thumbnail,"thumb")} loop/>
              </Box>
            ))
          }
        </Slider>
      </Box>
 
    </div>
  )
}

export default SocialPostImage