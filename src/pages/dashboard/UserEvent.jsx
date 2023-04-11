import React, { useEffect, useState } from 'react'
import { Card, Table, Switch, TableBody, TableCell, TableContainer, TableRow } from "@material-ui/core";
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { USER_API_URL } from "src/api/axios";
import LoadingScreen from 'src/components/LoadingScreen'
import UserListHead from "src/components/user/UserListHead";
import moment from 'moment'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AppTooltip from 'src/components/common/AppTooltip';
import Stack from '@mui/material/Stack';
import { useSnackbar } from "notistack";
import EventBlockUserPopup from 'src/components/user/EventBlockUserPopup';
import useStore from 'src/contexts/AuthProvider';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { Chip } from '@mui/material';
import EditPenIcon from 'src/svgComponents/EditPenIcon';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

const BusinessEdit = () => {
    const axiosPrivate = useAxiosPrivate();
    const [loding, setLoding] = useState(true);
    const [id, setId] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [openLinkPopup, setOpenLinkPopup] = useState(false);
    const permissionsData = useStore(state => state.permissions);
    const { state } = useLocation();
    const [CsvData, setCsvData] = useState([]);
    const navigate = useNavigate();

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
        { id: 'title', label: 'title', alignRight: false },
        { id: 'eventDate', label: 'event date', alignRight: false },
        { id: 'time', label: 'event time', alignRight: false },
        { id: 'duration', label: 'duration', alignRight: false },
        { id: 'type', label: 'type', alignRight: false },
        { id: 'noOfGuest', label: 'total no. of guest', alignRight: false },
        { id: 'event status', label: 'event status', alignRight: false },
        { id: 'status', label: 'status', alignRight: false },
        { id: 'action', label: 'action', alignRight: false },
    ];

    const { data: userEventList, refetch } = useQuery(
        "userEventList",
        async ({ signal }) => {
            return await axiosPrivate
                .get(USER_API_URL.userEventList + "?userId=" + state?.User_id, { signal })
                .then((res) => res.data);
        },
        { refetchOnWindowFocus: false }
    );

    useEffect(() => {
        var arr = [];
        userEventList?.map((item) => {
            var obj = {
                "title": item?.title ? item?.title : '',
                "description": item?.description ? item?.description : '',
                "event date": item?.eventDate ? moment(item?.eventDate).format("MMM DD YYYY h:mm A") : '',
                "event time": item?.time ? item?.time : '',
                "duration": item?.duration ? item?.duration + ' days' : '',
                "type": item?.businessId ? 'business' : 'user',
                "status": item?.status == 1 ? 'enable' : 'disable',
            }
            arr.push(obj);
        })
        setCsvData(arr)
    }, [userEventList]);

    const headers = [
        { label: 'title', key: "title" },
        { label: 'description', key: "description" },
        { label: 'event date', key: "event date" },
        { label: 'event time', key: "event time" },
        { label: 'duration', key: "duration" },
        { label: 'type', key: "type" },
        { label: 'status', key: "status" },
    ];

    let csvReport = {
        data: CsvData,
        headers: headers,
        filename: 'beemz-events.csv'
    };

    async function handleChangeEventStatus(id) {
        setLoding(true)
        const response = await axiosPrivate.put(USER_API_URL.eventInactive + id)
        if (response.status == 200) {
            refetch();
            enqueueSnackbar("status change successfully ", {
                variant: "success",
                anchorOrigin: { vertical: "top", horizontal: "right" },
                autoHideDuration: 2000,
            });
            setTimeout(() => {
                setLoding(false);
            }, 500);
        } else {
            enqueueSnackbar("something went wrong", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
                autoHideDuration: 2000,
            });
            setLoding(false)
        }
    };

    setTimeout(() => {
        setLoding(false);
    }, 1800);

    const handleLinkPopupClose = (value) => {
        setOpenLinkPopup(false);
        setId(false)
    };

    const handleActionPages = (data, flug) => {
        if (flug === 'view') {
            navigate(PATH_DASHBOARD.general.eventDetails, { state: { eventData: data } });
        } else if (flug === 'edit') {
            navigate(PATH_DASHBOARD.general.userEventEdit, { state: { eventData: data } });
        } else {
            navigate(PATH_DASHBOARD.general.eventInvitedUserList, { state: { eventId: data._id } });
        }
    }

    return (
        <>
            {loding ? <LoadingScreen /> : <>
                <div className="dashboard_header mb-4">
                    <h4 className="app_text_20_semibold mb-0 d-flex align-items-center">user events</h4>
                    <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>
                        {/* csv */}
                        {permissionsData?.event?.substring(1, 2) == "1" ?
                            <AppTooltip title="export-event" placement="bottom">
                                <Button className="dashboard_light_bg_icon_btn" >
                                    <CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink>
                                </Button>
                            </AppTooltip> : ''}
                    </Stack>
                </div>
                <Card>
                    <TableContainer>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            {userEventList?.length > 0 ?
                                <TableBody>
                                    {userEventList.length != 0 && userEventList?.map((row) => {
                                        var today = moment().format("MMM DD YYYY hh:mm");
                                        var dateTime = moment(row?.eventDateTime).format("MMM DD YYYY hh:mm");
                                        return (
                                            <StyledTableRow key={row._id}>
                                                <TableCell component="th" scope="row"> {row.title} </TableCell>
                                                <TableCell align="left"> {moment(row?.eventDate).format("MMM DD YYYY")} </TableCell>
                                                <TableCell align="left"> {moment(row?.time, 'hh:mm A').format("hh:mm A")} </TableCell>
                                                <TableCell align="left"> {row?.duration ? row?.duration + ' days' : ''} </TableCell>
                                                <TableCell align="left"> {row?.businessId ? 'business' : 'user'} </TableCell>
                                                <TableCell align="left"> {row?.noOfGuest ?? '-'} </TableCell>
                                                <TableCell align="left">
                                                    {
                                                        (row?.isCancle === 1) ? <Chip label="canceled" className="app_status_chip invalid" /> :
                                                            (today < dateTime) ? <Chip label="upcoming" className="app_status_chip accepted" /> : <Chip label="posted" className="app_status_chip posted" />
                                                    }
                                                </TableCell>
                                                <TableCell align="left">
                                                    {row?.isCancle === 1 ?
                                                        <Switch checked={row.status === 1 ? true : false} /> :
                                                        <AppTooltip title="change status" placement="bottom">
                                                            <Switch checked={row.status === 1 ? true : false} onChange={() => handleChangeEventStatus(row._id)} defaultChecked /></AppTooltip>}
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={3}>
                                                        <AppTooltip title="event edit" placement="bottom">
                                                            <Button sx={{ "&:hover": { bgcolor: "transparent" } }} onClick={() => handleActionPages(row, 'edit')} variant="text" className="user_list_row_btn"><EditPenIcon /></Button></AppTooltip>
                                                        <AppTooltip title="event view" placement="bottom">
                                                            <Button sx={{ "&:hover": { bgcolor: "transparent" } }} onClick={() => handleActionPages(row, 'view')} variant="text" className="user_list_row_btn"><VisibilityIcon /></Button>
                                                        </AppTooltip>
                                                        <AppTooltip title="invited users" placement="bottom">
                                                            <Button sx={{ "&:hover": { bgcolor: "transparent" } }} onClick={() => handleActionPages(row, 'invite')} variant="text" className="user_list_row_btn"><PeopleAltOutlinedIcon /></Button>
                                                        </AppTooltip>
                                                        {/* csv */}
                                                        <AppTooltip title="export-events" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip>
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
                    <EventBlockUserPopup newLinkId={id} open={openLinkPopup} onClose={handleLinkPopupClose} />

                </Card>
            </>
            }
        </>
    )
}

export default BusinessEdit