import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Button, MenuItem, Box, Switch, FormControlLabel, Typography } from "@mui/material";
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
      </DialogActions>
    </StyledDialog>
  );
};

export default EditUserDialog;
