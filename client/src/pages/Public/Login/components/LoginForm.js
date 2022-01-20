import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button, TextField, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin, { useGoogleLogin } from 'react-google-login';
import { login, facebookLogin, googleLogin, loginWithGoogle } from '../../../../store/actions';
import { history } from '../../../../utils';

const useStyles = makeStyles(theme => ({
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
const clientId = '765454672866-ogngmccn89t4b7nkf24glnk87e3mn5e5.apps.googleusercontent.com';

function LoginForm(props) {
  const { facebookLogin, googleLogin, isAuthenticated, user, redirect,loginWithGoogle } = props;
  const classes = useStyles();
  const [values, setValues] = useState({ username: '', password: '' });

  useEffect(() => {
    if (isAuthenticated && redirect) {
      if (user && user.role === 'superadmin')
        return history.push('/admin/dashboard');
      return history.push('/');
    }
  }, [isAuthenticated, user, redirect]);

  const handleFieldChange = e =>
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });

  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    if(res && res.profileObj){
      loginWithGoogle({
        email:res.profileObj["email"],
        familyName:res.profileObj["familyName"],
        givenName:res.profileObj["familyName"],
        googleId:res.profileObj["googleId"],
        imageUrl:res.profileObj["imageUrl"],
        name:res.profileObj["name"]
      })
    }


    // login({isSocial:true,body:res.profileObj}).then(res =>{
    //
    //   // localStorage.setItem("avatar",res.profileObj["imageUrl"]);
    // }).catch((res) =>{
    //     notify("Invalid")
    //     console.log(res)
    //   }
    // );

  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
    accessType: 'offline'
  });
  return (
    <form className={classes.form}>
      <Typography className={classes.title} variant="h2">
        Sign in
      </Typography>

      <div className={classes.socialLogin}>
        <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          onSuccess={onSuccess}
          onFailure={onFailure}
          render={renderProps => (
            <Button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              fullWidth
              variant="contained"
              style={{
                borderRadius: 0,
                background: '#fff',
                color: '#de5246',
                marginBottom: 10,
                height: 60,
                fontSize: 'calc(.27548vw + 12.71074px)',
                fontWeight: 700
              }}>
              Login With Google
            </Button>
            )
          }
        />

        <FacebookLogin
          buttonStyle={{ width: '100%', height: 60 }}
          appId={process.env.REACT_APP_FACEBOOK_APP_ID} //APP ID NOT CREATED YET
          fields="name,email,picture"
          callback={facebookLogin}
        />
      </div>

      <div className={classes.fields}>
        <TextField
          className={classes.textField}
          label="username"
          name="username"
          onChange={event => handleFieldChange(event)}
          type="text"
          value={values.username}
          variant="outlined"
        />
        <TextField
          className={classes.textField}
          label="Password"
          name="password"
          onChange={event => handleFieldChange(event)}
          type="password"
          value={values.password}
          variant="outlined"
        />
      </div>

      <Button
        className={classes.loginButton}
        color="primary"
        onClick={() => props.login(values.username, values.password)}
        size="large"
        variant="contained">
        Login now
      </Button>
      <Typography className={classes.register} variant="body1">
        Don't have an account?
        <Link className={classes.registerUrl} to="/register">
          register
        </Link>
      </Typography>
    </form>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated,
  user: state.authState.user
});
export default connect(mapStateToProps, { login, facebookLogin, googleLogin,loginWithGoogle })(
  LoginForm
);
