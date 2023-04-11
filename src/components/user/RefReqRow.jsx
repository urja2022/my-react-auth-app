import React from 'react'
import { Avatar, Button, ListItem, ListItemAvatar } from '@mui/material'
import { useMutation, useQueryClient } from 'react-query';
import { USER_API_URL } from 'src/api/axios';
import useAxiosPrivate from "src/hooks/useAxiosPrivate";

const RefReqRow = ({ requestId, userId , name, userPic, mobile, userName, businessName, endorsedType }) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const { mutateAsync:referencesRequest } = useMutation(
        async(data) => {
            if(data){
                return await axiosPrivate.put(USER_API_URL.referencesRequest + "/" +requestId);
            }else{
                return await axiosPrivate.delete(USER_API_URL.referencesRequest + "/" +requestId);
            }
        },
        {
            onSuccess:()=>{
                queryClient.invalidateQueries(['friendRefReqList'])
            }
        }
    );

    const rejected = async() => {
        await referencesRequest(false);
    }

    const accepted = async () => {
        await referencesRequest(true);
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
                    <span className='app_text_gray app_text_12'>{`@${endorsedType === 1 ? userName : businessName}`}</span>
                </div>
            </div>
            <div className='ms-auto'>
                <Button className={`linkList_btn app_border_primary text-lowercase app_text_14_semibold app_text_primary app_bg_primary_light`} onClick={rejected} variant='outlined'>Reject</Button>
                <Button className={`linkList_btn text-lowercase app_text_14_semibold text-white app_bg_primary ms-2`} onClick={accepted} variant='contained'>Accept</Button>
            </div>
        </ListItem >
    )
}

export default RefReqRow