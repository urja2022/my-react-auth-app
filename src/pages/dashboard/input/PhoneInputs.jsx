import { FormHelperText } from "@mui/material";
import PhoneInput from "react-phone-input-2";

const PhoneInputs = ({ name,customeName,disabled,data, label,form,errors, ...props }) => {
  //TODO:Solve Validation issue in Onchange event
  const { setFieldValue } = form;
  return (
    <>
      <PhoneInput
        containerClass=""
        inputProps={{
          style: { width: "100%" },
          name: customeName,
          required: true,
        }}
        value={data}
        disabled={disabled}
        onChange={(phone) => setFieldValue(customeName,phone)}
        country={"za"}
        specialLabel={label}
      />
      <FormHelperText error>{errors}</FormHelperText>
    </>
  );
};

export default PhoneInputs;
