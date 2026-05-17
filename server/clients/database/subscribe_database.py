class SubscribeDatabase():
    def __init__(self, database):
        self.database = database

    async def add_subscribe(self, *args):#Функция подписки/отписки на другого пользователя
        await self.database.create("INSERT INTO subscriptions (user_id, subscribed_on) VALUES (%s, %s)", *args)
    
    async def remove_subscribe(self, *args):
        await self.database.create("DELETE FROM subscriptions WHERE user_id=%s AND subscribed_on=%s", *args)

    async def get_subscribe(self, *args):
        return await self.database.get_data("SELECT * FROM subscriptions WHERE user_id=%s AND subscribed_on=%s", *args)#Получаем из бд, подписан ли пользователь на другого пользователя
    
    async def get_user_followers(self, user_id):
        return await self.database.get_data("SELECT user_id FROM subscriptions WHERE subscribed_on=%s", user_id, fetchall=True)
