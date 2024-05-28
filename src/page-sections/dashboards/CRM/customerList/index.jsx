import React, { useState, useEffect } from "react";
import {
  Card, IconButton, Stack, useTheme, styled, Table, TableContainer, TextField, Button, Dialog, DialogContent, DialogTitle, DialogActions, TableBody, TableCell, TablePagination, TableRow
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import AppCheckBox from "components/AppCheckBox";
import Scrollbar from "components/ScrollBar";
import { H5, Tiny } from "components/Typography";
import TableHeader from "./TableHeader";
import { LoadingButton } from "@mui/lab";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  paddingTop: 10,
  paddingBottom: 10,
}));

const tableHeading = [
  { id: "name", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "userType", label: "Role", alignRight: false },
  { id: "is_approved", label: "Status", alignRight: false },
  { id: "edit", label: "Edit", alignRight: true },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const UserList = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/users', {
          headers: { Authorization: accessToken },
        });
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = tableData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleEditChange = (field, value) => {
    setEditingUser(prev => ({ ...prev, [field]: value }));
  };

  const updateUser = async (user) => {
    try {
      setLoadingSave(true);
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`https://myserver.oulkaid-elhoussin.workers.dev/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        console.error('Failed to update user:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      return null;
    } finally {
      setLoadingSave(false);
    }
  };

  const handleEditSave = async () => {
    if (editingUser) {
      const updatedUser = await updateUser(editingUser);
      if (updatedUser) {
        setTableData(prevData => prevData.map(user => (user.id === updatedUser.id ? updatedUser : user)));
        setEditingUser(null);
      }
    }
  };

  const handleEditCancel = () => {
    setEditingUser(null);
  };

  const filteredUsers = stableSort(tableData, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card sx={{ padding: 3 }}>
      <H5 mb={2}>Customer List</H5>

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHeader
              order={order}
              orderBy={orderBy}
              heading={tableHeading}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              rowCount={tableData.length}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredUsers.map((row) => {
                const { id, name, userType, email, is_approved } = row;
                const isItemSelected = selected.indexOf(name) !== -1;
                return (
                  <TableRow
                    key={id}
                    tabIndex={-1}
                    role="checkbox"
                    selected={isItemSelected}
                    aria-checked={isItemSelected}
                    sx={{ "&.Mui-selected": { backgroundColor: "transparent" } }}
                  >
                    <StyledTableCell padding="checkbox">
                      <AppCheckBox checked={isItemSelected} onClick={() => handleClick(name)} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Tiny fontWeight={600} color="text.primary">
                          {name}
                        </Tiny>
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell align="left">{email}</StyledTableCell>
                    <StyledTableCell align="left">{userType}</StyledTableCell>
                    <StyledTableCell align="left">{is_approved}</StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton onClick={() => handleEditClick(row)}>
                        <Edit sx={{ color: "text.disabled" }} />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={tableData.length}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={(_, page) => setPage(page)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {editingUser && (
        <Dialog open={!!editingUser} onClose={handleEditCancel} maxWidth="sm" fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={2}>
              <TextField
                label="Name"
                value={editingUser.name}
                onChange={(e) => handleEditChange('name', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Email"
                value={editingUser.email}
                onChange={(e) => handleEditChange('email', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Role"
                value={editingUser.userType}
                onChange={(e) => handleEditChange('userType', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Status"
                value={editingUser.is_approved}
                onChange={(e) => handleEditChange('is_approved', e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={handleEditSave}
              loading={loadingSave}
            >
              Save
            </LoadingButton>
            <Button variant="outlined" color="secondary" onClick={handleEditCancel}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
};

export default UserList;
