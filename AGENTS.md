# Agents instructions

## General

- Do **not** create tests. This project does not use automated tests for now.
- Before installing a new version of a package (client or server), **always** ask the user for confirmation.

## Client (`client/`)

- UI is built with the **antd** design library and **TailwindCSS**.
- All UI text must be in **French**.
- All dates displayed in the UI must use the **DD.MM.YYYY** format (e.g. `17.08.2026`).
- All UI implementations must be **responsive**.
- Do **not** write custom CSS or custom component designs. Use the default antd components and styles for code generation, with minimal TailwindCSS for spacing and layout.
- When dealing with APIs, use a service, NEVER do API calls directly inside components or views. Create the service and/or the hook. The service contains the functions that call the API methods, and hooks are used to be called in components and pages; hooks use services.