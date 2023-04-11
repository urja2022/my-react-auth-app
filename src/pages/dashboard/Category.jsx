import React, { useEffect, useState } from "react";
import { Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Box, MenuItem, Chip } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useQuery } from 'react-query';
import { USER_API_URL, CATEGORY_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import EditPenIcon from 'src/svgComponents/EditPenIcon'
import BinIcon from 'src/svgComponents/BinIcon'
import { Stack } from "@mui/material";
import { Button, IconButton, Modal, InputBase, Paper, TextField, Select, FormControl, InputLabel } from "@mui/material";
import SearchIcon from "src/svgComponents/SearchIcon";
import CloseIcon from '@mui/icons-material/Close';
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import useStore from 'src/contexts/AuthProvider'
import LoadingScreen from 'src/components/LoadingScreen'
import AppTooltip from "src/components/common/AppTooltip";
import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from '@mui/material';

// for csv
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useTheme } from '@mui/material/styles';

const _ = require('lodash');


export default function UsersList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modelTitle, setmodelTitle] = useState("");
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [selectCateData, setSelectCateData] = useState([]);
  const [parentId, setParentId] = useState('');
  const [disable, setDisable] = useState(false);
  const [Id, setId] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [loding, setLoding] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const permissionsData = useStore(state => state.permissions);
  const [deleteId, setdeleteId] = useState("");
  const [type, setType] = useState("");
  const [open, setOpen] = useState(false);
  const [CsvData, setCsvData] = useState([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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
    { id: 'child', label: 'child', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];


  useEffect(() => {
    var arr = [];
    tableData.map((item) => {
      const child = item?.child.map(item => item.name).join(' , ');
      var obj = {
        "name": item?.name ? item?.name : '-',
        "child": child ? child : '-',
      }
      arr.push(obj);
    })
    setCsvData(arr)
  }, [tableData]);
  const headers = [
    { label: "name", key: "name" },
    { label: "child", key: "child" },
  ];
  let csvReport = {
    data: CsvData,
    headers: headers,
    filename: 'beemz-category.csv'
  };

  const completedSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "name can set of between 2 and 50 characters!")
      .max(50, "name can set of between 2 and 50 characters!")
      .required("name is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: completedSchema,
    onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
      const informationObj = {
        name: values.name
      };
      if (parentId != "") {
        informationObj.parentId = parentId
      }
      if (Id == "") {
        await categoryAdd(informationObj);
      } else {
        await categoryUpdate(informationObj);
      }
      setParentId("");
      resetForm();
      setSubmitting(false);
    },
  });
  const { mutateAsync: categoryAdd } = useMutation(
    async (data) => {
      return await axiosPrivate.post(CATEGORY_API_URL.addCategory, JSON.stringify(data))
    },
    {
      onSuccess: ({ data }) => {
        refetch();
        enqueueSnackbar("category add successfully ", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        handleCloseModal();
      },
      onError: (error) => {
        const errorData = error.response.data.errors;
        if (error.response?.data?.message) {
          enqueueSnackbar(error.response?.data?.message, {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: 2000,
          });
        }
        Object.keys(errorData).forEach((key) => {
          if (key === "name") {
            setFieldError("name", errorData[key]);
          } else {
            setFieldError(key, errorData[key]);
          }
        });
      },
    }
  );
  const { mutateAsync: categoryUpdate } = useMutation(
    async (data) => {
      return await axiosPrivate.put(USER_API_URL.categoryUpdate + Id, JSON.stringify(data))
    },
    {
      onSuccess: ({ data }) => {
        refetch();
        enqueueSnackbar("category update successfully ", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        handleCloseModal();
      },
      onError: (error) => {
        const errorData = error.response.data.errors;
        if (error.response?.data?.message) {
          enqueueSnackbar(error.response?.data?.message, {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: 2000,
          });
        }
        Object.keys(errorData).forEach((key) => {
          if (key === "name") {
            setFieldError("name", errorData[key]);
          } else {
            setFieldError(key, errorData[key]);
          }
        });
      },
    }
  );
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
  async function fetchSeeker(page, filterName) {
    const response = await axiosPrivate.get(USER_API_URL.categoryList, { params: { type: '1', page: page + 1, search: filterName, limit: rowsPerPage } })

    return response.data[0];
  }

  const { isLoading, data: categoryList, refetch } = useQuery(['categoryList', page, filterName], () => fetchSeeker(page, filterName), { keepPreviousData: true, })

  async function CategorySelect() {
    const response = await axiosPrivate.get(USER_API_URL.selectCategoryList)

    return response.data;
  }

  const { data: categorySelectList, refetch: refetchSelectList } = useQuery(['categorySelectList'], () => CategorySelect(), { keepPreviousData: true, })

  useEffect(() => {
    if (categorySelectList) {
      setSelectCateData(categorySelectList.data ? categorySelectList.data : categorySelectList);
    }
  }, [categorySelectList])

  useEffect(() => {
    if (categoryList) {
      setTableData(categoryList?.data);
      setRowsPerPage(categoryList?.metadata.length != 0 ? categoryList?.metadata[0].limit : 10);
    }
    if (categoryList?.metadata.length != 0 && categoryList?.metadata[0].hasMoreData == true) {
      fetchSeeker(page + 1);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [categoryList])

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
    setPage(0)
    setFilterName(event.target.value.trim());
    fetchSeeker(page, filterName);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categoryList?.metadata[0].total) : 0;

  const filteredUsers = applySortFilter(tableData, getComparator(order, orderBy));

  const isUserNotFound = filteredUsers.length === 0;

  const handleClickOpen = (categoryId, categoryType) => {
    setdeleteId(categoryId);
    setType(categoryType);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteCategory = async () => {
    if (type == "sub") {
      const response = await axiosPrivate.delete(USER_API_URL.deleteSubCategory + deleteId)
      if (response.status == 200) {
        enqueueSnackbar("sub category delete successfully", {
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
    } else {
      const response = await axiosPrivate.delete(USER_API_URL.deleteCategory + deleteId)
      if (response.status == 200) {
        enqueueSnackbar("category delete successfully", {
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
    }
    refetch();
    handleClose();
  };

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModalAdd = () => {
    setFieldValue('name', "")
    setId('')
    setmodelTitle('add')
    setDisable(false);
    refetchSelectList();
    setOpenModal(true);
  };
  const handleOpenModalUpdate = (row) => {
    setFieldValue('name', row.name)
    setId(row.id)
    setmodelTitle('update')
    setDisable(true);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;
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
              placeholder="search category..."
              onChange={(e) => handleFilterByName(e)}
            />
          </Paper>
          <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>
            {permissionsData?.category?.substring(1, 2) == "1"
              ? <AppTooltip title="add category" placement="bottom"><Button className="dashboard_light_bg_icon_btn" onClick={handleOpenModalAdd}><AddCircleOutlineOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip> : ''}
            <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>
            {/* csv */}
            {permissionsData?.category?.substring(1, 2) == "1"
              ?
              <AppTooltip title="export category" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip>
              : ''}
          </Stack>
        </div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title" className='m-auto'>
            {"are you sure you want to delete?"}
          </DialogTitle>
          <DialogContent>
          </DialogContent>
          <DialogActions className='m-auto'>
            <Button className="theme_button_view" variant="contained" autoFocus onClick={handleClose}>
              cancel
            </Button>
            <Button className="theme_button" variant="contained" onClick={() => deleteCategory()} autoFocus>
              delete
            </Button>
          </DialogActions>
        </Dialog>
        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={categoryList?.metadata.length !== 0 ? categoryList?.metadata[0].total : 0}
                onRequestSort={handleRequestSort}
              />
              {filteredUsers.length > 0 ?

                <TableBody>
                  {filteredUsers.map((row, key) => {
                    return (
                      <StyledTableRow key={key}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="left">
                          <Stack sx={{ flexWrap: 'wrap' }} direction="row" spacing={1}>
                            {row.child.length > 0 ? row?.child?.map((item, i) => (
                              <Chip style={{ marginBottom: '10px' }} label={item.name}
                                key={i}
                                onDelete={() =>
                                  permissionsData?.category?.substring(2, 3) == "1" ? handleClickOpen(item.id, "sub") : ''
                                } />
                            )) : "-"}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={3}>
                            {permissionsData?.category?.substring(3, 4) == "1"
                              ? <AppTooltip title="category edit" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                                onClick={() => handleOpenModalUpdate(row)}
                                variant="text" className="user_list_row_btn"><EditPenIcon /></Button></AppTooltip> : ''}
                            {permissionsData?.category?.substring(2, 3) == "1"
                              ? <AppTooltip title="category delete" placement="bottom"><Button variant="text" className="user_list_row_btn" onClick={() => handleClickOpen(row.id, "main")} ><BinIcon /></Button></AppTooltip> : ''}
                          </Stack>
                        </TableCell>
                      </StyledTableRow>
                    )
                  })}
                </TableBody>
                :
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={3} sx={{ py: 5 }}>
                      <span className="app_text_16_semibold">no data found</span>
                    </TableCell>
                  </TableRow>
                </TableBody>}
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 20, 50, 100]}
            count={categoryList?.metadata.length != 0 ? categoryList?.metadata[0].total : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className="modal_card modal_lg db_trust_level_modal_box">
            <div className="modal_card_header">
              <div className="left_part">
                <h4>{modelTitle}</h4>
              </div>
              <div className="right_part">
                <Button className="dashboard_light_bg_icon_btn" onClick={handleCloseModal} aria-label="delete">
                  <CloseIcon />
                </Button>
              </div>
            </div>
            <div className="modal_card_body">
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <div className="row">
                    <div className='col-12'>
                      <div className='user_edit_header mb-4'>
                        <h4 className="app_text_14_semibold mb-0">category information</h4>
                      </div>
                    </div>
                    {!disable ? <div className="col-lg-12">
                      <div className="form-group mb-4">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">parent id</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="parent id"
                            onChange={(e) => setParentId(e.target.value)}
                          >
                            {selectCateData.map((u, i) => (
                              <MenuItem value={u._id} key={i}>
                                {u.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div> : ""}

                    <div className="col-lg-12">
                      <div className="form-group mb-4">
                        <TextField
                          label='name'
                          autoComplete='off'
                          fullWidth
                          variant='outlined'
                          {...getFieldProps("name")}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-md-8 m-auto">
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="my-3 text-lowercase text-white app_bg_primary app_text_16_semibold app_btn_lg"
                      >
                        submit
                      </Button>
                    </div>
                  </div>
                </Form>
              </FormikProvider>
            </div>
            <div className="modal_card_footer"></div>
          </Box>
        </Modal>
      </>
      }
    </>
  )
}