from settings.config import *

class LikeDatabase():
    def __init__(self, database):
        self.database = database

    async def add_like(self, *args):#добавление на пост лайка[post_id, user_id]
        await self.database.create("INSERT INTO posts_likes (post_id, user_id) VALUES (%s, %s)", *args)

    async def get_post_likes(self, *args):#Функция для получения количества лайков на посте
        return await self.database.get_data("SELECT COUNT(*) FROM posts_likes WHERE post_id=%s", *args)
    
    async def get_post_user_like(self, *args):#Функция для получения, поставил ли пользователь на пост свой лайк
        return await self.database.get_data("SELECT * FROM posts_likes WHERE post_id=%s AND user_id=%s", *args)

    async def remove_like(self, *args):#Функция удаления лайка с поста
        await self.database.create("DELETE FROM posts_likes WHERE post_id=%s AND user_id=%s", *args)

    async def add_product_like(self, *args):#добавление на карточку товара лайка[post_id, user_id]
        await self.database.create("INSERT INTO products_likes (product_id, user_id) VALUES (%s, %s)", *args)

    async def remove_product_like(self, *args):#Функция удаления лайка с карточки товара
        await self.database.create("DELETE FROM products_likes WHERE product_id=%s AND user_id=%s", *args)

    async def get_product_user_like(self, *args):#Функция для получения, поставил ли пользователь на пост свой лайк
        return await self.database.get_data("SELECT * FROM products_likes WHERE product_id=%s AND user_id=%s", *args)

    async def get_user_liked_products(self, user_id):
        return await self.database.get_data("SELECT * FROM products_likes WHERE user_id=%s", int(user_id))
    
    async def get_liked_posts(self, user_id, limit=MAX_GET_POSTS, offset=0):
        return await self.database.get_data("""
                            SELECT p.*, u.name, u.nick_name, u.photo_url, COUNT(pl.post_id) AS likes
                            FROM posts AS p
                            JOIN posts_likes AS pl ON pl.post_id = p.post_id
                            JOIN users AS u ON u.id = p.user_id
                            WHERE pl.user_id = %s
                            GROUP BY p.post_id
                            ORDER BY pl.created DESC
                            LIMIT %s OFFSET %s       
                            """, int(user_id), int(limit), int(offset), fetchall=True)
    
    async def get_liked_products(self, user_id, limit=MAX_GET_POSTS, offset=0):
        return await self.database.get_data("""
                            SELECT p.*, u.name, u.nick_name, u.photo_url, COUNT(pl.product_id) AS likes
                            FROM products AS p
                            JOIN products_likes AS pl ON pl.product_id = p.product_id
                            JOIN users AS u ON u.id = p.user_id
                            WHERE pl.user_id = %s
                            GROUP BY p.product_id
                            ORDER BY pl.created DESC
                            LIMIT %s OFFSET %s       
                            """, int(user_id), int(limit), int(offset), fetchall=True)
    
    async def get_product_likes(self, *args):#Функция для получения количества лайков на карточке товара
        return await self.database.get_data("SELECT COUNT(*) FROM products_likes WHERE product_id=%s", *args)