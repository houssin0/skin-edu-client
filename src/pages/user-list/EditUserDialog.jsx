import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Button, MenuItem, Box, Switch, FormControlLabel, Typography, DialogContentText } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/system";

const SwitchWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
}));

const EditUserDialog = ({ open, onClose, onSave, onDelete, user }) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(user);

  useEffect(() => {
    if (open) {
      setEditingUser(user);
    }
  }, [open, user]);

  const handleEditChange = (field, value) => {
    setEditingUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (hasChanges()) {
      setLoadingSave(true);
      await onSave(editingUser);
      setLoadingSave(false);
    }
    onClose();
  };

  const hasChanges = () => {
    return Object.keys(user).some(key => user[key] !== editingUser[key]);
  };

  const handleDelete = async () => {
    await onDelete(editingUser);
    setConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Edit User
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              label="Name"
              value={editingUser.name || ''}
              onChange={(e) => handleEditChange('name', e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Email"
              value={editingUser.email || ''}
              onChange={(e) => handleEditChange('email', e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Role"
              value={editingUser.userType || ''}
              onChange={(e) => handleEditChange('userType', e.target.value)}
              fullWidth
              variant="outlined"
              select
            >
              <MenuItem value="med_student">Medical Student</MenuItem>
              <MenuItem value="med_teacher">Medical Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <TextField
              label="Phone"
              value={editingUser.phone || ''}
              onChange={(e) => handleEditChange('phone', e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Organization"
              value={editingUser.organization || ''}
              onChange={(e) => handleEditChange('organization', e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Department"
              value={editingUser.department || ''}
              onChange={(e) => handleEditChange('department', e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Country"
              value={editingUser.country || ''}
              onChange={(e) => handleEditChange('country', e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="State"
              value={editingUser.state || ''}
              onChange={(e) => handleEditChange('state', e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Address"
              value={editingUser.address || ''}
              onChange={(e) => handleEditChange('address', e.target.value)}
              fullWidth
              variant="outlined"
            />
            
            <SwitchWrapper>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingUser.is_approved || false}
                    onChange={(e) => handleEditChange('is_approved', e.target.checked)}
                    color="primary"
                  />
                }
                label="Approved"
                labelPlacement="start"
              />
            </SwitchWrapper>
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton 
            variant="contained" 
            color="primary" 
            onClick={handleSave} 
            loading={loadingSave}
            sx={{ textTransform: 'none' }}
          >
            Save
          </LoadingButton>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={onClose}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => setConfirmOpen(true)}
            sx={{ textTransform: 'none' }}
          >
            Delete
          </Button>
        </DialogActions>
      </StyledDialog>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditUserDialog;

