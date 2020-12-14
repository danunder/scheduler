import React from 'react';
import PropTypes from 'prop-types';

import InterviewerListItem from "components/InterviewerListItem"

import "components/InterviewerList.scss";

export default function InterviewerList (props){
  InterviewerList.propTypes = {
    interviewers: PropTypes.array.isRequired
  };
  
  return (
  <section className="interviewers">
    <h4 className="interviewers__header text--light">Interviewer</h4>
    <ul className="interviewers__list">
      {props.interviewers.map(value => 
      <InterviewerListItem 
      key={value.id}
      name={value.name}
      avatar={value.avatar}
      selected={value.id === props.value}
      onChange={() => props.onChange(value.id)}
      />
      )}
    </ul>
  </section>);

}