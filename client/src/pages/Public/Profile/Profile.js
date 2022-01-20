import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Grid, Typography, Container } from '@material-ui/core';
import { getMovies, getReservations, getCinemas, getOrderHistory } from '../../../store/actions';
import Account from '../../Admin/Account';
import OrderHistory from './OrderHistory';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '3rem',
    lineHeight: '3rem',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(3)
  },
  [theme.breakpoints.down('sm')]: {
    fullWidth: { width: '100%' }
  }
}));

function Profile(props) {
  const {
    user,
    reservations,
    movies,
    cinemas,
    getMovies,
    getReservations,
    getCinemas,
    orderHistory,
    getOrderHistory,
    isPayment

  } = props;


  useEffect(() => {
    // getMovies();
    // getReservations();
    // getCinemas();
    if(user){
      getOrderHistory(user.id);
    }
  }, [isPayment]);

  console.log(orderHistory)
  const classes = useStyles(props);

  // const myReservations = reservations.filter(
  //   reservation => reservation.username === user.username
  // );


  return (
    <Container>
      <Grid container spacing={2}>
        {orderHistory.length > 0 && (
          <>
            <Grid item xs={12}>
              <Typography
                className={classes.title}
                variant="h2"
                color="inherit">
                My Orders
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <OrderHistory
                orderHistory={orderHistory}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Typography className={classes.title} variant="h2" color="inherit">
            My Account
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Account />
        </Grid>
      </Grid>
    </Container>
  );
}

const mapStateToProps = ({
                           authState,
                           movieState,
                           reservationState,
                           cinemaState,
                           checkoutState
                         }) => ({
  user: authState.user,
  movies: movieState.movies,
  reservations: reservationState.reservations,
  cinemas: cinemaState.cinemas,
  orderHistory:reservationState.orderHistory,
  isPayment:checkoutState.isPayment,

});

const mapDispatchToProps = { getMovies, getReservations, getCinemas,getOrderHistory };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
