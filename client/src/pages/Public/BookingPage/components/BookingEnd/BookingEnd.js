import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box, Grid, Typography, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

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

export default function BookingEnd(props) {
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
    setIsExpireOrder
  } = props;

  const history = useHistory();

  const onReserved = async () =>{

    const response = await addReservation({
      seats: selectedSeats.map((item) => item.id),
      concessionId:selectedFood.map((item) => item.id),
      totalAmount: subTotal,
      userId: user && user.id || 0,
      showTimesDetailId:showtime.id,
      online:true
    });
    if(response && response.status === "success"){
      setReserved();
      setShowConcessions();
      setIsExpireOrder()
    }
  }

  useEffect(() =>{

  },[])


  const onPrevious = () =>{
    setShowConcessions();
  }


  return (
    <Box marginTop={2} bgcolor="rgb(18, 20, 24)" display={"fixed"}>
      <Grid container>
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
            onClick={() => onPrevious()}>
            Previous
          </Button>
        </Grid>
        <Grid item xs={8} md={8}>
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
                        <span key={index}>{item["tier"]}{item["numbers"]}{' '}</span>
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
            onClick={() => onReserved()}>
            Reserved
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
