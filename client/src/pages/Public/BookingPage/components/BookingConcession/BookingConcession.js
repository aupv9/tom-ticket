import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Typography, CardActions, Container, Chip,
} from '@material-ui/core';
import { Paper } from '../../../../../components';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import BookingEnd from '../BookingEnd/BookingEnd';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3)
  },
  paper: { padding: theme.spacing(4) },
  gridContainer: {
    marginTop: theme.spacing(4)
  },
  successInfo: { margin: theme.spacing(3) },
  ignoreButton: {
    marginLeft: theme.spacing(3)
  },
  media: {
    height: 0,
    paddingTop: 150,
    maxWidth:150,
    maxHeight:50
  }
}));

const convertToAlphabet = value => (value + 10).toString(36).toUpperCase();

export default function BookingConcession(props) {
  const classes = useStyles();
  const {
    selectedSeats,
    sendInvitations,
    ignore,
    invitations,
    concessions,
    selectedFood,
    addFood,
    removeFood,
    setSubTotal,
    subTotal,
    showtime
  } = props;

  const calTotalFood = () =>{
    return selectedFood && selectedFood.length > 0 && selectedFood.reduce((prev,cur) => prev + cur.price,0)
  }

  const calTotalSeats= () =>{
    return selectedSeats && selectedSeats.length > 0 && selectedSeats.reduce((prev,cur) => prev + cur.price,0)
  }

  useEffect(() =>{
    console.log(calTotalSeats() + calTotalFood())
    setSubTotal(calTotalSeats() + calTotalFood());
  },[selectedFood])

  const onAddFood = (item) =>{
    addFood(item);
  }
  const onRemoveFood = (item) =>{
    removeFood(item);
  }

  const calQuantityFood = (food) =>{
     return selectedFood
       .filter(item => item.id === food.id)
       .reduce((prev,cur) => {
         prev += 1;
         return prev;
       },0) || 0;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h4" align="center">
          Concessions
        </Typography>
        {/*<Typography*/}
        {/*  className={classes.successInfo}*/}
        {/*  variant="body1"*/}
        {/*  align="center">*/}
        {/*  You have successfuly booked your seats. Please fill the emails below,*/}
        {/*  to send invitations to your friends!*/}
        {/*</Typography>*/}
        <Container>
          {
            concessions && concessions.length > 0 &&
            concessions.map((item,index) => (
              <Card className={classes.root} key={index}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={item.thumbnail}
                    title="Contemplative Reptile"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {
                        item.name
                      }
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                      {
                        item.price
                      } vnd
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <IconButton
                    onClick={() => onAddFood(item)}
                    children={<AddCircleIcon />}
                  />
                  <Chip label={calQuantityFood(item).toString() || "0"} variant="outlined" />
                  <IconButton
                    onClick={() => onRemoveFood(item)}
                    children={<RemoveCircleIcon />}
                  />
                </CardActions>
              </Card>
            ))
          }
        </Container>
        <BookingEnd selectedSeats={selectedSeats}
                    selectedFood={selectedFood}
                    subTotal={subTotal}
                    showtime={showtime}/>
      </Paper>
    </div>
  );
}
