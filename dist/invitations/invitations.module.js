"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const invitations_service_1 = require("./invitations.service");
const invitations_controller_1 = require("./invitations.controller");
const invitation_schema_1 = require("./schemas/invitation.schema");
const board_schema_1 = require("../boards/schemas/board.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const email_service_1 = require("../email/email.service");
let InvitationsModule = class InvitationsModule {
};
exports.InvitationsModule = InvitationsModule;
exports.InvitationsModule = InvitationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: invitation_schema_1.Invitation.name, schema: invitation_schema_1.InvitationSchema },
                { name: board_schema_1.Board.name, schema: board_schema_1.BoardSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        controllers: [invitations_controller_1.InvitationsController],
        providers: [invitations_service_1.InvitationsService, email_service_1.EmailService],
        exports: [invitations_service_1.InvitationsService],
    })
], InvitationsModule);
//# sourceMappingURL=invitations.module.js.map