"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsvpCreateSchema = exports.RSVP_RESPONSE_ENUM = void 0;
const zod_1 = __importDefault(require("zod"));
exports.RSVP_RESPONSE_ENUM = ["YES", "NO", "MAY BE"];
exports.rsvpCreateSchema = zod_1.default.object({
    eventId: zod_1.default.coerce.number().positive().min(1),
    response: zod_1.default.enum(exports.RSVP_RESPONSE_ENUM),
});
//# sourceMappingURL=rsvp.schema.js.map