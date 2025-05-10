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
```

2. **Install packages**;
```bash
    cd Frontend
    npm install
    cd Backend 
    dotnet restore
```

3. **Update DB Connection String**;
    Navigate to Backend/appsettings.json <br>
    Update your connection String
```bash
    "ConnectionStrings": {
    "PostgreSqlConnection": "Host=localhost;Port=5432;Database=databaseName;Username=dbUserName;Password=yourPass"
  },
```

4. **Make Migrations**;
```bash
    dotnet ef migrations add migrationname
    dotnet ef database update
```

5. **Running the System**;
```bash
    cd frontend 
    npm run dev
```
```bash
    cd Backend 
    dotnet run
```
or Run the program.cs file

## Access the Application
Frontend: Open **http://localhost:5174** in your browser.
Backend API: Open **http://localhost:5106/swagger/index.html** for API documentation.

-----------------------------------------------------------------------------------

## 🤝 Team Behind
- **Sankalpa Shrestha (me)** - [GitHub](https://github.com/SankalpaGit)
- **Sahisha Karki** - [GitHub](https://github.com/SaishaJSX)
- **Jesish Khadka** - [GitHub](https://github.com/Jesish)
- **Ujjwal Bhattarai** - [GitHub](https://github.com/Ujjwal-027)
- **Bibek Chapagain** 