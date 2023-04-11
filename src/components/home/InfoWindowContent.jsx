import React, { useEffect, useState } from 'react'
import { List, ListItem } from '@mui/material'
import _ from 'lodash';
import moment from 'moment';

const InfoWindowContent = ({ userFullName, employeeData, isGroup, locationType, userId, isBusiness, name, profilePic, trustRating, distance, isOnline, onmouseleave, chatPermission, selfAsContact, businessId, selectedMapOption, status, eventId, eventStartsOn, eventStartTime, eventDescription }) => {
  const [windowColor, setWindowColor] = useState("");
  useEffect(() => {
    if (isBusiness) {
      setWindowColor("business");
    } else if (!_.isEmpty(employeeData)) {
      setWindowColor("employee");
    } else if (isGroup) {
      setWindowColor("group");
    } else if (locationType === "geo") {
      setWindowColor("google");
    } else if (eventId) {
      setWindowColor("event");
    }
    else {
      setWindowColor("person");
    }
  }, [employeeData, isBusiness, locationType]);

  return (
    <div className='info_window_container' onMouseLeave={onmouseleave} >
      {
        eventId ? '' :
          <div className={`${windowColor} info_window_distance_container`}>
            <div className='d-flex flex-column align-items-center justify-content-center'>
              <span className='app_text_16_semibold text-white mb-1'>{distance}</span>
              <span className='app_text_16_500 text-white'>km</span>
            </div>
          </div>
      }

      <List className='info_window_info_container'>
        <ListItem className="app_text_16_500 ">{userFullName}</ListItem>
        <ListItem className="app_text_14 app_text_gray">{eventDescription}</ListItem>

        {
          eventId ?
            <ListItem className="app_text_12 app_text_gray ">{name ? `@${name}` :
              moment(eventStartsOn).format("MMM DD YYYY")
              + '-' + eventStartTime || ''} </ListItem>
            :
            <ListItem>
              <div className='d-flex align-items-center'>
                <span className={`live_status_badge ${isOnline ? 'online' : 'offline'}`}></span><span className=' app_text_12 app_text_gray ms-1'>{isOnline ? 'Available' : 'not available now '}</span>
              </div>
            </ListItem>
        }

      </List>
    </div>
  )
}

export default InfoWindowContent