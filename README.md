# Even Platform

A full-stack AI-powered tech blogging platform where articles are organized into focused tech hubs, helping developers discover, write, and share high-quality technical content.

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

## Project Description

Even Platform combines a modern React frontend with an Express/MongoDB backend to deliver a scalable developer publishing experience.  
It supports content creation, organization, and discovery for technical communities.

## Section-by-Section Overview

### 1. Backend (`/backend`)
- REST API server built with Express.
- MongoDB integration with Mongoose for data modeling and persistence.
- Authentication and authorization using JWT.
- Security and middleware support using Helmet, CORS, and cookie parsing.
- File/media upload support using Multer + Cloudinary integration.

### 2. Frontend (`/frontend`)
- React 19 single-page application powered by Vite.
- Routing with React Router.
- Rich text editing and content authoring with TipTap extensions.
- Styling with Tailwind CSS.
- API communication using Axios.

### 3. API Documentation
- Published Postman documentation:
  - https://documenter.getpostman.com/view/37569986/2sBXVZpEmL

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- MongoDB instance

### Run Backend
1. Go to `/backend`.
2. Install dependencies: `npm install`
3. Add environment variables.
4. Start development server: `npm run dev`

### Run Frontend
1. Go to `/frontend`.
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Contribution

Contributions are welcome and the project is open to contribution.  
You can contribute by fixing bugs, improving documentation, refining UI/UX, or adding features.

To contribute:
1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request with a clear description.
