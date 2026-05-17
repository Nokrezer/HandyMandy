import uuid
import ast

from shared.exceptions import *
from settings.config import *

class ProductService():
    def __init__(self, product_database, file_storage_service):
        self.product_database = product_database
        self.file_storage_service = file_storage_service

    async def get_user_products(self, user_id, limit, offset):
        return await self.product_database.get_user_products(int(user_id), int(limit), int(offset))
    
    async def get_detailed_product_info(self, product_id):
        return await self.product_database.get_detailed_product_info(product_id)
 
    async def create_product(self, text, files, user_id, statuses, price):
        if text == None or len(files) == 0:
            raise NullDataProduct("Описание и фотографии не должны быть пустыми")
        
        files_urls = await self.file_storage_service.save_user_product(files)
        await self.product_database.create_product(text=text, user_id=user_id, statuses=statuses, product_id=uuid.uuid4().hex, files_urls=str(files_urls), price=price)
    
    async def get_latest_products(self, user_id):#Функция для генерации ленты, получаем последние выложившие карточки товаров
        return await self.product_database.get_latest_products(user_id)
    
    async def remove_product(self, user_id, product_id):
        files = ast.literal_eval(await self.product_database.get_product_files(product_id, user_id))#Получаем файлы из поста, для их удаления
        
        for file in files:
            try:
                self.file_storage_service.remove_file(USERS_DATA_DIR + "products/" + files[file] + "/" + file)
            except:
                pass
            
        await self.product_database.remove_product(user_id, product_id)
    
    async def set_archive_product(self, user_id, product_id):
        await self.product_database.set_archive_product(user_id, product_id)

    async def get_archive_products(self, user_id):#Локальное получение архивных карточек товаров
        return await self.product_database.get_archive_products(user_id)
    
    async def search_products(self, search_text):
        return await self.product_database.search_products(search_text)