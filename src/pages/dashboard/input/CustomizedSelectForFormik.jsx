import Select from "@mui/material/Select";

const CustomizedSelectForFormik = ({ children, form, field ,label,labelId,id,...props }) => {
    const { setFieldValue } = form;
    
    return (
      <Select
        {...field}
        labelId={labelId}
        label={label}
        onChange={e => {setFieldValue(field.name, e.target.value);}}
      >{children}
      </Select>
    );
};

export default CustomizedSelectForFormik