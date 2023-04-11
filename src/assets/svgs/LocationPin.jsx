import React from "react";

const LocationPin = ({ color, w, h }) => {
  return (
    <svg
      width={w ? w : '18'}
      height={h ? h : "22"}
      viewBox="0 0 18 22"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 9.22217C17 15.4444 9 20.7777 9 20.7777C9 20.7777 1 15.4444 1 9.22217C1 7.10044 1.84285 5.06561 3.34315 3.56531C4.84344 2.06502 6.87827 1.22217 9 1.22217C11.1217 1.22217 13.1566 2.06502 14.6569 3.56531C16.1571 5.06561 17 7.10044 17 9.22217Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.00456 11.889C10.4773 11.889 11.6712 10.6951 11.6712 9.22233C11.6712 7.74957 10.4773 6.55566 9.00456 6.55566C7.5318 6.55566 6.33789 7.74957 6.33789 9.22233C6.33789 10.6951 7.5318 11.889 9.00456 11.889Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LocationPin;
