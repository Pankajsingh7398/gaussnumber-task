# Neon Guess | Cyber Protocol

A high-fidelity number guessing game designed for the elite digital operative. It blends glassmorphic aesthetics with a competitive XP-based progression system.

## 🚀 How to Run the Game

This is a pure frontend web application. There are no servers, databases, or complex build steps required.

1. Simply open the **`index.html`** file in your preferred web browser. 
2. Double-clicking the file from your file explorer is usually enough. For the best experience, use a modern browser like Chrome, Firefox, Safari, or Edge.

## 🎮 How to Play

1. **Select Difficulty**: On the main Dashboard, select your operational difficulty level (EASY, MEDIUM, or HARD). Higher difficulties give you fewer attempts but significantly more base XP.
2. **Guess the Sequence**: The system will generate a secret "encrypted" number between **1 and 100**.
3. **Analyze**: Type your guess into the input field and press **Enter** (or click "ANALYZE GUESS").
4. **Use Intel**: The game will immediately respond with feedback, letting you know if the actual target number is **HIGHER** or **LOWER** than your guess.
5. **Request Hints**: If you get stuck, you can click **"REQUEST INTEL"**. This costs you 50 potential XP, but provides a major clue (such as whether the number is Even/Odd, or narrowing down the specific range).
6. **Beat the Clock**: You have a strict **60-second** time limit and a limited number of attempts.
7. **Earn XP**: Guess correctly to earn XP based on your speed and remaining attempts. Your high scores are automatically saved to your local **Rankings** leaderboard!

## 📁 Project Structure

The project has been cleanly separated into distinct technologies for maintainability:

- `index.html`: The core structure, layout, and view-switching logic containers.
- `style.css`: All the visual styling, including glassmorphism, flex/grid layouts, and cyberpunk neon themes.
- `script.js`: The central game engine, state management, UI updating logic, and view routing system.
- `shader.js`: Handles the WebGL animated background processing.

## ⚙️ Features

- **Glassmorphism UI**: Uses backdrop-blur and sleek gradient borders for a premium digital HUD interface.
- **Dynamic Game Engine**: Procedural number generation with varying entropy based on difficulty.
- **Intel System**: A tiered hint protocol that rewards tactical players but penalizes overall XP.
- **Global Shader**: Immersive WebGL backdrop using a custom plasma-field shader.
- **View Router**: A custom built-in JavaScript view switcher to navigate seamlessly between Dashboard, Rankings, Achievements, and Settings without reloading the page.
# gaussnumber-task
