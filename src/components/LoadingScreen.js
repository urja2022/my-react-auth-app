import Lottie from "react-lottie-player";
import Loder from "../assets/loder.json";
import Backdrop from '@mui/material/Backdrop';

export default function LoadingScreen() {
  return (
    <center>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <div style={{ transform: "scaleX(-1)" }}>
          <Lottie
            loop
            animationData={Loder}
            play
            style={{ width: 180, height: 180 }}
          />
        </div>
      </Backdrop>
    </center>
  );
}
