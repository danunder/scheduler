# Interview Scheduler

A modern, single page client application, built with React that allows interviews to be booked Monday to Friday. Data is persisted through the use of a PostgreSQL database communicating with an Axios client (JSON format data over HTTP). Full testing suite has been built using Storybook, Jest and Cypress.


[CHECK IT OUT HERE](https://pensive-sinoussi-912e59.netlify.app/) 
give it a minute for the database to warm up :-)


![Main Application Screen](https://github.com/danuhnder/scheduler/blob/master/docs/Application.png)

Primary view of application. Interviews can be added, edited and removed. 

![Day Selection](https://github.com/danuhnder/scheduler/blob/master/docs/Days.png)

Select day from Monday to Friday to see appointments for the day. Spots available count updates as interviews are booked and deleted.

![Interview creation and editing form](https://github.com/danuhnder/scheduler/blob/master/docs/Form.png)

You can add new interviews to the schedule

![Appointment tools](https://github.com/danuhnder/scheduler/blob/master/docs/Hover.png)

Hover over an exisitng interview to see editing and removal options

![Delete confirmation](https://github.com/danuhnder/scheduler/blob/master/docs/Confirm.png)

Delete exisiting records (don't worry, no actual students will be harmed)

![Saving transition](https://github.com/danuhnder/scheduler/blob/master/docs/Transition.png)

Satisfying feedback added so users know what's up. 


## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
