import { useEffect, useState } from "react"
import { useStateValue } from "./StateProvider"
import { getUsers, addFriend } from "./serverData"
import axios from 'axios'
import Avatar from "./Avatar"
import { Button, InputAdornment, LinearProgress, TextField } from "@mui/material"
import { Add, Check, Search } from "@mui/icons-material"
const AddFriend = ({friends , addNewUser}) => {
    const [state, ] = useStateValue()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]= useState(false)
    const [searchField, setSearchField] = useState("");
    useEffect(()=>{
        axios.get(getUsers,  {
            headers: {
                'auth-token': state.token,
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

    const handleAdd = (friend) =>{
        axios.post(addFriend, {friend_id: friend._id}, {
            headers: {
                'Authorization': state.token
            }
        }).then((response)=>{
            addNewUser(friend)
        }).catch((error)=>{

        })
    }

    const filteredPersons = users.filter(
        person => {
          return (
            person
            .name
            .toLowerCase()
            .includes(searchField.toLowerCase()) ||
            person
            .email
            .toLowerCase()
            .includes(searchField.toLowerCase())
          );
        }
      );
    return (
        <div>
            <div style={{padding: '0 16px 16px 16px'}}>
            <TextField
                label="Search Users"
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                ),
                }}
                variant="outlined"
                value={searchField}
                onChange={(e)=> setSearchField(e.target.value)}
                style={{width: '100%'}}
            /></div>
            {
                loading && <LinearProgress />
            }
        {
            
            filteredPersons.map((user)=>(
                <div key={user._id} style={{ padding: '18px', display:'flex', alignItems:"center", justifyContent: 'flex-start', gap: '12px'}}>
                    <div><Avatar name={user.name} id={user._id} selectedUser={{}} unreadUsers={[]} hideLabels={true}/></div>
                    <div style={{display: 'flex', flexDirection: 'column',alignItems: 'start', justifyContent: 'center', width: '100%'}}>
                    <div style={{fontSize : '22px'}}>{user.name}</div>
                    <div style={{fontSize : '14px'}}>{user.email}</div>    
                    </div>
                    {
                        friends.includes(user._id) ?
                        <Button variant="outlined"><Check /></Button> :
                        <Button variant="outlined" onClick={()=>{handleAdd(user)}}><Add /></Button>
                    }
                </div>
            ))
        }
        </div>

    )
}

export default AddFriend