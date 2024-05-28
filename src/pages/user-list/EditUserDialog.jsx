import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const EditUserDialog = ({ open, onClose, onSave, user }) => {
  const [loadingSave, setLoadingSave] = useState(false);
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
    setLoadingSave(true);
    await onSave(editingUser);
    setLoadingSave(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
        <LoadingButton variant="contained" color="primary" onClick={handleSave} loading={loadingSave}>
          Save
        </LoadingButton>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
