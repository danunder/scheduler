import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { updateSpots } from 'helpers/selectors';

export default function useApplicationData (initial) {

  // defines actions for reducer function
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  // gatekeeper of state modification
  function reducer(state, action) {

    switch (action.type) {
      case SET_DAY:
        return {...state,
          day : action.day
        }
      case SET_APPLICATION_DATA:
        return {...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        }
      case SET_INTERVIEW: {
        return {...state,
          days: action.newDays,
          appointments: action.newAppointments
        }
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  // sets initial state for the application
  const [ state, dispatch ] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}

  })

  // setDay called by DayList in navbar will update state
  const setDay = (day) => dispatch({type: "SET_DAY", day});

  useEffect(() => {

    // API call to database to obtain appointment data.
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      // destructure API response array and populate state with received data
      const [ days, appointments, interviewers ] = all;
      dispatch({type: SET_APPLICATION_DATA, days : days.data, appointments : appointments.data, interviewers: interviewers.data })

    });
  // empty dependency array means this function is only triggered on page reload
  }, [])

  // allows interviews to be booked (isNew) and edited (!isNew)
  function bookInterview(id, interview, isNew) {
    // updates appointment data with interview object
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    // takes updated appointment and builds new appointments array
    const newAppointments = {
      ...state.appointments,
      [id]: appointment
    };

    // API request to update singular appointment instance in database
    return axios.put(`/api/appointments/${id}`,
    appointment
    )
    .then(() => {

      // updates available spots for the day if the appointment is new
      const newDays = isNew? updateSpots([ ...state.days], id, -1) : [ ...state.days];
        // updates local state with new appointments and days
        dispatch({type: SET_INTERVIEW, newDays, newAppointments});
    })

  };

  function deleteInterview(id) {

    // updates appointment data
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const newAppointments = {
      ...state.appointments,
      [id]: appointment
    };



    return ( axios.delete(`/api/appointments/${id}`)
    .then( () => {
      // updates available spots for the day
      const newDays = updateSpots([ ...state.days], id, 1)

      dispatch({type: SET_INTERVIEW, newDays, newAppointments})

    }))

  };

  // functions called in application.js
  return { state, setDay, bookInterview, deleteInterview }
}