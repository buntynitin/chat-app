import React from 'react';
import { Button,
     TextField, 
     FormControlLabel,
     Checkbox,
     Grid,
     Alert,
     IconButton,
     InputAdornment,
     OutlinedInput,
     FormControl,
     InputLabel,
     Typography
    } from '@mui/material'
import { useStateValue } from './StateProvider';
import { Link } from 'react-router-dom'
import { createStyles, makeStyles } from '@mui/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios'
import jwt_decode from "jwt-decode";
import Header from './Header'
import { loginURL } from './serverData'

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
        minHeight: "100vh",
        alignContent: "stretch",
        [theme.breakpoints.down("sm")]: {
          alignContent: "flex-start"
        },
        '& label.Mui-focused': {
          color: theme.palette.type === 'dark'?'#9FA8DA':'rgba(63,81,181)',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: theme.palette.type === 'dark'?'#9FA8DA':'rgba(63,81,181)',
        },
        '& .MuiOutlinedInput-root': {
          
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.type === 'dark'?'#9FA8DA':'rgba(63,81,181)',
          },
        },
      },
      header: {
        padding: theme.spacing(5),
        display: "flex",
        flexDirection: "column !important",
        justifyContent: "center",
        textAlign: "center",
        [theme.breakpoints.down("sm")]: {
          flexGrow: 1
        }
      },
      title: {
        color: theme.palette.type === 'dark'?'#fff':'#000',
        marginBottom: theme.spacing(1)
      },
      subtitle: {
        color: theme.palette.primary.light
      },
      toolbar: {
        justifyContent: "center"
      },
      formDiv: {
        padding: 0,
    
        [theme.breakpoints.up("sm")]: {
          padding: theme.spacing(15, 20, 0, 20)
        }
      },
      form: {
        padding: theme.spacing(3)
      },
      register: {
        padding: theme.spacing(2, 0, 0, 0)
      }
  }),
);


function Login(props) {
  const [ , dispatch] = useStateValue();
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loginError, setLoginError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [showPassword1, setShowPassword1] = React.useState(false);
  const handleClickShowPassword1 = () => {
    setShowPassword1(!showPassword1)
  };


  const handleMouseDownPassword1 = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');
    const formJson = { 'email': email, 'password': password }
    axios.post(loginURL,
      formJson
    ).then(function (response) {
      const storedJwt = localStorage.getItem('user_token');
      if (!storedJwt && remember) {
        localStorage.setItem('user_token', response.data.token.toString());
      }
      var decoded = jwt_decode(response.data.token);
      decoded["isLoggedIn"] = true;
      decoded["token"] = response.data.token;
      dispatch({
        type: "LOGIN",
        item: decoded
      })
      setIsSubmitting(false)
    }).catch(function (error) {

      setIsSubmitting(false);
      if (error.message === "Network Error")
        setLoginError("Network Error");
      else
        setLoginError(error.response.data.error);
    })
  }

  return (
    <div>
      <Header />
   
      <Grid container className={classes.root}>

        <Grid item className={classes.header} xs={12} md={4} style={{ borderRadius: "0px 0px 30px 30px",background: "#edf2f4" }}>
          <center>
            <img style={{ width: "150px", height: "150px" }} alt="" src="/chat.svg" />
          </center>
          <Typography variant='h4' className={classes.title}>
            Sign In
          </Typography>

        </Grid>
        <Grid item xs={12} md={8}>
          <div className={classes.formDiv}>
            <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
              />

              <FormControl variant="outlined" fullWidth margin='normal'>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  name='password'
                  label='Password'
                  type={showPassword1 ? 'text' : 'password'}
                  variant='outlined'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword1}
                        onMouseDown={handleMouseDownPassword1}
                        edge="end"
                      >
                        {showPassword1 ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  required
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox checked={remember} color="primary" onChange={(e) => setRemember(e.target.checked)} style={{color: "rgb(63,81,181)"}} />}
                label="Remember me"
              />
              <div style={{ marginBottom: "8px" }} />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disableElevation={isSubmitting}
                style={{background:isSubmitting?'#E0E0E0':"rgb(63,81,181)",color:isSubmitting?'#9E9E9E':"#ffffff"}}
                className={classes.submit}
                disabled={isSubmitting}
                size="large"
              >

                Sign In
          </Button>
              <div style={{ marginBottom: "8px" }} />
              <div className={classes.register}>
                <Link to="/register" style={{color:"rgb(63,81,181)",textDecoration:"none"}}>
                  <Typography variant="body1">Don't have an account? Sign Up</Typography>
                </Link>
              </div>

              {loginError && (
                <Alert style={{ marginTop: "16px",backgroundColor:"#fdecea",color:'#000' }} severity="error">{loginError}</Alert>
              )}
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Login