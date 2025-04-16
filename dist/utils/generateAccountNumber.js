"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccountNumber = void 0;
const generateAccountNumber = () => {
    const prefix = '10'; // You can customize this prefix
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    return prefix + randomNumber.substring(0, 8);
};
exports.generateAccountNumber = generateAccountNumber;
