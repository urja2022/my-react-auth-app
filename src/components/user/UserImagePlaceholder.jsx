const PRIMARY_NAME = ['A', 'N', 'H', 'L', 'Q', '9', '8'];
const INFO_NAME = ['F', 'G', 'T', 'I', 'J', '1', '2', '3'];
const SUCCESS_NAME = ['K', 'D', 'Y', 'B', 'O', '4', '5'];
const WARNING_NAME = ['P', 'E', 'R', 'S', 'C', 'U', '6', '7'];
const ERROR_NAME = ['V', 'W', 'X', 'M', 'Z'];

function getAvatarColor(firstChar) {
    if (PRIMARY_NAME.includes(firstChar)) return '0d47a1';
    if (INFO_NAME.includes(firstChar)) return '0099CC';
    if (SUCCESS_NAME.includes(firstChar)) return '007E33';
    if (WARNING_NAME.includes(firstChar)) return 'FF8800';
    if (ERROR_NAME.includes(firstChar)) return 'CC0000';
    return '0d47a1';
}

const UserImagePlaceholder = ({ firstChar, diameter }) => {
    return (
        <div className='userImgPlaceholder' style={{ backgroundColor: `#${getAvatarColor(firstChar)}`, fontSize: `calc(${diameter / 2}px)` }}>{firstChar}</div>
    )
}

export default UserImagePlaceholder