import { sendEmail } from "../config/email.js";

export const sendBookingConfirmationEmail = async ({
  patientEmail,
  patientName,
  doctorName,
  slot,
}) => {
  const appointmentDate = new Date(slot.startTime).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  return sendEmail({
    to: patientEmail,
    subject: "Appointment Confirmed",
    text: `Hello ${patientName}, your appointment with ${doctorName} is confirmed for ${appointmentDate}.`,
    html: `
      <h2>Appointment Confirmed</h2>
      <p>Hello ${patientName},</p>
      <p>Your appointment with <strong>${doctorName}</strong> has been confirmed.</p>
      <p><strong>Date and time:</strong> ${appointmentDate}</p>
      <p>Thank you,<br>Clinic Appointment System</p>
    `,
  });
};

export const sendCancellationEmail = async ({
  patientEmail,
  patientName,
  doctorName,
  cancelReason,
}) => {
  return sendEmail({
    to: patientEmail,
    subject: "Appointment Cancelled",
    text: `Hello ${patientName}, your appointment with ${doctorName} was cancelled. Reason: ${
      cancelReason || "Not specified"
    }.`,
    html: `
      <h2>Appointment Cancelled</h2>
      <p>Hello ${patientName},</p>
      <p>Your appointment with <strong>${doctorName}</strong> was cancelled.</p>
      <p><strong>Reason:</strong> ${cancelReason || "Not specified"}</p>
      <p>Thank you,<br>Clinic Appointment System</p>
    `,
  });
};