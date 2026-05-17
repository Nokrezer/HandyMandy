import aiofiles
import uuid

from shared.exceptions import *
from settings.config import *

import os

class FileStorageService():
    async def save_user_avatar(self, photo):
        file = photo[0]
        file_name = f"{uuid.uuid4().hex}.{file.mimetype.split("/")[1]}"#Имя файла

        save_directory = USERS_AVATAR_DIR + file_name
        file_bytes = await file.read()#Байт содержимое файла

        async with aiofiles.open(save_directory, "wb") as f:
                await f.write(file_bytes)#Сохраняем файлы под случайным именем в папке
        
        return "avatars/" + file_name#Возвращаем путь, где лежит аватарка
    
    async def __save_user_files(self, files, folder):
        files_data = {}

        url = None
        save_directory = None
        media_type = None
        
        for file in files:
            file.seek(0)
            file_bytes = file.read()#Байт содержимое файла
            file_type = file.mimetype#Тип файла

            if "image" in file_type:
                # media_type = "photo"
                media_type = "images"
                file_name = f"{uuid.uuid4().hex}.{file.mimetype.split("/")[1]}"#Имя файла
                save_directory = folder + "images/" + file_name#Путь до изображения
                
            elif "mp4" in file_type:
                media_type = "videos"
                file_name = f"{uuid.uuid4().hex}.mp4"#Имя файла
                save_directory = folder + "videos/" + file_name#Путь до видео
            
            else:
                media_type = "files"
                file_name = f"{uuid.uuid4().hex}.{file.filename.split(".")[1]}"#Имя файла
                save_directory = folder + "files/" + file_name#Путь до файла
                
            files_data[file_name] = media_type
            
            file.seek(0)

            if file_bytes.startswith(b'\r\n'):
                file_bytes = file_bytes[2:]  # Удаляем первые 2 байта
            elif file_bytes.startswith(b'\n'):
                file_bytes = file_bytes[1:]   # Удаляем первый байт

            async with aiofiles.open(save_directory, "wb") as f:
                await f.write(file_bytes)#Сохраняем файлы под случайным именем в папке
            
            file.seek(0)
            
        return files_data
    
    def remove_file(self, path):
        os.remove(path)

    async def save_user_product(self, files):
        return await self.__save_user_files(files, USERS_DATA_DIR + "products/")

    async def save_user_post(self, files):
        files_data = await self.__save_user_files(files, USERS_DATA_DIR + "posts/")
        return files_data
        
    def exist_file(self, media_type, file_name):#Проверка, существует ли файл и можно ли давать к нему доступ
        real_path = os.path.realpath(USERS_DATA_DIR + media_type + "/" + file_name)
        if USERS_DATA_DIR not in real_path:
            raise PermissionDenied("Доступ запрещён")
            
        if not os.path.isfile(USERS_DATA_DIR + media_type + "/" + file_name):
            raise FileNotFound("Файл не найден")

        return True

    def get_file(self, media_type, file_name):
        self.exist_file(media_type=media_type, file_name=file_name)
        return USERS_DATA_DIR + media_type, file_name