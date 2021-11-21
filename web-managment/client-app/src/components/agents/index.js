import React, { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';

export default function Agents ({ children, ...props })  {
  const [rows, setRows] = React.useState([]);
  const columns = [
    { id: 'hostName', label: 'Host Name'},
    { id: 'ip', label: 'IP'},
    { id: 'lasySync', label: 'Last Sync'},
  ];
  useEffect(() => {
    const handleLoad = async() => {
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      };
      try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/agent', requestOptions);
        if (response.status == 200) {
          const responseData = await response.json();
          setRows(responseData);
        } else if (response.status == 401) {
          localStorage.clear("token");
          localStorage.clear("username");
          props.history.push('/login')
        } 
      } catch (err) {
        localStorage.clear("token");
        localStorage.clear("username");
        props.history.push('/login')
      }
    }
    handleLoad();
  },[]);
  return (
    <Box>
        <TableContainer sx={{ maxHeight: 440 }}>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.ip}>
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
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
    </Box>
  );
}