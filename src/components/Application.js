import React, { useState, useEffect } from "react";
import axios from 'axios';

import DayList from "components/DayList";
import Appointment from "components/Appointment";

import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors"

import "components/Application.scss";


export default function Application() {
   
  // Defaults to Monday - should it default to 'Today'? 
  const [ state, setState ] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // setDay called by DayList in navbar will update state
  const setDay = day => setState(prev => ({...prev, day }));
  
  // get arrays of appointments and interviewers for the selected day
  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  
   // allows interviews to be booked. takes a callback function to execute after API request
  function bookInterview(id, interview, done, error) {
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // API request to update appointments
    axios.put(`/api/appointments/${id}`, {
      interview
    })
    .then(res => {
     
      if (res.status === 204) {
        // updates local state with new appointment and executes callback function
        setState(prev => ({...prev, appointments}));
        done && done();
      }  
    })
    .catch((err) => {
      console.log(err.response.status);
      console.log(err.response.headers);
      console.log(err.response.data);
      error && error();
    });
  };
  
  function deleteInterview(id, done, error) {
    
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    axios.delete(`/api/appointments/${id}`)
    .then(res => {
     
      if (res.status === 204) {
        // updates local state with new appointment and executes callback function
        setState(prev => ({...prev, appointments}));
        done && done();
      }  
    })
    .catch((err) => {
      console.log(err.response.status);
      console.log(err.response.headers);
      console.log(err.response.data);
      error && error();
    });
  };
  

  // Generates appointment appointment elements for the selected day 
  const schedule = appointments.map((appointment) => {

    // returns interview object with interviewer data
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment 
        key={appointment.id} 
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        deleteInterview={deleteInterview}
      />
    )
  });

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
  

  // render function
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />

        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">

        {schedule} 

        <Appointment time="5pm" />               
      </section>
    </main>
  );

}
