import React, { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { HandleGetManager, handleCreateManager, handleUpdateManager, handleUpdateManagerPassword } from './api';
export default function ManagerForm ({ children, ...props })  {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [managerId] = useState(props.match.params.id);
  const [isEditPassword] = useState(props.match.path.search("password") > 0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: ''
  });
  const [isEditMode] = useState(!!props.match.params.id);
  const handleRedirection = (location) => {
    if (location.state && location.state.nextPathname) {
      props.history.push(location.state.nextPathname)
    } else {
      props.history.push('/managers')
    }
  }
  
  const [showErrorAlert, setshowErrorAlert] = React.useState(false);
  const location = props.location;
  const handleSubmit = async (event) => {
    setLoading(true);
    setDisabled(true);
    let response = undefined;
    if (isEditMode) {
      if (isEditPassword) {
        response = await handleUpdateManagerPassword(managerId, event)
      } else {
        response = await handleUpdateManager(managerId, event)
      }
      
    } else {
      response = await handleCreateManager(event);
    }
    setLoading(false);
    setDisabled(false);
    if (response === "done") {
      handleRedirection(location);
    } else if (response === "error"){
      localStorage.clear("token");
      props.history.push('/login');
    } else {
      setshowErrorAlert(true);
    }
  };
  useEffect(() => {
    const handleLoadForm = async() => {
      const response = await HandleGetManager(managerId);
      if (!!response) {
        setFormData(response);
      } else {
        localStorage.clear("token");
        props.history.push('/login');
      }
    }
    if (!!managerId) {
      handleLoadForm();
    }
    }, []);
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {!isEditPassword ?
            <span>
              <TextField
                margin="normal"
                required
                inputProps={{ minLength: 5 }}
                fullWidth
                id="name"
                value={formData.name}
                onChange={ e => setFormData({...formData, name: e.target.value }) }
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                type="email"
                id="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={ e => setFormData({...formData, email: e.target.value }) }
                autoComplete="email"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                inputProps={{ minLength: 5 }}
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={ e => setFormData({...formData, username: e.target.value }) }
                value={formData.username}
              /></span> : null 
            }
            {!isEditMode || isEditPassword ? 
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  inputProps={{ minLength: 5 }}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={ e => setFormData({...formData, password: e.target.value }) }
                value={formData.password}
                  autoComplete="current-password"
              /> : null
            }
            
            <Grid container justifyContent="flex-end">
                <LoadingButton 
                type="submit"
                variant="contained"
                loading={loading}
                disabled={disabled}
                sx={{ mt: 3, mb: 2 }}
                >
                {isEditMode ? "Update" : "Create"}
                </LoadingButton >
            </Grid>
            { showErrorAlert ? <Alert  severity="error">{isEditMode ? 'Update' : 'Create' } Manager Failed! Please try again</Alert> : null }
    </Box>
  );
}