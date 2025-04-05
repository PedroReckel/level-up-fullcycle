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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsError = exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user-model");
class AuthService {
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = yield user_model_1.UserModel.findByEmail(email);
            if (userModel && bcrypt_1.default.compareSync(password, userModel.password)) {
                return jsonwebtoken_1.default.sign({ id: userModel.id, email: userModel.email }, "123456", {
                    expiresIn: "1h"
                });
            }
            else {
                throw new InvalidCredentialsError;
            }
        });
    }
}
exports.AuthService = AuthService;
class InvalidCredentialsError extends Error {
}
exports.InvalidCredentialsError = InvalidCredentialsError;
