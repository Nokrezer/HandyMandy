from quart import Quart
from quart_rate_limiter import RateLimiter, RateLimit

from datetime import timedelta

import asyncio
#Hypercorn - для запуска сервера с ssl сертификатом
from hypercorn.config import Config
from hypercorn.asyncio import serve

#Модули проекта

#сервисы(бизнес-логика)
from services.token_service import TokenService
from services.crypt_service import CryptService
from services.file_storage_service import FileStorageService
from services.auth_service import AuthService
from services.like_service import LikeService
from services.post_service import PostService
from services.subscribe_service import SubscribeService
from services.user_service import UserService
from services.product_service import ProductService
from services.log_service import LogService
#Сервис мессенджера
from services.messenger_service import MessengerService

#БД
from clients.database.database import Database
from clients.database.like_database import LikeDatabase
from clients.database.post_database import PostDatabase
from clients.database.subscribe_database import SubscribeDatabase
from clients.database.token_database import TokenDatabase
from clients.database.user_database import UserDatabase
from clients.database.product_database import ProductDatabase
from clients.database.log_database import LogDatabase
from clients.database.messenger_database import MessengerDatabase

#Контроллеры(http запросы)
from controllers.api.auth_controller import AuthController
from controllers.api.api_controller import ApiController
from controllers.web_controller import WebController
from controllers.static_controller import StaticController
#Контроллеры мессенджера
from controllers.messenger_controller import MessengerController
from controllers.messenger_auth_controller import MessengerAuthController

#Конфиг и http пути
from settings.routes import Routes
from settings.config import *

from settings.messenger_routes import MessengerRoutes

#ядро мессенджера
from starter.messenger_core import MessengerCore, MessengerRun

from starter.core import *

import sys

class Runner():
    def __init__(self):
        self.standart_limit = RateLimit(RATE_LIMIT, timedelta(minutes=RATE_LIMIT_IN_MINUTE))
        #Регистрация quart приложения
        self.quart_app = Quart(__name__)
        RateLimiter(
            self.quart_app,
            default_limits=[
                self.standart_limit
            ]
        )

        #DATABASE
        self.database = Database()
        self.like_database = LikeDatabase(self.database)
        self.post_database = PostDatabase(self.database)
        self.subscribe_database = SubscribeDatabase(self.database)
        self.token_database = TokenDatabase(self.database)
        self.user_database = UserDatabase(self.database)
        self.product_database = ProductDatabase(self.database)
        self.log_database = LogDatabase(self.database)
        #БД мессенджера
        self.messenger_database = MessengerDatabase(self.database)

        #Сервисы(бизнес-логика)
        self.token_service = TokenService(token_database=self.token_database)
        self.crypt_service = CryptService()
        self.file_storage_service = FileStorageService()
        self.auth_service = AuthService(token_service=self.token_service, 
                                        crypt_service=self.crypt_service,
                                        user_database=self.user_database)
        self.like_service = LikeService(like_database=self.like_database)
        self.subscribe_service = SubscribeService(subscribe_database=self.subscribe_database)
        self.user_service = UserService(user_database=self.user_database, file_storage_service=self.file_storage_service, crypt_service=self.crypt_service)
        self.post_service = PostService(post_database=self.post_database, file_storage_service=self.file_storage_service)
        self.product_service = ProductService(product_database=self.product_database, file_storage_service=self.file_storage_service)
        self.log_service = LogService(log_database=self.log_database, crypt_service=self.crypt_service)
        #Сервис мессенджера
        self.messenger_service = MessengerService(crypt_service=self.crypt_service, messenger_database=self.messenger_database)

        #WEB/STATIC контроллеры
        self.web_controller = WebController()
        self.static_controller = StaticController()

        #USER API
        self.api_controller = ApiController(token_service=self.token_service, 
                                            file_storage_service=self.file_storage_service,
                                            user_service=self.user_service, 
                                            subscribe_service=self.subscribe_service,
                                            post_service=self.post_service,
                                            like_service=self.like_service,
                                            product_service=self.product_service)
        #AUTH API
        self.auth_controller = AuthController(token_service=self.token_service,
                                              auth_service=self.auth_service)
        #Контроллеры мессенджера
        self.messenger_controller = MessengerController(messenger_service=self.messenger_service)
        self.messenger_auth_controller = MessengerAuthController(token_service=self.token_service)

        #HTTP пути
        self.routes = Routes(api_controller=self.api_controller, web_controller=self.web_controller,
                            auth_controller=self.auth_controller, static_controller=self.static_controller)

        self.setting_headers = SettingHeaders()
        self.server_routes = ServerRoutes(self.routes, self.quart_app)
        #Работа с поступающими запросами к серверу
        self.server_core = ServerCore(quart_app=self.quart_app, database=self.database,
                                          server_routes=self.server_routes, setting_headers=self.setting_headers,
                                          log_service=self.log_service, auth_controller=self.auth_controller)
        
        self.messenger_routes = MessengerRoutes(messenger_controller=self.messenger_controller,
                                                messenger_auth_controller=self.messenger_auth_controller)
        self.messenger_core = MessengerCore(token_service=self.token_service,
                                            routes=self.messenger_routes,
                                            messenger_database=self.messenger_database
                                            )
        self.messenger_run = MessengerRun(self.messenger_core)

    async def run_hypercorn(self):#Функция для запуска сервера с ssl сертификатом
        self.server_core.init()

        config = Config()
        config.bind = [f"{SERVER_HOST}:{SERVER_PORT}"]#хост и порт
        config.certfile = SSL_CERTFILE  # путь к сертификату
        config.keyfile = SSL_CERTKEY    # путь к ключу

        await serve(self.quart_app, config)

    async def run_server(self):#Функция, которая управляет запуском сервера API и мессенджера
        try:
            await asyncio.gather(self.messenger_run.init(), self.run_hypercorn(), return_exceptions=True)
        except:
            sys.exit()
            return
            
    def run(self):#Функция для запуска сервера без ssl сертификата
        self.server_core.init()

        self.quart_app.run(host=SERVER_HOST, 
                            port=SERVER_PORT)
        
def main():
    runner = Runner()
    asyncio.run(runner.run_server())
    # asyncio.run(runner.run())

if __name__ == "__main__":
    main()