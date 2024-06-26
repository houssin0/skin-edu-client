import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Box, Card, Checkbox, Stack, styled, Table, TableRow, useTheme, IconButton } from "@mui/material";
import { Edit, Refresh } from "@mui/icons-material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import AppPagination from "components/AppPagination";
import LoadingScreen from "components/LoadingScreen";
import Scrollbar from "components/ScrollBar";
import BlankCheckBoxIcon from "icons/BlankCheckBoxIcon";
import CheckBoxIcon from "icons/CheckBoxIcon";
import SearchArea from "page-sections/admin-ecommerce/product-list/search-area";
import columnShape from "page-sections/user-list/columnShape";
import HeadingArea from "page-sections/user-list/heading-area";
import { useAsyncDebounce, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import EditUserDialog from "./EditUserDialog";
import toast from "react-hot-toast";

const HeadTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 600,
  color: theme.palette.text.secondary,
  "&:first-of-type": {
    paddingLeft: 24
  },
  "&:last-of-type": {
    paddingRight: 24
  }
}));

const BodyTableCell = styled(HeadTableCell)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 13,
  fontWeight: 500,
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const SelectCheckBox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;
  useEffect(() => {
    if (resolvedRef) {
      resolvedRef.current.indeterminate = indeterminate;
    }
  }, [resolvedRef, indeterminate]);
  return <Checkbox {...rest} disableRipple ref={resolvedRef} icon={<BlankCheckBoxIcon fontSize="small" color="disabled" />} checkedIcon={<CheckBoxIcon fontSize="small" color="primary" />} />;
});

const UserListView = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // New state for filtered data
  const [userType, setUserType] = useState(""); // New state for user type
  const [editingUser, setEditingUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const columns = useMemo(() => columnShape, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/users', {
          headers: {
            'Authorization': accessToken
          }
        });
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filterData = () => {
      if (userType === "is_approved") {
        setFilteredData(tableData.filter(user => !user.is_approved));
      } else if (userType) {
        setFilteredData(tableData.filter(user => user.userType === userType));
      } else {
        setFilteredData(tableData);
      }
    };

    filterData();
  }, [tableData, userType]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    gotoPage,
    state,
    setGlobalFilter,
  } = useTable({
    columns,
    data: filteredData
  }, useGlobalFilter, useSortBy, usePagination, useRowSelect, hooks => {
    hooks.visibleColumns.push(columns => [{
      id: "selection",
      Header: ({ getToggleAllRowsSelectedProps }) => <SelectCheckBox {...getToggleAllRowsSelectedProps()} />,
      Cell: ({ row }) => <SelectCheckBox {...row.getToggleRowSelectedProps()} />
    }, ...columns]);
  });

  const handleChange = (_, currentPageNo) => gotoPage(currentPageNo - 1);
  const changeTab = (_, newValue) => setUserType(newValue); // Update userType

  const [searchValue, setSearchValue] = useState(state.globalFilter);
  const handleSearch = useAsyncDebounce(value => setGlobalFilter(value || undefined), 200);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setOpenEditDialog(true);
  };

  const handleEditSave = async (updatedUser) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`https://myserver.oulkaid-elhoussin.workers.dev/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      if (response.ok) {
        setTableData(prevData => prevData.map(user => (user.id === data.id ? data : user)));
        toast.success("User is updated successfully", { duration: 4000 });
        
        } else {
          toast.error("Failed to update user", { duration: 4000 });
          }
          } catch (error) {
            toast.error("Failed to update user", { duration: 4000 });

    }
  };

  const handleDelete = async (editingUser) => {
    try {
      console.log(editingUser);
      console.log(editingUser.id);
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`https://myserver.oulkaid-elhoussin.workers.dev/api/users/${editingUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTableData(prevData => prevData.filter(user => user.id !== editingUser.id));
        toast.success(data.message, { duration: 4000 });
      } else {
        toast.error(data.message, { duration: 4000 });
      }
    } catch (error) {
      toast.error("Failed to delete user", { duration: 4000 });
    }
  };

  const handleDialogClose = () => {
    setOpenEditDialog(false);
    setEditingUser(null);
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/users', {
        headers: {
          'Authorization': accessToken
        }
      });
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      toast.error("Failed to refresh users", { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pt={2} pb={4}>
      <Card sx={{ py: 2 }}>
        <Box px={3}>
          <HeadingArea value={userType} changeTab={changeTab} />
          <Box display="flex" alignItems="center">
            <SearchArea value={searchValue} onChange={handleSearch} setValue={setSearchValue} />
            <IconButton onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>
        <Scrollbar autoHide={false}>
          <Table {...getTableProps()} sx={{ minWidth: 900 }}>
            <TableHead sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
              {headerGroups.map((headerGroup, index) => (
                <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, index) => (
                    <HeadTableCell key={index} {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render("Header")}
                    </HeadTableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()} key={index}>
                    {row.cells.map((cell, index) => (
                      <BodyTableCell key={index} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </BodyTableCell>
                    ))}
                    <BodyTableCell>
                      <IconButton onClick={() => handleEditClick(row.original)}>
                        <Edit sx={{ color: "text.disabled", fontSize: 18 }} />
                      </IconButton>
                    </BodyTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
        <Stack alignItems="center" marginY={4}>
          <AppPagination shape="rounded" onChange={handleChange} count={pageOptions.length} />
        </Stack>
      </Card>
      {editingUser && (
        <EditUserDialog
          open={openEditDialog}
          onClose={handleDialogClose}
          onSave={handleEditSave}
          onDelete={handleDelete}
          user={editingUser}
        />
      )}
      {loading && <LoadingScreen />}
    </Box>
  );
};

export default UserListView;
