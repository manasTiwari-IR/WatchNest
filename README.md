# VidTube

VidTube is a modern video streaming platform built with Node.js. It allows users to upload, stream, and manage videos seamlessly. This project is designed to provide a smooth and engaging user experience.

## Features

- 📹 **Video Uploading**: Easily upload videos with support for multiple formats.
- 🎥 **Video Streaming**: High-quality video streaming with adaptive bitrate.
- 🔍 **Search Functionality**: Quickly find videos with an intuitive search bar.
- 🛠️ **User Management**: Secure user authentication and profile management.
- 🌐 **Responsive Design**: Fully optimized for desktop and mobile devices.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MongoDB
- **Other Tools**: Multer, FFmpeg, Cloudinary

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/VidTube.git
    ```
2. Navigate to the project directory:
    ```bash
    cd VidTube
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variables:
      ```
      PORT=3000
      MONGO_URI=your_mongodb_connection_string
      CLOUDINARY_API_KEY=your_cloudinary_api_key
      CLOUDINARY_API_SECRET=your_cloudinary_api_secret
      ```
5. Start the development server:
    ```bash
    npm start
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Sign up or log in to start uploading and streaming videos.

## Screenshots

![Homepage](https://via.placeholder.com/800x400?text=Homepage)
*Caption: VidTube Homepage*

![Video Player](https://via.placeholder.com/800x400?text=Video+Player)
*Caption: Video Streaming Interface*

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE)
