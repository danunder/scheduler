import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { updateSpots } from 'helpers/selectors';

export default function useApplicationData (initial) {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const RESET = "RESET";

  function reducer(state, action) {
    switch (action.type) {
      // case SET_DAY:
      //   return {...state, 
      //     day : action.day
      //   }  
      case SET_APPLICATION_DATA:
        return {...state, 
          days: action.days, 
          appointments: action.appointments, 
          interviewers: action.interviewers 
        }
      case SET_INTERVIEW: {
        return {...state, 
          days: action.days, 
          appointments: action.appointments 
        }
      }
      case RESET: {
        return { ...state,
          day: "Monday",
          days: [],
          appointments: {},
          interviewers: {}
        }
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [ state, dispatch ] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}

  })
  

  // setDay called by DayList in navbar will update state
  const setDay = (day) => dispatch({type: "SET_DAY", day});

  // API call to database to obtain appointment data.
  useEffect(() => {
    dispatch({type: "RESET"})
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      // destructure API response array and populate state with data
      const [ days, appointments, interviewers ] = all;
      dispatch({type: SET_APPLICATION_DATA, days : days.data, appointments : appointments.data, interviewers: interviewers.data })
      
    })
    // .catch((error) => {
    //   console.log(error.response.status);
    //   console.log(error.response.headers);
    //   console.log(error.response.data);
    // });
  }, [])

  // allows interviews to be booked. takes a callback function to execute after API request
  function bookInterview(id, interview, changeSpots) {
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
    const days = changeSpots? updateSpots([ ...state.days], id, -1) : [ ...state.days];

    // API request to update appointments
    return axios.put(`/api/appointments/${id}`, 
      appointment
    )
    .then(res => {
      // console.log(thisDaysSpots);
        // updates local state with new appointment and executes callback function
        dispatch({type: SET_INTERVIEW, days, appointments});
        
      
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
        // updates local state with new appointment and updated spot availability
        dispatch({type: SET_INTERVIEW, days, appointments})      
    )
    
  };

  return { state, setDay, bookInterview, deleteInterview }
}