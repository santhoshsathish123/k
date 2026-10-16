import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAehZSoPd8b8FmDZKF_o3J6j-01vtoCt5s",
    authDomain: "finguard-9c8eb.firebaseapp.com",
    projectId: "finguard-9c8eb",
    storageBucket: "finguard-9c8eb.firebasestorage.app",
    messagingSenderId: "491332007785",
    appId: "1:491332007785:web:646e4601c5f03fb4da6ff8",
    measurementId: "G-WYCBCSG38G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const indianBanks = [
    "Karur Vysya Bank (KVB)",
    "State Bank of India",
    "Indian Bank",
    "Union Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Central Bank of India"
];

// Bank Balances & Monthly Spend Forecasts per bank
const bankData = {
    "Karur Vysya Bank (KVB)": { balance: 85000.00, forecast: 5200.00 },
    "Indian Bank": { balance: 125000.00, forecast: 9200.00 },
    "State Bank of India": { balance: 110000.00, forecast: 8100.00 },
    "Union Bank of India": { balance: 84500.00, forecast: 6437.00 },
    "Central Bank of India": { balance: 60000.00, forecast: 4500.00 },
    "HDFC Bank": { balance: 95000.00, forecast: 7100.00 },
    "ICICI Bank": { balance: 75000.00, forecast: 5600.00 }
};

// Past 4 Months Historical Master Transactions
const monthlyHistoryData = {
    "Sep 2026": [
        { title: "Swiggy - Biryani Order", category: "Food & Dining", date: "Sep 14, 2026", value: 446.00, bank: "Indian Bank" },
        { title: "Amazon - Wireless Headphones", category: "Shopping", date: "Sep 12, 2026", value: 3499.00, bank: "State Bank of India" },
        { title: "Electricity Bill - TNEB", category: "Bills", date: "Sep 11, 2026", value: 2100.00, bank: "Karur Vysya Bank (KVB)" },
        { title: "Zomato - Weekend Dinner", category: "Food & Dining", date: "Sep 10, 2026", value: 1947.00, bank: "State Bank of India" },
        { title: "Airtel Broadband Fiber", category: "Bills", date: "Sep 06, 2026", value: 999.00, bank: "Indian Bank" },
        { title: "KVB Fastag Recharge", category: "Others", date: "Sep 03, 2026", value: 500.00, bank: "Karur Vysya Bank (KVB)" },
        { title: "Netflix Premium Subscription", category: "Subscriptions", date: "Sep 01, 2026", value: 649.00, bank: "State Bank of India" }
    ],
    "Aug 2026": [
        { title: "Flipkart - Electronics Purchase", category: "Shopping", date: "Aug 25, 2026", value: 6200.00, bank: "Karur Vysya Bank (KVB)" },
        { title: "Barbeque Nation - Dinner", category: "Food & Dining", date: "Aug 20, 2026", value: 3800.00, bank: "State Bank of India" },
        { title: "Electricity Bill - TNEB", category: "Bills", date: "Aug 12, 2026", value: 1850.00, bank: "Indian Bank" },
        { title: "Amazon Prime Annual Fee", category: "Subscriptions", date: "Aug 10, 2026", value: 1499.00, bank: "State Bank of India" },
        { title: "HP Petrol Pump - Fuel", category: "Others", date: "Aug 05, 2026", value: 1500.00, bank: "Karur Vysya Bank (KVB)" }
    ],
    "Jul 2026": [
        { title: "Myntra - Festive Apparel", category: "Shopping", date: "Jul 28, 2026", value: 4500.00, bank: "State Bank of India" },
        { title: "Dominos Pizza Party", category: "Food & Dining", date: "Jul 18, 2026", value: 1250.00, bank: "Indian Bank" },
        { title: "Broadband Wi-Fi Bill", category: "Bills", date: "Jul 08, 2026", value: 999.00, bank: "Karur Vysya Bank (KVB)" },
        { title: "Spotify Annual Plan", category: "Subscriptions", date: "Jul 02, 2026", value: 1189.00, bank: "Indian Bank" }
    ],
    "Jun 2026": [
        { title: "Reliance Digital - Appliance", category: "Shopping", date: "Jun 24, 2026", value: 8900.00, bank: "Karur Vysya Bank (KVB)" },
        { title: "Supermarket Monthly Grocery", category: "Food & Dining", date: "Jun 15, 2026", value: 5400.00, bank: "Indian Bank" },
        { title: "Water & Power Utility Bill", category: "Bills", date: "Jun 10, 2026", value: 2300.00, bank: "State Bank of India" }
    ]
};

// Itemized Transactions Database
const categoryTransactions = {
    food: {
        title: "🍔 Food & Dining Transactions",
        items: [
            { title: "Swiggy - Biryani Order", date: "Sep 14, 2026 • 1:15 PM", value: 446.00, bank: "Indian Bank" },
            { title: "Zomato - Weekend Dinner", date: "Sep 10, 2026 • 8:45 PM", value: 1947.00, bank: "State Bank of India" },
            { title: "Barbeque Nation - Family Dinner", date: "Sep 05, 2026 • 9:30 PM", value: 4799.00, bank: "Karur Vysya Bank (KVB)" },
            { title: "More Supermarket - Monthly Groceries", date: "Sep 02, 2026 • 11:10 AM", value: 5208.00, bank: "Indian Bank" }
        ]
    },
    shopping: {
        title: "🛍️ Shopping & Apparel Transactions",
        items: [
            { title: "Amazon - Wireless Headphones", date: "Sep 12, 2026 • 4:20 PM", value: 3499.00, bank: "State Bank of India" },
            { title: "Myntra - Festive Wear", date: "Sep 08, 2026 • 2:15 PM", value: 2850.00, bank: "Indian Bank" },
            { title: "Trends - Casual Shirts", date: "Sep 03, 2026 • 6:30 PM", value: 1851.00, bank: "Karur Vysya Bank (KVB)" }
        ]
    },
    bills: {
        title: "⚡ Bills & Subscriptions Transactions",
        items: [
            { title: "Electricity Bill - TNEB", date: "Sep 11, 2026 • 10:00 AM", value: 2100.00, bank: "Karur Vysya Bank (KVB)" },
            { title: "Airtel Broadband Fiber", date: "Sep 06, 2026 • 9:15 AM", value: 999.00, bank: "Indian Bank" },
            { title: "YouTube Premium", date: "Sep 01, 2026 • 12:00 AM", value: 401.00, bank: "State Bank of India" },
            { title: "Netflix Premium Subscription", date: "Sep 01, 2026 • 8:00 AM", value: 649.00, bank: "State Bank of India" },
            { title: "Spotify Individual Subscription", date: "Sep 05, 2026 • 9:00 AM", value: 119.00, bank: "Indian Bank" },
            { title: "Amazon Prime Annual Renewal", date: "Aug 12, 2026 • 10:30 AM", value: 1499.00, bank: "Karur Vysya Bank (KVB)" }
        ]
    },
    others: {
        title: "🛒 Others & Miscellaneous Transactions",
        items: [
            { title: "HP Petrol Pump - Fuel", date: "Sep 13, 2026 • 5:45 PM", value: 1200.00, bank: "Karur Vysya Bank (KVB)" },
            { title: "Uber Ride - Office Commute", date: "Sep 09, 2026 • 8:30 AM", value: 345.00, bank: "Indian Bank" },
            { title: "ATM Cash Withdrawal", date: "Sep 04, 2026 • 7:10 PM", value: 500.00, bank: "State Bank of India" }
        ]
    }
};

// Active Subscriptions List Data
const activeSubscriptions = [
    { id: "sub-1", title: "Netflix Premium", renewal: "Renews on Oct 01, 2026", cost: 649.00, plan: "mo", bank: "State Bank of India", targetCost: 199.00 },
    { id: "sub-2", title: "Spotify Individual", renewal: "Renews on Oct 05, 2026", cost: 119.00, plan: "mo", bank: "Indian Bank", targetCost: 59.00 },
    { id: "sub-3", title: "Amazon Prime", renewal: "Renews on Nov 12, 2026", cost: 1499.00, plan: "yr", bank: "Karur Vysya Bank (KVB)", targetCost: 799.00 }
];

let currentUser = null;
let isNewUserSignUp = false;
let initialSelectedBank = "";
let initialPhone = "";
let modalSelectedBank = "";

function formatINR(val) {
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function generateRandomOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getActiveBankNames() {
    const tags = document.querySelectorAll("#bank-tags-container .bank-tag");
    return Array.from(tags).map(tag => tag.getAttribute("data-bank")).filter(Boolean);
}

function renderHistoryTab() {
    const monthSelect = document.getElementById("history-month-select");
    const listContainer = document.getElementById("history-tx-list");
    const totalSpendEl = document.getElementById("history-total-spend");

    if (!monthSelect || !listContainer) return;

    const selectedMonth = monthSelect.value;
    const activeBanks = getActiveBankNames();
    const monthItems = monthlyHistoryData[selectedMonth] || [];

    const filteredItems = monthItems.filter(tx => activeBanks.includes(tx.bank));
    const totalSpend = filteredItems.reduce((sum, item) => sum + item.value, 0);

    if (totalSpendEl) totalSpendEl.textContent = formatINR(totalSpend);
    listContainer.innerHTML = "";

    if (filteredItems.length === 0) {
        listContainer.innerHTML = `<p style="text-align: center; color: #64748b; padding: 1.5rem;">No spend recorded for ${selectedMonth} under currently active accounts.</p>`;
        return;
    }

    filteredItems.forEach(tx => {
        const itemHtml = `
            <div class="tx-item">
                <div class="tx-info">
                    <h5>${tx.title}</h5>
                    <p>${tx.date} • <span style="font-weight:600; color:#475569;">${tx.category}</span> • <span class="tx-bank-badge">🏦 ${tx.bank}</span></p>
                </div>
                <span class="tx-amount">- ${formatINR(tx.value)}</span>
            </div>
        `;
        listContainer.innerHTML += itemHtml;
    });
}

function updateCategoryTotalsUI() {
    const activeBanks = getActiveBankNames();

    Object.keys(categoryTransactions).forEach(catKey => {
        const cat = categoryTransactions[catKey];
        const activeItems = cat.items.filter(item => activeBanks.includes(item.bank));
        const activeTotal = activeItems.reduce((sum, item) => sum + item.value, 0);

        const catItemEl = document.querySelector(`.clickable-category[data-category="${catKey}"] .item-amount`);
        if (catItemEl) {
            catItemEl.textContent = formatINR(activeTotal);
        }
    });
}

function calculateSubscriptionAnalysis() {
    const activeBanks = getActiveBankNames();
    let currentTotal = 0;
    let targetTotal = 0;
    let totalSaved = 0;
    const bankBreakdown = {};

    activeSubscriptions.forEach(sub => {
        if (activeBanks.includes(sub.bank)) {
            currentTotal += sub.cost;
            targetTotal += sub.targetCost;
            const saved = Math.max(0, sub.cost - sub.targetCost);
            totalSaved += saved;

            if (!bankBreakdown[sub.bank]) {
                bankBreakdown[sub.bank] = 0;
            }
            bankBreakdown[sub.bank] += saved;
        }
    });

    return { currentTotal, targetTotal, totalSaved, bankBreakdown };
}

function renderSubscriptions() {
    const subContainer = document.querySelector("#tab-subscriptions");
    if (!subContainer) return;

    const activeBanks = getActiveBankNames();
    const analysis = calculateSubscriptionAnalysis();

    let bankBreakdownHtml = "";
    for (const [bank, amount] of Object.entries(analysis.bankBreakdown)) {
        bankBreakdownHtml += `
            <div class="bank-savings-item">
                <span>🏦 ${bank}</span>
                <strong>+${formatINR(amount)} extra</strong>
            </div>
        `;
    }

    let html = `
        <div class="savings-summary-card">
            <div class="savings-header">
                <h4>📊 Spend Optimization Analysis</h4>
                <span class="savings-badge">Smart Savings</span>
            </div>
            
            <div class="savings-row">
                <span>Current Subscriptions Cost:</span>
                <strong>${formatINR(analysis.currentTotal)}</strong>
            </div>
            <div class="savings-row">
                <span>Optimized Target Cost:</span>
                <strong>${formatINR(analysis.targetTotal)}</strong>
            </div>

            <hr class="savings-divider" />

            <div class="savings-total-row">
                <span class="savings-total-label">💡 Total Extra Money Saved:</span>
                <span class="savings-total-amount">+${formatINR(analysis.totalSaved)}</span>
            </div>

            <div class="bank-savings-breakdown">
                <div class="bank-savings-title">Extra Savings by Bank Account:</div>
                ${bankBreakdownHtml || '<div class="bank-savings-item"><span>No active subscriptions</span></div>'}
            </div>
        </div>

        <div class="dashboard-card shadow-sm">
            <h3 class="section-title">Active Subscriptions</h3>
    `;

    activeSubscriptions.forEach(sub => {
        if (activeBanks.includes(sub.bank)) {
            const savedAmount = Math.max(0, sub.cost - sub.targetCost);
            html += `
                <div class="list-item" id="${sub.id}">
                    <div class="sub-info">
                        <h4>${sub.title}</h4>
                        <p>${sub.renewal} • <span class="tx-bank-badge">🏦 ${sub.bank}</span></p>
                        <div class="sub-reduction-box">
                            <label>Target Plan (₹):</label>
                            <input type="number" class="sub-reduction-input" data-id="${sub.id}" value="${sub.targetCost}" min="0" max="${sub.cost}">
                        </div>
                    </div>
                    <div class="sub-right">
                        <span class="item-amount">${formatINR(sub.cost)}/${sub.plan}</span><br/>
                        ${savedAmount > 0 ? `<span class="extra-money-tag">Extra Money: +${formatINR(savedAmount)}</span>` : ''}
                    </div>
                </div>
            `;
        }
    });

    html += `</div>`;
    subContainer.innerHTML = html;

    document.querySelectorAll(".sub-reduction-input").forEach(input => {
        input.addEventListener("input", (e) => {
            const subId = e.target.getAttribute("data-id");
            const newTarget = parseFloat(e.target.value) || 0;
            const sub = activeSubscriptions.find(s => s.id === subId);
            if (sub) {
                sub.targetCost = newTarget;
                renderSubscriptions();
            }
        });
    });
}

function updateAllCalculations() {
    const remainingTags = document.querySelectorAll("#bank-tags-container .bank-tag");
    let totalBalance = 0;
    let totalForecast = 0;
    const count = remainingTags.length;

    remainingTags.forEach(tag => {
        const bankName = tag.getAttribute("data-bank");
        if (bankData[bankName]) {
            totalBalance += bankData[bankName].balance;
            totalForecast += bankData[bankName].forecast;
        } else {
            totalBalance += 50000.00;
            totalForecast += 3500.00;
        }
    });

    const balanceElement = document.getElementById("display-total-balance");
    if (balanceElement) balanceElement.textContent = formatINR(totalBalance);

    const forecastElement = document.getElementById("display-forecast-balance");
    if (forecastElement) forecastElement.textContent = formatINR(totalForecast);

    const countElement = document.getElementById("linked-account-count");
    if (countElement) countElement.textContent = count;

    updateCategoryTotalsUI();
    renderSubscriptions();
    renderHistoryTab();
}

function addBankTagToUI(bankName) {
    const tagsContainer = document.getElementById("bank-tags-container");
    if (!tagsContainer) return;
    
    const existingBank = Array.from(tagsContainer.children).find(
        tag => tag.getAttribute("data-bank") === bankName
    );

    if (!existingBank) {
        const newTag = document.createElement("span");
        newTag.className = "bank-tag";
        newTag.setAttribute("data-bank", bankName);
        newTag.innerHTML = `✓ ${bankName} <small class="remove-bank" style="cursor:pointer; margin-left:5px;">✕</small>`;
        tagsContainer.appendChild(newTag);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const bankSelect = document.getElementById("bank-select");
    const modalBankSelect = document.getElementById("modal-bank-select");

    indianBanks.forEach(bank => {
        if (bankSelect) {
            const option = document.createElement("option");
            option.value = bank;
            option.textContent = bank;
            bankSelect.appendChild(option);
        }
        if (modalBankSelect) {
            const option = document.createElement("option");
            option.value = bank;
            option.textContent = bank;
            modalBankSelect.appendChild(option);
        }
    });

    const loginSection = document.getElementById("login-section");
    const biometricSection = document.getElementById("biometric-section");
    const bankSection = document.getElementById("bank-section");
    const otpSection = document.getElementById("otp-section");
    const mainApp = document.getElementById("main-app");

    const addBankModal = document.getElementById("add-bank-modal");
    const modalStepBank = document.getElementById("modal-step-bank");
    const modalStepOtp = document.getElementById("modal-step-otp");
    const forecastModal = document.getElementById("forecast-modal");
    const categoryModal = document.getElementById("category-modal");

    document.getElementById("history-month-select")?.addEventListener("change", renderHistoryTab);

    renderSubscriptions();

    // 1. Sign Up Logic
    document.getElementById("signup-btn")?.addEventListener("click", async () => {
        const email = document.getElementById("email")?.value;
        const password = document.getElementById("password")?.value;

        if (!email || !password) return alert("Please fill in all fields.");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            currentUser = userCredential.user;
        } catch (error) {
            console.warn("Sign Up Note:", error.message);
            currentUser = { email: email, uid: "user_" + Date.now() };
        }

        isNewUserSignUp = true;
        loginSection?.classList.add("hidden");
        biometricSection?.classList.remove("hidden");
    });

    // 2. Login Logic (Directly Transitions to Biometric View)
    document.getElementById("login-btn")?.addEventListener("click", async () => {
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        const email = emailInput ? emailInput.value : "";
        const password = passwordInput ? passwordInput.value : "";

        if (!email || !password) {
            return alert("Please enter both Email and Password.");
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            currentUser = userCredential.user;
        } catch (error) {
            console.warn("Logging in locally:", error.message);
            currentUser = { 
                email: email, 
                uid: "user_" + Date.now() 
            };
        }

        isNewUserSignUp = false;

        if (loginSection) loginSection.classList.add("hidden");
        if (biometricSection) biometricSection.classList.remove("hidden");
    });

    // 3. Biometric Step Handler
    document.getElementById("biometric-btn")?.addEventListener("click", async () => {
        let hasPlatformAuth = false;
        if (window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
            hasPlatformAuth = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        }

        const proceedAfterBiometric = async () => {
            biometricSection?.classList.add("hidden");

            if (isNewUserSignUp) {
                bankSection?.classList.remove("hidden");
            } else {
                const tagsContainer = document.getElementById("bank-tags-container");
                if (tagsContainer) tagsContainer.innerHTML = "";

                if (currentUser) {
                    try {
                        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                        if (userDoc.exists() && userDoc.data().linkedBanks) {
                            userDoc.data().linkedBanks.forEach(b => addBankTagToUI(b));
                        } else {
                            addBankTagToUI("State Bank of India");
                        }
                    } catch (e) {
                        addBankTagToUI("State Bank of India");
                    }
                } else {
                    addBankTagToUI("State Bank of India");
                }

                updateAllCalculations();
                mainApp?.classList.remove("hidden");
                
                const userDisplay = document.getElementById("user-display");
                if (currentUser && userDisplay) {
                    userDisplay.innerText = currentUser.email.split('@')[0];
                }
            }
        };

        if (hasPlatformAuth) {
            try {
                const challenge = new Uint8Array(32);
                window.crypto.getRandomValues(challenge);
                const dummyUserId = new Uint8Array(16);
                window.crypto.getRandomValues(dummyUserId);

                const publicKeyCredentialCreationOptions = {
                    challenge: challenge,
                    rp: { name: "FinGuard AI", id: window.location.hostname },
                    user: {
                        id: dummyUserId,
                        name: currentUser ? currentUser.email : "user@finguard.com",
                        displayName: "FinGuard User"
                    },
                    pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
                    authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
                    timeout: 60000
                };

                await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });
                await proceedAfterBiometric();
                return;
            } catch (err) {
                console.warn("Biometric cancelled:", err);
            }
        }

        await proceedAfterBiometric();
    });

    // 4. Send OTP Step
    document.getElementById("send-bank-otp-initial-btn")?.addEventListener("click", () => {
        initialPhone = document.getElementById("phone")?.value || "";
        initialSelectedBank = bankSelect ? bankSelect.value : "";

        if (initialPhone.length !== 10 || !initialSelectedBank) {
            return alert("Please enter a valid 10-digit mobile number and select a bank.");
        }

        const generatedOtp = generateRandomOTP();
        alert(`🔒 FinGuard AI\n\nYour OTP: ${generatedOtp}`);

        const otpInput = document.getElementById("login-otp-input");
        if (otpInput) otpInput.value = generatedOtp;

        bankSection?.classList.add("hidden");
        otpSection?.classList.remove("hidden");
    });

    // 5. Verify OTP Step
    document.getElementById("verify-login-otp-btn")?.addEventListener("click", async () => {
        const otpVal = document.getElementById("login-otp-input")?.value || "";
        if (otpVal.length !== 6) return alert("Please enter a valid 6-digit OTP.");

        if (currentUser) {
            try {
                await setDoc(doc(db, "users", currentUser.uid), {
                    email: currentUser.email,
                    phone: initialPhone,
                    bank: initialSelectedBank,
                    linkedBanks: [initialSelectedBank],
                    biometricVerified: true,
                    updatedAt: new Date()
                }, { merge: true });
            } catch (e) {
                console.log("Firestore Note: ", e);
            }
        }

        const tagsContainer = document.getElementById("bank-tags-container");
        if (tagsContainer) tagsContainer.innerHTML = "";
        
        addBankTagToUI(initialSelectedBank);
        updateAllCalculations();

        otpSection?.classList.add("hidden");
        mainApp?.classList.remove("hidden");

        const userDisplay = document.getElementById("user-display");
        if (currentUser && userDisplay) {
            userDisplay.innerText = currentUser.email.split('@')[0];
        }
    });

    // 6. OPEN ADD BANK MODAL
    document.getElementById("open-add-bank-modal-btn")?.addEventListener("click", () => {
        addBankModal?.classList.remove("hidden");
        modalStepBank?.classList.remove("hidden");
        modalStepOtp?.classList.add("hidden");
    });

    document.getElementById("close-modal-btn")?.addEventListener("click", () => {
        addBankModal?.classList.add("hidden");
    });

    // 7. SEND MODAL BANK OTP
    document.getElementById("send-bank-otp-btn")?.addEventListener("click", () => {
        const modalPhone = document.getElementById("modal-phone")?.value || "";
        modalSelectedBank = modalBankSelect ? modalBankSelect.value : "";

        if (modalPhone.length !== 10 || !modalSelectedBank) {
            return alert("Please enter a valid phone number and select a bank.");
        }

        const generatedOtp = generateRandomOTP();
        alert(`🔒 FinGuard AI\n\nYour OTP: ${generatedOtp}`);

        const modalOtpInput = document.getElementById("modal-otp-input");
        if (modalOtpInput) modalOtpInput.value = generatedOtp;

        modalStepBank?.classList.add("hidden");
        modalStepOtp?.classList.remove("hidden");
    });

    // 8. VERIFY MODAL BANK OTP
    document.getElementById("verify-bank-otp-btn")?.addEventListener("click", async () => {
        const bankOtp = document.getElementById("modal-otp-input")?.value || "";
        if (bankOtp.length !== 6) return alert("Please enter a valid 6-digit OTP.");

        addBankTagToUI(modalSelectedBank);
        updateAllCalculations();

        if (currentUser) {
            try {
                const userRef = doc(db, "users", currentUser.uid);
                await updateDoc(userRef, {
                    linkedBanks: arrayUnion(modalSelectedBank)
                });
            } catch (e) {
                console.log("Firestore sync note: ", e);
            }
        }

        alert(`${modalSelectedBank} added and verified successfully!`);
        addBankModal?.classList.add("hidden");
    });

    // 9. OPEN SPEND FORECAST MODAL
    document.getElementById("view-forecast-btn")?.addEventListener("click", (e) => {
        e.preventDefault();
        updateAllCalculations(); 

        const activeBanks = getActiveBankNames();
        let currentForecastTotal = 0;

        activeBanks.forEach(bank => {
            if (bankData[bank]) {
                currentForecastTotal += bankData[bank].forecast;
            } else {
                currentForecastTotal += 3500.00;
            }
        });

        const foodProj = (currentForecastTotal * 0.395).toFixed(2);
        const shopProj = (currentForecastTotal * 0.261).toFixed(2);
        const billProj = (currentForecastTotal * 0.111).toFixed(2);
        const othrProj = (currentForecastTotal - foodProj - shopProj - billProj).toFixed(2);

        const modalHeader = document.getElementById("modal-projected-header");
        const modalTotal = document.getElementById("modal-total-amount");
        const foodEl = document.getElementById("modal-food-amount");
        const shopEl = document.getElementById("modal-shopping-amount");
        const billEl = document.getElementById("modal-bills-amount");
        const othrEl = document.getElementById("modal-others-amount");

        if (modalHeader) modalHeader.textContent = formatINR(currentForecastTotal);
        if (modalTotal) modalTotal.textContent = formatINR(currentForecastTotal);
        if (foodEl) foodEl.textContent = `~${formatINR(parseFloat(foodProj))}`;
        if (shopEl) shopEl.textContent = `~${formatINR(parseFloat(shopProj))}`;
        if (billEl) billEl.textContent = `~${formatINR(parseFloat(billProj))}`;
        if (othrEl) othrEl.textContent = `~${formatINR(parseFloat(othrProj))}`;

        forecastModal?.classList.remove("hidden");
    });

    document.getElementById("close-forecast-modal-btn")?.addEventListener("click", () => {
        forecastModal?.classList.add("hidden");
    });

    forecastModal?.addEventListener("click", (e) => {
        if (e.target === forecastModal) {
            forecastModal.classList.add("hidden");
        }
    });

    // 10. CATEGORY CLICK
    document.querySelectorAll(".clickable-category").forEach(catItem => {
        catItem.addEventListener("click", () => {
            const catKey = catItem.getAttribute("data-category");
            const data = categoryTransactions[catKey];
            const activeBanks = getActiveBankNames();

            if (data) {
                const filteredItems = data.items.filter(tx => activeBanks.includes(tx.bank));
                const filteredTotal = filteredItems.reduce((sum, tx) => sum + tx.value, 0);

                const titleEl = document.getElementById("cat-modal-title");
                const totalEl = document.getElementById("cat-modal-total");

                if (titleEl) titleEl.innerText = data.title;
                if (totalEl) totalEl.innerText = formatINR(filteredTotal);

                const listContainer = document.getElementById("cat-tx-list");
                if (listContainer) {
                    listContainer.innerHTML = "";

                    if (filteredItems.length === 0) {
                        listContainer.innerHTML = `<p style="text-align: center; color: #64748b; padding: 1rem;">No transactions found for currently linked accounts.</p>`;
                    } else {
                        filteredItems.forEach(tx => {
                            const txHtml = `
                                <div class="tx-item">
                                    <div class="tx-info">
                                        <h5>${tx.title}</h5>
                                        <p>${tx.date} • <span class="tx-bank-badge">🏦 ${tx.bank}</span></p>
                                    </div>
                                    <span class="tx-amount">- ${formatINR(tx.value)}</span>
                                </div>
                            `;
                            listContainer.innerHTML += txHtml;
                        });
                    }
                }

                categoryModal?.classList.remove("hidden");
            }
        });
    });

    document.getElementById("close-cat-modal-btn")?.addEventListener("click", () => {
        categoryModal?.classList.add("hidden");
    });

    categoryModal?.addEventListener("click", (e) => {
        if (e.target === categoryModal) {
            categoryModal.classList.add("hidden");
        }
    });

    // 11. Dynamic Bank Tag Removal
    document.getElementById("bank-tags-container")?.addEventListener("click", async (event) => {
        if (event.target.classList.contains("remove-bank")) {
            const tagElement = event.target.closest(".bank-tag");
            const bankName = tagElement.getAttribute("data-bank");

            const activeBanks = getActiveBankNames();
            if (activeBanks.length <= 1) {
                alert("You must keep at least one linked bank account.");
                return;
            }

            const confirmDelete = confirm(`Are you sure you want to remove ${bankName}?`);
            if (!confirmDelete) return;

            try {
                tagElement.remove();
                updateAllCalculations();

                if (currentUser) {
                    const userRef = doc(db, "users", currentUser.uid);
                    await updateDoc(userRef, {
                        linkedBanks: arrayRemove(bankName)
                    });
                }

                alert(`${bankName} removed!`);
            } catch (error) {
                console.error("Error removing bank: ", error);
            }
        }
    });

    // 12. Bottom Navigation Tabs
    const navDash = document.getElementById("nav-dash");
    const navCat = document.getElementById("nav-cat");
    const navSub = document.getElementById("nav-sub");
    const navHistory = document.getElementById("nav-history");

    const tabDash = document.getElementById("tab-dashboard");
    const tabCat = document.getElementById("tab-category");
    const tabSub = document.getElementById("tab-subscriptions");
    const tabHistory = document.getElementById("tab-history");

    function resetTabs() {
        [tabDash, tabCat, tabSub, tabHistory].forEach(t => t?.classList.add("hidden"));
        [navDash, navCat, navSub, navHistory].forEach(n => n?.classList.remove("active"));
    }

    navDash?.addEventListener("click", () => {
        resetTabs();
        tabDash?.classList.remove("hidden");
        navDash?.classList.add("active");
    });

    navCat?.addEventListener("click", () => {
        resetTabs();
        tabCat?.classList.remove("hidden");
        navCat?.classList.add("active");
    });

    navSub?.addEventListener("click", () => {
        resetTabs();
        tabSub?.classList.remove("hidden");
        navSub?.classList.add("active");
    });

    navHistory?.addEventListener("click", () => {
        resetTabs();
        tabHistory?.classList.remove("hidden");
        navHistory?.classList.add("active");
        renderHistoryTab();
    });

    // 13. Logout Handler
    document.getElementById("logout-btn")?.addEventListener("click", async () => {
        await signOut(auth);
        location.reload();
    });

    updateAllCalculations();
});