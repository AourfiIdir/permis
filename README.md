# 🎴 CARDS LEARNING SYSTEM + USER AUTHENTIFICATION API 🎴
<img width="512" height="512" alt="Image" src="https://github.com/user-attachments/assets/44f182b5-a495-4b82-b80c-e4d77a3231e5" />

## Introduction
This API implements a Flash Cards learning system designed to track user progress and improve learning efficiency.

It provides users with:

A list of learning cards

Mistake and progress tracking

A hit system for advanced interaction tracking (explained below)

The API also handles user account management using JWT (JSON Web Token) authentication, combined with an OTP verification mechanism for enhanced security.
JWT documentation: https://jwtsecrets.com/documentation

You can find the full backend implementation integrated with a React Native app here:
👉 [Project Repositoy](https://github.com/AourfiIdir/MyLicenceApp)
## FEATURES
### 🔁 Hit System
The backend includes a hit system that tracks additional user interactions with cards.
This mechanism can be used to detect user mistakes and dynamically adapt the card selection algorithm, prioritizing cards where the user struggles the most.
### 🃏 Unified Card Model
All cards share a single database model.
The content column uses a JSON type to store flexible card data, while the category column defines how each card should be rendered on the frontend.

This design allows easy extension to new card types without modifying the database structure.
### ✅ Input Validation with Zod 
Input validation is handled using Zod: [https://zod.dev/](url)

Zod adds a strong validation layer to incoming requests, helping prevent invalid or malicious data from reaching the system.
## Database MPD schema
<img width="787" height="706" alt="mpd" src="https://github.com/user-attachments/assets/2b27419a-e692-489b-a9a1-f5a5107c7fa4" />

## Contribution
Contributions are always welcome and greatly appreciated 🫶
Any contribution—whether code, documentation, or suggestions—is considered a valuable support gesture to the project.
