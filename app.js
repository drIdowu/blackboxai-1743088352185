// Main Application Controller
class FintechApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadNavigation();
        this.checkAuthState();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.loadPage(page);
            }

            if (e.target.matches('#logout-btn')) {
                this.logout();
            }

            if (e.target.matches('#login-form')) {
                e.preventDefault();
                const email = e.target.querySelector('#email').value;
                const password = e.target.querySelector('#password').value;
                this.handleLogin(email, password);
            }
        });
    }

    loadNavigation() {
        const navHTML = `
            <nav class="bg-white shadow-lg">
                <div class="max-w-6xl mx-auto px-4">
                    <div class="flex justify-between items-center py-4">
                        <div class="flex items-center space-x-4">
                            <a href="#" class="text-2xl font-bold text-blue-600">FinPay</a>
                        </div>
                        <div class="hidden md:flex items-center space-x-8">
                            <a href="#" data-page="dashboard" class="nav-link">Dashboard</a>
                            <a href="#" data-page="transfer" class="nav-link">Transfer Money</a>
                            <a href="#" data-page="bills" class="nav-link">Pay Bills</a>
                            <a href="#" data-page="airtime" class="nav-link">Airtime</a>
                            <div id="auth-section">
                                <a href="#" data-page="login" class="btn bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Login</a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;
        document.querySelector('#app').insertAdjacentHTML('afterbegin', navHTML);
    }

    checkAuthState() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            this.currentUser = user;
            this.updateAuthUI(true);
            this.loadPage('dashboard');
        } else {
            this.updateAuthUI(false);
            this.loadPage('login');
        }
    }

    updateAuthUI(isLoggedIn) {
        const authSection = document.querySelector('#auth-section');
        if (authSection) {
            authSection.innerHTML = isLoggedIn 
                ? `
                    <div class="flex items-center space-x-4">
                        <span class="text-gray-700">Hi, ${this.currentUser.name}</span>
                        <button id="logout-btn" class="btn bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Logout</button>
                    </div>
                  `
                : '<a href="#" data-page="login" class="btn bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Login</a>';
        }
    }

    async handleLogin(email, password) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'user@example.com' && password === 'password123') {
                    this.currentUser = {
                        id: 1,
                        email: 'user@example.com',
                        name: 'Demo User',
                        balance: 25000
                    };
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    this.updateAuthUI(true);
                    this.loadPage('dashboard');
                    resolve(this.currentUser);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000);
        });
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateAuthUI(false);
        this.loadPage('login');
    }

    loadPage(page) {
        let contentHTML = '';
        
        switch(page) {
            case 'dashboard':
                contentHTML = this.getDashboardHTML();
                break;
            case 'transfer':
                contentHTML = this.getTransferHTML();
                break;
            case 'bills':
                contentHTML = this.getBillsHTML();
                break;
            case 'airtime':
                contentHTML = this.getAirtimeHTML();
                break;
            case 'login':
                contentHTML = this.getLoginHTML();
                break;
            default:
                contentHTML = this.getDashboardHTML();
        }

        document.querySelector('#content').innerHTML = contentHTML;
    }

    getDashboardHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-6">Account Overview</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h3 class="text-lg font-medium text-gray-700">Available Balance</h3>
                        <p class="text-3xl font-bold text-blue-600">₦${this.currentUser?.balance?.toLocaleString() || '0.00'}</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <h3 class="text-lg font-medium text-gray-700">Recent Transactions</h3>
                        <p class="text-3xl font-bold text-green-600">12</p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <h3 class="text-lg font-medium text-gray-700">Quick Actions</h3>
                        <div class="flex space-x-2 mt-2">
                            <button class="btn-action bg-blue-100 text-blue-600">Transfer</button>
                            <button class="btn-action bg-green-100 text-green-600">Pay Bills</button>
                            <button class="btn-action bg-purple-100 text-purple-600">Airtime</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getTransferHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-6">Transfer Money</h2>
                <form id="transfer-form" class="space-y-4">
                    <div>
                        <label class="block text-gray-700">Recipient</label>
                        <select class="w-full p-2 border rounded-md">
                            <option>Select recipient</option>
                            <option>John Doe (1234567890 - Access Bank)</option>
                            <option>Jane Smith (0987654321 - Zenith Bank)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700">Amount (₦)</label>
                        <input type="number" class="w-full p-2 border rounded-md" placeholder="Enter amount">
                    </div>
                    <div>
                        <label class="block text-gray-700">Narration</label>
                        <input type="text" class="w-full p-2 border rounded-md" placeholder="Optional">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Send Money
                    </button>
                </form>
            </div>
        `;
    }

    getBillsHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-6">Pay Bills</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div class="bill-category bg-blue-50 p-4 rounded-lg text-center cursor-pointer hover:bg-blue-100">
                        <i class="fas fa-bolt text-blue-500 text-2xl mb-2"></i>
                        <p class="font-medium">Electricity</p>
                    </div>
                    <div class="bill-category bg-green-50 p-4 rounded-lg text-center cursor-pointer hover:bg-green-100">
                        <i class="fas fa-water text-green-500 text-2xl mb-2"></i>
                        <p class="font-medium">Water</p>
                    </div>
                    <div class="bill-category bg-yellow-50 p-4 rounded-lg text-center cursor-pointer hover:bg-yellow-100">
                        <i class="fas fa-tv text-yellow-500 text-2xl mb-2"></i>
                        <p class="font-medium">Cable TV</p>
                    </div>
                    <div class="bill-category bg-red-50 p-4 rounded-lg text-center cursor-pointer hover:bg-red-100">
                        <i class="fas fa-phone text-red-500 text-2xl mb-2"></i>
                        <p class="font-medium">Internet</p>
                    </div>
                </div>
            </div>
        `;
    }

    getAirtimeHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-6">Airtime Top-Up</h2>
                <form id="airtime-form" class="space-y-4">
                    <div>
                        <label class="block text-gray-700">Network</label>
                        <select class="w-full p-2 border rounded-md">
                            <option>Select network</option>
                            <option>MTN</option>
                            <option>Airtel</option>
                            <option>Glo</option>
                            <option>9mobile</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700">Phone Number</label>
                        <input type="tel" class="w-full p-2 border rounded-md" placeholder="Enter phone number">
                    </div>
                    <div>
                        <label class="block text-gray-700">Amount (₦)</label>
                        <input type="number" class="w-full p-2 border rounded-md" placeholder="Enter amount">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Top Up
                    </button>
                </form>
            </div>
        `;
    }

    getLoginHTML() {
        return `
            <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
                <h2 class="text-2xl font-semibold mb-6 text-center">Login to Your Account</h2>
                <form id="login-form" class="space-y-4">
                    <div>
                        <label class="block text-gray-700">Email Address</label>
                        <input type="email" id="email" class="w-full p-2 border rounded-md" placeholder="Enter your email" required>
                    </div>
                    <div>
                        <label class="block text-gray-700">Password</label>
                        <input type="password" id="password" class="w-full p-2 border rounded-md" placeholder="Enter your password" required>
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Login
                    </button>
                    <p class="text-center text-gray-600">
                        Don't have an account? <a href="#" data-page="register" class="text-blue-600">Sign up</a>
                    </p>
                </form>
            </div>
        `;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new FintechApp();
});