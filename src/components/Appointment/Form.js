import React, { useState } from "react";

import Button from "components/Button";
import InterviewerList from "components/InterviewerList";


export default function Form (props) {

    // define states for the form
    const [name, setName] = useState(props.name || "");
    const [interviewer, setInterviewer] = useState(props.interviewer || null) 
    const [error, setError] = useState("");

    // reset states to initial value
    const reset = () => {
      setName(""); 
      setInterviewer(null);
    }

    // triggers 'back' mode transition of parent
    const cancel = () => {
      reset();
      props.onCancel();
    }; 

    function validate() {
      if (name === "") {
        setError("Student name cannot be blank");
        return;
      }
      setError("");
      props.onSave(name, interviewer, props.isNew);
    }
    


  return ( 
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input

            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            onSubmit={event => event.preventDefault()}

            value={name}
            onChange={event => setName(event.target.value)}
            
            data-testid="student-name-input"
          />
          <section className="appointment__validation">{error}</section>

        </form>

      
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />

      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">

          <Button onClick={cancel} danger>Cancel</Button>

          <Button onClick={() => validate()} confirm>Save</Button>

        </section>
      </section>
    </main>
  )
}