import { useState, useEffect } from 'react';
import axios from 'axios';
import { updateSpots } from 'helpers/selectors';

export default function useApplicationData (initial) {

  // Defaults to Monday - should it default to 'Today'? 
  const [ state, setState ] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // setDay called by DayList in navbar will update state
  const setDay = day => setState(prev => ({...prev, day }));

  // API call to database to obtain appointment data.
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("api/appointments"),
      axios.get("api/interviewers"),
    ]).then((all) => {
      // destructure API response array and populate state with data
      const [ days, appointments, interviewers ] = all;
      setState(prev => ({...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data}))
    })
    .catch((error) => {
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log(error.response.data);
    });
  }, [])

  // allows interviews to be booked. takes a callback function to execute after API request
  function bookInterview(id, interview) {
    // updates appointment data
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    // updates available spots for the day 
    const days = updateSpots([ ...state.days], id, -1)

    // API request to update appointments
    return axios.put(`/api/appointments/${id}`, 
      appointment
    )
    .then(res => {
      // console.log(thisDaysSpots);
        // updates local state with new appointment and executes callback function
        setState(prev => ({...prev, days, appointments }));
        
      
    })

  };

  function deleteInterview(id) {
    
    // updates appointment data
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // updates available spots for the day 
    const days = updateSpots([ ...state.days], id, 1)

    return axios.delete(`/api/appointments/${id}`)
    .then( () =>  
        // updates local state with new appointment and executes callback function
        setState(prev => ({...prev, days, appointments}))      
    )
    
  };

  return { state, setDay, bookInterview, deleteInterview }
}