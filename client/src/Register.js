import React from 'react';
import { Button,
    TextField,
    Grid,
    Snackbar,
    SnackbarContent,
    Alert,
    IconButton,
    InputAdornment,
    OutlinedInput,
    FormControl,
    InputLabel,
    Typography
} from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Visibility, VisibilityOff, ErrorOutline} from '@mui/icons-material';
import Success from './Success'
import Header from './Header'
import { registerURL } from './serverData';
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
    formdiv: {
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
    },
    message: {
        display: "flex",
        alignItems: "center",
      },
      error: {
        backgroundColor: "#f94144 !important"
      },
      icon: {
        marginRight: theme.spacing(1)
      }
}));

function Register(props) {
    const classes = useStyles();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [accountCreated, setAccountCreated] = React.useState(false);
    const [loginError, setLoginError] = React.useState('');
    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [showPassword1, setShowPassword1] = React.useState(false)
    const [showPassword2, setShowPassword2] = React.useState(false)
    const [matchPassword, setMatchPassword] = React.useState(true)
    const [open, setOpen] = React.useState(false);
    const [snackmessage, setSnackmessage] = React.useState('');
    const handleClickShowPassword1 = () => {
        setShowPassword1(!showPassword1)
    };

    const handleCloseSnackbar = () => {
        setOpen(false);
      };

    const handleMouseDownPassword1 = (event) => {
        event.preventDefault();
    };

    const handleClickShowPassword2 = () => {
        setShowPassword2(!showPassword2)
    };

    const handleMouseDownPassword2 = (event) => {
        event.preventDefault();
       
    };

    
    const handleSubmit = (e) => {
        setLoginError('')
        
        e.preventDefault()
        if(password !== confirmPassword){
            setMatchPassword(false)
            setSnackmessage('Passwords not matching')
            setOpen(true);
            return 
        }
        setIsSubmitting(true)
        axios.post(registerURL, {
        name,email,password
      }).then(function (response) {
        setIsSubmitting(false)
        setAccountCreated(true)

        }).catch(function (error){
            setIsSubmitting(false)
            if (error.message === "Network Error")
            setLoginError('Network Error')
          else
            setLoginError(error.response.data.error);

        })

     
    }

    return (
        <div>
            <Header />
            <Grid container className={classes.root}>

                <Grid item className={classes.header}  xs={12} md={4} style={{ borderRadius: "0px 0px 30px 30px",background: "#edf2f4" }}>
                    <center>
                        <img style={{ width: "150px", height: "150px" }} alt="" src="/chat.svg" />
                    </center>
                    <Typography variant='h4' className={classes.title}>
                        Sign Up
          </Typography>

                </Grid>
                
                <Grid item xs={12} md={8}>
                {accountCreated? <Success />:
                    <div className={classes.formdiv}>
                        <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        resumeHideDuration={3000}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        open={open}
      >
        <SnackbarContent
          className={(classes.error, classes.error)}
          message={
            <span className={classes.message}>
              <ErrorOutline className={classes.icon} />
              {snackmessage}
            </span>
          }
        />
      </Snackbar>
                         
                        <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                            
                            <TextField


                                label='Name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                variant='outlined'
                                margin='normal'
                                required
                                inputProps={{
                                    minLength: 4,
                                    maxLength: 255
                                }}

                                fullWidth
                            />
                            <div style={{marginBottom:"8px"}} />

                            <TextField
                                label='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type='email'
                                variant='outlined'
                                margin='normal'

                                required
                                fullWidth
                            />
                            <div style={{marginBottom:"8px"}} />
                            
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6}>
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
                                    inputProps={{
                                        minLength: 6,
                                        maxLength: 255
                                    }}

                                />


                            </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" fullWidth margin='normal' style={{ marginBottom: '10px' }}>
                                             <InputLabel>Confirm</InputLabel>
                                             <OutlinedInput
                                                label='Confirm'
                                                name='confirmpassword'
                                                value={confirmPassword}
                                                onChange={(e) => {
                                                    setMatchPassword('true')
                                                    setConfirmPassword(e.target.value)
                                                }}
                                                type={showPassword2 ? 'text' : 'password'}
                                                variant='outlined'
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword2}
                                                            onMouseDown={handleMouseDownPassword2}
                                                            edge="end"
                                                        >
                                                            {showPassword2 ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                required
                                                error={!matchPassword}
                                                
                                            />
                                        </FormControl>
                                        </Grid>
                                        </Grid>
                                        <div style={{marginBottom:"16px"}} />
                            <Button
                                type="submit"
                                fullWidth
                                color="primary"
                                variant="contained"
                                disableElevation={isSubmitting}
                                style={{background:isSubmitting?'#E0E0E0':"rgb(63,81,181)",color:isSubmitting?'#9E9E9E':"#ffffff"}}
                                className={classes.submit}
                                disabled={isSubmitting}
                                size="large"
                            >

                                

                                Sign Up
          </Button>
          <div className={classes.register}>
                <Link to={"/"} style={{color:"rgb(63,81,181)",textDecoration:"none"}}>
                    <Typography>Already have an account? Sign In</Typography>
                
                </Link>
              </div>

          





        

{loginError && (
        <Alert style={{ marginTop: "16px",backgroundColor:"#fdecea",color:'#000' }} severity="error">{loginError}</Alert>
      )}
                        </form>


                    </div>
}

                </Grid>

            </Grid>

        </div>
    );
}

export default Register