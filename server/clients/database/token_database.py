class TokenDatabase():
    def __init__(self, database):
        self.database = database
    
    async def save_token(self, *args):#Сохраняем в БД refresh token пользователя
        return await self.database.create("INSERT INTO refresh_tokens (hash, revoked, user_id, expires, id) VALUES (%s, %s, %s, %s, %s)", *args)

    async def get_token(self, *args):#Для получения старого refresh токена
        return await self.database.get_data("SELECT * FROM refresh_tokens WHERE user_id = %s AND id = %s", *args)#Получаем данные старого токена

        # if token_data != None and token_data["revoked"] == 0:#Если токен есть в БД, меняем параметр revoked на 1(true)
            # await self.database.create("UPDATE refresh_tokens SET revoked = 1 WHERE user_id = %s AND id = %s", *args)

        # return token_data
    
    async def remove_revoked_user_tokens(self, user_id):
        await self.database.create("DELETE FROM refresh_tokens WHERE revoked=1 AND user_id=%s", user_id)