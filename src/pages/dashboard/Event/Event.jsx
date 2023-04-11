import React, { useEffect, useState } from "react";
import { Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Switch, MenuItem, Select } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useQuery } from 'react-query';
import { USER_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import Stack from '@mui/material/Stack';
import { Button, IconButton, InputBase, Paper, Chip, FormControl } from "@mui/material";
import SearchIcon from "src/svgComponents/SearchIcon";
import { useSnackbar } from "notistack";
import LoadingScreen from 'src/components/LoadingScreen'
import useStore from 'src/contexts/AuthProvider'
import AppTooltip from "src/components/common/AppTooltip";
import moment from 'moment'
import EventBlockUserPopup from 'src/components/user/EventBlockUserPopup';
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { PATH_DASHBOARD } from "src/routes/paths";
import { useNavigate } from "react-router";
import EditPenIcon from "src/svgComponents/EditPenIcon";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { result } from "lodash";

const _ = require('lodash');

export default function Event() {
	const [tableData, setTableData] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState('name');
	const [filterName, setFilterName] = useState('');
	const axiosPrivate = useAxiosPrivate();
	const permissionsData = useStore(state => state.permissions);
	const [loding, setLoding] = useState(true);
	const { enqueueSnackbar } = useSnackbar();
	const [openLinkPopup, setOpenLinkPopup] = useState(false);
	const [id, setId] = useState(false);
	const [CsvData, setCsvData] = useState([]);
	const [filterValue, setFilterValue] = useState(1);
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

	useEffect(() => {
		var arr = [];
		tableData.map((item) => {
			var obj = {
				"title": item?.title ? item?.title : '-',
				"description": item?.description ? item?.description : '-',
				"event date": item?.eventDate ? moment(item?.eventDate).format("MMM DD YYYY h:mm A") : '-',
				"event time": item?.time ? item?.time : '-',
				"duration": item?.duration ? item?.duration + ' days' : '-',
				"type": item?.businessId ? 'business' : 'user',
				"status": item?.status == 1 ? 'enable' : 'disable',
			}
			arr.push(obj);
		})
		setCsvData(arr)
	}, [tableData]);

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
	async function fetchSeeker(page, filterName, filterValue) {
		const response = await axiosPrivate.get(USER_API_URL.eventList, { params: { page: page + 1, search: filterName, limit: rowsPerPage, eventStatus: filterValue } })
		return response.data[0];
	}

	const { isLoading, data: eventList, refetch } = useQuery(['eventList', page, filterName, filterValue], () => fetchSeeker(page, filterName, filterValue), { keepPreviousData: true, })

	useEffect(() => {
		if (eventList) {
			setTableData(eventList?.data);
			setRowsPerPage(eventList?.metadata.length != 0 ? eventList?.metadata[0].limit : 10);
		}
		setTimeout(() => {
			setLoding(false);
		}, 1800);
	}, [eventList])

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
		setTimeout(() => {
			refetch();
		}, 500);
	};

	const handleFilterByName = (event) => {
		setFilterName(event.target.value.trim());
		fetchSeeker(page, filterName, filterValue);
	};

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - eventList?.data?.length) : 0;

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
	// async function handleChangeBlockUsers(id) {
	// 	setOpenLinkPopup(true);
	// 	setId(id);
	// };
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

	const handleFilter = (e) => {
		setFilterValue(e.target.value)
		refetch()
	}
	if (isLoading) return <LoadingScreen />

	return (
		<>
			{loding ? <LoadingScreen /> : <>
				<div className="dashboard_header mb-4">
					<Paper className='dashboard_searchbox col-lg-4'>
						<IconButton>
							<SearchIcon />
						</IconButton>
						<InputBase
							fullWidth
							sx={{ flex: 1 }}
							placeholder="search event..."
							onChange={(e) => handleFilterByName(e)}
						/>
					</Paper>
					<div className="form-group w-25">
						<FormControl fullWidth>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								label="filter"
								defaultValue={filterValue}
								onChange={(e) => handleFilter(e)}
							>
								<MenuItem value="1"> all </MenuItem>
								<MenuItem value="2"> upcoming </MenuItem>
								<MenuItem value="3"> posted </MenuItem>
								<MenuItem value="4"> canceled </MenuItem>
							</Select>
						</FormControl>
					</div>
					<Stack direction={"row"} className="d-flex align-items-center" spacing={2}>
						<AppTooltip title="refresh" placement="bottom">
							<Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button>
						</AppTooltip>
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
								rowCount={eventList?.data?.length}
								onRequestSort={handleRequestSort}
							/>
							{tableData?.length > 0 ?

								<TableBody>
									{tableData.length != 0 && tableData?.map((row) => {
										var today = moment().format("MMM DD YYYY hh:mm");
										var dateTime = moment(row?.eventDateTime).format("MMM DD YYYY hh:mm");
										return (
											<StyledTableRow key={row._id}>
												<TableCell component="th" scope="row"> {row.title} </TableCell>
												<TableCell align="left"> {moment(row?.eventDate).format("MMM DD YYYY")} </TableCell>
												<TableCell align="left"> {moment(row?.time, 'hh:mm A').format("hh:mm A")} </TableCell>
												<TableCell align="left"> {row?.duration ? row?.duration + ' hours' : ''} </TableCell>
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
														{/* {permissionsData?.sub_admin?.substring(2, 3) == "1" ?
															<AppTooltip title="event block user list" placement="bottom">
																<Button onClick={() => handleChangeBlockUsers(row._id)} variant="text" className="user_list_row_btn"><BlockOutlinedIcon /></Button>
															</AppTooltip> : ''} */}
														<AppTooltip title="event edit" placement="bottom">
															<Button sx={{ "&:hover": { bgcolor: "transparent" } }} onClick={() => handleActionPages(row, 'edit')} variant="text" className="user_list_row_btn"><EditPenIcon /></Button>
														</AppTooltip>
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
									{/* {emptyRows > 0 && (
										<TableRow style={{ height: 53 * emptyRows }}>
											<TableCell colSpan={6} />
										</TableRow>
									)} */}
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
					<TablePagination
						component="div"
						rowsPerPageOptions={[10, 20, 50, 100]}
						count={eventList?.metadata.length != 0 ? eventList?.metadata[0].total : 0}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
					<EventBlockUserPopup newLinkId={id} open={openLinkPopup} onClose={handleLinkPopupClose} />
				</Card>
			</>
			}
		</>
	)
}