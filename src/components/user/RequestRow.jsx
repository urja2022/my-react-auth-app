import React from 'react'
import { Avatar, Button, ListItem, ListItemAvatar } from '@mui/material';
import { USER_API_URL } from 'src/api/axios';
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { useMutation, useQueryClient } from 'react-query';

const RequestRow = ({ userId, name, userPic, mobile, userName }) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    
    const { mutateAsync:friendRequest } = useMutation(
        async(data) => {
            if(data){
                return await axiosPrivate.put(USER_API_URL.friendRequest + userId);
            }else{
                return await axiosPrivate.delete(USER_API_URL.friendRequest + userId);
            }
        },
        {
            onSuccess:()=>{
                queryClient.invalidateQueries(['friendList'])
            }
        }
    );

    const rejected = async() => {
        await friendRequest(false);
    }

    const accepted = async () => {
        await friendRequest(true);
    }

    return (
        <ListItem className='px-0 py-3'>
            <ListItemAvatar className='linkList_avatar_container'>
                <Avatar>
                    <img src={userPic} alt="user avatar" />
                </Avatar>
            </ListItemAvatar>
            <div className='d-flex flex-column'>
                <h4 className='app_text_14_500'>{name}</h4>
                <div className='d-flex'>
                    <span className='app_text_gray app_text_12'>{`@${userName}`}</span>
                </div>
            </div>
            <div className='ms-auto'>
                <Button className={`linkList_btn app_border_primary text-lowercase app_text_14_semibold app_text_primary app_bg_primary_light`} onClick={rejected} variant='outlined'>Reject</Button>
                <Button className={`linkList_btn text-lowercase app_text_14_semibold text-white app_bg_primary ms-2`} onClick={accepted} variant='contained'>Accept</Button>
            </div>
        </ListItem >
    )
}

export default RequestRow