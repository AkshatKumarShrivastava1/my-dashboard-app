Dynamic React CNAPP Dashboard
This project is a dynamic, customizable dashboard built with React, based on the "Assignment for Frontend Trainees." It features a component-based architecture where users can add, remove, and manage widgets within different categories. The entire application is self-contained within a single file (App.jsx) and uses React's built-in state management (Context API and Reducer hooks) instead of external libraries like Redux.

✨ Features
Fully Dynamic Layout: The entire dashboard, including all categories and widgets, is rendered from a central dashboardData object, making it easy to configure and scale.

Add & Remove Widgets: Users can click the "+ Add Widget" button in any category to open a modal. From this modal, they can select new widgets to add or uncheck existing ones to remove them.

Instant Removal: Each widget has a close icon (X) for quick and easy removal from the dashboard.

Widget Search: The "Add Widget" modal includes a search bar to easily find and filter through the list of all available widgets.

Rich Data Visualization: Widgets display meaningful data visualizations using the recharts library, including pie charts and stacked bar charts that closely match the design mockups.

Modern UI: The interface is built with Material-UI, providing a clean, professional, and responsive user experience.

Self-Contained State Management: Uses React's native useReducer and useContext hooks for robust and efficient state management without external dependencies.

🛠️ Technologies Used
React: Core library for building the user interface.

Vite: Frontend tooling for a fast development experience.

Material-UI (MUI): For UI components, styling, and layout.

Recharts: For creating beautiful and responsive charts.

React Hooks: Extensive use of useState, useEffect, useReducer, useContext, and useMemo for managing component state and logic.

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
You need to have Node.js (version 18.x or newer) and a package manager like npm or yarn installed on your machine.

Installation & Setup
Clone the repository:

git clone <your-repository-url>
cd <repository-directory>

Install dependencies:
Open your terminal in the project directory and run:

npm install

Run the development server:

npm run dev

Open the application:
Open your browser and navigate to http://localhost:5173 (or the address shown in your terminal).

🏛️ Code Architecture
This project is intentionally built within a single file (src/App.jsx) to demonstrate a self-contained application. The file is logically structured into the following sections:

THEME & STYLES: Contains the Material-UI theme configuration for consistent colors, typography, and component styles.

DATA SOURCE: The dashboardData object which acts as the single source of truth for the dashboard's initial layout and all available widgets.

STATE MANAGEMENT (React Context & Reducer):

dashboardReducer: A pure function that handles all state transitions (adding/removing widgets).

DashboardContext: The React context that provides the state to all components.

DashboardProvider: The component that holds the state logic and wraps the application.

useDashboard: A custom hook for easy access to the dashboard's state and dispatch function.

WIDGET COMPONENTS: Contains the individual components for each widget, including placeholders and chart-based visualizations.

CORE UI COMPONENTS: Includes the main structural components like Widget, Category, AddWidgetModal, and the primary DashboardPage.

ROOT APP COMPONENT: The main App component that brings everything together.

This structure ensures a clear separation of concerns even within a single file, making the code readable and maintainable.
