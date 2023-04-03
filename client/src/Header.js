import React from 'react';
import {AppBar, Toolbar, Typography, Tooltip, IconButton} from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { useStateValue } from './StateProvider';
import { LogoutRounded } from '@mui/icons-material';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    },
    logoutButton: {
        background: "#fff !important"
    }
  }),
);

export default function Header(props) {
  const classes = useStyles();
  const [state , dispatch] = useStateValue();
  const handleLogout = () => {
    dispatch({
        type: "LOGOUT",
    })
    }
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{background: 'rgb(63,81,181)', maxHeight: '56px'}}>
        <Toolbar>
          <img style={{height:"35px" ,width:"35px"}}
            alt="Logo"
            src="/chat.svg"
            />
          <Typography variant="h6" className={classes.title} style={{color:'#fff'}}>
            &nbsp;&nbsp;Chat App
          </Typography>
          {
            state.isLoggedIn && 
            <Tooltip title="Logout">
            <IconButton onClick={handleLogout} aria-label="logout" className={classes.logoutButton}><LogoutRounded /></IconButton>
            </Tooltip>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}