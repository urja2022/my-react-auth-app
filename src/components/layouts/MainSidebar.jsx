import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Category from 'src/svgComponents/sidebarIcons/Category'
import Roles from 'src/svgComponents/sidebarIcons/Roles'
import Trust from 'src/svgComponents/sidebarIcons/Trust'
import Business from 'src/svgComponents/sidebarIcons/Business'
import Event from 'src/svgComponents/sidebarIcons/Event'
import UserCircle from 'src/svgComponents/sidebarIcons/UesrCircle'
import Dashboard from 'src/svgComponents/sidebarIcons/Dashboard'
import SubAdmin from 'src/svgComponents/sidebarIcons/SubAdmin'
import Trace from 'src/svgComponents/sidebarIcons/Trace'
import Configurable from 'src/svgComponents/sidebarIcons/Configurable'
import Setting from 'src/svgComponents/sidebarIcons/Setting'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { Backdrop, Box, Fab, IconButton, InputBase, List, Paper } from '@mui/material'
import SearchIcon from 'src/svgComponents/SearchIcon'
import useStore from 'src/contexts/AuthProvider'
import MapFeedItem from '../home/MapFeedItem'
import WidgetsIcon from "@mui/icons-material/Widgets";
import SidebarListitem from './SidebarListitem'
import NotificationsIcon from '@mui/icons-material/Notifications';
import PostIcon from 'src/svgComponents/sidebarIcons/PostIcon'
import ContactPageIcon from '@mui/icons-material/ContactPage';


const sidebarData = [
    {
        linkText: 'dashboard',
        link: PATH_DASHBOARD.general.dashboard,
        linkIconElem: <Dashboard />,
        permission: "",
    },
    {
        linkText: 'users',
        link: PATH_DASHBOARD.general.users,
        linkIconElem: <UserCircle />,
        permission: "users",
    },
    {
        linkText: 'chat group',
        link: PATH_DASHBOARD.general.chatGroup,
        linkIconElem: <SubAdmin />,
        permission: "users",
    },
    {
        linkText: 'roles/permissions',
        link: PATH_DASHBOARD.general.rolesPermissions,
        linkIconElem: <Roles />,
        permission: "roles",
    },
    {
        linkText: 'sub admin',
        link: PATH_DASHBOARD.general.admin,
        linkIconElem: <SubAdmin />,
        permission: "sub_admin",
    },
    {
        linkText: 'business',
        link: PATH_DASHBOARD.general.business,
        linkIconElem: <Business />,
        permission: "business_request",
    },
    {
        linkText: 'events',
        link: PATH_DASHBOARD.general.event,
        linkIconElem: <Event />,
        permission: "event",
    },
    {
        linkText: 'delete user/business',
        link: PATH_DASHBOARD.general.userDeleteReq,
        linkIconElem: <UserCircle />,
        permission: "users",
    },
    
    {
        linkText: 'settings',
        link: PATH_DASHBOARD.general.settings,
        linkIconElem: <Setting />,
        permission: "",
    },
   
]

const MainSidebar = () => {
    const location = useLocation();
    let activeLink = location.pathname;
    const locationData = useStore(state => state.locationData);
    const permissionsData = useStore(state => state.permissions);
    const sidebarContentBoxRef = useRef(null);
    const [searchValue, setSearchValue] = useState('');
    const [showDashboard, setShowDashboard] = useState(false);
    const [isOpenedManually, setIsOpenedMenaually] = useState(false);


    const handleLinkOnClick = () => {
        setShowDashboard(false);
        setIsOpenedMenaually(false);
    }

    useEffect(() => {
        sidebarContentBoxRef?.current?.addEventListener("scroll", () => {
            if (sidebarContentBoxRef.current.scrollTop > 10) {
                sidebarContentBoxRef.current.classList.add("scrolling")
            } else {
                sidebarContentBoxRef.current.classList.remove("scrolling")
            }
        })
    }, [])

    useEffect(() => {
        window.addEventListener("resize", () => {
            const windowCurrentWidth = window.outerWidth;
            if (windowCurrentWidth < 991 && activeLink.includes("/dashboard")) {
                setShowDashboard(false);
                setIsOpenedMenaually(false);
            }
        });
        return window.removeEventListener("resize", () => {
            const windowCurrentWidth = window.outerWidth;
            if (windowCurrentWidth < 991 && activeLink.includes("/dashboard")) {
                setShowDashboard(false);
                setIsOpenedMenaually(false);
            }
        });
    });
    const handleSidebarOnManualOpen = () => {
        setIsOpenedMenaually(true);
        setShowDashboard(true);
    };

    const handleDashboardBackdropClose = () => {
        setShowDashboard(false);
        setIsOpenedMenaually(false);
    };
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            <div className={`main_sidebar_wrapper ${showDashboard ? "show" : ""}`}>
                {(activeLink.includes('/dashboard/') || activeLink === '/') &&
                    <List className=''>
                        {/* <li style={{ marginTop: "8px", padding: "8px 0px" }}>
                            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className="ms-3"
                                TransitionProps={{
                                    timeout: 250s
                                }}
                                elevation={0}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                    sx={{
                                        height: "0px", minHeight: "0px", padding: "13px 20px", margin: "0px !important",
                                        "& .MuiAccordionSummary-content": {
                                            alignItems: "center",
                                        },
                                        "&.MuiAccordionSummary-root": {
                                            paddingLeft: "8px !important",
                                            paddingRight: '20px !important',
                                            width: "100%"
                                        },
                                        "&.Mui-expanded": {
                                            minHeight: "0px !important",
                                            marginBottom: "0px !important"
                                        }
                                    }}
                                >
                                    <Dashboard />
                                    <Typography sx={{ flexShrink: 0, whiteSpace: "nowrap" }} className="app_text_14 text-lowercase app_text_black d-flex align-items-center ms-3 mr-">
                                        General settings
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ padding: "8px 0px 0px 8px" }}>
                                    <li className={`main_sidebar_item `}>
                                        <NavLink onClick={() => handleLinkOnClick()} className="d-flex align-items-center" to={PATH_DASHBOARD.general.userIdVerification}>
                                            <UserCircle />
                                            <span className='app_text_14 text-lowercase app_text_black d-flex align-items-center ms-3'>{"users id verification"}</span>
                                        </NavLink>
                                    </li>

                                    <li className={`main_sidebar_item `}>
                                        <NavLink onClick={() => handleLinkOnClick()} className="d-flex align-items-center" to={PATH_DASHBOARD.general.idVerifyLimit}>
                                            <UserCircle />
                                            <span className='app_text_14 text-lowercase app_text_black d-flex align-items-center ms-3'>{"id verification limit"}</span>
                                        </NavLink>
                                    </li >
                                    <li className={`main_sidebar_item  mb-0`}>
                                        <NavLink onClick={() => handleLinkOnClick()} className="d-flex align-items-center" to={PATH_DASHBOARD.general.updateIdVerification}>
                                            <UserCircle />
                                            <span className='app_text_14 text-lowercase app_text_black d-flex align-items-center ms-3'>{"update id verification"}</span>
                                        </NavLink>
                                    </li>
                                </AccordionDetails>
                            </Accordion>
                        </li> */}
                        {sidebarData.map(({ linkText, link, linkIconElem, permission, children }, index) => {
                            return <SidebarListitem LinkText={linkText} Link={link} LinkIconElem={linkIconElem} children={children} hasChildren={children?.length > 0} />
                        }
                        )}

                    </List>}
            </div>
            {
                isOpenedManually && (
                    <Backdrop
                        className="dashbord_backdrop"
                        sx={{ color: "#fff" }}
                        open={isOpenedManually}
                        onClick={handleDashboardBackdropClose}
                    ></Backdrop>
                )
            }

            {
                !showDashboard && (
                    <Fab
                        aria-label="add"
                        className="dashboard_sidebar_button"
                        onClick={() => handleSidebarOnManualOpen()}
                    >
                        <WidgetsIcon className="sidebar_opan_icon" />
                    </Fab>
                )
            }
        </>
    )
}

export default MainSidebar