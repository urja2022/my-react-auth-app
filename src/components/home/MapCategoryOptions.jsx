import React, { useEffect, useRef } from 'react'
import { Button, Stack } from '@mui/material'
import DoneAllIcon from "@mui/icons-material/DoneAll";
import BuildingEditable from "src/svgComponents/BuildingEditable";
import DoubleUserEditable from "src/svgComponents/DoubleUserEditable";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';

const MapCategoryOptions = ({ categoryList, selectedMapOption, mapCatUpdateFunc }) => {

    const mapCatRef = useRef(null);
    const mapCatOptionsLeftScrollBtnRef = useRef(null);
    const mapCatOptionsRightScrollBtnRef = useRef(null);

    // Map Category Options container functionality 
    useEffect(() => {
        if (mapCatRef?.current?.scrollWidth > 900) {
            mapCatOptionsRightScrollBtnRef.current.classList.add("active")
        }
    })

    const mapCatOptionsScrollLeftBtnClick = () => {
        mapCatRef.current.scrollTo({ behavior: 'smooth', left: 0 })
        mapCatOptionsLeftScrollBtnRef.current.classList.remove("active")
    }

    const mapCatOptionsScrollRightBtnClick = () => {
        mapCatRef.current.scrollTo({ behavior: 'smooth', left: mapCatRef.current.scrollWidth })
        mapCatOptionsLeftScrollBtnRef.current.classList.add("active")

    }
    useEffect(() => {
        const elem = document.getElementById("mapCategoriesOptionsContainer");
        // if (elem.scrollWidth <= 1100) {
        //     elem.style.maxWidth = 'unset';
        //     elem.style.width = 'auto'
        //     mapCatOptionsRightScrollBtnRef.current.classList.remove("active")
        // } else {
        //     elem.style.maxWidth = '900px';
        //     elem.style.width = '50vw'
        //     mapCatOptionsRightScrollBtnRef.current.classList.add("active")
        // }
        elem.addEventListener("scroll", () => {

            if (elem.scrollWidth === elem.scrollLeft + 900) {
                mapCatOptionsRightScrollBtnRef.current.classList.remove("active")
            } else {
                mapCatOptionsRightScrollBtnRef.current.classList.add("active")
            }
        })

    })
    //-----------------------------------------------------

    return (

        <div className="home_map_options_wrapper">
            <div className="position-relative">
                <Button ref={mapCatOptionsLeftScrollBtnRef} onClick={() => mapCatOptionsScrollLeftBtnClick()} className="home_map_btn app_text_14_semibold more_cat_map_btn_left"><KeyboardArrowLeftOutlinedIcon /></Button>
                <Button ref={mapCatOptionsRightScrollBtnRef} onClick={() => mapCatOptionsScrollRightBtnClick()} className="home_map_btn app_text_14_semibold more_cat_map_btn_right"><KeyboardArrowRightOutlinedIcon /></Button>
                <Stack direction={"row"} id="mapCategoriesOptionsContainer" spacing={2} ref={mapCatRef} className="home_map_options_container">
                    <Button
                        className={`home_map_btn app_text_14_semibold ${selectedMapOption === "all" ? "mapActive" : ""}`}
                        onClick={() => mapCatUpdateFunc("all")}
                        startIcon={<DoneAllIcon color={selectedMapOption === "all" ? "#fff" : "#626B76"} />}
                        variant='contained'>
                        <span className='map_cat_btn_text'>All</span>
                    </Button>

                    {categoryList && categoryList.map(cate => {
                        return (
                        
                        <Button
                            key={cate._id}
                            className={`home_map_btn app_text_14_semibold ${selectedMapOption === cate._id ? "mapActive" : ""}`}
                            onClick={() => mapCatUpdateFunc(cate._id)}
                            startIcon={<BuildingEditable color={selectedMapOption === cate._id ? "#fff" : "#626B76"} />}
                            variant='contained'>
                            <span className='map_cat_btn_text'>{cate.name}</span>
                        </Button>)
                    })}
                    <Button
                        className={`home_map_btn app_text_14_semibold ${selectedMapOption === "people" ? "mapActive" : ""}`}
                        onClick={() => mapCatUpdateFunc("people")}
                        startIcon={<DoubleUserEditable color={selectedMapOption === "people" ? "#fff" : "#626B76"} />}
                        variant='contained'>
                        <span className='map_cat_btn_text'>People</span>
                    </Button>
                </Stack>
            </div>
        </div>

    )
}

export default MapCategoryOptions