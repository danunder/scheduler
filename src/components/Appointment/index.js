import React from "react";
// import { action } from "@storybook/addon-actions/dist/preview";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

import useVisualMode from "hooks/useVisualMode";

import 'components/Appointment/styles.scss';


export default function Appointment (props) {

  // Defines variables for visual mode 
  const SAVING = "SAVING";
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  // custom hook for navigating through appointment views - 
  // mode is state
  // transition sets state from supplied parameter and keeps state history
  // back sets state based on view history
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);  

  // generates interview object and passes to bookInterview function
  function save(name, interviewer, changeSpots) {
    
    // interviewer value of null will crash app on rendering so basic error handling required here
    if (name && interviewer){
      const interview = {
      student: name,
      interviewer
      }

      // SAVING mode displayed until SHOW or ERROR transition executed by bookInterview function
      transition(SAVING);

      // callbacks passed to bookInterview function
      

      // passes bookInterview function appointment id, interview object and callbacks to be executed after API request
      props
        .bookInterview(props.id, interview, changeSpots)
        .then( () => transition(SHOW))
        .catch( () => transition(ERROR_SAVE, true))
    };
  }

  // deletes appointment record from the database
  function destroy() {
    
    // DELETING mode displayed until EMPTY or ERROR transition executed by deleteInterview function
    transition(DELETING, true);
    
    // callbacks passed to deleteInterview function
    // const done = () => transition(EMPTY);
    // const error = () => transition(ERROR_DELETE, true);
    
    // passes deleteInterview function appointment id and callbacks to be executed after API request
    props
      .deleteInterview(props.id)
      .then( () => transition(EMPTY))
      .catch( () => transition(ERROR_DELETE, true))
  }

  function confirm() {
    
    transition(CONFIRM);

  }

  function edit() {
    
    transition(EDIT);

  }

  return (
    <article className="appointment">
      <Header time={props.time} />
    
      {mode === EMPTY && // Default view if interview slot is empty.
      <Empty onAdd={() => transition(CREATE)} />}

      {mode === SHOW && (// Default view if interview slot is full.
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onEdit={edit}
        onDelete={confirm} />
      )} 

      {mode === CREATE && ( // View selected by clicking onAdd element in EMPTY view 
      <Form 
        interviewers={props.interviewers} 
        onCancel={back} 
        onSave={save}
        changeSpots={true} />
      )}     

      {mode === EDIT && ( // View selected by clicking onEdit component in SHOW view
      <Form 
        name={props.interview.student}
        interviewer={props.interview.interviewer.id}
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save}
        changeSpots={false} />
      )}
      
      {mode === CONFIRM && // View selected by clicking onDelete component in SHOW view
      <Confirm message="Delete this appointment?" onCancel={back} onConfirm={destroy} />}

      {mode === DELETING && // View appears while API processing delete request
      <Status message="Deleting" ></Status>}

      {mode === SAVING && // View appears while API processing save request 
      <Status message="Saving" ></Status>}

      {mode === ERROR_SAVE && <Error message="Appointment could not be saved" onClose={back} />}

      {mode === ERROR_DELETE && <Error message="Appointment could not be deleted" onClose={back} />}

    </article>
    )

}