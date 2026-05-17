from settings.config import *

class ProductDatabase():
    def __init__(self, database):
        self.database = database

    async def create_product(self, user_id, product_id, files_urls, text, statuses, price):#Метод создания поста 
        await self.database.create("INSERT INTO products (product_id, user_id, files_types, text, product_statuses, price) VALUES (%s, %s, %s, %s, %s, %s)", product_id, user_id, files_urls, text, statuses, price)#Добавляем новый пост в таблицу products

    async def get_detailed_product_info(self, product_id):
        return await self.database.get_data("""
            SELECT * FROM products
            WHERE product_id = %s
        """, product_id, fetchall=False)

    async def get_user_products(self, user_id, limit=MAX_GET_PRODUCTS, offset=0):
        return await self.database.get_data("""
            SELECT p.product_id, p.files_types, p.text, COUNT(l.product_id) AS likes 
            FROM products AS p
            LEFT JOIN products_likes AS l ON l.product_id = p.product_id
            WHERE p.user_id = %s AND p.archive = 0
            GROUP BY p.product_id
            ORDER BY p.created DESC
            LIMIT %s OFFSET %s
        """, user_id, limit, offset, fetchall=True)
    
    async def get_latest_products(self, user_id, limit=MAX_GET_PRODUCTS):#Функция необходимая для генерации ленты, получаем рандомные посты преимущественно выложенные недавно
        return await self.database.get_data("""
            SELECT p.*, u.name, u.nick_name, u.photo_url, COUNT(l.product_id) AS likes
            FROM products AS p
            JOIN users AS u ON p.user_id = u.id
            LEFT JOIN products_likes AS l ON l.product_id = p.product_id
            WHERE NOT p.user_id = %s AND archive = 0
            GROUP BY p.product_id
            ORDER BY created DESC
            LIMIT %s
        """, -1, limit, fetchall=True)

    async def remove_product(self, user_id, product_id):
        await self.database.create("""DELETE FROM products WHERE product_id = %s AND user_id = %s""", product_id, user_id)

    async def set_archive_product(self, user_id, product_id):
        await self.database.create("UPDATE products SET archive = NOT archive WHERE user_id = %s AND product_id = %s", user_id, product_id)

    async def get_product_files(self, product_id, user_id):
        return (await self.database.get_data("""SELECT files_types
                                      FROM products
                                      WHERE product_id=%s AND user_id=%s""", product_id, user_id))["files_types"]

    async def get_archive_products(self, user_id):
        return await self.database.get_data("""
            SELECT product_id, files_types, text FROM products
            WHERE user_id = %s AND archive = 1
            ORDER BY created DESC
        """, user_id, fetchall=True)
    
    async def search_products(self, search_text, limit=MAX_GET_PRODUCTS):
        return await self.database.get_data("""SELECT * FROM products
                                            WHERE text LIKE CONCAT('%%', %s, '%%') OR product_statuses LIKE CONCAT('%%', %s, '%%')
                                            LIMIT %s
                                            """, search_text, search_text, limit, fetchall=True)