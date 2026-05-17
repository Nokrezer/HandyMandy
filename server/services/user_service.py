from shared.exceptions import *
from settings.config import *

class UserService:
    def __init__(self, user_database, file_storage_service, crypt_service):
        self.user_database = user_database
        self.file_storage_service = file_storage_service
        self.crypt_service = crypt_service
    
    async def set_user_data(self, data, user_id):
        edit_data = []

        for i in ["name","nick_name","bio","city"]:
            param = data.get(i, None)
            
            if (i == "name" or i == "nick_name") and len(param) < 3:
                param = None

            edit_data.append(param)
            
        await self.user_database.set_user_data(*edit_data, user_id)
    
    async def get_public_user_data(self, data):
        user_id = None
        
        if "nickName" in data:
            user_raw_id = await self.user_database.get_user_id(data["nickName"])

            if user_raw_id == None:
                raise UserNotExist("Пользователя с таким никнеймом не существует")

            user_id = user_raw_id["id"]
        elif "id" in data:
            user_id = data["id"]
        
        return await self.user_database.get_public_user_data(user_id)
    
    async def get_private_user_data(self, user_id):
        return await self.user_database.get_public_user_data(user_id)
    
    async def set_profile_photo(self, photo, user_id):
        last_photo_path = await self.user_database.get_user_photo_path(user_id)#Получаем путь к посленей аватарке
        
        try:
            self.file_storage_service.remove_file(USERS_DATA_DIR + last_photo_path)
        except:
            pass

        path = await self.file_storage_service.save_user_avatar(photo=photo)#Сохраняем аватарку и получаем ее путь
        await self.user_database.set_profile_photo(path, user_id)#Сохраняем в бд аватарку

    async def set_email(self, email, user_id):
        email_hash = self.crypt_service.email_hash(email)
        await self.user_database.set_email(email_hash, user_id)

    async def get_user_id(self, nick_name):
        return await self.user_database.get_user_id(nick_name)

    async def set_password(self, password, user_id):
        password_hash, salt = self.crypt_service.reset_password(password)#Вернет хэш нового пароля и его соль
        await self.user_database.set_password(password_hash, salt, user_id)
