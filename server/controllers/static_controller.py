from quart import send_from_directory

from settings.config import *

class StaticController():
    #Стилистика, для сайта
    async def css(self, file_name):
        return await send_from_directory(SITE_DIRECTORY + CSS_DIRECTORY, f"{file_name}.css", mimetype='text/css'), 200
    
    #JavaScript
    async def js(self, file_name, path=''):
        return await send_from_directory(SITE_DIRECTORY + JS_DIRECTORY + path, f"{file_name}.js", mimetype='text/javascript'), 200

    #React(Для тестов)
    async def jsx(self, file_name, path=''):
        return await send_from_directory(SITE_DIRECTORY + JSX_DIRECTORY + path, f"{file_name}.js", mimetype='text/javascript'), 200
    
    async def img(self, file_name, path=''):
        return await send_from_directory(SITE_DIRECTORY + IMGS_DIRECTORY + path, file_name), 200
