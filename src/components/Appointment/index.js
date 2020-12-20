//Dependency
import React from "react";

// Components
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

// hooks / helper functions
import useVisualMode from "hooks/useVisualMode";

// style
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
  function save(name, interviewer, isNew) {

    const interview = {
    student: name,
    interviewer
    }

    // SAVING mode displayed until SHOW or ERROR transition executed by bookInterview function
    transition(SAVING);

    // passes bookInterview function appointment id, interview object
    props
      .bookInterview(props.id, interview, isNew)
      // transitions to new view modes
      .then( () => { transition(SHOW);

      })
      .catch( () => transition(ERROR_SAVE, true))

  }

  // deletes appointment record from the database
  function destroy() {

    // DELETING mode displayed until EMPTY or ERROR transition executed by deleteInterview function
    transition(DELETING, true);

    // passes deleteInterview function appointment id
    props
      .deleteInterview(props.id)
      // transitions to new view modes
      .then( () => {

        transition(EMPTY)
      })
      .catch( () => {

        transition(ERROR_DELETE, true)
      })
  }


  function confirm() {

    transition(CONFIRM);

  }

  function edit() {

    transition(EDIT);

  }

  return (
    <article className="appointment" data-testid="appointment">
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
        isNew={true} />
      )}

      {mode === EDIT && ( // View selected by clicking onEdit component in SHOW view
      <Form
        name={props.interview.student}
        interviewer={props.interview.interviewer&&props.interview.interviewer.id}
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save}
        isNew={false} />
      )}

      {mode === CONFIRM && // View selected by clicking onDelete component in SHOW view
      <Confirm message="Delete this appointment?" onCancel={back} onConfirm={destroy} />}

      {mode === DELETING && // View appears while API processing delete request
      <Status message="Deleting" ></Status>}

      {mode === SAVING && // View appears while API processing save request
      <Status message="Saving" ></Status>}

      {mode === ERROR_SAVE && // View appears if API returns error saving appointment
      <Error message="Appointment could not be saved" onClose={back} />}

      {mode === ERROR_DELETE && // View appears if API returns error saving appointment
      <Error message="Appointment could not be deleted" onClose={back} />}

    </article>
    )

}