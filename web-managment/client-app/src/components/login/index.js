import React, { useEffect } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
export default function Login ({ children, ...props })  {
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  
  const handleRedirection = (location) => {
    if (location.state && location.state.nextPathname) {
      props.history.push(location.state.nextPathname)
    } else {
      props.history.push('/agents')
    }
  }
  
  const [showErrorAlert, setshowErrorAlert] = React.useState(false);
  const location = props.location;
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setDisabled(true);
    const data = new FormData(event.currentTarget);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Username: data.get('username'), Password: data.get('password') })
    };
    const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/Authentication/authenticate', requestOptions);
    setLoading(false);
    setDisabled(false);
    if (response.status != 200) {
      setshowErrorAlert(true);
      return;
    }
    const responseData = await response.json();
    setshowErrorAlert(false);
    localStorage.setItem("token", responseData.token);
    localStorage.setItem("username", data.get('username'));
    handleRedirection(location);
  };
  useEffect(() => {
    if (!!localStorage.getItem("token")) {
      handleRedirection(location);
    }
  }, []);

  return (
    <Box>
      <Typography component="h1" variant="h5">
            .:: Login ::.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <LoadingButton 
              type="submit"
              fullWidth
              variant="contained"
              loading={loading}
              disabled={disabled}
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </LoadingButton >
            { showErrorAlert ? <Alert  severity="error">Login Failed! Please try again</Alert> : null }
          </Box>
    </Box>
  );
}