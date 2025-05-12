# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /App
COPY . ./
RUN dotnet restore Backend.csproj
RUN dotnet publish Backend.csproj -c Release -o /App/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /App
COPY --from=build /App/publish .
RUN mkdir -p /App/Uploads

EXPOSE 10000
ENV PORT=10000
ENV ASPNETCORE_URLS=http://+:${PORT}
ENTRYPOINT ["dotnet", "Backend.dll"]
