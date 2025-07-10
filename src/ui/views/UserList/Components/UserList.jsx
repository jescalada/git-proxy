import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import GridItem from '../../../components/Grid/GridItem';
import GridContainer from '../../../components/Grid/GridContainer';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from '../../../assets/jss/material-dashboard-react/views/dashboardStyle';
import { getUsers } from '../../../services/user';
import Pagination from '../../../components/Pagination/Pagination';
import { CloseRounded, Check, KeyboardArrowRight } from '@mui/icons-material';
import Search from '../../../components/Search/Search';

const useStyles = makeStyles(styles);

export default function UserList(props) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [, setAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState('');

  const openUser = (username) => navigate(`/dashboard/admin/user/${username}`, { replace: true });

  useEffect(() => {
    const query = {};

    for (const k in props) {
      if (!k) continue;
      query[k] = props[k];
    }
    getUsers(setIsLoading, setData, setAuth, setIsError, setErrorMessage, query);
  }, [props]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{errorMessage}</div>;

  const filteredUsers = data.filter(
    (user) =>
      (user.displayName && user.displayName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = filteredUsers.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Search onSearch={handleSearch} placeholder='Search users...' />
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell align='left'>Name</TableCell>
                <TableCell align='left'>Role</TableCell>
                <TableCell align='left'>E-mail</TableCell>
                <TableCell align='left'>GitHub Username</TableCell>
                <TableCell align='left'>Administrator</TableCell>
                <TableCell align='left'></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((row) => (
                <TableRow key={row.username}>
                  <TableCell align='left'>{row.displayName}</TableCell>
                  <TableCell align='left'>{row.title}</TableCell>
                  <TableCell align='left'>
                    <a href={`mailto:${row.email}`}>{row.email}</a>
                  </TableCell>
                  <TableCell align='left'>
                    <a
                      href={`https://github.com/${row.gitAccount}`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {row.gitAccount}
                    </a>
                  </TableCell>
                  <TableCell align='left'>
                    {row.admin ? (
                      <Check fontSize='small' color='primary' />
                    ) : (
                      <CloseRounded color='error' />
                    )}
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => openUser(row.username)}
                    >
                      <KeyboardArrowRight />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </GridItem>
    </GridContainer>
  );
}
