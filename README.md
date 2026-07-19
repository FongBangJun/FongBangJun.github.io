# FongBangJun.github.io
halo

# Event Manager - CM2040 Coursework #

A full-featured event management web application built with **Node.js, Express, SQLite, and EJS**. It allows organisers to create and manage events, and attendees to browse and book tickets.

## 📋 Core Features (Base Requirements)

| Page | Description |
| :--- | :--- |
| **Main Home Page** | Default page (`/`) with links to Organiser and Attendee pages |
| **Organiser Home Page** | Create, review, and edit events (draft/published) |
| **Site Settings Page** | Change site name and description |
| **Organiser Edit Event Page** | Create and amend events with ticket pricing |
| **Attendee Home Page** | Browse published events ordered by date |
| **Attendee Event Page** | View event details and book tickets |

### Main Home Page Details
- Default home page at `http://localhost:3000/`
- Contains a link to the Organiser Home Page
- Contains a link to the Attendee Home Page
- *(Note: I extended this with authentication – see Extensions section)*

### Organiser Home Page Details
- Display event manager name and description
- "Create New Event" button → creates draft and redirects to edit
- Dynamically populated list of **published events** with:
  - Title, date, created/published timestamps
  - Number of each ticket type for sale
  - Sharing link to Attendee Event Page
  - Delete button (removes from database, reloads page)
- Dynamically populated list of **draft events** with:
  - Title, date, created timestamp
  - Number of each ticket type for sale
  - Edit link to edit page
  - Publish button (updates status, timestamps publication, reloads page)
  - Delete button (removes from database, reloads page)

### Site Settings Page Details
- Heading: "Site Settings Page"
- Form with text inputs for name and description
- Dynamically populated with current settings
- Submit button → updates settings → redirects to Organiser Home
- Form validation (all fields required)
- Back button → Organiser Home

### Organiser Edit Event Page Details
- Heading: "Organiser Edit Event Page"
- Displays event creation date
- Form with: title, description, full-price tickets (number + price), concession tickets (number + price)
- Submit changes button
- Form populated with current event data (if editing existing event)
- Last modified date updated on submit
- Back button → Organiser Home

### Attendee Home Page Details
- Heading: "Attendee Home Page"
- Displays site name and description
- List of published events ordered by date (next event at top)
- Event title and date visible for each item
- Clicking → Attendee Event Page

### Attendee Event Page Details
- Heading: "Attendee Event Page"
- Displays single event determined by URL
- Information: title, description, date, ticket types, prices
- User can select number of each ticket type
- User enters their name
- "Book" button → books the tickets
- Attendees can only book as many tickets as are available
- Back button → Attendee Home Page

---

## 🚀 Extensions (Additional Features)

These are features I added **beyond the base requirements** to demonstrate server-side development skills.

### Authentication & User Management
| Feature | Description |
| :--- | :--- |
| **User Registration** | Users can register with email + password (bcrypt hashing) |
| **User Login** | Session-based authentication with express-session |
| **Secure Logout** | Destroys session and prevents back-button access |
| **Login as Default Page** | The main home page now shows login first (extended from base) |

### Role-Based Access Control
| Feature | Description |
| :--- | :--- |
| **Attendee Role** | Users can register as an attendee |
| **Organiser Role** | Users can register as an organiser |
| **Both Roles** | Users can register as both attendee and organiser |
| **Role Switching** | Users with both roles can switch between views |
| **Route Protection** | Middleware restricts access based on user roles |

### Event Management Enhancements
| Feature | Description |
| :--- | :--- |
| **Organiser Profiles** | Company name, description, business registration, site settings |
| **Per-Organiser Settings** | Each organiser has their own site name and description |
| **Event Details Modal** | Click any event row to view full details with ticket sales |
| **Event Search** | Search events by title or description |
| **Event Filters** | Filter by date range |
| **Table Sorting** | Sort events by Title, Date, Created, or Published |

### Booking System Enhancements
| Feature | Description |
| :--- | :--- |
| **Booking Number** | Unique reference number (e.g., BK-20260718-0001) |
| **Booking History** | View all past bookings with details and grand total |
| **Cancel Booking** | Cancel bookings and restore ticket quantities |
| **Duplicate Booking Warning** | Warns when booking the same event twice |
| **Same Date Booking Warning** | Warns when booking another event on the same date |
| **Export Attendees CSV** | Download attendee list for any published event |
| **Cancelled Attendees Modal** | View all cancelled bookings for an event |

---

## Setup Instructions

1. Install dependencies: Run ```npm install```

2. Build the database.db: Run ```npm run build-db``` to create the database on Mac or Linux 
or run ```npm run build-db-win``` to create the database on Windows

3. Start the server: Run ```npm run start```

4. Open in browser: http://localhost:3000

## 📦 Additional Libraries Used

| Library | Purpose |
| :--- | :--- |
| **Bootstrap 5** | Frontend styling and responsive components |
| **bcrypt** | Password hashing for secure storage |
| **express-session** | Session management for user authentication |
