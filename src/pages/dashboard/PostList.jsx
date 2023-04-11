import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, styled, useMediaQuery, useTheme } from '@material-ui/core'
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react'
import AppTooltip from 'src/components/common/AppTooltip';
import SearchIcon from 'src/svgComponents/SearchIcon'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { CSVLink } from "react-csv";
import UserListHead from 'src/components/user/UserListHead';
import { POST_API_URL } from 'src/api/axios';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { useQuery } from 'react-query';
import LoadingScreen from 'src/components/LoadingScreen';
import moment from 'moment';
import BinIcon from 'src/svgComponents/BinIcon';
import { useSnackbar } from 'notistack';
import CommentIcon from 'src/svgComponents/CommentIcon';
// import ShowCommentsPopUp from './social/ShowCommentsPopUp';
import { SOCIAL_API_URL } from 'src/api/axios';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useNavigate } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useStore from 'src/contexts/AuthProvider';


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}
function applySortFilter(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
}
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
const PostList = () => {

    const [filterName, setFilterName] = useState();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [tableData, setTableData] = useState();
    const [loding, setLoding] = useState(true);
    const [deleteId, setdeleteId] = useState();
    const [userId, setUserId] = useState();
    const [open, setOpen] = useState(false);
    const [openCreatePopup, setOpenCreatePopup] = useState(false);
    const [postDataComment, setPostDataComment] = useState();
    const [fetchCommentsData, setFetchCommentData] = useState();
    const [CsvData, setCsvData] = useState([]);
    const [postId, setPostId] = useState();
    const permissionsData = useStore(state => state.permissions);
    const axiosPrivate = useAxiosPrivate();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    //table head
    const TABLE_HEAD = [
        { id: 'title', label: 'title', alignRight: false },
        { id: 'description', label: 'description', alignRight: false },
        { id: 'user', label: 'user', alignRight: false },
        { id: 'totalLikes', label: 'likes', alignRight: false },
        { id: 'totalComments', label: 'comments', alignRight: false },
        { id: 'date', label: 'posted on', alignRight: false },
        { id: 'action', label: 'action', alignRight: false },

    ];

    useEffect(() => {
        var arr = [];
        tableData?.map((item) => {
            const createdAt = new Date(item?.createdAt).toLocaleString();
            var obj = {
                "title": item?.title ? item?.title : '-',
                "description": item?.description ? item?.description : '-',
                "user": item?.userName ? item?.userName : '-',
                "totalLikes": item?.totalLikes ? item?.totalLikes : '-',
                "totalComments": item?.totalComments ? item?.totalComments : '-',
                "date": createdAt ?? '-',
            }
            arr.push(obj);
        })
        setCsvData(arr)
    }, [tableData]);
    const headers = [
        { label: "title", key: "title" },
        { label: "description", key: "description" },
        { label: "user", key: "user" },
        { label: "totalLikes", key: "totalLikes" },
        { label: "totalLikes", key: "totalLikes" },
        { label: "totalLikes", key: "totalLikes" },
        { label: "totalComments", key: "totalComments" },
        { label: "date", key: "date" },
    ];
    //CSV
    let csvReport = {
        data: CsvData,
        headers: headers,
        filename: 'beemz-feeds.csv'
    };
    const handleFilterByName = (event) => {
        setFilterName(event.target.value.trim().replace('+', ''));
        fetchPostList(0, filterName)
    };
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    //pagonation
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        refetch();
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        setTimeout(() => {
            refetch();
        }, 500);
    };




    //get all post list data
    async function fetchPostList(page, filterName) {
        const response = await axiosPrivate.get(POST_API_URL.postList, { params: { type: '1', page: page + 1, search: filterName, limit: rowsPerPage } })

        return response.data[0];
    }

    const { isLoading, data: postList, refetch } = useQuery(['postList', page, filterName], () => fetchPostList(page, filterName), { keepPreviousData: true, })

    useEffect(() => {
        if (postList) {
            setTableData(postList?.data);
            setRowsPerPage(postList?.metadata.length != 0 ? postList?.metadata[0].limit : 10);
        }
        if (postList?.metadata.length != 0 && postList?.metadata[0].hasMoreData == true) {
            fetchPostList(page + 1);
        }
        setTimeout(() => {
            setLoding(false);
        }, 1800);

        // if(postCommentList) {

        // }
    }, [postList])

    if (isLoading) return <LoadingScreen />

    const posts = postList?.data || [];

    const filteredPosts = applySortFilter(posts, getComparator(order, orderBy));

    const isPostNotFound = filteredPosts.length === 0;


    //delete post 
    const handleClickOpen = (row) => {
        setdeleteId(row?._id);
        setUserId(row?.userId)
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const deletePost = async () => {
        const response = await axiosPrivate.post(POST_API_URL.postDelete + deleteId, { userId: userId })
        if (response.status == 200) {
            enqueueSnackbar(response?.data?.message, {
                variant: "success",
                anchorOrigin: { vertical: "top", horizontal: "right" },
                autoHideDuration: 2000,
            });
        } else {
            enqueueSnackbar("something went wrong", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
                autoHideDuration: 2000,
            });
        }
        refetch();
        handleClose();
    }




    // Comment Popup 
    const handleOpenCommentPopup = (row) => {
        setPostId(row?._id)
        setPostDataComment(row)
        setOpenCreatePopup(true);
    }

    const commentPopupCloseClick = () => {
        setOpenCreatePopup(false);
    }



    return (
        <>
            <div className="dashboard_header mb-4">
                <Paper className='dashboard_searchbox col-lg-4'>
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        fullWidth
                        sx={{ flex: 1 }}
                        placeholder="search post..."
                        onChange={(e) => handleFilterByName(e)}
                    />
                </Paper>
                <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>

                    {permissionsData?.posts?.substring(1, 2) == "1"
                        ?
                        <AppTooltip title="export feeds" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip> : ''}

                    <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>


                </Stack>
            </div>
            {/* Listiing */}
            <Card>
                <TableContainer>
                    <Table>
                        <UserListHead
                            headLabel={TABLE_HEAD}
                            rowCount={0}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {
                                filteredPosts.map((row, key) => {
                                    return (
                                        <StyledTableRow key={key}>
                                            <TableCell component="th" scope="row"> {row?.title ?? "-"}</TableCell>
                                            <TableCell align="left">  {row?.description ?? "-"}</TableCell>
                                            <TableCell align="left">  {row?.userName ?? "-"}</TableCell>
                                            <TableCell align="left">  {row?.totalLikes ?? "-"}</TableCell>
                                            <TableCell align="left">  {row?.totalComments ?? "-"}</TableCell>
                                            <TableCell align="left">  {moment(row?.createdAt).format('DD MMM YYYY') ?? "-"}</TableCell>
                                            <TableCell align="left">
                                                <Stack Stack direction="row" spacing={3} >
                                                    {/* delete post */}
                                                    <AppTooltip title="post delete" placement="bottom"><Button variant="text" className="user_list_row_btn" onClick={() => handleClickOpen(row)} ><BinIcon /></Button>
                                                    </AppTooltip>

                                                    {/* post Detail */}

                                                    <AppTooltip title="feed view" placement="bottom"><Button variant="text" className="user_list_row_btn" onClick={() => navigate(PATH_DASHBOARD.general.feedDetail + "/" + row?._id)}><VisibilityIcon /></Button>
                                                    </AppTooltip>

                                                    {/* Comment view */}
                                                    {/* <AppTooltip title="comment view" placement="bottom"><Button variant="text" className="user_list_row_btn" onClick={() => handleOpenCommentPopup(row)}><CommentIcon /></Button>
                                                    </AppTooltip> */}
                                                </Stack>

                                            </TableCell>
                                        </StyledTableRow>
                                    )
                                })

                            }

                        </TableBody>
                        {isPostNotFound && (
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                                        <span className="app_text_16_semibold">no data found</span>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    count={postList?.metadata.length != 0 ? postList?.metadata[0].total : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </Card>

            {/* Alert Dialog */}
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" className='m-auto'>
                    {"Are you sure you want to delete?"}
                </DialogTitle>
                <DialogContent>
                </DialogContent>
                <DialogActions className='m-auto'>
                    <Button className="theme_button_view" variant="contained" autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className="theme_button" variant="contained" onClick={deletePost} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Comment Popup */}
            {/* <ShowCommentsPopUp
                open={openCreatePopup}
                onClose={commentPopupCloseClick}
                postDataComment={postDataComment}
                postDataId={postId}
            /> */}
        </>
    )
}

export default PostList