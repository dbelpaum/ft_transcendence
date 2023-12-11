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
const game_gateway_1 = __webpack_require__(/*! ./game/game.gateway */ "./src/game/game.gateway.ts");
const session = __webpack_require__(/*! express-session */ "express-session");
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
        imports: [authentification_module_1.AuthentificationModule, chat_module_1.ChatModule],
        controllers: [app_controller_1.AppController, sam_test_controller_1.SamTestController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService, game_gateway_1.GameGateway],
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthentificationController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const express_1 = __webpack_require__(/*! express */ "express");
let AuthentificationController = class AuthentificationController {
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
        session.user = { id: userData.id, login: userData.login, email: userData.email, imageUrl: userData.image.link, firstname: userData.first_name, lastname: userData.last_name };
        console.log(session.user);
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
    __metadata("design:paramtypes", [Object, typeof (_a = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _a : Object, typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthentificationController.prototype, "callback42", null);
__decorate([
    (0, common_1.Get)('42/profil'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof Record !== "undefined" && Record) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthentificationController.prototype, "profilSession42", null);
exports.AuthentificationController = AuthentificationController = __decorate([
    (0, common_1.Controller)('authentification')
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
let AuthentificationModule = class AuthentificationModule {
};
exports.AuthentificationModule = AuthentificationModule;
exports.AuthentificationModule = AuthentificationModule = __decorate([
    (0, common_1.Module)({
        controllers: [authentification_controller_1.AuthentificationController],
        providers: [fortytwo_service_1.FortyTwoService]
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const chat_interface_1 = __webpack_require__(/*! ./chat.interface */ "./src/chat/chat.interface.ts");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
let ChatGateway = class ChatGateway {
    constructor() {
        this.server = new socket_io_1.Server();
        this.logger = new common_1.Logger('ChatGateway');
    }
    async handleEvent(payload) {
        this.logger.log(payload);
        console.log(payload);
        this.server.emit('chat', payload);
        return payload;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof chat_interface_1.Message !== "undefined" && chat_interface_1.Message) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], ChatGateway.prototype, "handleEvent", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
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
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        providers: [chat_gateway_1.ChatGateway]
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const validation_pipe_1 = __webpack_require__(/*! src/game/validation-pipe */ "./src/game/validation-pipe.ts");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
const ServerEvents_1 = __webpack_require__(/*! src/game/shared/server/ServerEvents */ "./src/game/shared/server/ServerEvents.ts");
const ClientEvents_1 = __webpack_require__(/*! src/game/shared/client/ClientEvents */ "./src/game/shared/client/ClientEvents.ts");
let GameGateway = class GameGateway {
    async handleConnection(client, ...args) {
    }
    onPing(client) {
        client.emit(ServerEvents_1.ServerEvents.Pong, {
            message: 'pong',
        });
    }
    onLobbyCreate(client) {
        return {
            event: ServerEvents_1.ServerEvents.GameMessage,
            data: {
                color: 'green',
                message: 'Lobby created',
            },
        };
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)(ClientEvents_1.ClientEvents.Ping),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onPing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(ClientEvents_1.ClientEvents.LobbyCreate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof websockets_1.WsResponse !== "undefined" && websockets_1.WsResponse) === "function" ? _c : Object)
], GameGateway.prototype, "onLobbyCreate", null);
exports.GameGateway = GameGateway = __decorate([
    (0, common_1.UsePipes)(new validation_pipe_1.WsValidationPipe()),
    (0, websockets_1.WebSocketGateway)({ namespace: 'game' })
], GameGateway);


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
    ClientEvents["LobbyCreate"] = "lobby.create";
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