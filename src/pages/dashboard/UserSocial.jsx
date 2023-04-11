import React, { useEffect, useState } from 'react'
import { IconButton, InputBase, Paper, TextField, MenuItem, Card, Table, Switch, TableBody, TableCell, TableContainer, TablePagination, TableRow, Box, Chip } from "@material-ui/core";
import { useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { SOCIAL_API_URL } from "src/api/axios";
import LoadingScreen from 'src/components/LoadingScreen'
import UserListHead from "src/components/user/UserListHead";
import moment from 'moment'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import EditPenIcon from 'src/svgComponents/EditPenIcon'
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import AppTooltip from 'src/components/common/AppTooltip';
import Stack from '@mui/material/Stack';
import { useSnackbar } from "notistack";
import BinIcon from 'src/svgComponents/BinIcon'
import SocialReportUserPopup from 'src/components/user/SocialReportUserPopup';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';

const UserSocial = () => {
    const axiosPrivate = useAxiosPrivate();
    const [loding, setLoding] = useState(true);
    const [id, setId] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [openLinkPopup, setOpenLinkPopup] = useState(false);

    const { state } = useLocation();

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: '#ffffff',

        },
        '&:nth-of-type(even)': {
            background: "linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), #F4F5F7",
        },
        // hide last border
        '& td, & th': {
            border: 0,
        },
    }));
    const TABLE_HEAD = [
        { id: 'name', label: 'name', alignRight: false },
        { id: 'address', label: 'address', alignRight: false },
        { id: 'comment', label: 'comment', alignRight: false },
        { id: 'like', label: 'like', alignRight: false },
        { id: 'description', label: 'description', alignRight: false },
        { id: 'visibility', label: 'visibility', alignRight: false },
        { id: 'createdAt', label: 'createdAt', alignRight: false },
        { id: 'action', label: 'action', alignRight: false },
    ];

    const { data: userSocialList, refetch } = useQuery(
        "userSocialList",
        async ({ signal }) => {
            return await axiosPrivate
                .get(SOCIAL_API_URL.getUserSocialList + state?.User_id, { signal })
                .then((res) => res.data[0].data);
        },
        { refetchOnWindowFocus: false }
    );

    async function handleChangePostStatus(id) {
        setLoding(true)
        const response = await axiosPrivate.put(SOCIAL_API_URL.postInactive + id)
        if (response.status == 200) {
            refetch();
            enqueueSnackbar("status change successfully ", {
                variant: "success",
                anchorOrigin: { vertical: "top", horizontal: "right" },
                autoHideDuration: 2000,
            });
            setTimeout(() => {
                setLoding(false);
            }, 1000);
        } else {
            enqueueSnackbar("something went wrong", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
                autoHideDuration: 2000,
            });
            setLoding(false)
        }
    };

    async function handleChangeBlockUsers(id) {
        setOpenLinkPopup(true);
        setId(id);
    };

    setTimeout(() => {
        setLoding(false);
    }, 2000);

    const handleLinkPopupClose = (value) => {
        setOpenLinkPopup(false);
        setId(false)
    };
    const handleRequestSocialComment = (post_id) => {
        navigate(PATH_DASHBOARD.general.socialComment, { state: { post_id: post_id } });
    };
    return (
        <>
            {loding ? <LoadingScreen /> : <>
                <div className="dashboard_header mb-4">
                    <h4 className="app_text_20_semibold mb-0 d-flex align-items-center">user social media posts</h4>
                </div>
                <Card>
                    <TableContainer>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            {userSocialList?.length > 0 ?
                                <TableBody>
                                    {userSocialList.length != 0 && userSocialList?.map((row) => {
                                        return (
                                            <StyledTableRow key={row._id}>
                                                <TableCell component="th" scope="row">
                                                    {row.userName}
                                                </TableCell>
                                                <TableCell align="left"> {row?.address?.name}</TableCell>
                                                <TableCell align="left"> {row.totalComments ?? 0}</TableCell>
                                                <TableCell align="left"> {row.totalLikes ?? 0}</TableCell>
                                                <TableCell align="left"> {row?.description}</TableCell>                                                <TableCell align="left">
                                                    <AppTooltip title="change status" placement="bottom"><Switch
                                                        checked={row.isBlockPost === 0 ? true : false}
                                                        onChange={() => handleChangePostStatus(row._id)}
                                                        defaultChecked /></AppTooltip>
                                                </TableCell>
                                                <TableCell align="left">  {moment(row?.createdAt).format("MMM DD YYYY h:mm A")}
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={3}>
                                                        <AppTooltip title="post report user list" placement="bottom"><Button
                                                            onClick={() => handleChangeBlockUsers(row._id)}
                                                            variant="text" className="user_list_row_btn"><BlockOutlinedIcon /></Button></AppTooltip>
                                                        <AppTooltip title="users comments" placement="bottom"><Button
                                                            onClick={() => handleRequestSocialComment(row._id)}
                                                            variant="text" className="user_list_row_btn"><CommentOutlinedIcon /></Button></AppTooltip>
                                                    </Stack>
                                                </TableCell>
                                            </StyledTableRow>
                                        )
                                    })}

                                </TableBody>
                                :
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" colSpan={7} sx={{ py: 5 }}>
                                            <span className="app_text_16_semibold">no data found</span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>}

                        </Table>
                    </TableContainer>
                    <SocialReportUserPopup newLinkId={id} open={openLinkPopup} onClose={handleLinkPopupClose} />

                </Card>
            </>
            }
        </>
    )
}

export default UserSocial