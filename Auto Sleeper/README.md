# 🌙 Auto Sleeper

**Auto Sleeper** is a sleek, high-performance Windows desktop utility built to automate system power actions (Shutdown, Restart, Sleep, Hibernate, Lock) while intelligently managing your open applications.

Ever wanted to fall asleep watching a video or listening to music, but didn't want your computer running all night? Auto Sleeper lets you set a countdown timer to power down your machine. More importantly, it allows you to specify **Target Applications** (like Chrome, Discord, or VS Code) that the app will cleanly and safely close *before* your system shuts down, preventing data loss or abrupt process termination.

---

## ✨ Features

- **Smart Power Management:** Schedule your PC to Shutdown, Restart, Sleep, Hibernate, or Lock automatically.
- **Graceful Application Termination:** Add any `.exe` to the Target Applications list. Auto Sleeper will gracefully terminate these specific applications before executing the system action.
- **Dynamic Timer Controls:** Use quick presets (30m, 1h, 2h) or dial in a highly specific custom time using the interactive UI.
- **Test Mode:** Not sure if your setup works? Use Test Mode to run a fast 5-second countdown that terminates your targeted apps but skips the final system shutdown.
- **Modern, Premium UI:** Built with an incredibly smooth, dark-mode aesthetic featuring fluid animations, custom tooltips, and Lenis smooth scrolling.
- **Persistent Configuration:** Your targeted applications list is saved securely to your local AppData folder, so you never have to reconfigure your setup between launches.

---

## 🛠️ Technology Stack

This application is built using a modern, web-first desktop stack:
- **Core Framework:** [Electron](https://www.electronjs.org/)
- **Frontend Library:** [React 19](https://react.dev/)
- **Build Tooling:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS
- **Components:** [Radix UI](https://www.radix-ui.com/) (Shadcn)
- **Scrolling Engine:** [Lenis](https://lenis.studiofreight.com/)

---

## 🚀 Installation & Setup

If you want to use the application without modifying the code, you can download the latest `.exe` installer from the [Releases](#) page.

If you are a developer and want to run Auto Sleeper locally or build it yourself, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- Windows OS (Required for native system power commands)

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/auto-sleeper.git
   cd "Auto Sleeper"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in Development Mode:**
   ```bash
   npm run dev
   ```
   *This command uses `concurrently` to launch the Vite frontend development server and the Electron backend simultaneously.*

### Building the Executable

To package the application into a standalone `.exe` installer that you can share with others:

```bash
npm run package
```
Once the build completes, your installer will be located in the `/release` folder (e.g., `Auto Sleeper Setup 1.0.0.exe`).

---

## 💻 How to Use

1. **Select an Action:** Use the dropdown menu to choose what you want your PC to do when the timer hits zero (Shutdown, Restart, Sleep, etc.).
2. **Set the Timer:** Click one of the quick presets (30m, 1h, 2h) or use the `+` and `-` buttons to adjust the exact minute count.
3. **Configure Target Apps:** 
   - Check the boxes next to the apps you want the utility to close before shutting down.
   - To add a new app to the list, type a readable name (e.g., `Spotify`) and the exact process name (e.g., `Spotify.exe`) in the bottom fields and click the `+` button.
4. **Start Timer:** Click the yellow **Start Timer** button to begin the countdown. 
5. *Optional:* Click **Test Mode** to verify that your selected applications successfully close without actually shutting down your computer.

---

## 📝 Configuration

Your list of Target Applications is saved automatically to your local machine at:
`%APPDATA%\auto-sleeper\config.json`

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#) if you want to contribute. 

## 📜 License

This project is licensed under the [MIT License](LICENSE).
