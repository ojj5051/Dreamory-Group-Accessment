import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, Stack, TextField,
    TableRow, TableSortLabel, Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, FormControlLabel, Switch, Menu, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import { EditEventForm } from './EditEventForm';
import axios from 'axios'

let data = []
let eventId = []

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        _id: 'eventName',
        numeric: false,
        disablePadding: true,
        label: 'EventName',
    },
    {
        _id: 'date',
        numeric: true,
        disablePadding: false,
        label: 'Date',
    },
    {
        _id: 'time',
        numeric: true,
        disablePadding: false,
        label: 'Time',
    },
    {
        _id: 'location',
        numeric: true,
        disablePadding: false,
        label: 'Location',
    },
    {
        _id: 'completion',
        numeric: true,
        disablePadding: false,
        label: 'Completion',
    },
];

function EnhancedTableHead(props) {
  const {  order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell>
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell._id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell._id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell._id}
              direction={orderBy === headCell._id ? order : 'asc'}
              onClick={createSortHandler(headCell._id)}
            >
              {headCell.label}
              {orderBy === headCell._id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;
    const [ open, setOpen ] = useState(false)
   
    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.delete('http://localhost:4001/events/delete/' + eventId)
        .then(res => {
            if(eventId.length > 1) {
                alert('Can only delete one data per time');
                return;
            }
            console.log(res.data)
            window.location.reload(false);
        })
        .catch(err => {
            console.log(err)
        })
    }; 

    const handleClick = (e) => {
        e.preventDefault();

        if(eventId.length > 1) {
            alert('Can only update one data per time');
            return;
        }

        setOpen(true)
    }

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
        {numSelected > 0 ? (
            <Typography
                sx={{ flex: '1 1 100%' }}
                color="inherit"
                variant="subtitle1"
                component="div"
                >
                {numSelected} selected
            </Typography>
        ) : (
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
                align='center'
            >
            Event List
            </Typography>
        )}

        {numSelected > 0 ? (
            <Stack 
                direction="row" 
                spacing={2} 
                justifyContent="space-between"
            >
                <Tooltip title="Edit">
                    <IconButton onClick={handleClick}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton onClick={handleSubmit}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <EditEventForm setOpen={setOpen} open={open} _id={eventId}/>
            </Stack>
        ): (
             <Typography>
             </Typography>
        )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function EventList() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('date');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState(null);
    const [eventName, setEventName] = useState("")
    const open = Boolean(anchorEl);

    // Get all event data
    useEffect(() => {
        axios.get('http://localhost:4001/events')
        .then(res => {
            data = res.data
            setOrder("desc")
        })
        .catch(err => {
            console.log(err)
        })
    }, []);

    // Filter Ongoing and Completed Events
    const handleFilter = (completion) => {
        axios.post('http://localhost:4001/events/findCompletion', {completion})
        .then(res => {
            data = res.data
            setAnchorEl(null);
            
            let state = (order === 'asc') ? 'desc' : 'asc';
            setOrder(state)
        })
        .catch(err => {
            console.log(err)
        })
    }

    // Search event
    const searchData = () => {
        axios.post('http://localhost:4001/events/findEvent', {eventName})
        .then(res => {
            data = res.data
            let state = (order === 'asc') ? 'desc' : 'asc';
            setOrder(state)
        })
        .catch(err => {
            console.log(err)
        })
    }

    // Filter Ongoing and Completed
    const filterAll = () => {
        handleFilter()
    }

    const filterOngoing = () => {
        handleFilter("Ongoing")
    }

    const filterCompleted = () => {
        handleFilter("Completed")
    }

    // Press Enter to search data, double click ESC to clear the search
    const handleChange = (e) => {
        setEventName(e.target.value);
    }
  
    const keyPress = (e) => {
        if(e.keyCode === 13) {
            searchData();
        }
        else if(e.keyCode === 27) {
            setEventName("")
            searchData();
        }
    }

    // Handle anchor of the menu item
    const handleAnchor = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle sorting
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Handle pages
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Change dense of the table
    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    // Handle checkbox of the data
    const handleClick = (event, _id) => {
        const selectedIndex = selected.indexOf(_id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, _id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        eventId = newSelected;
        setSelected(newSelected);
    };

    const isSelected = (_id) => selected.indexOf(_id) !== -1;
    
    // Handle rows of the data
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
   
    const visibleRows = React.useMemo(() =>
        stableSort(data, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        ),
        [order, orderBy, page, rowsPerPage],
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2, mt: 10 }}>
                <EnhancedTableToolbar numSelected={selected.length} />
                    <Box display={"flex"} justifyContent={"space-between"}>
                        <TextField value={eventName} onKeyDown={keyPress} onChange={handleChange} label="Event Name" size="small" autoComplete='off'
                                    sx={{ width: "40%", left: "30%" }}></TextField>
                        <Tooltip title="Filter list">
                            <IconButton  onClick={handleAnchor}>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="demo-positioned-menu"
                            anchorEl={anchorEl}
                            aria-labelledby="demo-positioned-button"
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={filterAll}>All</MenuItem>
                            <MenuItem onClick={filterOngoing}>Ongoing</MenuItem>
                            <MenuItem onClick={filterCompleted}>Completed</MenuItem>
                        </Menu>
                    </Box>
                <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={dense ? 'small' : 'medium'}
                >
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={DataTransfer.length}
                    />
                    <TableBody>
                    {visibleRows.map((row, index) => {
                        const isItemSelected = isSelected(row._id);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                        <TableRow
                            hover
                            onClick={(event) => handleClick(event, row._id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row._id}
                            selected={isItemSelected}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                'aria-labelledby': labelId,
                                }}
                            />
                            </TableCell>
                            <TableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                            >
                            {row.eventName}
                            </TableCell>
                            <TableCell align="right">{row.date}</TableCell>
                            <TableCell align="right">{row.time}</TableCell>
                            <TableCell align="right">{row.location}</TableCell>
                            <TableCell align="right">{row.completion}</TableCell>
                        </TableRow>
                        );
                    })}
                    {emptyRows > 0 && (
                        <TableRow
                            style={{
                                height: (dense ? 33 : 53) * emptyRows,
                            }}
                        >
                        <TableCell colSpan={6} />                           
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );
}

export default EventList