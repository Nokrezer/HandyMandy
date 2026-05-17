from shared.exceptions import *

class SubscribeService():
    def __init__(self, subscribe_database):
        self.subscribe_database = subscribe_database
    
    async def get_subscribe(self, user_id, target_user_id):
        return await self.subscribe_database.get_subscribe(user_id, target_user_id)

    async def set_subscribe(self, user_id, subscribe_on):
        if user_id == int(subscribe_on):
            raise SubcribeOnYourSelf("Вы не можете подписаться на себя")
        
        #Получаем состояние, подписан ли пользователь на другого пользователя
        #Если не подписан - вернет None
        is_user_subscribed = await self.subscribe_database.get_subscribe(user_id, subscribe_on)

        if is_user_subscribed == None:#Если ничего не найдено, подписываемся на другого пользователя
            await self.subscribe_database.add_subscribe(user_id, subscribe_on)
        else:#Если подписка была, отписываемся
            await self.subscribe_database.remove_subscribe(user_id, subscribe_on)

    async def get_user_followers(self, user_id):
        followers = await self.subscribe_database.get_user_followers(user_id)
        
        if followers == None:
            return {}
        
        return followers
