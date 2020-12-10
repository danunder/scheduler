export function getAppointmentsForDay(state, day) {
  const appointments = [];
  state.days.forEach(val => { 
    if (val.name === day){
      const today = val
      today.appointments.forEach(app => {
      appointments.push(state.appointments[app])
      })
    }
  });
  return appointments;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewerDetails = state.interviewers[interview.interviewer];
  return {...interview, interviewer: interviewerDetails};



}

export function getInterviewersForDay(state, day) {

  const interviewers = [];
  state.days.forEach(val => { 
    if (val.name === day){
      const today = val
      today.interviewers.forEach(int => {
      interviewers.push(state.interviewers[int])
      })
    }
  });
  return interviewers;
}