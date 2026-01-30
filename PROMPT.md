You are a coding assistant. Create a complete, production-ready flashcard app called **Flashdecks** with a **modern UI** and **light theme**. Use **best practices** throughout (clean architecture, type-safe interfaces, validation, error handling, reusable components, consistent naming, and clear project structure). Implement **both frontend and backend** end-to-end.

## Tech Stack

* **Frontend:** React 
* **Backend:** Python **FastAPI** 
* **Database:** **PostgreSQL** running in **Docker** with **persistent storage** (data must persist across container restarts; use a named volume)

## Core Data Model

* Users can create **Decks**
* Each **Deck** contains multiple **Cards**
* Users can **create/edit/delete** decks
* Users can **create/edit/delete** cards within a deck
* Users can **Review** a deck: show one question at a time; clicking the card reveals the answer with a simple flip animation.

## Pages and UX Requirements

### 1) Landing Page

* The first page displayed when accessing the website
* Contains buttons: **“Log in”** and **“Sign up”**
* Add interesting/modern content (hero section, brief feature highlights, etc.)
* On clicking **Log in** or **Sign up**, redirect to the **Dashboard** page
  *(Authentication does not need to be implemented unless required by your architecture—this redirect is sufficient.)*

### Shared Layout (applies to all pages after Landing)

All pages listed below must include:

* **Header**

  * Left: app name **“Flashdecks”**
  * Right: text **“STREAK : 7”** and a **bulb icon button** to toggle light/dark
  * The toggle button **must not perform any action** (no theme switching logic required)
* **Left Nav Bar**

  * Two buttons: **“Dashboard”** and **“All Decks”**
  * Navigates to the corresponding pages

### 2) Dashboard Page

* Summary view containing stat boxes:

  * **Number of decks**
  * **Total number of cards**
* Add another box similar to a **GitHub activity heatmap**

  * This can be a **static** heatmap (no need for real tracking)
* **Quick Start** section with a button: **“Create New Deck”**
* **Your Decks** section:

  * Shows **at most 4 decks**
  * Clicking a deck redirects to that deck’s page

### 3) All Decks Page

* Lists **all decks**
* Has a button: **“Add New Deck”**

  * Clicking it opens a **modal form** with:

    * Inputs: **Name**, **Description**
    * Buttons: **Create**, **Cancel**
  * Clicking **Create**:

    * Creates the deck
    * Redirects user to the newly created deck’s page

### 4) Deck Page

* Shows the **deck name** as the page heading

* Provides actions:

  * **Add Card**

    * Opens modal with **Question** and **Answer**
    * Buttons: **Add Card**, **Cancel**
  * **Edit Deck**

    * Opens modal to update **Name** and **Description**
  * **Start Review**

    * Navigates to a separate **Review page**
  * **Delete Deck**

    * Asks for confirmation before deleting
    * Deletes deck and handles navigation afterward

* Below, render the deck’s cards in individual containers:

  * Grid layout: **max 4 cards per row**
  * Each card container shows:

    * Preview of the **question**
    * Buttons: **Edit**, **Delete**

      * **Edit** opens a modal to edit that card and **save** or **cancel**
      * **Delete** asks for confirmation before deleting

### Review Page (from “Start Review”)

* Shows **one question at a time**
* Clicking the card **flips** with an animation to reveal the answer
* No spaced repetition
* Show a **“Next Card”** button to move to the next card

## Implementation Notes

* Implement full CRUD for decks and cards with proper API endpoints.
* Ensure UI actions (create/edit/delete) are wired to backend calls and update state correctly.
* Include sensible empty/loading/error states.
* Ensure Dockerized Postgres uses persistence (named volume) so data is not lost on container stop/start.
