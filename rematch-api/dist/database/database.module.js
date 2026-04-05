"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const database_setup_service_1 = require("./database-setup.service");
const graph_setup_service_1 = require("./graph-setup.service");
const seed_service_1 = require("./seed.service");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        providers: [database_setup_service_1.DatabaseSetupService, graph_setup_service_1.GraphSetupService, seed_service_1.SeedService],
        exports: [database_setup_service_1.DatabaseSetupService, graph_setup_service_1.GraphSetupService, seed_service_1.SeedService],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map