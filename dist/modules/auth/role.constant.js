"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipJwtAuth = exports.IS_PUBLIC_KEY = exports.Roles = exports.ROLES_KEY = exports.Role = void 0;
const common_1 = require("@nestjs/common");
var Role;
(function (Role) {
    Role[Role["Admin"] = 0] = "Admin";
    Role[Role["Manager"] = 1] = "Manager";
    Role[Role["User"] = 2] = "User";
    Role[Role["Guest"] = 3] = "Guest";
})(Role = exports.Role || (exports.Role = {}));
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
exports.IS_PUBLIC_KEY = 'isPublic';
const SkipJwtAuth = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.SkipJwtAuth = SkipJwtAuth;
//# sourceMappingURL=role.constant.js.map