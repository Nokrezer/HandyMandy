from settings.config import *

class PostDatabase():
    def __init__(self, database):
        self.database = database

    async def create_post(self, user_id, post_id, files_urls, text):#Метод создания поста 
        await self.database.create("INSERT INTO posts (post_id, user_id, files_types, text) VALUES (%s, %s, %s, %s)", post_id, user_id, files_urls, text)#Добавляем новый пост в таблицу posts

    async def get_user_posts(self, user_id, limit=MAX_GET_POSTS, offset=0):
        return await self.database.get_data("""
            SELECT p.*, COUNT(l.post_id) AS likes
            FROM posts AS p
            LEFT JOIN posts_likes AS l ON l.post_id = p.post_id
            WHERE p.user_id = %s
            GROUP BY p.post_id
            ORDER BY p.created DESC
            LIMIT %s OFFSET %s
        """, user_id, int(limit), int(offset), fetchall=True)
    
    async def get_latest_posts(self, user_id, limit=MAX_GET_POSTS):#Функция необходимая для генерации ленты, получаем рандомные посты преимущественно выложенные недавно
        return await self.database.get_data("""
            SELECT p.*, u.name, u.nick_name, u.photo_url 
            FROM posts AS p
            JOIN users AS u ON p.user_id = u.id
            WHERE NOT p.user_id = %s
            ORDER BY created DESC
            LIMIT %s
        """, user_id, limit, fetchall=True)
    
    async def get_post_files(self, post_id, user_id):
        return (await self.database.get_data("""SELECT files_types
                                      FROM posts
                                      WHERE post_id=%s AND user_id=%s""", post_id, user_id))["files_types"]

    async def remove_post(self, user_id, post_id):
        await self.database.create("""DELETE FROM posts WHERE post_id = %s AND user_id = %s""", post_id, user_id)