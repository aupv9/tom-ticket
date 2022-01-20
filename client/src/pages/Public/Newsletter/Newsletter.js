import { Button, Container, Grid, TextField, Typography, withStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from '../BookingPage/styles';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { subNewsletter } from '../../../store/actions';

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

const Newsletter = (props) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const history = useHistory();
  const {
    subNewsletter
  } = props;

  const handleFieldChange = e => setEmail(e.target.value);

  const onSub = async () =>{
    if(email){
      subNewsletter(email);
      setEmail("")
    }
  }
  return(
    <Container maxWidth={"sm"}>
      <Grid container>
        <Grid md={12}>
          <form className={classes.form}>
            <Typography>
              Subscribe to our newsletter
            </Typography>
            <div className={classes.fields}>
              <TextField
                className={classes.textField}
                label="Email"
                name="email"
                onChange={event => handleFieldChange(event)}
                type="text"
                value={email}
                variant="outlined"
              />
            </div>
            <Button
              className={classes.loginButton}
              color="primary"
              onClick={() => onSub()}
              size="large"
              variant="contained">
              Subscribe
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  )
}
const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated,
  user: state.authState.user
});
export default connect(
  mapStateToProps,
  {
    subNewsletter
  }
)(withStyles(styles)(Newsletter));
