import { useEffect, useState } from 'react';
import axios from 'axios';
import { useStateValue } from './StateProvider';
import { fetchMessages, sendMessage } from './serverData';
import {
    Typography, Divider, Card, Grid, TextField, CircularProgress
} from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles';
import { MessageOutlined, ArrowCircleRightOutlined } from '@mui/icons-material';

var messagesEnd
const useStyles = makeStyles((theme) => createStyles({
    input: {
        background: (theme.palette.type === 'dark') ? '#424242' : '#fff',
        '& label.Mui-focused': {
            color: theme.palette.type === 'dark' ? '#9FA8DA' : 'rgba(63,81,181)',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.type === 'dark' ? '#9FA8DA' : 'rgba(63,81,181)',
        },
        '& .MuiOutlinedInput-root': {

            '&.Mui-focused fieldset': {
                borderColor: theme.palette.type === 'dark' ? '#9FA8DA' : 'rgba(63,81,181)',
            },
        },

    },

    notchedOutline: {
        borderColor: (theme.palette.type === 'dark') ? '#fff' : '#9E9E9E'
    }

}))

const Chat = ({selectedUser, socket, messages, setMessages}) => {
    const [state , ] = useStateValue()
    const [chatLoading, setChatLoading] = useState(true)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')
    const [load, setLoad]= useState(false)
    const classes = useStyles();
    const scrollToBottom = () => {
        messagesEnd.scrollIntoView();
    }
    useEffect(() => {
        if (messagesEnd) scrollToBottom();
    },[load, messages])
    useEffect(()=>{
        setMessages([])
        setChatLoading(true)
        axios.get(fetchMessages,  {
            params: { 
                'receiver_id': selectedUser._id
            },
            headers: {
                'Authorization': state.token
            }
        }).then((response)=>{
            setMessages(response.data)
            setChatLoading(false)
        }).catch((error)=>{
            setError(true)
            setChatLoading(false)
        })
    }, [selectedUser, state.token, setMessages])

    const handleSend = () =>{
        if (message.replace(/\s/g, '') === '')
            return
        setLoad(true)
        const payloadObj = {
            receiver_id : selectedUser._id,
            content: message,
            timestamp: new Date().getTime()
        }
        axios.post(sendMessage, payloadObj, {
            headers: {
                'Authorization': state.token
            }
        }).then((response)=>{
            setMessages((prev)=>[...prev, response.data])
            setMessage('')
            socket.emit("sendMessage",response.data)
            setLoad(false)
        }).catch((error)=>{
            setLoad(false)
        })
    }
    const handleKeyDown = (e) =>{
        if (e.key === 'Enter') {
            handleSend()
        }
    }
    return (
        <div style={{ width: "100%", height: "100%", background: "url(https://res.cloudinary.com/dez3yjolk/image/upload/v1607089644/samples/chatbackground_tjkimh.svg)" }}>
            <div style={{ padding: "0 16px 8px 16px", height: "100%" }}>
                <Divider style={{ background: "rgb(63,81,181)", marginBottom: "12px" }} />
                {chatLoading && <div style={{height: "calc(100% - 68px", overflow: "hidden", display: 'flex', alignItems: 'center', justifyContent: 'center'}} ><CircularProgress /></div>}
                {!chatLoading && <div className='chatbox' style={{ height: "calc(100% - 68px", overflow: "hidden", overflowY: "auto" }}>
                    {
                    messages.map((mssge) =>
                         <div key={mssge._id}>
                                {(mssge.receiver_id === state._id) ?
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                        <Card style={{ maxWidth: "70%", padding: "8px", marginBottom: "12px", borderTopRightRadius: "18px", borderBottomLeftRadius: "18px", borderBottomRightRadius: "18px", background: "rgba(63,81,181,0.8)" }}>
                                            <Typography style={{ color: "#fff" }}>
                                                {mssge.content}
                                            </Typography>
                                        </Card></div> :
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                        <Card style={{ maxWidth: "70%", padding: "8px", marginBottom: "12px", borderTopRightRadius: "18px", borderBottomLeftRadius: "18px", borderTopLeftRadius: "18px", background: "rgba(63,81,181,0.8)" }}>
                                            <Typography style={{ color: "#fff" }}>
                                                {mssge.content}
                                            </Typography>
                                        </Card>
                                    </div>



                                }
                            </div>
                        )

                    }
                    <div style={{ float: "left", clear: "both" }}
                        ref={(el) => { messagesEnd = el; }}>
                    </div>

                </div>}



            </div>

            <Grid container style={{ width: "100%", position: "fixed", bottom: "2px" }}>
                <Grid item xs={10}>
                    <TextField

                        fullWidth
                        variant='outlined'
                        size='small'
                        value={message}
                        className={classes.input}
                        onChange={(e) => {
                            setMessage(e.target.value)
                        }}
                        onKeyDown={handleKeyDown}
                        InputProps={{
                            classes: {

                                notchedOutline: classes.notchedOutline,
                            },

                        }}

                        placeholder='Type a message'>
                    </TextField>
                </Grid>
                <Grid item xs={2}>
                    <div onClick={handleSend} className="sendButton" style={{ width: "100%", border: "1px solid rgb(63,81,181)", background: "rgb(63,81,181)", height: "100%", display: "flex", alignItems: "center", borderRadius: "4px" }}>
                        <ArrowCircleRightOutlined  style={{ marginLeft: "50%", transform: "translateX(-50%)", color: load ? "gray" : "#fff" }} />
                    </div>


                </Grid>
            </Grid>
        </div>              
    )
}

export default Chat