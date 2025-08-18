- [x] Add Patient
- [x] Configure Git
- [x] Edit Patient
- [x] Delete Patient
- [x] Visits CRUD
- [x] Integrate Auth
- [x] Earnings this month card
- [x] Record Payments
- [ ] [Bug] Archive and Delete Patient not working as expected.
- [x] Reminders
- [x] Modal to write notes for the visit
- [X] Revamp Patient profile
- [ ] Integrate Calendar View to view visits in Patient Profile - react day picker (https://react-day-picker.js.org/)
- [ ] Analytics on Earnings and visits.
- [ ] App settings
- [ ] Upgrade with new styles - Different Themes and Dark Theme
- [ ] Media uploads
- [ ] deploy for testing - Netlify
- [ ] testing
- [ ] import patients from contacts

Lets implement record payments feature. WHen the user clicks on record payment button a new modal should open up to record the payments made by the user. The modal should have the following fields in it
Amount (₹ input)
Date (defaults to today; editable)
Method (cash / upi / card / other)
Note (optional)
CTA: Save

UX details:

Disable Save until amount ≥ ₹1 and method selected.

Show small helper: “Tip: payments allocate to oldest visits first.”

On submit: optimistic UI (disable form + spinner)
Consistent styling with existing app.

Create a new paymentsSlice to store payments related state.
add the following in patient slice

- listPayments(patientId)
- createPayment(patientId, payload)

Payments should be part of patients collection just like how visits is part of patient collection.
