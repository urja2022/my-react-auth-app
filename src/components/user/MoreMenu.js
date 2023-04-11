import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import eyeOutline from '@iconify/icons-eva/eye-outline';
import { Link as RouterLink } from 'react-router-dom';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
MoreMenu.propTypes = {
    to: PropTypes.string,

};

export default function MoreMenu({ to }) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <Icon icon={moreVerticalFill} width={20} height={20} />
            </IconButton>
            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: { width: 200, maxWidth: '100%' }
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem
                    component={RouterLink}
                    sx={{ color: 'text.secondary' }}
                    to={to}
                >
                    <ListItemIcon>
                        <Icon icon={eyeOutline} width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="View" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
            </Menu>
        </>
    )
}

