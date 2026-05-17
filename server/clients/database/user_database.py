class UserDatabase():
    def __init__(self, database):
        self.database = database

    async def create_user(self, *args):#Создание пользователя в БД. Для создания передаём минимальную информацию
        await self.database.create("""INSERT INTO 
        users (name, nick_name, city, password_hash, consent_version, salt, email_hash, photo_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""", *args, "avatars/profile.svg")
    
    async def get_public_user_data(self, *args):#Получение публичной информации пользователя
        return await self.database.get_data("SELECT id, name, nick_name, bio, city, registration_date, photo_url, statuses FROM users WHERE id = %s;", args)

    async def get_user_id(self, nick_name):#Получение id пользователя по его нику
        return await self.database.get_data("SELECT id FROM users WHERE nick_name = %s", nick_name)

    async def auth_user(self, *args):#В качестве логина используем почту или nick_name пользователя
        return await self.database.get_data("SELECT id, password_hash, email_hash, salt FROM users WHERE email_hash = %s OR nick_name = %s;", *args)

    async def set_profile_photo(self, *args):#Передаём ссылку на фото и user id
        await self.database.create("UPDATE users SET photo_url=%s WHERE id=%s", *args)

    async def get_user_photo_path(self, user_id):
        return (await self.database.get_data("SELECT photo_url FROM users WHERE id=%s", user_id))["photo_url"]

    async def set_user_data(self, name, nick_name, bio, city, id):
        await self.database.create("""UPDATE users SET name = COALESCE(%s, name),
                            nick_name = COALESCE(%s, nick_name),
                            bio = COALESCE(%s, bio),
                            city = COALESCE(%s, city)
                            WHERE id = %s""", name, nick_name, bio, city, id)
    
    async def set_password(self, *args):
        await self.database.create("UPDATE users SET password_hash = %s, salt = %s WHERE id = %s", *args)
    
    async def set_email(self, *args):
        await self.database.create("UPDATE users SET email_hash = %s WHERE id = %s", *args)