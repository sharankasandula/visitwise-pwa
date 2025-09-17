- [x] Add Patient
- [x] Configure Git
- [x] Edit Patient
- [x] Delete Patient
- [x] Visits CRUD
- [x] Integrate Auth
- [x] Earnings this month card
- [x] Record Payments
- [x] [Bug] Archive and Delete Patient not working as expected.
- [x] Modal to write notes for the visit
- [x] Revamp Patient profile
- [x] Integrate Calendarx View to view visits in Patient Profile - react day picker
- [x] Send Payment Reminder on Whatsapp
- [x] Make M/F in Profile.
- [x] Make history collapsible.
- [x] Mark Paid Visits
- [x] Fix bug in App settings
- [x] Upgrade with new styles - Different Themes and Dark Theme
- [x] deploy for testing - Netlify
- [x] Delete visit from patient calendar
- [x] Show notes, protocol for patient in patient profile
- [x] Bring themes in Home page
- [x] Toast notifications
- [x] Add illustrations and animations
- [x] Store user and user preferences in Firebase

- [x] Pull to refresh
- [x] Editable payment/visit history.
- [x] Media support
- [ ] Multiple media upload support
- [ ] Reminders
- [ ] Convert to android app
- [ ] Analytics on Earnings and visits.
- [ ] Testing

UI Testing tasks
- [x] Add outstanding amount in patient card
- [x] Remove shadows
- [x] Change layout in earnings summary
- [x] Remove fab button
- [x] Remove search when empty
- [x] Earnings this month font size
- [x] Switches
- [X] Follow up reminder on archive
- [ ] On reminder - select patients you visited that day


Bugs
- [X] Sometimes patient keeps loading
- [X] On archiving patients patients keep loading
- [X] Fix Patient info in patient profile.


I would like to refactor the patient card. Instead of 3 icons on the right; make payment, call and archive, I would like to just add a 3 dot menu which upon clicking shows the following list of actions - Record Payment - Send Payment Reminder - Archive Patient - Edit Patient - Delete Patient All of the actions should need appropriate confirmation dialogs, except the record payment, which should open the modal for recording payments.

Make sure absolutely sure to reuse already implemented parts of the code. For example Send whatsapp reminder is already implmented in PatientProfile component. Refer to that component berfore refactoring patientcard. If need be, refactor parts of patient profile so that you can reuse those parts in patient card. 


I would like to refactor patient profile component. It is humongous. Make all the shareable functions reusable. For example Send payment reminder, record payment, edit, archive functions reusable. Keep patient profile component minimal offloading functionality to utilities or other places. 