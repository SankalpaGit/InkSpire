# InkSpire
A full-stack application built with **React** for the frontend and **.NET 8 Web API** for the Backend, using **PostgreSQL** as the database. The Backend leverages **Entity Framework Core** for database management and follows REST API principles.

--------------------------------------------------------------------------------------

## 🛠️ Technologies Used

- **Frontend**: React
- **Backend**: .NET 8 Web API
- **Database**: PostgreSQL
- **ORM**: Entity Framework Core
- **API Documentation**: Swagger (via Swashbuckle)


--------------------------------------------------------------------------------------

## 📖 Setup Guide

Follow these steps to set up the project on your local machine:

### Prerequisites

1. **Install .NET SDK**: [Download .NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
2. **Install Node.js**: [Download Node.js](https://nodejs.org/)
3. **Install PostgreSQL**: [Download PostgreSQL](https://www.postgresql.org/download/)

#### Note : You can user any other database 

--------------------------------------------------------------------------------------

### System Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SankalpaGit/InkSpire.git

2. **Install packages**;
    cd authorities and then members : **npm install** 
    cd Backend : **dotnet restore**

3. **Update DB Connection String**;
    Navigate to Backend/appsettings.json <br>
    Update your connection String

4. **Make Migrations**;
    dotnet ef migrations add migrationname <br>
    dotnet ef database update

5. **Running the System**;
    cd frontend - **npm run dev**
    cd Backend - **dotnet run** or run the **Program.cs** file

## Access the Application
Frontend: Open **http://localhost:5174** in your browser.
Backend API: Open **http://localhost:5000/swagger** for API documentation.

-----------------------------------------------------------------------------------

## 🤝 Team Behind

