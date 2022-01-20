import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core';

import Portlet from '../../../components/Portlet';
import PortletContent from '../../../components/PortletContent';
import styles from './style';
import { format } from 'date-fns';

class OrderHistory extends Component {
  state = {
    rowsPerPage: 10,
    page: 0
  };

  // static propTypes = {
  //   className: PropTypes.string,
  //   classes: PropTypes.object.isRequired,
  //   onSelect: PropTypes.func,
  //   onShowDetails: PropTypes.func,
  //   orders: PropTypes.array.isRequired,
  //   movies: PropTypes.array.isRequired,
  //   cinemas: PropTypes.array.isRequired
  // };

  static defaultProps = {
    orders: [],
    movies: [],
    cinemas: [],
    onSelect: () => {},
    onShowDetails: () => {},
    orderHistory: []
  };


  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  onFindAttr = (id, list, attr) => {
    const item = list.find(item => item._id === id);
    return item ? item[attr] : `Not ${attr} Found`;
  };




  render() {
    const { classes, className, orderHistory, movies, cinemas } = this.props;
    const { rowsPerPage, page } = this.state;
    const rootClassName = classNames(classes.root, className);
    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Code</TableCell>
                <TableCell align="left">Movie</TableCell>
                <TableCell align="left">Cinema</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Start At</TableCell>
                <TableCell align="left">End At</TableCell>
                <TableCell align="left">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderHistory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(order => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={order.id}>
                    <TableCell className={classes.tableCell}>
                      {
                        order.code
                      }
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {
                        order.movie
                      }
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {
                        order.theater
                      }
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {
                        format(new Date(order.createdDate),"dd-MM-yyyy hh:mm a")
                      }
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {order.timeStart}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {
                        order.timeEnd
                      }
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {
                        new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(order.total || 0)
                      }
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            component="div"
            count={orderHistory.length}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </PortletContent>
      </Portlet>
    );
  }
}

export default withStyles(styles)(OrderHistory);
