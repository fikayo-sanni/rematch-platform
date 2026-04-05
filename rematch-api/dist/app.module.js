"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const ductape_module_1 = require("./config/ductape.module");
const database_module_1 = require("./database/database.module");
const users_module_1 = require("./modules/users/users.module");
const guilds_module_1 = require("./modules/guilds/guilds.module");
const matches_module_1 = require("./modules/matches/matches.module");
const competitions_module_1 = require("./modules/competitions/competitions.module");
const social_module_1 = require("./modules/social/social.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ductape_module_1.DuctapeModule,
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            guilds_module_1.GuildsModule,
            matches_module_1.MatchesModule,
            competitions_module_1.CompetitionsModule,
            social_module_1.SocialModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map