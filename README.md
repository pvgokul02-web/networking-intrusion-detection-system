# Real-Time NIDS & Self-Healing Security System

An AI-powered Intrusion Detection System (NIDS) utilizing XGBoost machine learning models, Scapy packet capturing, and automated firewall self-healing mitigation policies.

---

## 📁 Project Structure (Frontend & Backend Separated)

```text
├── src/                         # FRONTEND (React 18, Vite, Tailwind CSS, Lucide Icons)
│   ├── App.tsx                  # Main App with Tab Router
│   ├── components/
│   │   ├── RealtimeNIDSDashboard.tsx # Slide 7, 8, 9 Live NIDS Presentation UI
│   │   ├── SystemArchitectureView.tsx # Slide 1-6 Technical Specs & Flowcharts
│   │   ├── FirewallManager.tsx       # Slide 10 Dynamic Windows Defender & ML Rules
│   │   ├── CSVLogViewer.tsx          # Real-time CSV Storage & Backend Log Viewer
│   │   ├── NetworkTopologyMap.tsx    # Live Interactive Topology Visualizer
│   │   └── MLAnalyticsPanel.tsx      # XGBoost Feature Importance & ROC Metrics
│   ├── types.ts                 # Shared TypeScript Data Interfaces
│   └── main.tsx                 # React Entrypoint
│
├── backend/                     # BACKEND (Python Scripts, Express API & CSV Storage)
│   ├── api.ts                   # Node/Express API routes serving CSV logs & ML predictions
│   ├── scapy_sniffer.py         # Scapy Network Traffic Sniffer & Feature Extractor
│   ├── xgboost_model.py         # XGBoost Anomaly Classifier (CICIDS 2017 Dataset)
│   ├── attack_simulator.py      # Synthetic Scapy/Nmap Attack Packet Crafter
│   ├── requirements.txt         # Python Package Dependencies
│   └── storage/                 # Persistent CSV Storage
│       ├── attack_logs.csv          # Real-time Security Incident Logs
│       └── traffic_statistics.csv   # Real-time Flow Feature Log Data
│
├── server.ts                    # Full-Stack Server Entrypoint (Express + Vite Middleware)
├── package.json                 # Node.js Dependencies & Run Scripts
└── README.md                    # Setup & Execution Guide
```

---

## 🛠️ How to Export & Open in VS Code

### Step 1: Export Project Files
- In the top-right header menu of AI Studio, click the **Settings / Export** button.
- Select **Download ZIP** (or **Export to GitHub**).
- Unzip the downloaded folder on your local computer.

### Step 2: Open in Visual Studio Code
- Launch **VS Code**.
- Click `File -> Open Folder...` and select the extracted project directory.

---

## 🚀 Running the Project Locally in VS Code

### 1️⃣ Install Dependencies (Required First Step)
Open a integrated terminal in VS Code (`Ctrl + ~` or `Terminal -> New Terminal`) and run:
```bash
npm install
```

### 2️⃣ Start Development Server
Run the full-stack server (Express backend + React Vite frontend):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 🔧 VS Code Troubleshooting & Quick Fixes

If you encounter any errors when running in VS Code, follow these steps:

### 🔴 Fix Windows `EPERM: operation not permitted` (npm error -4048):
If you see `npm error code EPERM` or `mkdir 'D:\self-healing-nids (2)\node_modules'`:

1. **Rename the folder to remove parentheses `()` and spaces:**
   - Windows file permissions and Node `npm` frequently fail when folder paths contain parentheses like `(2)`.
   - Close VS Code.
   - In Windows File Explorer, rename `D:\self-healing-nids (2)` to `D:\self-healing-nids`.
   - Re-open the renamed folder in VS Code (`File -> Open Folder`).

2. **Run VS Code as Administrator:**
   - Close VS Code.
   - Right-click the VS Code icon on your desktop or Windows Start Menu -> Click **"Run as administrator"**.
   - Open your project folder in VS Code and run:
     ```bash
     npm install
     ```

3. **Clear npm cache & re-install:**
   ```bash
   npm cache clean --force
   npm install
   ```

---

1. **`npm install` fails or package conflicts:**
   Make sure you are using Node.js v18, v20, or v22. Clean `node_modules` and re-install:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript errors in VS Code editor (`Cannot find module`, `@types/react` errors):**
   - We have configured `@types/react` and `tsconfig.json` paths.
   - In VS Code, press `Ctrl + Shift + P` (or `Cmd + Shift + P` on Mac), type **`TypeScript: Restart TS Server`**, and press Enter.

3. **Port 3000 already in use:**
   If port 3000 is occupied by another process, kill it or run with a custom port:
   ```bash
   PORT=3001 npm run dev
   ```

4. **Python Backend Dependencies (Optional):**
   If you want to run the raw Python packet sniffer or XGBoost scripts:
   ```bash
   pip install -r backend/requirements.txt
   python backend/scapy_sniffer.py
   ```

---

## 📊 Tech Stack Summary

- **Network Traffic Capture:** Scapy (Python), Npcap (Windows)
- **Attack Simulation & Testing:** Nmap & Scapy Packet Crafter
- **Backend & Processing:** Python Runtime & Node.js Express API
- **AI / ML Module:** Python with XGBoost (TensorFlow / Scikit-Learn)
- **Data Storage & Logging:** CSV files (`/backend/storage/*.csv`)
- **Visualization & Monitoring:** React Dashboard with Console Alerts & Self-Healing
