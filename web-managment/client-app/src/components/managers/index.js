import React, { useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PasswordIcon from '@mui/icons-material/Password';
import Button from '@mui/material/Button';
import { HandleManagersLoad, handleDeleteManager } from './api';
export default function Managers ({ children, ...props })  {
  const [rows, setRows] = React.useState([]);
  const [isSuccessOpened, setIsSuccessOpened] = React.useState(false);
  const [sucessMessaage, setSucessMessaage] = React.useState(false);
  const [isDialogOpened, setIsDialogOpened] = React.useState(false);
  const [loggedInUser] = React.useState(localStorage.getItem("username"));
  const [managerIdToBeDeleted, setManagerIdToBeDeleted] = React.useState();

  const columns = [
    { id: 'name', label: 'Full Name'},
    { id: 'username', label: 'Username'},
    { id: 'email', label: 'Email'},
  ];
  const handleSucessMessageClose = () => {
    setIsSuccessOpened(false);
  }
  const nextPath = (path) => {
    props.history.push(path);
  }
  const handleDeleteManagerFromUI = (commandId) => {
    setManagerIdToBeDeleted(commandId);
    setIsDialogOpened(true);
  }
  const handleClose = () => {
    setManagerIdToBeDeleted("");
    setIsDialogOpened(false);
  }
  
  const handleDeleteReject = () => {
    handleClose();
  };
  const handleDeleteAccept = async () => {
    await handleDeleteManager(managerIdToBeDeleted);
    handleClose();
    await handleLoad();
    setSucessMessaage("Manager Deleted Successfully");
    setIsSuccessOpened(true);
  };
  const handleLoad = async() => {
    const managers = await HandleManagersLoad();
    if (!!managers) {
      setRows(managers);
    } else {
      localStorage.clear("token");
      localStorage.clear("username");
      props.history.push('/login');
    }
}
  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <Box>
      <Snackbar onClose={handleSucessMessageClose} open={isSuccessOpened} autoHideDuration={6000}>
        <Alert onClose={handleSucessMessageClose}  severity="success" sx={{ width: '100%' }}>
          {sucessMessaage}
        </Alert>
      </Snackbar>

      <Dialog
        open={isDialogOpened}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Manager?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you Sure you want to delete the Manager?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteReject} autoFocus>No</Button>
          <Button onClick={handleDeleteAccept}>
            Yes!
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container justifyContent="flex-end">
          <Button variant="contained" onClick={() => nextPath('/managers/add') }>Create Manager</Button>
      </Grid>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.email}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                      <IconButton tooltip="Edit" onClick={() => nextPath('/managers/' + row.id) }>
                        <EditIcon/>
                      </IconButton>
                      <IconButton tooltip="Update Password" onClick={() => nextPath('/managers/password/' + row.id) }>
                        <PasswordIcon/>
                      </IconButton>
                      
                      <IconButton disabled={loggedInUser === row.username} tooltip="Delete" onClick={() => handleDeleteManagerFromUI(row.id) }>
                        <DeleteForeverIcon/>
                      </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
    </Box>
  );
}