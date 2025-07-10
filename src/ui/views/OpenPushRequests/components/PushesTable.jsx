import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import moment from 'moment';
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
import { getPushes } from '../../../services/git-push';
import { KeyboardArrowRight } from '@mui/icons-material';
import Search from '../../../components/Search/Search';
import Pagination from '../../../components/Pagination/Pagination';

export default function PushesTable(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [, setAuth] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const openPush = (push) => navigate(`/dashboard/push/${push}`, { replace: true });

  useEffect(() => {
    const query = {};
    for (const k in props) {
      if (k) query[k] = props[k];
    }
    getPushes(setIsLoading, setData, setAuth, setIsError, setErrorMessage, query);
  }, [props]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = searchTerm
      ? data.filter(
          (item) =>
            item.repo.toLowerCase().includes(lowerCaseTerm) ||
            item.commitTo.toLowerCase().includes(lowerCaseTerm) ||
            item.commitData[0].message.toLowerCase().includes(lowerCaseTerm),
        )
      : data;
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const handleSearch = (term) => setSearchTerm(term.trim());

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{errorMessage}</div>;

  return (
    <div>
      <Search onSearch={handleSearch} /> {}
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='left'>Timestamp</TableCell>
              <TableCell align='left'>Repository</TableCell>
              <TableCell align='left'>Branch</TableCell>
              <TableCell align='left'>Commit SHA</TableCell>
              <TableCell align='left'>Committer</TableCell>
              <TableCell align='left'>Author</TableCell>
              <TableCell align='left'>Author E-mail</TableCell>
              <TableCell align='left'>Commit Message</TableCell>
              <TableCell align='left'>No. of Commits</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.reverse().map((row) => {
              const repoFullName = row.repo.replace('.git', '');
              const repoBranch = row.branch.replace('refs/heads/', '');

              return (
                <TableRow key={row.id}>
                  <TableCell align='left'>
                    {moment
                      .unix(row.commitData[0].commitTs || row.commitData[0].commitTimestamp)
                      .toString()}
                  </TableCell>
                  <TableCell align='left'>
                    <a href={`https://github.com/${row.repo}`} rel='noreferrer' target='_blank'>
                      {repoFullName}
                    </a>
                  </TableCell>
                  <TableCell align='left'>
                    <a
                      href={`https://github.com/${repoFullName}/tree/${repoBranch}`}
                      rel='noreferrer'
                      target='_blank'
                    >
                      {repoBranch}
                    </a>
                  </TableCell>
                  <TableCell align='left'>
                    <a
                      href={`https://github.com/${repoFullName}/commit/${row.commitTo}`}
                      rel='noreferrer'
                      target='_blank'
                    >
                      {row.commitTo.substring(0, 8)}
                    </a>
                  </TableCell>
                  <TableCell align='left'>
                    <a
                      href={`https://github.com/${row.commitData[0].committer}`}
                      rel='noreferrer'
                      target='_blank'
                    >
                      {row.commitData[0].committer}
                    </a>
                  </TableCell>
                  <TableCell align='left'>
                    <a
                      href={`https://github.com/${row.commitData[0].author}`}
                      rel='noreferrer'
                      target='_blank'
                    >
                      {row.commitData[0].author}
                    </a>
                  </TableCell>
                  <TableCell align='left'>
                    {row.commitData[0].authorEmail ? (
                      <a href={`mailto:${row.commitData[0].authorEmail}`}>
                        {row.commitData[0].authorEmail}
                      </a>
                    ) : (
                      'No data...'
                    )}
                  </TableCell>
                  <TableCell align='left'>{row.commitData[0].message}</TableCell>
                  <TableCell align='left'>{row.commitData.length}</TableCell>
                  <TableCell component='th' scope='row'>
                    <Button variant='contained' color='primary' onClick={() => openPush(row.id)}>
                      <KeyboardArrowRight />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination Component */}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredData.length}
        paginate={paginate}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
