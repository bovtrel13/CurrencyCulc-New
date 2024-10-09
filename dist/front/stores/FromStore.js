"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyStore = void 0;
const mobx_1 = require("mobx");
class CurrencyStore {
    constructor() {
        this.rates = null;
        this.items = [];
        this.favorite = [];
        this.loading = true;
        this.error = null;
        this.successMessage = null;
        this.account = localStorage.getItem('Account') || '';
        this.initializeData = () => __awaiter(this, void 0, void 0, function* () {
            if (this.account) {
                yield this.getFavoriteData();
            }
            yield this.fetchCurrencyData();
        });
        this.fetchCurrencyData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('http://localhost:5000/currencies');
                const currencyData = yield response.json();
                const rates = {};
                currencyData.forEach((item) => {
                    rates[item.code] = item.rate;
                });
                (0, mobx_1.runInAction)(() => {
                    this.items = currencyData.map((item) => (Object.assign(Object.assign({}, item), { isFavorite: this.favorite.includes(item.code) }))).sort(this.sortByFavorite);
                    this.rates = rates;
                    this.loading = false;
                });
            }
            catch (error) {
                (0, mobx_1.runInAction)(() => {
                    this.error = "Ошибка загрузки данных";
                    this.loading = false;
                });
            }
        });
        this.getFavoriteData = () => __awaiter(this, void 0, void 0, function* () {
            const savedFavorites = localStorage.getItem(this.account || '');
            (0, mobx_1.runInAction)(() => {
                this.favorite = savedFavorites ? JSON.parse(savedFavorites) : [];
            });
        });
        this.addToFavorite = (favoriteCode) => __awaiter(this, void 0, void 0, function* () {
            const favorites = [...this.favorite];
            if (!favorites.includes(favoriteCode)) {
                favorites.push(favoriteCode);
                localStorage.setItem(this.account || '', JSON.stringify(favorites));
                (0, mobx_1.runInAction)(() => {
                    this.favorite = favorites;
                });
                yield this.updateItemsWithFavorites();
            }
        });
        this.removeFromFavorite = (favoriteCode) => __awaiter(this, void 0, void 0, function* () {
            const favorites = this.favorite.filter(item => item !== favoriteCode);
            localStorage.setItem(this.account || '', JSON.stringify(favorites));
            (0, mobx_1.runInAction)(() => {
                this.favorite = favorites;
            });
            yield this.updateItemsWithFavorites();
        });
        this.toggleFavorite = (code) => {
            if (this.favorite.includes(code)) {
                this.removeFromFavorite(code);
            }
            else {
                this.addToFavorite(code);
            }
        };
        this.updateItemsWithFavorites = () => __awaiter(this, void 0, void 0, function* () {
            yield this.getFavoriteData();
            (0, mobx_1.runInAction)(() => {
                this.items = this.items.map((item) => (Object.assign(Object.assign({}, item), { isFavorite: this.favorite.includes(item.code) }))).sort(this.sortByFavorite);
            });
        });
        this.sortByFavorite = (a, b) => {
            if (a.isFavorite === b.isFavorite) {
                return 0;
            }
            return a.isFavorite ? -1 : 1;
        };
        this.registerUser = (username, login, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('http://localhost:5000/accounts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, login, password }),
                });
                const data = yield response.json();
                (0, mobx_1.runInAction)(() => {
                    if (response.ok) {
                        this.successMessage = 'Регистрация успешна';
                        this.account = login;
                        localStorage.setItem('Account', login);
                        localStorage.setItem(login, JSON.stringify([]));
                        this.updateItemsWithFavorites();
                    }
                    else {
                        this.error = data.error || 'Ошибка регистрации';
                        this.successMessage = null;
                    }
                });
            }
            catch (err) {
                (0, mobx_1.runInAction)(() => {
                    this.error = 'Ошибка при отправке данных на сервер';
                    this.successMessage = null;
                });
            }
        });
        this.authoriseUser = (login, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('http://localhost:5000/accounts/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ login, password }),
                });
                const data = yield response.json();
                (0, mobx_1.runInAction)(() => {
                    if (response.ok) {
                        this.successMessage = 'Авторизация успешна';
                        this.account = login;
                        localStorage.setItem('Account', login);
                        this.getFavoriteData();
                        this.updateItemsWithFavorites();
                    }
                    else {
                        this.error = data.error || 'Ошибка авторизации';
                        this.successMessage = null;
                    }
                });
            }
            catch (err) {
                (0, mobx_1.runInAction)(() => {
                    this.error = 'Ошибка при отправке данных на сервер';
                    this.successMessage = null;
                });
            }
        });
        (0, mobx_1.makeAutoObservable)(this);
        this.initializeData();
    }
}
exports.currencyStore = new CurrencyStore();
