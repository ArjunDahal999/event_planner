Project Overview

Event Planner is a web application that allows users to create, share, and RSVP to events. It is built with Next.js and uses a monorepo architecture with shared schemas and types between the client and server.

Project Setup

To run this project, you need to have Node.js installed. You can install it from [https://nodejs.org/](https://nodejs.org/).

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:

```bash
pnpm install
```

4. Environment Variables

Create a .env file in the root of the project and add the following environment variables:

5. Spin Up Database server using Docker

```bash
docker-compose up
```

6. Run the database migrations:

```bash
pnpm db:push
```
    

7. Run the development server:

```bash
pnpm dev
```

8. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

9. Open [http://localhost:9000/docs](http://localhost:9000/docs) to view the server docs.


Project Strucuture

I Have followed the monorepo architecture for this project.
Where different schema and types are shared between the client and server

event_planner
├── apps
│   ├── client
│   └── server
├── packages
│   └── shared
│       └── src
│           ├── index.ts
│           ├── schemas
│           └── types


