// dependency
import React from "react";

// components
import DayList from "components/DayList";
import Appointment from "components/Appointment";

// hooks / helper functions
import useApplicationData from "hooks/useApplicationData";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors"

// style
import "components/Application.scss";

export default function Application() {
   
  const { 
    state, 
    setDay, 
    bookInterview, 
    deleteInterview 
  } = useApplicationData();
  
  // generates array of interviewers for the selected day
  const interviewers = getInterviewersForDay(state, state.day);
  
  // generates array of appointments for the selected day and returns them as JSX elements
  const appointments = getAppointmentsForDay(state, state.day).map(
    (appointment) => {
    return (
      <Appointment 
        key={appointment.id} 
        id={appointment.id}
        time={appointment.time}
        interview={getInterview(state, appointment.interview)}
        interviewers={interviewers}
        bookInterview={bookInterview}
        deleteInterview={deleteInterview}
      />
    )
  });   

  // renders HTML elements
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

        {appointments} 

        <Appointment time="5pm" />               
      </section>
    </main>
  );

}
