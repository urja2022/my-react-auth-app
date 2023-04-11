export default function getDataURL(url, color) {

  return new Promise((resolve, reject) => {
    var canvas = document.createElement("CANVAS");
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    img.onload = function () {
      var dataURL;
      canvas.height = 70;
      canvas.width = 70;
      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;
      var radius = centerX / 2;
      var radiusOne = centerX / 2;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radiusOne, 0, 2 * Math.PI, false);
      ctx.fillStyle = "rgba(255,255,255, 1.0)";
      ctx.lineWidth = 4;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(35, centerY + radius);
      ctx.lineTo(35, centerY + radius + 10);
      ctx.lineWidth = 6;
      ctx.strokeStyle = color;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, centerX / 2.2, centerY / 2.2, 40, 40);

      dataURL = canvas.toDataURL();
      return resolve(dataURL);
    };

    img.onerror = function () {
      img.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAUKSURBVFiFtZfbb1RVFMZ/65zTaWeG6UxnpuVOoUOpQjFBuRhULjEgWggBpepf4FNF33wAcsLt1YAmJsY3TYAiBhRqeSAFwyUIQpRwtVS5lNLLtENv087Mme1D6TBtz3SmEL+3vdfaa31nn3XbwgRhmg1GhyM2V7eS85TCBSBCv6Vrd4IxR6Nprk5MxJ7k5rTWEdY960E2Cmo94M+g2qOgAeFgINFzxDSrYy9GQCnZuqf+gyTsFcXcXMimHb6Pkj3+5MXvTNNMTphAjVk3Q3Q5DLw+WmboOmUzC/H7nAgQ7orS9LCbhGWNpQEXDEls+XLbhuacCdTsrFuEyDGBmaNliysns3rZLFzOvBH7fdE4py7c5+qNVjuTLaKSm/btqLqYlcDWnSeWKdEaAOdo2Zo3Slm+aLqdgxTO/tHMqQv37ERRJbLqq23rfk/f1NIXn+2pn6pEO2Ln/KWyQFbnAG++Np2K2bYx6hSljtWYdTPsCSglyaT6CbD1smLJDLttW6xcOubPDWOK6HIIpVI3nyKwddfJj7EJOACP28HUYnfOBKaWuJnkcmQSL/90V/2HIwiYZq1DidqZ6YR3Un7Ozofh84xzRthbs78uP0WgyyjcAIQy6ccTGdM4IwZjY1MyDXOkW95LEVBKbRxPOxyJZjM4AgMxi87ugfGVFBsBNNNsMICq8XQTVpK/brfnTODarXYsK+utVW2prdW1iN5XTubansKZSw/o7s1a2on0DHL60oNceAZLGt0hzdKMsly0+/rjfH/0Op2RzFcbjkT54ecb9EfjuZhE4hIyNAuvyqknQkckyjcH/mTJK5NZEApQHHADivZwP9cbw1y61mrbDzIS0MVn5Krs9TioLA9QOqUAdwFoqodwWwQAXdOpLMtnzrRZ3Hs8wLU74Zx+F4CR1Hki48RL6bRCViyeSdksL53hDgai/ZCE9CPKGppB3A54tcLD28vn0HQvwm+XH3K/pTujbWWpiKFE7gpqLDNdY+1bs1lcOSXVsYr8Adpb4yQS9v9YNwx8RX4ECJX6KCv1cfnaY06e/dc2KzTNaNSCMUcjMIKmiLB57TyWpDkf3vcHg4iMDRoRwR8IomnP2osASxZOYfOacru+39FSEWnSTHN1AsWZdMnC8iAvh+wz0zDy8PkDY/Z9RX7y8uzr//y5ARaUB0cR5vjh6mprqBJqHEgXLpg3Unk0nE4X7kme1No9yYPTNX6zqqwYaVMhR+FpKR4sLv5RCY0pBwXZk6PQ6yM/vwCHI59Cry+rvqtgxAT1jz/R/WuKwLefLI5Lku3D0kdtvVkNighFgUDGmBiN5taeZwslXwxPzKmI2b993SEFFwDOX2nOqflomo6m6Vn1BmIW56+0DBGHc/u3v3M4ZSPtk5SuyfvAw+7eGAdP3CIWz72qZcJgzOLg8Zv09A0CtCQt9REiqbwfc3c1u+uXilKnAWeRt4D1q0KUzfQ+l/O79yOcOH2Xru5BgKgoVu7b8e6ldJ2cxvIZkz0sml9CxRw/blee3ZEUevtj3G7q4urNVppbU7H0SIlsGj0RZyQA8PnuX6ZbyqgFlqcr+7wFlATceFwGBflD2TIwmKCnL05bZz+RJwMj6qrAOcvSq7821z6y8/M/Ps24h2Lvcz/N0mGatY5Ow1P1dIyqAjJVqg4RjotSx3xWb92LP05tsKW2Vi9pdIc0pZeLpTwASpeepFh/t83tu3u4unpCqfMfIzLR3v5BgA8AAAAASUVORK5CYII=";
      img.onload();
    };
  });
}
