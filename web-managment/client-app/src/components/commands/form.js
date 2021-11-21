import React, { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { HandleGetCommand, handleCreateCommand, handleUpdateCommand } from './api';
export default function CommandForm ({ children, ...props })  {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [resourceNameErrorText, setResourceNameErrorText] = useState('');
  const [resourceName, setResourceName] = useState('Host Name');
  const [commandId] = useState(props.match.params.id);
  const [formData, setFormData] = useState({
    value: '',
    resourceType: 0,
    operationDurationMinutes: 0
  });
  const [isEditMode] = useState(!!props.match.params.id);
  const handleRedirection = (location) => {
    if (location.state && location.state.nextPathname) {
      props.history.push(location.state.nextPathname)
    } else {
      props.history.push('/commands')
    }
  }
  const [showErrorAlert, setshowErrorAlert] = React.useState(false);
  const location = props.location;
  const handleSubmit = async (event) => {
    setLoading(true);
    setDisabled(true);
    let response = undefined;
    if (isEditMode) {
      response = await handleUpdateCommand(commandId, event);
    } else {
      response = await handleCreateCommand(event);
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
      const response = await HandleGetCommand(commandId);
      if (!!response) {
        setFormData(response);
      } else {
        localStorage.clear("token");
        props.history.push('/login');
      }
    }
    if (!!commandId) {
      handleLoadForm();
    }
    }, []);
    const onResourceNameChange = (e) => {
      const validHostnameRegex = new RegExp("^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$");
      if (formData.resourceType === 0) {
        if (!validHostnameRegex.test(e.target.value) || 
          e.target.value.startsWith("www") ||
          !e.target.value.includes(".")) {
          setResourceNameErrorText('you should enter valid hostname');
        } else {
          setResourceNameErrorText('');
        }
      }
      
      setFormData({...formData, value: e.target.value })
    }
    const onResourceTypeChange = (e) => {
      if (e.target.value  == 0) {
        setResourceName("Host Name");
      } else {
        setResourceName("Application Name");
      }
      setFormData({...formData, resourceType: e.target.value })
    }
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal">
                <InputLabel id="resourceType-label">Resource Type</InputLabel>
                <Select
                    labelId="resourceType-label"
                    id="resourceType"
                    value={formData.resourceType}
                    onChange={ onResourceTypeChange }
                    label="resourceType"
                    name="resourceType"
                    required
                    autoFocus
                >
                    <MenuItem value={0}>Website</MenuItem>
                    <MenuItem value={1}>Application</MenuItem>
                </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="value"
              value={formData.value}
              onChange={ onResourceNameChange }
              label={resourceName}
              name="value"
              autoComplete="value"
              error ={resourceNameErrorText.length === 0 ? false : true }
              helperText={resourceNameErrorText}
            />
            <TextField
                 margin="normal"
                 required
                 fullWidth
                 type="number"
                 id="operationDurationMinutes"
                 value={formData.operationDurationMinutes}
                 onChange={ e => setFormData({...formData, operationDurationMinutes: e.target.value }) }
                 label="Operation Duration In Minutes"
                 name="operationDurationMinutes"
                 autoComplete="operationDurationMinutes"
            />
            {formData.operationDurationMinutes == 0 ? 
            <FormHelperText id="component-helper-text">
              Duration of Zero will block the app indefinitly
            </FormHelperText>
            : null }
            <Grid container justifyContent="flex-end">
                <LoadingButton 
                type="submit"
                variant="contained"
                loading={loading}
                disabled={disabled}
                sx={{ mt: 3, mb: 2 }}
                >
                {isEditMode ? "Edit" : "Create"}
                </LoadingButton >
            </Grid>
            { showErrorAlert ? <Alert  severity="error">{isEditMode ? 'Update' : 'Create' } Command Failed! Please try again</Alert> : null }
    </Box>
  );
}