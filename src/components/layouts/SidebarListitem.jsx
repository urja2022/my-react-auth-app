import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Collapse, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { ListItemText } from '@material-ui/core';
import Trace from 'src/svgComponents/DashboardCardIcons/Trace';
import Dashboard from 'src/svgComponents/sidebarIcons/Dashboard';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { StarBorder } from '@mui/icons-material';
import { useNavigate ,useLocation} from 'react-router';

const SidebarListitem = ({ LinkText, Link, LinkIconElem, children, hasChildren }) => {
    const location = useLocation();
    let activeLink = location.pathname;
    const [isCollapes, setisCollapes] = useState(false)
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
    const navigate =useNavigate()
    return (
        <>
            {
                !hasChildren ? (<ListItem sx={{
                    "&.MuiListItem-root": {
                        padding: "0px"
                    }
                  }}
                 className=""
                >
                    <ListItemButton sx={{
                        "&.MuiButtonBase-root": {
                            padding: "10px 20px",
                        },
                      
                    }}
                    onClick={()=>navigate(Link)}
                    className={`main_sidebar_item ${activeLink === Link ? "isActive" : ""
                                        }`}
                     >
                        <ListItemIcon sx={{
                            "&.MuiListItemIcon-root": {
                                minWidth: "35px"
                            }
                        }}>
                            {LinkIconElem}
                        </ListItemIcon>
                        <ListItemText className='app_text_14 text-lowercase app_text_black d-flex align-items-center'>
                            {LinkText}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>) : (
                    <>
                        <ListItem sx={{
                            "&.MuiListItem-root": {
                                padding: "0px"
                            }
                        }}
                        className="main_sidebar_item ">
                            <ListItemButton sx={{
                                "&.MuiButtonBase-root": {
                                    padding: "10px 20px",
                                },
                            

                            }} onClick={handleClick}>
                                <ListItemIcon sx={{
                                    "&.MuiListItemIcon-root": {
                                        minWidth: "35px"
                                    }
                                }} className={`main_sidebar_item ${activeLink === Link ? "isActive" : ""
                            }`}>
                                    {LinkIconElem}
                                </ListItemIcon>
                                <ListItemText className='app_text_14 text-lowercase app_text_black d-flex align-items-center'>
                                    {LinkText}
                                </ListItemText>
                                <ListItemIcon sx={{
                                    "&.MuiListItemIcon-root": {
                                        minWidth: "0px"
                                    }
                                }}>
                                    {
                                        open ? <ExpandLessIcon /> : <ExpandMoreIcon />
                                    }
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            {
                                children?.map(({ linkText, link, linkIconElem }) => {
                                    return <ListItem sx={{
                                        "&.MuiListItem-root": {
                                            padding: "0px 0px 0px 30px"
                                        }
                                    }} >
                                        <ListItemButton sx={{
                                            "&.MuiButtonBase-root": {
                                                padding: "10px 20px",
                                            },
                        
                                        }}
                                        onClick={()=>navigate(link)}
                                        className={`main_sidebar_item ${activeLink === link ? "isActive" : ""
                                        }`}
                                        >
                                            <ListItemIcon sx={{
                                                "&.MuiListItemIcon-root": {
                                                    minWidth: "35px"
                                                }
                                            }}>
                                                {linkIconElem}
                                            </ListItemIcon>
                                            <ListItemText className='app_text_14 text-lowercase app_text_black d-flex align-items-center'>
                                                {linkText}
                                            </ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                })
                            }
                            <List component="div" disablePadding>


                            </List>
                        </Collapse>
                    </>
                )
            }

        </>
    )
}

export default SidebarListitem