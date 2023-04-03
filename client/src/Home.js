import { useEffect, useState, useRef, forwardRef } from 'react'
import axios from 'axios'
import { getFriends, socketURL } from './serverData'
import Header from './Header'
import Avatar from './Avatar'
import { Box, IconButton, Slide, Dialog, DialogTitle, LinearProgress} from '@mui/material'
import { useStateValue } from './StateProvider';
import Chat from './Chat'
import io from "socket.io-client";
import { PersonAdd, Close } from '@mui/icons-material'
import AddFriend from './AddFriend'
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const socket = io(socketURL)
const Home = () => {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [error, setError] = useState(false)
    const [state , ] = useStateValue();
    const [selectedUser, setSelectedUser] = useState(null)
    const [unreadUsers, setUnreadUsers] = useState([])
    const [open, setOpen] = useState(false)
    const selectedUserRef = useRef();
    selectedUserRef.current = selectedUser;

    useEffect(() =>{
        console.log("In socket")
        socket.emit("join_room",
        {
            room_id: state._id
        })
        socket.on("receiveMessage",handleReceive)
        
    },[])

     const handleReceive = (data) =>{
        if(selectedUserRef.current && data.sender_id === selectedUserRef.current._id){
            removeUnread(selectedUserRef.current._id)
            setMessages(prev=>[...prev, data])
            
        }else{
            setUnreadUsers(prev => [...prev, data.sender_id])
        }
     }

     const addNewUser = (friend) => {
        setUsers((prev)=>[...prev, friend])
     }

    useEffect(()=>{
        axios.get(getFriends,  {
            headers: {
                'Authorization': state.token
            }
        }).then((response)=>{
            setUsers(response.data)
            setLoading(false)
        }).catch((error)=>{
            setError(true)
            setLoading(false)
        })
    }, [state.token])

    const handleChangeUser = (user) =>{
        removeUnread(user._id)
        setSelectedUser(user)
    }

    const removeUnread = (id) =>{
        const index = unreadUsers.indexOf(id);
        if(index > -1){
            const newUnreadUsers = [...unreadUsers]
            newUnreadUsers.splice(index, 1)
            setUnreadUsers(newUnreadUsers)
        }
    }

    const handleClose = () => {
        setOpen(false);
      };
    
      const handleOpen = () => {
        setOpen(true);
      }


    return (
        <>
            <Header />
            {
                loading ?  <LinearProgress />:
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: 'calc(100% - 24px)', overflow: 'auto', gap: "10px", padding: "10px 12px"}} className="chatbox">
                      
                        {
                        users.map((user)=>(
                            <div key={user._id} onClick={()=>handleChangeUser(user)}>
                                <Avatar name={user.name} id={user._id} selectedUser={selectedUser} unreadUsers={unreadUsers}/>
                            </div>
                            ))
                        }
                        <IconButton aria-label='add-button' onClick={handleOpen} style={{width: '75px', height: '75px', background: 'rgba(63,81,181,0.8)', color: '#fff'}}> 
                            <PersonAdd />
                        </IconButton>
                    </Box>
                     <div style={{height: 'calc(100vh - 170px)'}}>
                       {selectedUser ?  <Chat selectedUser={selectedUser} socket={socket} messages={messages} setMessages={setMessages}/>:
                       <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%'}}><img style={{height: '300px', width: '300px', objectFit: 'contain'}} src="/quick_chat.svg" alt="chat" /></div>}
                     </div>
                
                    
                </Box>
                
            }

        <Dialog
            TransitionComponent={Transition}
            style={{background: "rgba(0,0,0,0.6)"}}
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={handleClose}
            aria-labelledby="add-friends-dialog"
            >
                <DialogTitle sx={{ m: 0, p: 2 }}>
                Add friends
          
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'gray',
                    }}
                >
                    <Close />
                </IconButton>
             
            </DialogTitle>
                <AddFriend friends={users.map(user=>user._id)} handleClose={handleClose} addNewUser={addNewUser}/>
            </Dialog>
        </>
        
    )
}

export default Home