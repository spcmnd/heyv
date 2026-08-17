# Agents instructions

## General

- Do **not** create tests. This project does not use automated tests for now.

## Client (`client/`)

- UI is built with the **antd** design library and **TailwindCSS**.
- Do **not** write custom CSS or custom component designs. Use the default antd components and styles for code generation, with minimal TailwindCSS for spacing and layout.
- When dealing with APIs, use a service, NEVER do API calls directly inside components or views. Create the service and/or the hook. The service contains the functions that call the API methods, and hooks are used to be called in components and pages; hooks use services.