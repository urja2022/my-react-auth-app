import React from 'react'
import StarYellowEditable from 'src/svgComponents/StarYellowEditable';

const TrustLevelFilter = ({ index, onChange, selected }) => {
    return (
        <div>
            <input onChange={() => onChange(index)} type="checkbox" id={`trustLevelStar_${index}`} checked={selected} hidden />
            <label style={{ cursor: "pointer" }} htmlFor={`trustLevelStar_${index}`} className="d-flex flex-column align-items-center">
                <StarYellowEditable color={selected ? '#FFCB45' : ''} />
                <span className='mt-2 app_text_14'>{index + 1}</span>
            </label>
        </div>
    )
}

export default TrustLevelFilter