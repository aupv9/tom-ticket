import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  CardActions,
  Container,
  Chip,
  Grid,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  Button,
  FormLabel, FormControl, FormControlLabel, Radio, RadioGroup,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Paper } from '../../../../../components';
import Timer from '../Timer/Timer';

import { getMinutes, subMinutes } from 'date-fns';
import FooterPayment from '../FooterPayment/FooterPayment';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1)
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
  },
  form: {
    paddingLeft: '100px',
    paddingRight: '100px',
    paddingBottom: '125px',
    flexBasis: '700px',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    color: theme.palette.common.contrastText,
    marginTop: theme.spacing(3)
  },
  socialLogin: {
    margin: theme.spacing(4, 0)
  },
  fields: {
    marginTop: theme.spacing(2)
  },
  textField: {
    width: '100%',
    '& + & ': {
      marginTop: theme.spacing(2)
    }
  },
  progress: {
    display: 'block',
    marginTop: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  loginButton: {
    marginTop: theme.spacing(2),
    width: '100%'
  },
  register: {
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary
  },
  registerUrl: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  fieldError: {
    color: theme.palette.danger.main,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1)
  },
  submitError: {
    color: theme.palette.danger.main,
    alignText: 'center',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2)
  }

}));

const convertToAlphabet = value => (value + 10).toString(36).toUpperCase();

export default function MakePayment(props) {
  const classes = useStyles();
  const {
    selectedSeats,
    user,
    ignore,
    invitations,
    concessions,
    selectedFood,
    addFood,
    removeFood,
    showtime,
    setShowConcessions,
    showConcession,
    addReservation,
    orderNow,
    checkPromotionCode,
    isApplyPromotionCode,
    setSubTotal,
    subTotal,
    setReserved,
    setIsExpireOrder,
    resetOnExpireOrder
  } = props;
  const [promoCode, setPromoCode] = useState("");

  useEffect(() =>{

  },[]);

  const handleFieldChange = e => setPromoCode(e.target.value);

  const onCheckCode = async () =>{
    if(promoCode){
      const response = await checkPromotionCode(promoCode,showtime.movieId);
      if(response && response.status === "success" ){
        const offer = response.data;
        const typePromotion = offer.type;
        if(typePromotion === "Flat"){
           setSubTotal(subTotal - offer["discountAmount"]);
        }else{
          const discount = ((subTotal / 100) * offer["percentage"]);
          setSubTotal(subTotal - discount);
        }
      }
    }
  }

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="timer">Too lale...</div>;
    }

    return (
      <div className="timer">
        <div className="text">Remaining Make Payment</div>
        <div className="value">{remainingTime}</div>
        <div className="text">seconds</div>
      </div>
    );
  };

  const onExpireOrder = () =>{
    resetOnExpireOrder();
  };
  const [value, setValue] = React.useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h4" align="center">
          Payment
        </Typography>
        <Container>
          <Grid container>
            {/*<Grid item md={12}>*/}
            {/*  <Timer initialMinute={5} initialSeconds={0}/>*/}
            {/*</Grid>*/}
            <Grid item md={9}>
              {
                !isApplyPromotionCode &&
                <Accordion disabled={isApplyPromotionCode}  >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>Apply Promotion</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <form className={classes.form}>
                      <Typography>
                        Usage Promotion Code
                      </Typography>
                      <div className={classes.fields}>
                        <TextField
                          className={classes.textField}
                          label="Promotion Code"
                          name="code"
                          onChange={event => handleFieldChange(event)}
                          type="text"
                          value={promoCode}
                          variant="outlined"
                        />
                      </div>
                      <Button
                        className={classes.loginButton}
                        color="primary"
                        onClick={() => onCheckCode()}
                        size="large"
                        variant="contained">
                        Apply
                      </Button>
                    </form>
                  </AccordionDetails>
                </Accordion>
              }
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography className={classes.heading}>Select Payment</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                      {

                      }
                      <FormControlLabel value="female" control={<Radio />} label="Female" />

                    </RadioGroup>
                  </FormControl>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item md={3}>
              <Grid container>
                <Grid item md={12}>
                  <Container>
                    <Typography>
                      Countdown Time
                    </Typography>
                    <CountdownCircleTimer
                      isPlaying
                      duration={300}
                      colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                      colorsTime={[10, 6, 3, 0]}
                      onComplete={() => onExpireOrder()}
                    >
                      {renderTime}
                    </CountdownCircleTimer>
                  </Container>

                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <FooterPayment
                      user={user}
                      showConcession={showConcession}
                      setShowConcessions={setShowConcessions}
                      selectedSeats={selectedSeats}
                      selectedFood={selectedFood}
                      subTotal={subTotal}
                      showtime={showtime}
                      addReservation={addReservation}
                      setReserved={setReserved}
                      setIsExpireOrder={setIsExpireOrder}
                      orderNow={orderNow}
        />
      </Paper>
    </div>
  );
}
