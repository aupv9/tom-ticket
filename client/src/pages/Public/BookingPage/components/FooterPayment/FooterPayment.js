import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box, Grid, Typography, Button } from '@material-ui/core';
import { addReservation, setIsExpireOrder } from '../../../../../store/actions';
import { useHistory } from 'react-router-dom';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { addMinutes, getSeconds, subSeconds } from 'date-fns';

const useStyles = makeStyles(theme => ({
  bannerTitle: {
    fontSize: theme.spacing(1.4),
    textTransform: 'uppercase',
    color: 'rgb(93, 93, 97)',
    marginBottom: theme.spacing(1)
  },
  bannerContent: {
    fontSize: theme.spacing(2),
    textTransform: 'capitalize',
    color: theme.palette.common.white
  },
  [theme.breakpoints.down('sm')]: {
    hideOnSmall: {
      display: 'none'
    }
  }
}));

export default function FooterPayment(props) {
  const classes = useStyles(props);
  const {
    user,
    seatsAvailable,
    onBookSeats,
    selectedSeats,
    selectedFood,
    showtime,
    subTotal,
    setSubTotal,
    setShowConcessions,
    showConcession,
    addReservation,
    setReserved,
    isReserved,
    setIsExpireOrder,
    orderNow,
    handlePayment
  } = props;

  const history = useHistory();

  const onPayment = async () =>{
    handlePayment();
    // const response = await addReservation({
    //   seats: selectedSeats.map((item) => item.id),
    //   concessionId:selectedFood.map((item) => item.id),
    //   totalAmount: subTotal,
    //   userId: user && user.id || 0,
    //   showTimesDetailId:showtime.id,
    //   isOnline:true
    // });
    // if(response.status === "success"){
    //   setReserved();
    //   setShowConcessions();
    //   setIsExpireOrder()
    // }
  }

  useEffect(() =>{

  },[])


  const onPrevious = () =>{
    setShowConcessions();
    setIsExpireOrder();
    setReserved();
  }


  return (
    <Box marginTop={2} bgcolor="rgb(18, 20, 24)" display={"fixed"}>
      <Grid container>
        <Grid item xs={8} md={10}>
          <Grid container spacing={3} style={{ padding: 20 }}>
            {user && user.name && (
              <Grid item className={classes.hideOnSmall}>
                <Typography className={classes.bannerTitle}>Name</Typography>
                <Typography className={classes.bannerContent}>
                  {user.name}
                </Typography>
              </Grid>
            )}
            <Grid item>
              <Typography className={classes.bannerTitle}>Tickets</Typography>
              {selectedSeats  && selectedSeats.length > 0 ? (
                <>
                  <Typography className={classes.bannerContent}>
                    {selectedSeats.length} tickets
                  </Typography>
                  {
                    selectedSeats && selectedSeats.map((item,index) => (
                        <span key={index}>{item["tier"]}{item["numbers"]}</span>
                      )
                    )
                  }
                </>

              ) : (
                <Typography className={classes.bannerContent}>0</Typography>
              )}
            </Grid>
            <Grid item>
              <Typography className={classes.bannerTitle}>Foods</Typography>
              {selectedSeats  && selectedSeats.length > 0 ? (
                <Typography className={classes.bannerContent}>
                  {selectedFood.length} foods
                </Typography>
              ) : (
                <Typography className={classes.bannerContent}>0</Typography>
              )}
            </Grid>
            <Grid item>
              <Typography className={classes.bannerTitle}>Price</Typography>
              <Typography className={classes.bannerContent}>
                {
                  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(subTotal || 0)
                }
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={4}
          md={2}
          style={{
            color: 'rgb(120, 205, 4)',
            background: 'black',
            display: 'flex'
          }}>
          <Button
            color="inherit"
            fullWidth
            disabled={seatsAvailable <= 0}
            onClick={() => onPayment()}>
            Payment
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
