// Authentication Module
class AuthService {
    constructor() {
        this.users = [
            { id: 1, email: 'user@example.com', password: 'password123', name: 'Demo User', balance: 25000 }
        ];
        this.currentUser = null;
    }

    login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = this.users.find(u => u.email === email && u.password === password);
                if (user) {
                    this.currentUser = user;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    resolve(user);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000);
        });
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        if (!this.currentUser && localStorage.getItem('currentUser')) {
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        }
        return this.currentUser;
    }

    register(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    id: this.users.length + 1,
                    ...userData,
                    balance: 0
                };
                this.users.push(newUser);
                resolve(newUser);
            }, 1000);
        });
    }
}

// Export singleton instance
const authService = new AuthService();
export default authService;