from settings.config import *

class LikeService():
    def __init__(self, like_database):
        self.like_database = like_database

    async def set_post_like(self, post_id, user_id):
        is_user_liked_post = await self.like_database.get_post_user_like(post_id, user_id)

        if is_user_liked_post == None:
            await self.like_database.add_like(post_id, user_id)
        
        else:
            await self.like_database.remove_like(post_id, user_id)
    
    async def get_post_likes(self, post_id):
        return await self.like_database.get_post_likes(post_id)
    
    async def set_product_like(self, product_id, user_id):
        is_user_liked_product = await self.like_database.get_product_user_like(product_id, user_id)

        if is_user_liked_product == None:
            await self.like_database.add_product_like(product_id, user_id)
        
        else:
            await self.like_database.remove_product_like(product_id, user_id)

    async def get_user_liked_products(self, user_id):
        return await self.like_database.get_user_liked_products(user_id)
    
    async def get_liked_posts(self, user_id, limit, offset):
        return await self.like_database.get_liked_posts(user_id, limit, offset)
    
    async def get_liked_products(self, user_id, limit, offset):
        return await self.like_database.get_liked_products(user_id, limit, offset)
    
    async def get_product_likes(self, product_id):
        return await self.like_database.get_product_likes(product_id)