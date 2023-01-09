"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const role_constant_1 = require("../role.constant");
let WsAuthGuard = class WsAuthGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const client = context.switchToWs().getClient();
        if (!client.userId) {
            client.send(JSON.stringify({
                event: 'error',
                data: {
                    message: 'unauthorized',
                },
            }));
            return false;
        }
        const requiredRoles = this.reflector.get(role_constant_1.ROLES_KEY, context.getHandler());
        if (!requiredRoles) {
            return true;
        }
        const roleId = client.roleId;
        const canActive = roleId !== null && roleId !== undefined && requiredRoles.includes(roleId);
        if (canActive) {
            return true;
        }
        else {
            client.send(JSON.stringify({
                event: 'error',
                data: {
                    message: 'permission denied',
                },
            }));
            return false;
        }
    }
};
WsAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], WsAuthGuard);
exports.WsAuthGuard = WsAuthGuard;
//# sourceMappingURL=ws-auth.guard.js.map