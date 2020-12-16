import React from "react";
import axios from "axios";
import { prettyDOM, getByText, getByAltText, getAllByTestId, render, cleanup, fireEvent, waitForElement, getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";


describe("Application", () => {
  afterEach(() => {
    
    cleanup();
  });
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    

    // Render document and wait for DOM painting
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"))
    
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();

    const appointment = getAllByTestId(container, "appointment")[0];
    
    
    fireEvent.click(getByAltText(appointment, "Add"));
    
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));


    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
    
    cleanup();
    
  });

  // cleanup does not correctly clear my reducer. This test will fail in isolation as it is using values based on the test before it being run
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    
    // Renders document and awaits state to be populated and appointments rendered
    
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"))
    
    // verifies no appointment slots are available for the day
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();

    // gets populated appointment
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    
    // clicks delete button and checks confirmation dialog appears
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Delete this appointment?")).toBeInTheDocument();

    // clicks confirm and checks deleting placeholder appears
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // awaits appearance of add image and confirms 2 spots remaining in Monday 
    await waitForElement(() => getByAltText(appointment, "Add"))
    
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
       
  });



  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    // Renders document and awaits state to be populated and appointments rendered
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"))
    
    // verifies no appointment slots are available for the day
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();

    // gets populated appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen"));
    
    // clicks edit button and checks student name is appears in text box
    fireEvent.click(getByAltText(appointment, "Edit"));
    expect(getByPlaceholderText(appointment, /enter student name/i)).toHaveValue("Archie Cohen");

    // changes student name and interviewer
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "MISTER BRUCE WILLIS" }
    });
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"))

    // Saves the appointment and verifies the Saving view is displayed
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // After API call verifies that updated appointment details were saved and spots remain unchanged
    await waitForElement(() => getByText(appointment, "MISTER BRUCE WILLIS"));
    expect(getByText(appointment, "Tori Malcolm")).toBeInTheDocument()
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    // Renders document and awaits state to be populated and appointments rendered
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"))
    
    // verifies no appointment slots are available for the day
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();

    // gets populated appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen"));
    
    // clicks edit button and checks student name is appears in text box
    fireEvent.click(getByAltText(appointment, "Edit"));
    expect(getByPlaceholderText(appointment, /enter student name/i)).toHaveValue("Archie Cohen");

    // changes student name and interviewer
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "MISTER BRUCE WILLIS" }
    });
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"))

    // Saves the appointment and verifies the Error field is displayed
    fireEvent.click(getByText(appointment, "Save"));
    
    await waitForElement(() => getByText(appointment, "Appointment could not be saved"));


  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // Renders document and awaits state to be populated and appointments rendered
    
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"))
    
    // verifies no appointment slots are available for the day
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();

    // gets populated appointment
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    
    // clicks delete button and checks confirmation dialog appears
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Delete this appointment?")).toBeInTheDocument();

    // clicks confirm and checks deleting placeholder appears
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // awaits appearance of add image and confirms 2 spots remaining in Monday 
    await waitForElement(() => getByText(appointment, "Appointment could not be deleted"));


  });
  
  
 


})
