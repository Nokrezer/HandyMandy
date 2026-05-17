from quart import send_from_directory

from shared.exceptions import *
from settings.config import *

class WebController():
    async def main_page(self, **args):#Главная страница
        return await send_from_directory(SITE_DIRECTORY + HTML_DIRECTORY, "index.html"), 200

    async def login_page(self):#Страница входа в аккаунт
        return await send_from_directory(SITE_DIRECTORY + HTML_DIRECTORY, "login.html"), 200
    
    async def registration_page(self):#Страница входа в аккаунт
        return await send_from_directory(SITE_DIRECTORY + HTML_DIRECTORY, "registration.html"), 200

    async def user_page(self, nick_name):#Страничка публичного пользователя
        return await send_from_directory(SITE_DIRECTORY + HTML_DIRECTORY, "profile.html"), 200
    
    