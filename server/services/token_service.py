import jwt
import hashlib
import os
import uuid

from datetime import datetime, timezone, timedelta

from shared.exceptions import *
from settings.config import *

class TokenService():
    def __init__(self, token_database):
        self.token_database = token_database

    async def generate_access_token(self, user_id):
        now_time = datetime.now(timezone.utc)
        token_data = {"userId": user_id,
                    "exp": now_time + timedelta(minutes=ACCESS_TOKEN_MINUTES),
                    "type": "access"
            }
        
        return jwt.encode(token_data, os.getenv("TOKENS_KEY"), algorithm="HS256")

    async def generate(self, user_id):#Функция для генерации access и refresh токенов
        access_token = await self.generate_access_token(user_id)#access token - токен доступа

        now_time = datetime.now(timezone.utc)
        refresh_token_expires = now_time + timedelta(days=REFRESH_TOKEN_DAYS)#Срок истечения refresh токена
        token_data = {"userId": user_id,
                    "exp": refresh_token_expires,
                    "type": "refresh",
                    "id": uuid.uuid4().hex
        }
        refresh_token = jwt.encode(token_data, os.getenv("TOKENS_KEY"), algorithm="HS256")#refresh token - токен обновления

        refresh_token_hash = hashlib.sha256(refresh_token.encode()).digest()#Создаём хэш токена
        await self.token_database.save_token(refresh_token_hash, 0, user_id, refresh_token_expires, token_data["id"])#Сохраняем в БД рефреш токен

        return access_token, refresh_token
    
    def generate_file_token(self):#Функция для генерации временных токенов (2-5 минут), нужна чтобы иметь доступ к файлам
        now_time = datetime.now(timezone.utc)
        token_data = {
                    "exp": now_time + timedelta(minutes=2),
                    "type": "tmp_file"
            }
        tmp_token = jwt.encode(token_data, os.getenv("TOKENS_KEY"), algorithm="HS256")#access token - токен доступа

        return tmp_token
    
    async def update_access_token(self, refresh_token):
        self.verify_token(refresh_token)#Проверяем refresh token по сроку годности
        #дополнительная проверка, существует ли refresh токен в БД
        await self.verify_refresh_token(refresh_token)

        token_data = jwt.decode(refresh_token, os.getenv("TOKENS_KEY"), algorithms=["HS256"])
        return await self.generate_access_token(token_data["userId"])#Возвращаем access токен
    
    # async def update_tokens(self, token):#Обновление токенов
    #     token_data = jwt.decode(token, os.getenv("TOKENS_KEY"), algorithms=["HS256"])
    #     token_hash = hashlib.sha256(token.encode()).digest()
        
    #     tokenDB = await self.token_database.get_token(token_data["userId"], token_data["id"])#Токен пользователя из БД

        # if tokenDB == None:#Если нету токена в БД
        #     raise TokenNotFound("Токен не найден")
            
        # elif tokenDB["revoked"] == 1:#Если токен больше не активный
        #     raise TokenOutdated("Токен устарел")

        # elif token_hash != tokenDB["hash"]:#Сверяем хэши токенов, которые отправил пользватель и из базы данныхе
        #     raise IncorrectToken("Неверный токен")
            
        # access_token, refresh_token = await self.generate(token_data["userId"])
        # await self.token_database.remove_revoked_user_tokens(token_data["userId"])
        
        # return access_token, refresh_token
    
    def decrypt_token(self, token):
        return jwt.decode(token, os.getenv("TOKENS_KEY"), algorithms=["HS256"])

    async def verify_refresh_token(self, refresh_token):#Проверка refresh токена, содержится ли он в БД
        token_data = jwt.decode(refresh_token, os.getenv("TOKENS_KEY"), algorithms=["HS256"])
        token_hash = hashlib.sha256(refresh_token.encode()).digest()
        token_from_db = await self.token_database.get_token(token_data["userId"], token_data["id"])#Токен пользователя из БД

        if token_from_db == None:#Если нету токена в БД
            raise TokenNotFound("Токен не найден")
        
        elif token_hash != token_from_db["hash"]:#Сверяем хэши токенов, которые отправил пользватель и из базы данныхе
            raise IncorrectToken("Неверный токен")
        
        elif token_from_db["revoked"] == 1:#Если токен больше не активный
            raise TokenOutdated("Токен устарел")

    def verify_token(self, token):#Проверка токена по времени
        token_data = self.decrypt_token(token)
        now_time = datetime.now(timezone.utc).timestamp()
        
        if now_time > token_data["exp"]:
            raise TokenOutdated("Срок действия токена истек")
        
    def verify_file_token(self, token):
        token_data = self.decrypt_token(token)
        if token_data["type"] != "tmp_file":
                raise NotValidToken("Неверный токен для доступа к медиа")