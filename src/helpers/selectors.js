// returns Appointments for the selected day.
export function getAppointmentsForDay(state, day) {
  
  const appointments = [];
  
  // Gets the correct day's data (filter method didn't work here for some reason)
  state.days.forEach(val => { 
    if (val.name === day){
      const today = val

      // uses appointment IDs from today to get appointment details from state
      today.appointments.forEach(app => {
      appointments.push(state.appointments[app])
      })
    }
  });

  return appointments;

}

// returns Interviewers for the selected day.
export function getInterviewersForDay(state, day) {

  const interviewers = [];
  // day function as above
  state.days.forEach(val => { 
    if (val.name === day){
      const today = val

 // uses interviewer IDs from today to get interviewer details from state
      today.interviewers.forEach(int => {
      interviewers.push(state.interviewers[int])
      })
    }
  });

  return interviewers;

};

 // receives an interview object with interviewer ID
export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  // returns interview object with interviewer ID replaced with interviewer details from state
  const interviewerDetails = state.interviewers[interview.interviewer];
  return {...interview, interviewer: interviewerDetails};

};