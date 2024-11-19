# File Reader App

A simple NestJS application that monitors a directory for files and maintains their state.

## Features

- Monitors a specified directory for files
- Tracks file status (active/inactive)
- Provides REST API endpoints for file management
- Uses Redux for state management

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
```

## Configuration

The app watches a directory for files. By default, it uses `./watched-files`. You can customize this by setting the `WATCH_DIRECTORY` environment variable.

## Running the App

```bash
# Development mode
npm run start:dev
```

The application will start on port 3000 by default.

## API Endpoints

### 1. List Files

```http
GET http://127.0.0.1:3000/list
```

Returns a list of all files and their status.

### 2. Scan Directory

```http
GET http://127.0.0.1:3000/scan
```

Rescans the watched directory and updates file statuses.

### 3. Download State

```http
GET http://127.0.0.1:3000/download-state
```

Downloads the current state as a JSON file.

Accessing http://127.0.0.1:3000/download-state API directly in the browser will download the state as a JSON file.

## Response Format

```json
[
  {
    "name": "File_name.jpg",
    "active": true
  },
  {
    "name": "File_name2.jpg",
    "active": false
  }
]
```
