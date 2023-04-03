import { useEffect, useRef } from 'react'
import { createStyles, makeStyles } from '@mui/styles';
import { Box } from '@mui/material';

const colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"]
const useStyles = makeStyles((theme) =>
  createStyles({ 
    avatar:{
        width: '75px',
        height: '75px',
        font : '37.5px Arial',
        color: '#FFF',
        textAlign: 'center',
        lineHeight: '75px',
        borderRadius: '50%',
        cursor: 'pointer',
        userSelect: 'none'
    }
  }))
const Avatar = ({name, id, selectedUser, unreadUsers, hideLabels}) =>{
    const nameList = name.split(' ')
    const initials =  nameList.length > 1 ? nameList[0].charAt(0).toUpperCase() + nameList[1].charAt(0).toUpperCase() : nameList[0].charAt(0).toUpperCase()
    const colorIndex = (initials.charCodeAt(0) - 65) % 19
    const avatarRef = useRef(null)
    const isUnread = unreadUsers.indexOf(id) > -1 ? true : false 
    const classes = useStyles();
    useEffect(()=>{
        const avatarElement = avatarRef.current
        avatarElement.innerText = initials
        avatarElement.style.backgroundColor = colors[colorIndex]
        if(selectedUser && id === selectedUser._id){
            avatarElement.style.border = "2px solid rgb(63,81,181)"
        }else{
            avatarElement.style.border = "unset"
        }
    },[initials, avatarRef, colorIndex, id, selectedUser])
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
            <div ref={avatarRef} className={classes.avatar}></div>
            {   !hideLabels &&
                <Box style={{background: 'rgba(63,81,181,0.8)',
                color: '#fff',
                padding: '4px',
                maxWidth: '75px',
                borderRadius: '8px',
                bottom: '-5px'}} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', textAlign: 'center'}}>
                {nameList[0]}
            </Box>
            }
            {
                isUnread && <div style={{background: 'red',
                position: 'absolute',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                top: '4px', right: '8px'}}>
            </div>
            } 
        </Box>
       
    )
}

export default Avatar