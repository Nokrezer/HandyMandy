from quart import Quart, request
from settings.config import *

import sys

class ServerCore():
    def __init__(self, quart_app, database, server_routes, log_service, auth_controller, setting_headers):
        self.quart_app = quart_app
        self.database = database
        self.server_routes = server_routes
        self.log_service = log_service
        self.setting_headers = setting_headers
        self.auth_controller = auth_controller

    def init(self):#Регистрация путей к методам сервера
        self.server_routes.register()

        @self.quart_app.before_serving#До запуска сервера
        async def before_serving():
            await self.database.init()#Инициализируем подключение к БД
        
        @self.quart_app.before_request#До ЛЮБОГО запроса
        async def before_request():
            self.auth_controller.before_request()

        
        @self.quart_app.after_serving#После завершения работы сервера
        async def after_serving():
            self.database.database_connection.close()#Завершаем подключение к sql
            sys.exit()

        @self.quart_app.after_request
        async def after_request(response):
            self.setting_headers.set_headers(response)
            
            if request.path.startswith(USER_API_PREFIX) or request.path.startswith(AUTH_API_PREFIX):
                try:
                    await self.log_service.add_log(user_ip=request.remote_addr, action=request.path, user_id=request.user_id)
                except:
                    pass

            return response

class SettingHeaders():#класс для настройки заголовков
    def set_headers(self, response):
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        
class ServerRoutes():#Класс регистрации путей к серверу
    def __init__(self, routes, quart_app):
        self.routes = routes
        self.quart_app = quart_app

    def register(self):
        for route_data in self.routes.ROUTES:
            self.quart_app.add_url_rule(
                    route_data.url_route,
                    view_func=route_data.func,
                    methods=route_data.methods
                )