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
exports.PartnerService = void 0;
const database_1 = require("../database");
const user_model_1 = require("../models/user-model");
const partner_model_1 = require("../models/partner-model");
class PartnerService {
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, company_name } = data;
            const connection = yield database_1.Database.getInstance().getConnection();
            try {
                yield connection.beginTransaction();
                const user = yield user_model_1.UserModel.create({
                    name,
                    email,
                    password,
                }, { connection });
                const partner = yield partner_model_1.PartnerModel.create({
                    company_name,
                    user_id: user.id,
                }, { connection });
                yield connection.commit();
                return {
                    id: partner.id,
                    name,
                    user_id: user.id,
                    company_name,
                    created_at: partner.created_at,
                };
            }
            catch (e) {
                yield connection.rollback();
                throw e;
            }
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return partner_model_1.PartnerModel.findByUserId(userId);
        });
    }
}
exports.PartnerService = PartnerService;
