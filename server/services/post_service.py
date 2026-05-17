import uuid
import ast

from shared.exceptions import *
from settings.config import *

class PostService():
    def __init__(self, post_database, file_storage_service):
        self.post_database = post_database
        self.file_storage_service = file_storage_service

    async def get_user_posts(self, user_id, limit, offset=0):
        return await self.post_database.get_user_posts(int(user_id), int(limit), int(offset))
 
    async def create_post(self, text, files, user_id):
        files_urls = await self.file_storage_service.save_user_post(files)
        await self.post_database.create_post(text=text, user_id=user_id, post_id=uuid.uuid4().hex, files_urls=str(files_urls))
    
    async def get_latest_posts(self, user_id):
        return await self.post_database.get_latest_posts(user_id)
    
    async def remove_post(self, user_id, post_id):
        files = ast.literal_eval(await self.post_database.get_post_files(post_id, user_id))#Получаем файлы из поста, для их удаления
        
        for file in files:
            try:
                self.file_storage_service.remove_file(USERS_DATA_DIR + "posts/" + files[file] + "/" + file)
            except:
                pass
            
        await self.post_database.remove_post(user_id, post_id)

    async def get_post_owner_id(self, post_id):
        return await self.post_database.get_post_owner_id(post_id)
    
    # async def get_user_posts_offset(self, offset):
    #     return await self.post_database.get_user_posts_offset(offset)