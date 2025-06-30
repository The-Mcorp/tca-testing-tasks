# TCA Testing Tasks

A Vue.js and .NET 8.0 application for managing testing tasks, designed for Visual Studio on Windows.

## Development Setup

### Prerequisites

- Windows OS
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) with ASP.NET and web development workload
- SQL Server LocalDB (included with Visual Studio)

### Getting Started

1. **Clone the repository**

   **Option 1: Using Git command line**
   ```bash
   git clone https://github.com/The-Mcorp/tca-testing-tasks.git
   cd tca-testing-tasks
   ```

   **Option 2: Using Visual Studio**
   - Open Visual Studio 2022
   - Click "Clone a repository" on the start window
   - Enter the repository URL: `https://github.com/The-Mcorp/tca-testing-tasks.git`
   - Choose a local path and click "Clone"
   - The solution should open automatically after cloning

2. **Open the solution in Visual Studio**
   - Double-click `MyApp.sln` to open the solution (if it didn't open automatically)
   - Wait for Visual Studio to restore NuGet packages

3. **Install frontend dependencies**
   - Open a terminal in Visual Studio (View > Terminal)
   - Navigate to the ClientApp directory:
     ```bash
     cd MyApp.Client
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

4. **Run the application**
   - In Visual Studio, ensure the startup project is set to `MyApp`
   - Select "IIS Express" from the debug target dropdown (next to the Start button)
   - Press F5 or click the "Start" button to run the application
   - This will:
     - Start the .NET backend using IIS Express
     - Launch the Vite dev server for the frontend
     - Open the app in your default browser

   **Note on Self-Signed Certificates**:
   - When using IIS Express, you might see a certificate warning in your browser
   - To trust the development certificate:
     1. Click "Continue to this website (not recommended)" in the browser
     2. Or install the development certificate:
        - Open Windows Start and search for "Internet Options"
        - Go to the "Content" tab > "Certificates" button
        - In the "Trusted Root Certification Authorities" tab, import the certificate from:
          `%USERPROFILE%\Documents\IISExpress\config\localhost.pfx`
        - Use the password "password" if prompted
      3. If all else fails try clicking anywhere on the page and typing "thisisunsafe".

### Database Setup

The application uses SQL Server for data storage. Database setup is fully automated:

1. On first run, the application will:
   - Create the database if it doesn't exist
   - Apply all migrations to create necessary tables
   - Create default user accounts (admin, manager, employee, new user)

2. If you need to manually set up the database:
   - Open Visual Studio and navigate to **View → SQL Server Object Explorer**
   - Expand **SQL Server → (localdb)\MSSQLLocalDB**
   - Right-click on **Databases** and select **Add New Database**
   - Enter **TcaTestingTasks** as the database name and click **OK**

3. To completely reset the database:
   - Delete the database through SQL Server Object Explorer
   - Restart the application - it will recreate everything automatically

4. If you need to recreate all users with fresh passwords:
   - Run the command: `dotnet run -- migrate.users`
   - This will recreate all user accounts with their default passwords

Note: The application uses SQL Server LocalDB with Windows Authentication. Make sure your Windows user account has sufficient permissions.

### Accessing the Admin UI

1. Navigate to `/admin-ui/database` in your browser
2. Log in with one of these accounts (all with password `p@55wOrd`):
   - Admin: `admin@email.com`
   - Manager: `manager@email.com`
   - Employee: `employee@email.com`
   - Test: `new@user.com`

### Development Workflow

- **Frontend**: The Vite dev server runs with hot module replacement
- **Backend**: The .NET API runs on `https://localhost:5001` (or similar)
- **API Explorer**: Available at `/swagger`

### Troubleshooting

1. **Database Issues**
   - Ensure SQL Server LocalDB is installed (comes with Visual Studio)
   - If the database isn't created automatically, try running the application as Administrator
   - To reset the database:
     - Open SQL Server Object Explorer
     - Right-click the database and select "Delete"
     - Restart the application to recreate it

2. **Port Conflicts**
   - If ports 5001 or 5173 are in use, update the ports in:
     - `Properties/launchSettings.json` (backend)
     - `ClientApp/vite.config.ts` (frontend)

3. **SSL Certificate Errors in Microsoft Edge**
   - If you see a certificate error, follow these steps:
     1. In the Edge error page, type `thisisunsafe` (this bypasses the warning for development purposes)
     2. Or, to permanently trust the development certificate:
        - Open Windows Start and search for "Manage user certificates"
        - Navigate to "Trusted Root Certification Authorities" > "Certificates"
        - Find and delete any existing localhost certificates
        - In Visual Studio's Solution Explorer (usually on the right side):
          1. Right-click on the `MyApp` project (not the solution)
          2. Select "Properties" from the context menu
          3. In the properties window, go to the "Debug" tab
          4. Uncheck the "Enable SSL" option
          5. Save your changes (Ctrl + S)
          6. Restart the application

---

## Project Structure

```
tca-testing-tasks/
├── MyApp/                     # .NET 8 Backend
│   ├── App_Data/             # Database files and migrations
│   ├── wwwroot/              # Static files (auto-populated)
│   ├── ServiceInterface/     # Service implementations
│   ├── ServiceModel/         # Request/Response DTOs and types
│   └── Program.cs            # Application entry point
│
├── MyApp.Client/            # Vue 3 Frontend
│   ├── public/               # Static assets
│   ├── src/                  # Source files
│   └── README.md             # Frontend development guide
│
├── MyApp.ServiceInterface/  # Service implementations
├── MyApp.ServiceModel/       # DTOs and service contracts
└── MyApp.Tests/              # Unit and integration tests
```

### Key Directories

- **MyApp/**: Backend .NET 8 application
  - `App_Data/`: Database files and migrations
  - `wwwroot/`: Static files served by the web server
  - `ServiceInterface/`: Service implementations
  - `ServiceModel/`: DTOs and service contracts

- **MyApp.Client/**: Vue 3 frontend application
  - `public/`: Static assets
  - `src/`: Vue components and application code

## Development

### Frontend Development

Frontend development is done using Vue 3 with Vite. The frontend code is located in the `MyApp.Client` directory.

### Backend Development

The backend is built with .NET 8. The solution can be opened and run directly in Visual Studio.

### Testing

#### Frontend Unit Tests

Unit tests for the frontend code are located in the `MyApp.ClientTests` directory. These tests use Vitest as the testing framework.

**Running the Tests:**

1. **Navigate to the test directory:**
   ```bash
   cd MyApp.ClientTests
   ```

2. **Install test dependencies:**
   ```bash
   npm install
   ```

3. **Run all tests:**
   ```bash
   npm run test:run
   ```

4. **Run tests with coverage:**
   ```bash
   npm run test:coverage
   ```

5. **Run tests in interactive mode:**
   ```bash
   npm test
   ```

6. **Run tests with UI:**
   ```bash
   npm run test:ui
   ```

**Test Coverage:**

The unit tests are designed to achieve at least 80% line coverage. The test suite includes:

- **api.ts tests**: Comprehensive tests for the API module including:
  - Module structure validation
  - Function signature verification
  - Error handling scenarios
  - Global variable handling
  - Type safety checks

The tests focus on the behavior and structure of the code that can be reliably tested while working around the complex ServiceStack dependencies.

**Test Files:**

- `MyApp.ClientTests/api.test.ts`: Unit tests for `MyApp.Client/src/api.ts`

Each test is clearly documented with:
- What functionality is being tested
- What the expected behavior should be
- Why the test is important

## License

This project is based on the [vue-spa](https://github.com/NetCoreTemplates/vue-spa) template which is licensed under the terms of the MIT license.


This is an updatream test more testing of it
