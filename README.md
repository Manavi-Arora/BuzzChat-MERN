# 💬 BuzzChat – Real-Time Chat & Video Calling 🚀  

ZappChat is a *MERN-stack* real-time chat platform with *one-on-one & group messaging, image sharing, voice & video calls (powered by Agora), Google authentication, and status updates. Designed for seamless communication, it ensures **secure, fast, and interactive* conversations.  

---

## 🌟 Features  

### 🔹 *Real-Time One-on-One & Group Chat*  
✅ *Instant Messaging* – Send and receive messages *in real time*.  
✅ *Typing Indicators* – Know when someone is typing.  
✅ *Message Notifications* – Get instant alerts for new messages.  
✅ *Message History* – Search past conversations easily.  
✅ *Group Chats* – Create and manage groups, add/remove members, and send messages.  

### 🔹 *Text & Image Messaging*  
✅ *Text Chat* – Quick and efficient message delivery.  
✅ *Image Sharing* – Send and receive images instantly.  
✅ *Multimedia Support* – Inline image previews for a richer experience.  

### 🔹 *Voice & Video Calling (Agora Integration)*  
✅ *One-on-One Video and Voice Calls* – High-quality, real-time video and voice chat.  
✅ *Mute & Camera Toggle* – Manage audio/video settings easily.  

### 🔹 *User Authentication & Security*  
✅ *Google Authentication* – Sign in quickly using Google.  
✅ *Secure Sign-up/Login* – Authenticate via *email/password*.  
✅ *Session Management* – Stay logged in across devices.  
✅ *JWT-Based Authentication* – Secure login system.  

### 🔹 *Group Messaging & Status Updates*  
✅ *Create & Manage Groups* – Add/remove participants easily.  
✅ *Status Updates* – Share text/image status updates visible to friends.  

### 🔹 *User Profile Management and Friend Suggestions*  
✅ *Profile Picture Update* – Upload and change profile pictures.  
✅ *Edit Profile* – Update username, bio, and other personal details.
✅ *Friend Suggestion Management – View, send, and manage friend requests, adjust suggestion algorithms, hide/block suggestions, and add or remove friends from available users

### 🔹 *Settings & Customization*  
✅ *Change Theme* – Switch between *dark & light* modes.  
✅ *Notification Preferences* – Enable/disable message alerts.  

---

## 🛠 Tech Stack  

### *Frontend:*  
- *React.js (Vite)* – Fast UI rendering.  
- *Tailwind CSS* – Modern & responsive styling.  
- *Socket.io* – Real-time messaging.  
- *Zustand* – Efficient state management.  

### *Backend:*  
- *Node.js & Express.js* – API server.  
- *MongoDB* – Database for storing messages, users, and chats.  
- *JWT (JSON Web Tokens)* – Secure authentication.  
- *Socket.io* – Real-time communication.  
- *Agora SDK* – High-quality voice & video calls.  
- *Google OAuth* – Secure Google authentication.  

### *Cloud Storage & Other Services:*  
- *Cloudinary* – Store and manage images.  
- *WebRTC (via Agora)* – Video calling.  

---

## 🚀 Getting Started  

### 1️⃣ *Clone the Repository*  
```
git clone https://github.com/Manavi-Arora/BuzzChat-MERN.git
cd BuzzChat-MERN
```


### 2️⃣ *Install Dependencies*  
```
npm install
```


### 3️⃣ *Set Up Environment Variables*  
Create a *.env* file in the server folder and add:  
```
MONGO_URI=<your_mongo_database_url>
JWT_SECRET=<your_secret_key>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
AGORA_APP_ID=<your_agora_app_id>
AGORA_APP_CERTIFICATE=<your_agora_app_certificate>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
PORT=5000
NODE_ENV=development
```


### 4️⃣ *Run the Application*  
```
npm start
```


---

## 🎥 Live Demo  
🔗 [BuzzChat-MERN](#) (Add live link here)  

💬 *Start chatting, make video calls, and stay connected – all in real time with ZappChat!* 🚀
