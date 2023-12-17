/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.controller.ts":
/*!*******************************!*\
  !*** ./src/app.controller.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./src/app.service.ts");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_controller_1 = __webpack_require__(/*! ./app.controller */ "./src/app.controller.ts");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./src/app.service.ts");
const sam_test_controller_1 = __webpack_require__(/*! ./sam-test/sam-test.controller */ "./src/sam-test/sam-test.controller.ts");
const prisma_service_1 = __webpack_require__(/*! ./prisma.service */ "./src/prisma.service.ts");
const authentification_module_1 = __webpack_require__(/*! ./authentification/authentification.module */ "./src/authentification/authentification.module.ts");
const chat_module_1 = __webpack_require__(/*! ./chat/chat.module */ "./src/chat/chat.module.ts");
const channel_module_1 = __webpack_require__(/*! ./channel/channel.module */ "./src/channel/channel.module.ts");
const logout_controller_1 = __webpack_require__(/*! ./logout/logout.controller */ "./src/logout/logout.controller.ts");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const user_controller_1 = __webpack_require__(/*! ./user/user.controller */ "./src/user/user.controller.ts");
const session = __webpack_require__(/*! express-session */ "express-session");
const game_module_1 = __webpack_require__(/*! ./game/game.module */ "./src/game/game.module.ts");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(session({
            secret: 'g5fd6gfd564gdf54az65ecx',
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false }
        }))
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [authentification_module_1.AuthentificationModule, chat_module_1.ChatModule, channel_module_1.ChannelModule, schedule_1.ScheduleModule.forRoot(), game_module_1.GameModule],
        controllers: [app_controller_1.AppController, sam_test_controller_1.SamTestController, logout_controller_1.LogoutController, user_controller_1.UserController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService],
    })
], AppModule);


/***/ }),

/***/ "./src/app.service.ts":
/*!****************************!*\
  !*** ./src/app.service.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let AppService = class AppService {
    getHello() {
        return 'Nest fonctionne houraaaaaa';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),

/***/ "./src/authentification/authentification.controller.ts":
/*!*************************************************************!*\
  !*** ./src/authentification/authentification.controller.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthentificationController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const express_1 = __webpack_require__(/*! express */ "express");
const prisma_service_1 = __webpack_require__(/*! ../prisma.service */ "./src/prisma.service.ts");
let AuthentificationController = class AuthentificationController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async login42(req) {
    }
    async callback42(req, res, session) {
        const apiResponse = await fetch('https://api.intra.42.fr/v2/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.user.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const userData = await apiResponse.json();
        const checkUserid = await this.prisma.user.findUnique({
            where: {
                id42: userData.id,
            },
        });
        if (checkUserid == null) {
            var newUser = {
                id42: userData.id,
                pseudo: userData.login,
                email: userData.email,
                firstname: userData.first_name,
                lastname: userData.last_name,
                imageURL: userData.image.link,
            };
            newUser = await this.prisma.user.create({
                data: newUser,
            });
            session.user = newUser;
            console.log("L'utilisateur n'existe pas dans la bdd");
        }
        else {
            session.user = checkUserid;
            console.log("L'utilisateur existe deja dans la bdd");
        }
        res.redirect('http://localhost:3000/profil');
    }
    async profilSession42(req, session) {
        if (session.user) {
            console.log("Il y a un utilisateur connecté");
            return session.user;
        }
        else {
            console.log("Aucun utilisateur connecté");
            return { undefined };
        }
    }
};
exports.AuthentificationController = AuthentificationController;
__decorate([
    (0, common_1.Get)('42'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthentificationController.prototype, "login42", null);
__decorate([
    (0, common_1.Get)('42/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object, typeof (_c = typeof Record !== "undefined" && Record) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthentificationController.prototype, "callback42", null);
__decorate([
    (0, common_1.Get)('42/profil'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof Record !== "undefined" && Record) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AuthentificationController.prototype, "profilSession42", null);
exports.AuthentificationController = AuthentificationController = __decorate([
    (0, common_1.Controller)('authentification'),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AuthentificationController);


/***/ }),

/***/ "./src/authentification/authentification.module.ts":
/*!*********************************************************!*\
  !*** ./src/authentification/authentification.module.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthentificationModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const authentification_controller_1 = __webpack_require__(/*! ./authentification.controller */ "./src/authentification/authentification.controller.ts");
const fortytwo_service_1 = __webpack_require__(/*! ./fortytwo/fortytwo.service */ "./src/authentification/fortytwo/fortytwo.service.ts");
const prisma_service_1 = __webpack_require__(/*! src/prisma.service */ "./src/prisma.service.ts");
let AuthentificationModule = class AuthentificationModule {
};
exports.AuthentificationModule = AuthentificationModule;
exports.AuthentificationModule = AuthentificationModule = __decorate([
    (0, common_1.Module)({
        controllers: [authentification_controller_1.AuthentificationController],
        providers: [fortytwo_service_1.FortyTwoService, prisma_service_1.PrismaService],
    })
], AuthentificationModule);


/***/ }),

/***/ "./src/authentification/fortytwo/fortytwo.service.ts":
/*!***********************************************************!*\
  !*** ./src/authentification/fortytwo/fortytwo.service.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FortyTwoService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_42_1 = __webpack_require__(/*! passport-42 */ "passport-42");
let FortyTwoService = class FortyTwoService extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42') {
    constructor() {
        super({
            clientID: process.env.FORTYTWO_APP_ID,
            clientSecret: process.env.FORTYTWO_APP_SECRET,
            callbackURL: process.env.FORTYTWO_CALLBACK,
        });
    }
    async validate(accessToken, refreshToken, profile) {
        const user = {
            fortytwoId: profile.id,
            accessToken
        };
        return user;
    }
};
exports.FortyTwoService = FortyTwoService;
exports.FortyTwoService = FortyTwoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FortyTwoService);


/***/ }),

/***/ "./src/channel/channel.controller.ts":
/*!*******************************************!*\
  !*** ./src/channel/channel.controller.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChannelController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const channel_service_1 = __webpack_require__(/*! ./channel.service */ "./src/channel/channel.service.ts");
let ChannelController = class ChannelController {
    constructor(channelService) {
        this.channelService = channelService;
    }
    async getAllChannels(params) {
        return await this.channelService.getAccessibleChannels(params.user);
    }
    async getChannel(params) {
        const channels = await this.channelService.getAllChannels();
        const channel = await this.channelService.getChannelByName(params.channel);
        return channels[channel];
    }
};
exports.ChannelController = ChannelController;
__decorate([
    (0, common_1.Get)('/all/:user'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], ChannelController.prototype, "getAllChannels", null);
__decorate([
    (0, common_1.Get)('/one/:channel'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], ChannelController.prototype, "getChannel", null);
exports.ChannelController = ChannelController = __decorate([
    (0, common_1.Controller)('channel'),
    __metadata("design:paramtypes", [typeof (_a = typeof channel_service_1.ChannelService !== "undefined" && channel_service_1.ChannelService) === "function" ? _a : Object])
], ChannelController);


/***/ }),

/***/ "./src/channel/channel.module.ts":
/*!***************************************!*\
  !*** ./src/channel/channel.module.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChannelModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const channel_service_1 = __webpack_require__(/*! ./channel.service */ "./src/channel/channel.service.ts");
const channel_controller_1 = __webpack_require__(/*! ./channel.controller */ "./src/channel/channel.controller.ts");
let ChannelModule = class ChannelModule {
};
exports.ChannelModule = ChannelModule;
exports.ChannelModule = ChannelModule = __decorate([
    (0, common_1.Module)({
        providers: [channel_service_1.ChannelService],
        exports: [channel_service_1.ChannelService],
        controllers: [channel_controller_1.ChannelController]
    })
], ChannelModule);


/***/ }),

/***/ "./src/channel/channel.service.ts":
/*!****************************************!*\
  !*** ./src/channel/channel.service.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChannelService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let ChannelService = class ChannelService {
    constructor() {
        this.channels = [];
    }
    async addChannel(channelCreate) {
        const channel = await this.getChannelByName(channelCreate.name);
        if (channel === -1) {
            await this.channels.push({
                name: channelCreate.name,
                host: [channelCreate.user.login],
                owner: channelCreate.user,
                users: [channelCreate.user],
                type: channelCreate.type,
                mdp: channelCreate.mdp,
                invited: [channelCreate.user.login]
            });
        }
    }
    async removeChannel(channelName) {
        const findChannel = await this.getChannelByName(channelName);
        if (findChannel !== -1) {
            this.channels = this.channels.filter((channel) => channel.name !== channelName);
        }
    }
    async getChannelHost(hostName) {
        const channelIndex = await this.getChannelByName(hostName);
        return this.channels[channelIndex].host;
    }
    async getChannelByName(channelName) {
        const channelIndex = this.channels.findIndex((channel) => channel?.name === channelName);
        return channelIndex;
    }
    userIsInvited(login, channel) {
        return channel.invited.some(l => l === login);
    }
    mdpIsValid(mdp, channel) {
        return (mdp === channel.mdp);
    }
    userIsHost(user_login, channel) {
        return channel.host.some(l => l == user_login);
    }
    async addInviteToChannel(inviteInfo) {
        const channelIndex = await this.getChannelByName(inviteInfo.channel_name);
        if (channelIndex === -1)
            return;
        if (!this.userIsHost(inviteInfo.user.login, this.channels[channelIndex]))
            return;
        this.channels[channelIndex].invited.push(inviteInfo.invited_name);
    }
    async addAdminToChannel(adminInfo) {
        const channelIndex = await this.getChannelByName(adminInfo.channel);
        if (channelIndex === -1)
            return;
        if (!this.userIsHost(adminInfo.user.login, this.channels[channelIndex]))
            return;
        this.channels[channelIndex].host.push(adminInfo.new_admin_name);
    }
    async removeAdminToChannel(adminInfo) {
        const channelIndex = await this.getChannelByName(adminInfo.channel);
        if (channelIndex === -1)
            return;
        if (!this.userIsHost(adminInfo.user.login, this.channels[channelIndex]))
            return;
        if (adminInfo.new_admin_name === adminInfo.user.login)
            return;
        const adminIndex = this.channels[channelIndex].host.indexOf(adminInfo.new_admin_name);
        if (adminIndex !== -1) {
            this.channels[channelIndex].host.splice(adminIndex, 1);
        }
    }
    async addUserToChannel(channelCreate) {
        const channelIndex = await this.getChannelByName(channelCreate.name);
        if (channelIndex !== -1) {
            if (this.channels[channelIndex].type === "private") {
                if (!this.userIsInvited(channelCreate.user.login, this.channels[channelIndex])) {
                    return {
                        errorNumber: 20,
                        text: "L'utilisateur " + channelCreate.user.login + " essaie de rejoindre un channel privé sans avoir été invité : " + this.channels[channelIndex].name
                    };
                }
            }
            if (this.channels[channelIndex].type === "protected") {
                if (!this.mdpIsValid(channelCreate.mdp, this.channels[channelIndex])) {
                    return {
                        errorNumber: 21,
                        text: "L'utilisateur " + channelCreate.user.login + " essaie de rejoindre un channel privé avec le mauvais mdp: " + this.channels[channelIndex].name
                    };
                }
            }
            this.channels[channelIndex].users.push(channelCreate.user);
            return {
                errorNumber: 0,
                text: "Utilisateur ajouté dans le channel"
            };
        }
        await this.addChannel(channelCreate);
        return {
            errorNumber: 0,
            text: "Nouveau channel créé"
        };
    }
    async findChannelsByUserSocketId(socketId) {
        const filteredChannels = this.channels.filter((channel) => {
            const found = channel.users.find((user) => user.socketId === socketId);
            if (found) {
                return found;
            }
        });
        return filteredChannels;
    }
    async removeUserFromAllChannels(socketId) {
        const channels = await this.findChannelsByUserSocketId(socketId);
        for (const channel of channels) {
            await this.removeUserFromChannel(socketId, channel.name);
        }
    }
    async removeUserFromChannel(socketId, channelName) {
        const channel = await this.getChannelByName(channelName);
        if (this.channels[channel]) {
            this.channels[channel].users = this.channels[channel].users.filter((user) => user.socketId !== socketId);
            if (this.channels[channel].users.length === 0) {
                await this.removeChannel(channelName);
            }
        }
    }
    async getAllChannels() {
        return this.channels;
    }
    async getAccessibleChannels(login) {
        return this.channels.filter(c => c.type !== "private" || this.userIsInvited(login, c));
    }
};
exports.ChannelService = ChannelService;
exports.ChannelService = ChannelService = __decorate([
    (0, common_1.Injectable)()
], ChannelService);


/***/ }),

/***/ "./src/chat/chat.gateway.ts":
/*!**********************************!*\
  !*** ./src/chat/chat.gateway.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const chat_interface_1 = __webpack_require__(/*! ./chat.interface */ "./src/chat/chat.interface.ts");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
const channel_service_1 = __webpack_require__(/*! src/channel/channel.service */ "./src/channel/channel.service.ts");
let ChatGateway = class ChatGateway {
    constructor(channelService) {
        this.channelService = channelService;
        this.server = new socket_io_1.Server();
        this.logger = new common_1.Logger('ChatGateway');
    }
    async delete_admin(payload) {
        this.logger.log(payload);
        await this.channelService.removeAdminToChannel(payload);
    }
    async addAdmin(payload) {
        this.logger.log(payload);
        await this.channelService.addAdminToChannel(payload);
    }
    async handleInvite(payload) {
        this.logger.log(payload);
        await this.channelService.addInviteToChannel(payload);
    }
    async handleEvent(payload) {
        this.logger.log(payload);
        this.server.to(payload.channelName).emit('chat', payload);
        return payload;
    }
    async handleSetClientDataEvent(payload) {
        if (payload.user.socketId) {
            this.logger.log(`${payload.user.socketId} is joining ${payload.name}`);
            await this.server.in(payload.user.socketId).socketsJoin(payload.name);
            const response = await this.channelService.addUserToChannel(payload);
            if (response.errorNumber === 0) {
                this.server.to(payload.name).emit('chat', {
                    user: payload.user,
                    timeSent: null,
                    message: `${payload.user.login} jump in ${payload.name}`,
                    channelName: payload.name,
                });
            }
            return response;
        }
    }
    async handleConnection(socket) {
        this.logger.log(`Socket connected: ${socket.id}`);
    }
    async handleDisconnect(socket) {
        await this.channelService.removeUserFromAllChannels(socket.id);
        this.logger.log(`Socket disconnected: ${socket.id}`);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_b = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _b : Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('remove_admin'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof chat_interface_1.addAdminInfo !== "undefined" && chat_interface_1.addAdminInfo) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ChatGateway.prototype, "delete_admin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('add_admin'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof chat_interface_1.addAdminInfo !== "undefined" && chat_interface_1.addAdminInfo) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], ChatGateway.prototype, "addAdmin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('invite'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof chat_interface_1.InviteToChannel !== "undefined" && chat_interface_1.InviteToChannel) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], ChatGateway.prototype, "handleInvite", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof chat_interface_1.Message !== "undefined" && chat_interface_1.Message) === "function" ? _j : Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], ChatGateway.prototype, "handleEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_channel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof chat_interface_1.ChannelCreate !== "undefined" && chat_interface_1.ChannelCreate) === "function" ? _l : Object]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], ChatGateway.prototype, "handleSetClientDataEvent", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof channel_service_1.ChannelService !== "undefined" && channel_service_1.ChannelService) === "function" ? _a : Object])
], ChatGateway);


/***/ }),

/***/ "./src/chat/chat.interface.ts":
/*!************************************!*\
  !*** ./src/chat/chat.interface.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/chat/chat.module.ts":
/*!*********************************!*\
  !*** ./src/chat/chat.module.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const chat_gateway_1 = __webpack_require__(/*! ./chat.gateway */ "./src/chat/chat.gateway.ts");
const channel_module_1 = __webpack_require__(/*! src/channel/channel.module */ "./src/channel/channel.module.ts");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [channel_module_1.ChannelModule],
        providers: [chat_gateway_1.ChatGateway],
    })
], ChatModule);


/***/ }),

/***/ "./src/game/ServerExceptions.ts":
/*!**************************************!*\
  !*** ./src/game/ServerExceptions.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServerException = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
class ServerException extends websockets_1.WsException {
    constructor(type, message) {
        const serverExceptionResponse = {
            exception: type,
            message: message,
        };
        super(serverExceptionResponse);
    }
}
exports.ServerException = ServerException;


/***/ }),

/***/ "./src/game/dtos.ts":
/*!**************************!*\
  !*** ./src/game/dtos.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LobbyJoinDto = exports.LobbyCreateDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class LobbyCreateDto {
}
exports.LobbyCreateDto = LobbyCreateDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LobbyCreateDto.prototype, "mode", void 0);
class LobbyJoinDto {
}
exports.LobbyJoinDto = LobbyJoinDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LobbyJoinDto.prototype, "lobbyId", void 0);


/***/ }),

/***/ "./src/game/game.gateway.ts":
/*!**********************************!*\
  !*** ./src/game/game.gateway.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const validation_pipe_1 = __webpack_require__(/*! src/game/validation-pipe */ "./src/game/validation-pipe.ts");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
const ServerEvents_1 = __webpack_require__(/*! src/game/shared/server/ServerEvents */ "./src/game/shared/server/ServerEvents.ts");
const ClientEvents_1 = __webpack_require__(/*! src/game/shared/client/ClientEvents */ "./src/game/shared/client/ClientEvents.ts");
const lobby_manager_1 = __webpack_require__(/*! ./lobby/lobby.manager */ "./src/game/lobby/lobby.manager.ts");
const types_1 = __webpack_require__(/*! ./types */ "./src/game/types.ts");
const dtos_1 = __webpack_require__(/*! ./dtos */ "./src/game/dtos.ts");
let GameGateway = class GameGateway {
    constructor(lobbyManager) {
        this.lobbyManager = lobbyManager;
    }
    afterInit(server) {
        this.lobbyManager.server = server;
        console.log('Game server initialized !');
    }
    async handleConnection(client, ...args) {
        this.lobbyManager.initializeSocket(client);
    }
    async handleDisconnect(client) {
        this.lobbyManager.terminateSocket(client);
    }
    onPing(client) {
        console.log("Received event :" + ClientEvents_1.ClientEvents.Ping);
        client.emit(ServerEvents_1.ServerEvents.Pong, {
            message: 'pong',
        });
    }
    onLobbyCreate(client, data) {
        console.log("Received event :" + ClientEvents_1.ClientEvents.LobbyCreate);
        const lobby = this.lobbyManager.createLobby(data.mode);
        console.log('Created %s Lobby with id %s', data.mode, lobby.id);
        lobby.addClient(client);
        return {
            event: ServerEvents_1.ServerEvents.GameMessage,
            data: {
                message: 'Lobby created',
            },
        };
    }
    onLobbyJoin(client, data) {
        console.log("Received event :" + ClientEvents_1.ClientEvents.LobbyJoin);
        console.log('Client %s joined lobby %s', client.id, data.lobbyId);
        this.lobbyManager.joinLobby(data.lobbyId, client);
    }
    onLobbyLeave(client) {
        console.log("Received event :" + ClientEvents_1.ClientEvents.LobbyLeave);
        client.data.lobby?.removeClient(client);
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)(ClientEvents_1.ClientEvents.Ping),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onPing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(ClientEvents_1.ClientEvents.LobbyCreate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof types_1.AuthenticatedSocket !== "undefined" && types_1.AuthenticatedSocket) === "function" ? _c : Object, typeof (_d = typeof dtos_1.LobbyCreateDto !== "undefined" && dtos_1.LobbyCreateDto) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof websockets_1.WsResponse !== "undefined" && websockets_1.WsResponse) === "function" ? _e : Object)
], GameGateway.prototype, "onLobbyCreate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(ClientEvents_1.ClientEvents.LobbyJoin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof types_1.AuthenticatedSocket !== "undefined" && types_1.AuthenticatedSocket) === "function" ? _f : Object, typeof (_g = typeof dtos_1.LobbyJoinDto !== "undefined" && dtos_1.LobbyJoinDto) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onLobbyJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(ClientEvents_1.ClientEvents.LobbyLeave),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof types_1.AuthenticatedSocket !== "undefined" && types_1.AuthenticatedSocket) === "function" ? _h : Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onLobbyLeave", null);
exports.GameGateway = GameGateway = __decorate([
    (0, common_1.UsePipes)(new validation_pipe_1.WsValidationPipe()),
    (0, websockets_1.WebSocketGateway)({ namespace: 'game' }),
    __metadata("design:paramtypes", [typeof (_a = typeof lobby_manager_1.LobbyManager !== "undefined" && lobby_manager_1.LobbyManager) === "function" ? _a : Object])
], GameGateway);


/***/ }),

/***/ "./src/game/game.module.ts":
/*!*********************************!*\
  !*** ./src/game/game.module.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const game_gateway_1 = __webpack_require__(/*! ./game.gateway */ "./src/game/game.gateway.ts");
const lobby_manager_1 = __webpack_require__(/*! ./lobby/lobby.manager */ "./src/game/lobby/lobby.manager.ts");
let GameModule = class GameModule {
};
exports.GameModule = GameModule;
exports.GameModule = GameModule = __decorate([
    (0, common_1.Module)({
        providers: [
            game_gateway_1.GameGateway,
            lobby_manager_1.LobbyManager,
        ],
    })
], GameModule);


/***/ }),

/***/ "./src/game/instance/instance.ts":
/*!***************************************!*\
  !*** ./src/game/instance/instance.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Instance = void 0;
class Instance {
    constructor(lobby) {
        this.lobby = lobby;
        this.hasStarted = false;
        this.hasFinished = false;
        this.isSuspended = false;
        this.scores = {};
    }
}
exports.Instance = Instance;


/***/ }),

/***/ "./src/game/lobby/lobby.manager.ts":
/*!*****************************************!*\
  !*** ./src/game/lobby/lobby.manager.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LobbyManager = void 0;
const lobby_1 = __webpack_require__(/*! ./lobby */ "./src/game/lobby/lobby.ts");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const ServerExceptions_1 = __webpack_require__(/*! ../ServerExceptions */ "./src/game/ServerExceptions.ts");
const SocketExceptions_1 = __webpack_require__(/*! ../shared/server/SocketExceptions */ "./src/game/shared/server/SocketExceptions.ts");
class LobbyManager {
    constructor() {
        this.lobbies = new Map();
    }
    initializeSocket(client) {
        client.data.lobby = null;
    }
    terminateSocket(client) {
        client.data.lobby?.removeClient(client);
    }
    createLobby(mode) {
        const lobby = new lobby_1.Lobby(this.server, mode);
        this.lobbies.set(lobby.id, lobby);
        console.log("Created lobby %s", lobby.id);
        return lobby;
    }
    joinLobby(lobbyId, client) {
        const lobby = this.lobbies.get(lobbyId);
        if (!lobby) {
            throw new ServerExceptions_1.ServerException(SocketExceptions_1.SocketExceptions.LobbyError, 'Lobby not found');
        }
        if (lobby.clients.size >= lobby.maxClients) {
            throw new ServerExceptions_1.ServerException(SocketExceptions_1.SocketExceptions.LobbyError, 'Lobby already full');
        }
        lobby.addClient(client);
    }
    lobbiesCleaner() {
    }
}
exports.LobbyManager = LobbyManager;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LobbyManager.prototype, "lobbiesCleaner", null);


/***/ }),

/***/ "./src/game/lobby/lobby.ts":
/*!*********************************!*\
  !*** ./src/game/lobby/lobby.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Lobby = void 0;
const instance_1 = __webpack_require__(/*! ../instance/instance */ "./src/game/instance/instance.ts");
const ServerEvents_1 = __webpack_require__(/*! ../shared/server/ServerEvents */ "./src/game/shared/server/ServerEvents.ts");
class Lobby {
    constructor(server, mode) {
        this.server = server;
        this.mode = mode;
        this.id = Math.floor(1000 + Math.random() * 9000).toString();
        this.maxClients = 2;
        this.createdAt = new Date();
        this.clients = new Map();
        this.instance = new instance_1.Instance(this);
    }
    addClient(client) {
        this.clients.set(client.id, client);
        client.join(this.id);
        client.data.lobby = this;
        this.dispatchLobbyState();
    }
    removeClient(client) {
        this.clients.delete(client.id);
        client.leave(this.id);
        client.data.lobby = null;
        this.dispatchLobbyState();
    }
    dispatchLobbyState() {
        const payload = {
            lobbyId: this.id,
            hasStarted: this.instance.hasStarted,
            hasFinished: this.instance.hasFinished,
            playersCount: this.clients.size,
            isSuspended: this.instance.isSuspended,
            scores: this.instance.scores,
        };
        this.dispatchToLobby(ServerEvents_1.ServerEvents.LobbyState, payload);
    }
    dispatchToLobby(event, payload) {
        this.server.to(this.id).emit(event, payload);
    }
}
exports.Lobby = Lobby;


/***/ }),

/***/ "./src/game/shared/client/ClientEvents.ts":
/*!************************************************!*\
  !*** ./src/game/shared/client/ClientEvents.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientEvents = void 0;
var ClientEvents;
(function (ClientEvents) {
    ClientEvents["Ping"] = "client.ping";
    ClientEvents["LobbyCreate"] = "client.lobby.create";
    ClientEvents["LobbyJoin"] = "client.lobby.join";
    ClientEvents["LobbyLeave"] = "client.lobby.leave";
})(ClientEvents || (exports.ClientEvents = ClientEvents = {}));


/***/ }),

/***/ "./src/game/shared/server/ServerEvents.ts":
/*!************************************************!*\
  !*** ./src/game/shared/server/ServerEvents.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServerEvents = void 0;
var ServerEvents;
(function (ServerEvents) {
    ServerEvents["Pong"] = "server.pong";
    ServerEvents["LobbyState"] = "server.lobby.state";
    ServerEvents["GameMessage"] = "server.game.message";
})(ServerEvents || (exports.ServerEvents = ServerEvents = {}));


/***/ }),

/***/ "./src/game/shared/server/SocketExceptions.ts":
/*!****************************************************!*\
  !*** ./src/game/shared/server/SocketExceptions.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocketExceptions = void 0;
var SocketExceptions;
(function (SocketExceptions) {
    SocketExceptions["UnexpectedError"] = "exception.unexpected_error";
    SocketExceptions["UnexpectedPayload"] = "exception.unexpected_payload";
    SocketExceptions["LobbyError"] = "exception.lobby.error";
    SocketExceptions["GameError"] = "exception.game.error";
})(SocketExceptions || (exports.SocketExceptions = SocketExceptions = {}));


/***/ }),

/***/ "./src/game/types.ts":
/*!***************************!*\
  !*** ./src/game/types.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/game/validation-pipe.ts":
/*!*************************************!*\
  !*** ./src/game/validation-pipe.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WsValidationPipe = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const ServerExceptions_1 = __webpack_require__(/*! src/game/ServerExceptions */ "./src/game/ServerExceptions.ts");
const SocketExceptions_1 = __webpack_require__(/*! src/game/shared/server/SocketExceptions */ "./src/game/shared/server/SocketExceptions.ts");
let WsValidationPipe = class WsValidationPipe extends common_1.ValidationPipe {
    createExceptionFactory() {
        return (validationErrors = []) => {
            if (this.isDetailedOutputDisabled) {
                return new ServerExceptions_1.ServerException(SocketExceptions_1.SocketExceptions.UnexpectedError, 'Bad request');
            }
            const errors = this.flattenValidationErrors(validationErrors);
            return new ServerExceptions_1.ServerException(SocketExceptions_1.SocketExceptions.UnexpectedPayload, errors);
        };
    }
};
exports.WsValidationPipe = WsValidationPipe;
exports.WsValidationPipe = WsValidationPipe = __decorate([
    (0, common_1.Injectable)()
], WsValidationPipe);


/***/ }),

/***/ "./src/logout/logout.controller.ts":
/*!*****************************************!*\
  !*** ./src/logout/logout.controller.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogoutController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const express_1 = __webpack_require__(/*! express */ "express");
let LogoutController = class LogoutController {
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Session destruction failed", err);
                return res.status(500).send("Internal Server Error");
            }
            res.send({ message: "Logout successful" });
        });
        console.log("Session détruite cote serveur");
    }
};
exports.LogoutController = LogoutController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _a : Object, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], LogoutController.prototype, "logout", null);
exports.LogoutController = LogoutController = __decorate([
    (0, common_1.Controller)('logout')
], LogoutController);


/***/ }),

/***/ "./src/prisma.service.ts":
/*!*******************************!*\
  !*** ./src/prisma.service.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);


/***/ }),

/***/ "./src/sam-test/sam-test.controller.ts":
/*!*********************************************!*\
  !*** ./src/sam-test/sam-test.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SamTestController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma.service */ "./src/prisma.service.ts");
let SamTestController = class SamTestController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTexte() {
        try {
            var user = await this.prisma.user.findFirst();
            return {
                message: "Voila le nom du premier utilisateur : " + (user ? user.pseudo : "Personne dans la bdd")
            };
        }
        catch (error) {
            return {
                message: "Une erreur s'est produite en rapport avec la bdd "
            };
        }
    }
};
exports.SamTestController = SamTestController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], SamTestController.prototype, "getTexte", null);
exports.SamTestController = SamTestController = __decorate([
    (0, common_1.Controller)('sam-test'),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SamTestController);


/***/ }),

/***/ "./src/user/user.controller.ts":
/*!*************************************!*\
  !*** ./src/user/user.controller.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! src/prisma.service */ "./src/prisma.service.ts");
let UserController = class UserController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserById(id) {
        return await this.prisma.user.findUnique({
            where: { id42: Number(id) },
        });
    }
    async updatePseudo(id, pseudo) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { pseudo },
        });
    }
    async updateEmail(id, email) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { email },
        });
    }
    async updateFirstName(id, firstname) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { firstname },
        });
    }
    async updateLastName(id, lastname) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { lastname },
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Patch)(':id/pseudo'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('pseudo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePseudo", null);
__decorate([
    (0, common_1.Patch)(':id/email'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateEmail", null);
__decorate([
    (0, common_1.Patch)(':id/firstname'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('firstname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateFirstName", null);
__decorate([
    (0, common_1.Patch)(':id/lastname'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('lastname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateLastName", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UserController);


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/schedule":
/*!***********************************!*\
  !*** external "@nestjs/schedule" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),

/***/ "@nestjs/websockets":
/*!*************************************!*\
  !*** external "@nestjs/websockets" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("express-session");

/***/ }),

/***/ "passport-42":
/*!******************************!*\
  !*** external "passport-42" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("passport-42");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const fs = __webpack_require__(/*! fs */ "fs");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
const dotenv = __webpack_require__(/*! dotenv */ "dotenv");
async function bootstrap() {
    dotenv.config();
    const cert = fs.readFileSync('/var/nest_cert.pem', 'utf8');
    const key = fs.readFileSync('/var/nest_key.pem', 'utf8');
    const httpsOptions = {
        key: key,
        cert: cert,
    };
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: "http://localhost:3000",
        credentials: true,
    });
    await app.listen(4000);
}
bootstrap();

})();

/******/ })()
;