import { Button, Popover } from '@mui/material'
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import ArrowDownCircle from 'src/svgComponents/ArrowDownCircle'
import HomeIcon from 'src/svgComponents/HomeIcon'
import LogoWithText from 'src/svgComponents/LogoWithText'
import AppTooltip from "src/components/common/AppTooltip";
import LocationPin from 'src/svgComponents/LocationPin'
import useLogout from 'src/hooks/useLogout';
import { useSnackbar } from 'notistack'
import { PATH_AUTH } from "src/routes/paths";

const MainNavbar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const logout = useLogout();
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate(PATH_AUTH.login);
            handleClose();
        } catch (error) {
            enqueueSnackbar('unable to logout', { variant: 'error' });
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <div className='navbar_wrapper'>
            <div className='navbar_container'>
                <div className='logo_container'>
                    <NavLink to="/dashboard/"><LogoWithText /></NavLink>
                </div>
                <div className='navbar_menu_container'>
                    <ul>
                        <li>
                            <AppTooltip title="dashboard" placement="bottom">
                                <NavLink to="/dashboard/"><HomeIcon /></NavLink>
                            </AppTooltip>
                        </li>
                        <li>
                            <AppTooltip title="map" placement="bottom">
                                <NavLink to='/map'><LocationPin /></NavLink>
                            </AppTooltip>
                        </li>
                    </ul>
                </div>
                <div className='navbar_config_container'>
                    <ul>
                        <li>
                            <Button onClick={(e) => handleClick(e)} className='main_nav_config_btn h-100'><ArrowDownCircle /></Button>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <div className='logout_popover_content'>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <AppTooltip title="admin logout" placement="bottom">
                                            <Button variant="contained" className='theme_button app_text_14_semibold text-lowercase py-2 w-100' onClick={handleLogout}>logout</Button>
                                        </AppTooltip>
                                    </div>
                                </div>
                            </Popover>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MainNavbar