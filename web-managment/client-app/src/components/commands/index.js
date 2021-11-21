import React, { useEffect } from 'react';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { HandleCommandsLoad,handleDeleteCommand } from './api';
export default function Managers ({ children, ...props })  {
  const [rows, setRows] = React.useState([]);
  const [isSuccessOpened, setIsSuccessOpened] = React.useState(false);
  const [sucessMessaage, setSucessMessaage] = React.useState(false);
  const [isDialogOpened, setIsDialogOpened] = React.useState(false);
  const [commandIdToBeDeleted, setCommandIdToBeDeleted] = React.useState();

  const columns = [
    { id: 'resourceType', label: 'Resource Type'},
    { id: 'value', label: 'Command Name'},
    { id: 'creationTime', label: 'Creation Time'},
    { id: 'expirationTime', label: 'Expiration Time'},
  ];
  const handleLoad = async() => {
    const commands = await HandleCommandsLoad();
    if (!!commands) {
      const allCommands = commands.map (item => {
        item.resourceType = item.resourceType == 0 ? "Website" : "Application";
        item.operationType = item.operationType == 0 ? "Block" : "UnBlock";
        item.creationTime = moment(item.dateAdded).format('Do MMMM YYYY, h:mm:ss a');
        item.expirationTime = moment(item.dateAdded).add(item.operationDurationMinutes, 'minutes').format('Do MMMM YYYY, h:mm:ss a');
        return item;
      }); 
      setRows(allCommands);
    } else {
      localStorage.clear("token");
      localStorage.clear("username");
      props.history.push('/login');
    }
  }
  const handleSucessMessageClose = () => {
    setIsSuccessOpened(false);
  }
  const nextPath = (path) => {
    props.history.push(path);
  }
  const handleDeleteCommandFromUI = (commandId) => {
    setCommandIdToBeDeleted(commandId);
    setIsDialogOpened(true);
  }
  const handleClose = () => {
    setCommandIdToBeDeleted("");
    setIsDialogOpened(false);
  }
  
  const handleDeleteReject = () => {
    handleClose();
  };
  const handleDeleteAccept = async () => {
    await handleDeleteCommand(commandIdToBeDeleted);
    handleClose();
    await handleLoad();
    setSucessMessaage("Command Deleted Successfully");
    setIsSuccessOpened(true);
  };
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
          {"Delete Command?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you Sure you want to delete the command?
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
          <Button variant="contained" onClick={() => nextPath('/commands/add') }>Create Command</Button>
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
                <TableCell>Edit</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
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
                      <IconButton tooltip="Edit" onClick={() => nextPath('/commands/' + row.id) }>
                        <EditIcon/>
                      </IconButton>
                      </TableCell>
                      <TableCell>
                      <IconButton tooltip="Delete" onClick={() => handleDeleteCommandFromUI(row.id) }>
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