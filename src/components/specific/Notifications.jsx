import React, { memo } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { sampleNotifications } from "../../constants/sampleData";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
import toast from "react-hot-toast";
const Notifications = () => {
  const dispatch = useDispatch();
  const {isNotification} = useSelector((state)=> state.misc)
  const {isLoading, data, error, isError} = useGetNotificationsQuery();
  const [acceptRequest] = useAcceptFriendRequestMutation()
  const friendRequesthandler = async ({_id, accept})=> {
    dispatch(setIsNotification(false))
    // Add friend request handler
    try {
     const res = await acceptRequest({requestId : _id, accept}) 
     Sd;
     if (res.data?.success) {
      console.log("Use Socket Here")
      toast.success(res.data.message)
      
     } else toast.error(res.data?.error || "Something Went Wrong")
    } catch (error) {
      toast.error("Something Went Wrong")
      console.log(error)
      
    }
  }

  const closeHandler = () => dispatch(setIsNotification(false))
  useErrors([{error, isError}])
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {
          isLoading ? <Skeleton/> : <>
          {data?.allRequests.length > 0 ? (
          data?.allRequests?.map(({ sender, _id }) => (
            <NotificationItem
              sender={sender}
              _id={_id}
              handler={friendRequesthandler}
              key={_id}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>No Notifications</Typography>
        )}
          </>
        }
        
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const {name, avatar} = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar/>
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {`${name} sent you a friend request`}
        </Typography>
       
       <Stack
       direction={{
        xs:"column",
        sm:"row"
       }}
       >
        <Button onClick={()=> handler({_id, accept:true})}>Accept</Button>
        <Button color="error" onClick={()=> handler({_id, accept:false})}>Reject</Button>
       </Stack>


      </Stack>
    </ListItem>
  );
});

export default Notifications;
