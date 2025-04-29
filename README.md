# developer-example

Example app to demonstrate how to use the developer platform.

- **Connect**: Authorize your app to access the user's data using OAuth2.
- **Oolio API Integration**: Fetch and display data from the Oolio API.

```mermaid
flowchart TD
    start(("Start")) --> A

    subgraph "Authentication Flow"
        A[/Connect with Oolio/]:::action -->|"Initiates OAuth"| B[Redirect to Oolio Authorization Page]:::redirect
        B -->|"Login & Consent"| C[User Authorizes App]:::user
        C -->|"Authorization Code"| D[Redirect to App Callback]:::redirect
        D -->|"Exchange"| E[App Obtains Access & Refresh Tokens]:::token
        E -->|"Store Securely"| F[(App Stores Refresh Token)]:::storage
    end

    subgraph "API Usage"
        F -->|"Authenticated Request"| G[App Fetches Data Using Oolio API]:::api
        G -->|"Process"| H[Display Data in App UI]:::display
    end

    classDef action fill:#3A9D3A,stroke:#267326,color:white
    classDef redirect fill:#4A90E2,stroke:#2F75C5,color:white
    classDef user fill:#F2C94C,stroke:#DDB32B,color:black
    classDef token fill:#9B6EDD,stroke:#7A4FC5,color:white
    classDef storage fill:#E27E4A,stroke:#C5602F,color:white
    classDef api fill:#5C7CFA,stroke:#3A5AF2,color:white
    classDef display fill:#26B9C8,stroke:#1A95A3,color:white
```

**Tech Stack:**

- **Server** Express.js
- **Client** React.js (Vite)
- **Database** In memory (for demo purposes)
- **Authentication** [oauth4webapi ](https://github.com/panva/oauth4webapi)

## Getting Started

1. Clone the repository:
   ```bash
   git clone
   cd developer-example
    ```
2. Install dependencies:
    ```bash
    bun install
    ```
3. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variables:
      ```bash
      cp .env.example .env
      ```
    - Add your Oolio API credentials:
      ```env
      OOLIO_CLIENT_ID=your_client_id
      OOLIO_CLIENT_SECRET=your_client_secret
      ```
4. Start the server:
    ```bash
    docker compose up
    ```
5. Open your browser and navigate to `http://localhost:3000`.
6. Click the "Connect with Oolio" button to authorize your app.
7. After authorization, you will be redirected back to your app, and the Oolio API data will be displayed.

## Folder Structure

```
├── client
│   ├── public
│   └── src
│       ├── assets
│       ├── components
│       ├── services
│       └── types
└── server
    └── src
        ├── config
        ├── controllers
        ├── middleware
        ├── models
        └── routes
````
