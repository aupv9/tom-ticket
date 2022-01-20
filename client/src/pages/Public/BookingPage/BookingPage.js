import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Grid, Container } from '@material-ui/core';
import {
  getMovie,
  getCinemasUserModeling,
  getCinema,
  getCinemas,
  getShowtimes,
  getReservations,
  getSuggestedReservationSeats,
  setSelectedSeats,
  setSelectedCinema,
  setSelectedDate,
  setSelectedTime,
  setInvitation,
  toggleLoginPopup,
  showInvitationForm,
  resetCheckout,
  setAlert,
  addReservation,
  setSuggestedSeats,
  setQRCode,
  getShowTimesFilter,
  getCinemasByMovie,
  getSeatsByShowTime,
  setSeats,
  showConcession,
  setShowConcessions, setShowTime, setReserved, setIsExpireOrder, checkPromotionCode, resetOnExpireOrder,
} from '../../../store/actions';
import { ResponsiveDialog } from '../../../components';
import LoginForm from '../Login/components/LoginForm';
import styles from './styles';
import MovieInfo from './components/MovieInfo/MovieInfo';
import BookingForm from './components/BookingForm/BookingForm';
import BookingSeats from './components/BookingSeats/BookingSeats';
import BookingCheckout from './components/BookingCheckout/BookingCheckout';
import BookingInvitation from './components/BookingInvitation/BookingInvitation';

import jsPDF from 'jspdf';

import { format } from 'date-fns'
import BookingConcession from './components/BookingConcession/BookingConcession';
import {
  addFood, createPayment,
  getConcession,
  getPaymentMethods,
  handleVNPAY,
  removeFood, resetSelectedFood,
  setSubTotal, showMessagePaymentSuccess,
} from '../../../store/actions/concession';
import { setFoodTotal } from '../../../store/reducers/concession';
import MakePayment from './components/Payment/MakePayment';
import { setPayment } from '../../../store/reducers/checkout';


class BookingPage extends Component {
  didSetSuggestion = false;


  componentDidMount() {
      const {
        user,
        match,
        getMovie,
        getCinemas,
        getCinemasUserModeling,
        getShowtimes,
        getReservations,
        getSuggestedReservationSeats,
        getCinemasByMovie,
        getConcession,
        getPaymentMethods
      } = this.props;
      if(match.params.id){
        getMovie(match.params.id);
        getCinemasByMovie(match.params.id);
      }
      getConcession();
      getPaymentMethods();
  }

  // componentDidMount() {
  //   const {
  //     user,
  //     match,
  //     getMovie,
  //     getCinemas,
  //     getCinemasUserModeling,
  //     getShowtimes,
  //     getReservations,
  //     getSuggestedReservationSeats
  //   } = this.props;
  //    getCinemasByMovie(match.params.id);
  //    // getCinemas(match.params.id);
  //    getMovie(match.params.id);
  //    // user ? getCinemasUserModeling(user.username) : getCinemas();
  //    // getShowtimes();
  //    // getReservations();
  //   // if (user) getSuggestedReservationSeats(user.username);
  // }

  componentDidUpdate(prevProps) {
    const { selectedCinema, selectedDate,selectedTime,movie ,getShowTimesFilter,getSeatsByShowTime,setShowTime,selectedSeats,setSubTotal} = this.props;

      if ((selectedCinema && prevProps.selectedCinema !== selectedCinema) || (selectedCinema && prevProps.selectedDate !== selectedDate)) {
        getShowTimesFilter(selectedCinema,movie.id,format(new Date(selectedDate),"yyyy-MM-dd"));
      }
      if(
          ( prevProps.selectedCinema !== selectedCinema && selectedDate && selectedTime) ||
          (prevProps.selectedDate !== selectedDate && selectedDate && selectedTime)||
          (prevProps.selectedTime !== selectedTime && selectedDate && selectedTime) ){
        getSeatsByShowTime(selectedCinema,movie.id,format(new Date(selectedDate),"yyyy-MM-dd"),selectedTime);
        setShowTime(selectedCinema,movie.id,format(new Date(selectedDate),"yyyy-MM-dd"),selectedTime);

      }
      if(prevProps.selectedSeats !== selectedSeats){
        setSubTotal(selectedSeats && selectedSeats[0] && selectedSeats[0]["price"] * selectedSeats.length);
      }
  }

  // JSpdf Generator For generating the PDF
  jsPdfGenerator = () => {
    const { movie, cinema, selectedDate, selectedTime, QRCode } = this.props;
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(22);
    doc.text(movie.title, 20, 20);
    doc.setFontSize(16);
    doc.text(cinema.name, 20, 30);
    doc.text(
      `Date: ${new Date(
        selectedDate
      ).toLocaleDateString()} - Time: ${selectedTime}`,
      20,
      40
    );
    doc.addImage(QRCode, 'JPEG', 15, 40, 160, 160);
    doc.save(`${movie.title}-${cinema.name}.pdf`);
  };



  onSelectSeat = (row,index,seat) => {
    const { seats, setSelectedSeats, setSeats,selectedSeats, setSubTotal } = this.props;

    const seatExist = selectedSeats.find(
      seat => seat.id === seats[row][index].id
    );

    !seatExist ?
      (  seats[row][index] = {
        ...seats[row][index],
        status:'Unvaiable'
      })
      : (  seats[row][index] = {
        ...seats[row][index],
        status:'Available'
      } );

    setSeats(seats);
    setSelectedSeats(seats[row][index]);
  };


  async checkout() {
    const {
      movie,
      cinema,
      selectedSeats,
      selectedDate,
      selectedTime,
      getReservations,
      isAuth,
      user,
      addReservation,
      toggleLoginPopup,
      showInvitationForm,
      setQRCode,
      setShowConcessions
    } = this.props;
    if (selectedSeats.length === 0) return;
    if (!isAuth) return toggleLoginPopup();

    // const response = await addReservation({
    //   date: selectedDate,
    //   startAt: selectedTime,
    //   seats: this.bookSeats(),
    //   ticketPrice: cinema.ticketPrice,
    //   total: selectedSeats.length * cinema.ticketPrice,
    //   movieId: movie._id,
    //   cinemaId: cinema._id,
    //   username: user.username,
    //   phone: user.phone
    // });
    // if (response.status === 'success') {
    //   const { data } = response;
    //   setQRCode(data.QRCode);
    //   getReservations();
     setShowConcessions();
     // showInvitationForm();
    // }
  }

  bookSeats() {
    const { cinema, selectedSeats } = this.props;
    const seats = [...cinema.seats];

    if (selectedSeats.length === 0) return;

    const bookedSeats = seats
      .map(row =>
        row.map((seat, i) => (seat === 2 ? i : -1)).filter(seat => seat !== -1)
      )
      .map((seats, i) => (seats.length ? seats.map(seat => [i, seat]) : -1))
      .filter(seat => seat !== -1)
      .reduce((a, b) => a.concat(b));

    return bookedSeats;
  }

  onFilterTimes() {
    const { cinemas, showtimes, selectedCinema, selectedTime } = this.props;
    const initialReturn = { uniqueCinemas: [], uniqueTimes: [] };
    if (!showtimes || !cinemas) return initialReturn;

    // const uniqueCinemasId = showtimes
    //   .filter(showtime =>
    //     selectedTime ? showtime.startAt === selectedTime : true
    //   )
    //   .map(showtime => showtime.cinemaId)
    //   .filter((value, index, self) => self.indexOf(value) === index);
    //
    // const uniqueCinemas = cinemas.filter(cinema =>
    //   uniqueCinemasId.includes(cinema.id)
    // );

    const uniqueTimes = showtimes
      // .filter(showtime =>
      //   selectedCinema ? selectedCinema === showtime.cinemaId : true
      // )
      .map(showtime => showtime["time"])
      // .filter((value, index, self) => self.indexOf(value) === index)
      // .sort(
      //   (a, b) => new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b)
      // );

    return { ...initialReturn, uniqueCinemas : cinemas, uniqueTimes };
  }


  onGetReservedSeats = () => {
    const { reservations, cinema, selectedDate, selectedTime ,seats} = this.props;

    if (!cinema) return [];
    // const newSeats = [...cinema.seats];
    const newSeats = [];

    // const filteredReservations = reservations.filter(
    //   reservation =>
    //     new Date(reservation.date).toLocaleDateString() ===
    //       new Date(selectedDate).toLocaleDateString() &&
    //     reservation.startAt === selectedTime
    // );
    // if (filteredReservations.length && selectedDate && selectedTime) {
    //   const reservedSeats = filteredReservations
    //     .map(reservation => reservation.seats)
    //     .reduce((a, b) => a.concat(b));
    //   reservedSeats.forEach(([row, seat]) => (newSeats[row][seat] = 1));
    //   return newSeats;
    // }
    return newSeats;
  };

  onGetSuggestedSeats = (seats, suggestedSeats) => {
    const { numberOfTickets, positions } = suggestedSeats;

    const positionsArray = Object.keys(positions).map(key => {
      return [String(key), positions[key]];
    });

    positionsArray.sort((a, b) => {
      return b[1] - a[1];
    });

    if (positionsArray.every(position => position[1] === 0)) return;

    const step = Math.round(seats.length / 3);
    let indexArr = [];
    let suggested;
    for (let position of positionsArray) {
      switch (position[0]) {
        case 'front':
          indexArr = [0, step];
          suggested = this.checkSeats(indexArr, seats, numberOfTickets);
          break;
        case 'center':
          indexArr = [step, step * 2];
          suggested = this.checkSeats(indexArr, seats, numberOfTickets);
          break;
        case 'back':
          indexArr = [step * 2, step * 3];
          suggested = this.checkSeats(indexArr, seats, numberOfTickets);
          break;
        default:
          break;
      }
      if (suggested) this.getSeat(suggested, seats, numberOfTickets);
      break;
    }
  };

  checkSeats = (indexArr, seats, numberOfTickets) => {
    for (let i = indexArr[0]; i < indexArr[1]; i++) {
      for (let seat in seats[i]) {
        let seatNum = Number(seat);

        if (
          !seats[i][seatNum] &&
          seatNum + (numberOfTickets - 1) <= seats[i].length
        ) {
          let statusAvailability = [];
          for (let y = 1; y < numberOfTickets; y++) {
            //check the next seat if available
            if (!seats[i][seatNum + y]) {
              statusAvailability.push(true);
            } else {
              statusAvailability.push(false);
            }
          }
          if (statusAvailability.every(Boolean)) return [i, seatNum];
        }
      }
    }
    return null;
  };

  getSeat = (suggested, seats, numberOfTickets) => {
    const { setSuggestedSeats } = this.props;
    for (let i = suggested[1]; i < suggested[1] + numberOfTickets; i++) {
      const seat = [suggested[0], i];
      setSuggestedSeats(seat);
    }
  };

  onChangeCinema = event => this.props.setSelectedCinema(event.target.value);
  onChangeDate = date => this.props.setSelectedDate(date);
  onChangeTime = event => this.props.setSelectedTime(event.target.value);

  sendInvitations = async () => {
    const invitations = this.createInvitations();
    if (!invitations) return;
    try {
      const token = localStorage.getItem('jwtToken');
      const url = '/invitations';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invitations)
      });
      if (response.ok) {
        this.props.resetCheckout();
        this.props.setAlert('invitations Send', 'success', 5000);
        return { status: 'success', message: 'invitations Send' };
      }
    } catch (error) {
      this.props.setAlert(error.message, 'error', 5000);
      return {
        status: 'error',
        message: ' invitations have not send, try again.'
      };
    }
  };

  createInvitations = () => {
    const {
      user,
      movie,
      cinema,
      selectedDate,
      selectedTime,
      invitations
    } = this.props;

    const invArray = Object.keys(invitations)
      .map(key => ({
        to: invitations[key],
        host: user.name,
        movie: movie.title,
        time: selectedTime,
        date: new Date(selectedDate).toDateString(),
        cinema: cinema.name,
        image: cinema.image,
        seat: key
      }))
      .filter(inv => inv.to !== '');
    return invArray;
  };

  setSuggestionSeats = (seats, suggestedSeats) => {
    suggestedSeats.forEach(suggestedSeat => {
      seats[suggestedSeat[0]][suggestedSeat[1]] = 3;
    });
    return seats;
  };

  render() {
    const {
      addReservation,
      classes,
      user,
      movie,
      cinema,
      showtimes,
      selectedSeats,
      selectedCinema,
      selectedDate,
      selectedTime,
      showLoginPopup,
      toggleLoginPopup,
      showInvitation,
      invitations,
      setInvitation,
      resetCheckout,
      suggestedSeats,
      suggestedSeat,
      cinemas,
      seats,
      showConcession,
      setShowConcessions,
      concessions,
      selectedFood,
      addFood,
      removeFood,
      setSubTotal,
      subTotal,
      showtime,
      isReserved,
      isPayment,
      setPayment,
      setReserved,
      isExpireOrder,
      setIsExpireOrder,
      orderNow,
      checkPromotionCode,
      isApplyPromotionCode,
      resetOnExpireOrder,
      paymentMethods,
      handleVNPAY,
      createPayment,
      showMessagePaymentSuccess,
      resetSelectedFood
    } = this.props;
    const {uniqueTimes} =  this.onFilterTimes();
    // let seats = this.onGetReservedSeats();
    // if (suggestedSeats && selectedTime && !suggestedSeat.length) {
    //   this.onGetSuggestedSeats(seats, suggestedSeats);
    // }
    // if (suggestedSeat.length && !this.didSetSuggestion) {
    //   seats = this.setSuggestionSeats(seats, suggestedSeat);
    //   this.didSetSuggestion = true;
    // }

    return (
      <>
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={2} style={{ height: '100%' }}>
           <MovieInfo movie={movie} />
            <Grid item lg={9} xs={12} md={12}>
              {
                !showConcession && !isReserved &&
                <BookingForm
                  cinemas={cinemas}
                  times={uniqueTimes}
                  showtimes={showtimes}
                  selectedCinema={selectedCinema}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onChangeCinema={this.onChangeCinema}
                  onChangeDate={this.onChangeDate}
                  onChangeTime={this.onChangeTime}
                />
              }

              {/*{showInvitation && !!selectedSeats.length && (*/}
              {/*  <BookingInvitation*/}
              {/*    selectedSeats={selectedSeats}*/}
              {/*    sendInvitations={this.sendInvitations}*/}
              {/*    ignore={resetCheckout}*/}
              {/*    invitations={invitations}*/}
              {/*    onSetInvitation={setInvitation}*/}
              {/*    onDownloadPDF={this.jsPdfGenerator}*/}
              {/*  />*/}
              {/*)}*/}

              {
                showConcession && !isReserved &&(
                  <BookingConcession
                    user={user}
                    selectedSeats={selectedSeats}
                    concessions={concessions}
                    selectedFood={selectedFood}
                    addFood={(item) => addFood(item)}
                    removeFood={(item) => removeFood(item)}
                    setSubTotal={(subTotal) => setSubTotal(subTotal)}
                    subTotal={subTotal}
                    showtime={showtime}
                    setShowConcessions={setShowConcessions}
                    showConcession={showConcession}
                    addReservation={addReservation}
                    setPayment={setPayment}
                    setReserved={setReserved}
                    isReserved={isReserved}
                    isPayment={isPayment}
                    setIsExpireOrder={setIsExpireOrder}
                  />
                )
              }
              {
                !!isReserved && !!isExpireOrder && <MakePayment
                                                              createPayment={createPayment}
                                                              selectedSeats={selectedSeats}
                                                              selectedFood={selectedFood}
                                                              setIsExpireOrder={setIsExpireOrder}
                                                              showConcession={showConcession}
                                                              setShowConcessions={setShowConcessions}
                                                              showtime={showtime}
                                                              orderNow={orderNow}
                                                              checkPromotionCode={checkPromotionCode}
                                                              isApplyPromotionCode={isApplyPromotionCode}
                                                              setSubTotal={setSubTotal}
                                                              subTotal={subTotal}
                                                              setReserved={setReserved}
                                                              resetOnExpireOrder={resetOnExpireOrder}
                                                              paymentMethods={paymentMethods}
                                                              handleVNPAY={handleVNPAY}
                                                              showMessagePaymentSuccess={showMessagePaymentSuccess}
                                                              resetSelectedFood={resetSelectedFood}
                />
              }

              {selectedCinema && selectedTime && !showConcession && seats && !isReserved && (
                <>
                  <BookingSeats
                    seats={seats}
                    onSelectSeat={(indexRow,index, seat) =>
                      this.onSelectSeat(indexRow, index,seat)
                    }
                  />
                  {
                    selectedSeats &&
                    <BookingCheckout
                      user={user}
                      // ticketPrice={cinema.ticketPrice}
                      // seatsAvailable={cinema.seatsAvailable}
                      selectedSeats={selectedSeats}
                      onBookSeats={() => this.checkout()}
                      subTotal={subTotal}
                      setSubTotal={setSubTotal}
                    />
                  }
                </>
              )}
            </Grid>
          </Grid>
          <ResponsiveDialog
            id="Edit-cinema"
            open={!!showLoginPopup && !user}
            handleClose={() => toggleLoginPopup()}
            maxWidth="sm">
            <LoginForm />
          </ResponsiveDialog>
        </Container>
      </>

    );
  }
}

BookingPage.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (
  {
    authState,
    movieState,
    cinemaState,
    showtimeState,
    reservationState,
    checkoutState,
    food
  },
  ownProps
) => ({
  isAuth: authState.isAuthenticated,
  user: authState.user,
  movie: movieState.selectedMovie,
  cinema: cinemaState.selectedCinema,
  cinemas: cinemaState.cinemas,
  showtimes: showtimeState.showtimes.filter(value => value.status !== "Expire"),
  reservations: reservationState.reservations,
  selectedSeats: checkoutState.selectedSeats,
  suggestedSeat: checkoutState.suggestedSeat,
  selectedCinema: checkoutState.selectedCinema,
  selectedDate: checkoutState.selectedDate,
  selectedTime: checkoutState.selectedTime,
  showLoginPopup: checkoutState.showLoginPopup,
  showInvitation: checkoutState.showInvitation,
  invitations: checkoutState.invitations,
  QRCode: checkoutState.QRCode,
  suggestedSeats: reservationState.suggestedSeats,
  selectedShowtime:showtimeState.selectedShowtime,
  seats:reservationState.seats,
  showConcession:checkoutState.showConcession,
  concessions:food.concessions,
  selectedFood:food.selectedFood,
  subTotal:food.subTotal,
  showtime:showtimeState.showtime,
  foodTotal:food.foodTotal,
  isReserved:checkoutState.isReserved,
  isPayment:checkoutState.isPayment,
  isExpireOrder:checkoutState.isExpireOrder,
  orderNow:reservationState.orderNow,
  isApplyPromotionCode:reservationState.isApplyPromotionCode,
  paymentMethods:food.paymentMethods
});

const mapDispatchToProps = {
  getCinemasByMovie,
  getMovie,
  getCinema,
  getCinemasUserModeling,
  getCinemas,
  getShowtimes,
  getReservations,
  getSuggestedReservationSeats,
  addReservation,
  setSelectedSeats,
  setSuggestedSeats,
  setSelectedCinema,
  setSelectedDate,
  setSelectedTime,
  setInvitation,
  toggleLoginPopup,
  showInvitationForm,
  resetCheckout,
  setAlert,
  setQRCode,
  getShowTimesFilter,
  getSeatsByShowTime,
  setSeats,
  setShowConcessions,
  getConcession,
  addFood,
  removeFood,
  setSubTotal,
  setShowTime,
  setFoodTotal,
  setPayment,
  setReserved,
  setIsExpireOrder,
  checkPromotionCode,
  resetOnExpireOrder,
  getPaymentMethods,
  handleVNPAY,
  showMessagePaymentSuccess,
  createPayment,
  resetSelectedFood
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BookingPage));
