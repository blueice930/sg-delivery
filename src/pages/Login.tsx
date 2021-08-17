import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CopyRight from 'src/components/CopyRight';
import { useAuth } from 'src/contexts/AuthContext';
import AlertMsg, { Severity } from 'src/components/AlertMsg';

const StyledIcon = styled(FontAwesomeIcon)`
  margin: 5px;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    width: '100%',
    margin: '20px 0',
  },
}));

const Login = () => {
  const fnameRef = useRef<HTMLInputElement>(null);
  const lnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const classes = useStyles();
  const { signup, login } = useAuth();
  const history = useHistory();

  const handleSignUp = async () => {
    const email = emailRef?.current?.value;
    const pw = passwordRef?.current?.value;
    const pwConfirm = passwordConfirmRef?.current?.value;
    const fname = fnameRef?.current?.value;
    const lname = lnameRef?.current?.value;

    if (pw !== pwConfirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      setError('');
      setLoading(true);
      await signup(email, pw, fname, lname);
      history.push('/order');
    } catch {
      setError('Failed to create an account');
    }
  };

  const handleLogIn = async () => {
    const email = emailRef?.current?.value;
    const pw = passwordRef?.current?.value;

    setLoading(true);
    try {
      setError('');
      await login(email, pw);
      history.push('/order');
    } catch {
      setError('Failed to log in');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      handleSignUp();
      return;
    }
    handleLogIn();
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            { isSignUp ? 'Sign up' : 'Sign in'}
          </Typography>
          <AlertMsg alertMsg={error} severity={Severity.ERROR} />
          <form className={classes.form} noValidate onSubmit={(e) => handleSubmit(e)}>
            <Grid container spacing={2}>
              {isSignUp && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="fname"
                      name="firstName"
                      variant="outlined"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                      inputRef={fnameRef}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="lname"
                      inputRef={lnameRef}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  inputRef={emailRef}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  inputRef={passwordRef}
                />
              </Grid>
              {isSignUp && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password-confirmation"
                    label="Password confirmation"
                    type="password"
                    id="password-confirmation"
                    inputRef={passwordConfirmRef}
                  />
                </Grid>
              )}
              { isSignUp ? (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive recent marketing promotions and updates via email."
                  />
                </Grid>
              ) : (
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              {isSignUp ? 'Sign Up' : 'Sign in'}
              {loading && (
                <StyledIcon icon={faSpinner} spin />
              )}
            </Button>
            <Grid container>
              <Grid item xs>
                <Button variant="contained">
                  Forgot password?
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={() => { setIsSignUp(!isSignUp); }} variant="contained">
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
                </Button>
              </Grid>
            </Grid>
            <Box mt={5}>
              <CopyRight websiteName="SG-Delivery" url={window.location.origin} />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
