# ImpactIQ - UPAY: 2-Minute Hackathon Judge Walkthrough Script

"Pay for impact, not for noise."

---

## ⏱️ Step-by-Step 2-Minute Walkthrough

### 0:00 - 0:25: The Problem & upay Customer App Replica
1. Open the app in browser at `http://localhost:8081` (orExpo Web).
2. Enter PIN **`1234`** or click **"Biometric Login"**.
3. **Show Home Screen**: Point out the exact upay visual language:
   - Yellow header with avatar and masked number
   - Tap **"ব্যালেন্স"** to reveal `৳14,250.75`
   - 4-column main service grid (*Send Money, Mobile Recharge, Cash Out, Make Payment, Pay Bill, Add Money, Savings, Fund Transfer, Request Money, Refer & Earn, NPSB*)
   - Banners and floating elements: *upay Card*, *upay Offer*, and *upay Wheel*
4. Explain: *"In traditional MFS campaigns, companies report gross numbers: 'Campaign users spent ৳18.5M'. But how much of that would have happened anyway?"*

### 0:25 - 0:50: Causal AI Engine & Hero Impact Report
1. On the left desktop sidebar, click **"Command Center"** or **"Campaigns ➔ Hero Report"** (`/console/campaigns/CMP-2026-EID-BILL`).
2. Point out the **Headline Contrast Strip**:
   - Gross Reported: **৳18.5M** ❌ (Overstated)
   - True Incremental Causal Uplift: **৳7.3M** ✅ (iROI 192%)
3. Show the **Counterfactual Time Series Chart** with shaded area showing true campaign lift over control baseline.
4. Show the **Causal Decomposition Waterfall Chart**:
   - Gross Total ➔ minus Organic Baseline ➔ minus Sure Things Subsidy Waste (৳720k) ➔ minus Fraud Leakage ➔ Net True Value.

### 0:50 - 1:20: Four Uplift Quadrants & Top Feature Drivers
1. Click **"Uplift Explorer"** (`/console/uplift`).
2. Show the **4 Quadrant Matrix**:
   - **Persuadables (37%)**: High uplift (+42.5%) — TARGET THIS
   - **Sure Things (32%)**: Would transact anyway — EXCLUDE (Saves ৳1.8M waste)
   - **Lost Causes (23%)**: Unresponsive — SUPPRESS
   - **Sleeping Dogs (8%)**: Negative response / churn risk — DO NOT DISTURB
3. Highlight the **Top Causal Feature Drivers** panel explaining *why* the model assigned customers to each segment.

### 1:20 - 1:45: What-If Simulator & Budget Optimizer
1. Click **"Simulator"** (`/console/simulator`).
2. Adjust cashback % and target segment sliders live. Show how targeting *Persuadables* boosts iROI from 88% to 210%.
3. Click **"Budget Optimizer"** (`/console/budget`). Show **Before (Broad Blast)** vs **After (ImpactIQ Targeted)**:
   - ৳1.8M saved in subsidy waste while generating +৳4.3M *more* incremental revenue!
   - Point to the **Diminishing Returns Curve** identifying the optimal spend point at ৳3.96M.

### 1:45 - 2:00: Command Center Live Simulation & Conclusion
1. Click **"Command Center"** (`/console/command-center`).
2. Click **"RUN SIMULATION"** to trigger the 6-step animated Causal loop:
   - *Launch ➔ Causal Separation ➔ Uplift Segmentation ➔ Budget Reallocation ➔ Abuse Blocked ➔ Executive Outcome*.
3. Conclude with the tagline:
   **"ImpactIQ - UPAY: Pay for impact, not for noise."**
