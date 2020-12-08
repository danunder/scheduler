import React from "react";
import "components/DayListItem.scss"
const classNames = require('classnames');

export default function DayListItem(props) {

  const dayClass = classNames("day-list__item", {
    "day-list__item--selected":props.selected,
    "day-list__item--full":!props.spots

  })
  const formatSpots = () => (props.spots? `${props.spots} spot${props.spots > 1? "s" :""} remaining` : "no spots remaining")
  

  return (
    <li onClick={props.setDay} className={dayClass}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  )


}