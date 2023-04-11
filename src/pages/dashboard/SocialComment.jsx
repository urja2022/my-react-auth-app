import React, { useEffect, useState } from 'react'
import { Card, Table, TableBody, TableCell, TableContainer, TableRow, Switch } from "@material-ui/core";
import { useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { SOCIAL_API_URL } from "src/api/axios";
import LoadingScreen from 'src/components/LoadingScreen'
import UserListHead from "src/components/user/UserListHead";
import moment from 'moment'
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router";
import AppTooltip from 'src/components/common/AppTooltip';
import { useSnackbar } from "notistack";

const SocialComment = () => {
    const axiosPrivate = useAxiosPrivate();
    const [loding, setLoding] = useState(true);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

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
        { id: 'comment', label: 'comment', alignRight: false },
        { id: 'createdAt', label: 'date', alignRight: false },
        { id: 'enabled', label: 'enabled', alignRight: false },

    ];

    const { data: commentList, refetch } = useQuery(
        "commentList",
        async ({ signal }) => {
            return await axiosPrivate
                .get(SOCIAL_API_URL.getSocialCommentList + state?.post_id, { signal })
                .then((res) => res.data[0].data);
        },
        { refetchOnWindowFocus: false }
    );

    setTimeout(() => {
        setLoding(false);
    }, 1800);
    async function handleChangeUserStatus(id) {
        setLoding(true)
        const response = await axiosPrivate.post(SOCIAL_API_URL.removeComment, { postId: state?.post_id, commentId: id })
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

    return (
        <>
            {loding ? <LoadingScreen /> : <>
                <div className="dashboard_header mb-4">
                    <h4 className="app_text_20_semibold mb-0 d-flex align-items-center">posts comments</h4>
                </div>
                <Card>
                    <TableContainer>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            {commentList?.length > 0 ?
                                <TableBody>
                                    {commentList.map((row) => {
                                        return (
                                            <StyledTableRow key={row._id}>
                                                <TableCell component="th" scope="row">
                                                    {row?.userName}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row?.comment}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {moment(row.createdAt).format("MMM DD YYYY h:mm A")}
                                                </TableCell>
                                                <TableCell align="left">
                                                    <AppTooltip title="change status" placement="bottom"><Switch
                                                        checked={row.isDeleteAdmin !== 1 ? true : false}
                                                        onChange={() => handleChangeUserStatus(row._id)}
                                                        defaultChecked /></AppTooltip>
                                                </TableCell>
                                            </StyledTableRow>
                                        )
                                    })}
                                </TableBody>
                                :
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" colSpan={5} sx={{ py: 5 }}>
                                            <span className="app_text_16_semibold">no data found</span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>}
                        </Table>
                    </TableContainer>
                </Card>
            </>
            }
        </>
    )
}

export default SocialComment