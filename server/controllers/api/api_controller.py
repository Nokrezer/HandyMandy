from quart import request, jsonify, send_from_directory

from shared.exceptions import *
from settings.config import *

from aiomysql import IntegrityError, OperationalError

import asyncio

class ApiController():
    def __init__(self, token_service, product_service, like_service, post_service, file_storage_service, user_service, subscribe_service):
        self.token_service = token_service
        self.post_service = post_service
        self.file_storage_service = file_storage_service
        self.user_service = user_service
        self.subscribe_service = subscribe_service
        self.like_service = like_service
        self.product_service = product_service
    
    async def set_subscribe(self):
        try:
            data = request.args
            target_user_id = data["userId"]#id пользователя, на которого подписываемся

            await self.subscribe_service.set_subscribe(request.user_id, target_user_id)
            return '', 200
        except Exception as e:
            return str(e), 401
    
    async def get_subscribe(self):#Для проверки, подписан ли пользователь на другого пользователя\
        try:
            data = request.args
            target_user_id = data["userId"]#id другого пользователя
        
            return jsonify(await self.subscribe_service.get_subscribe(request.user_id, target_user_id)), 200
        except Exception as e:
            return str(e), 401

    async def set_post_like(self):#функция добавления/удаления лайка с поста
        try:
            data = request.args
        
            await self.like_service.set_post_like(data["postId"], request.user_id)
            return '', 200

        except Exception as e:
            return str(e), 401

    async def get_post_likes(self):#Получения количества лайков на посте
        try:
            data = request.args
        
            return jsonify(await self.like_service.get_post_likes(data["postId"])), 200
        except Exception as e:
            return str(e), 401

    async def get_public_user_data(self):
        try:
            data = request.args
        
            return jsonify(await self.user_service.get_public_user_data(data))
        except UserNotExist as e:
            return str(e), 404

    async def get_private_user_data(self):
        try:
            return jsonify(await self.user_service.get_private_user_data(request.user_id))
        except Exception as e:
            return str(e), 400
    
    async def create_post(self):
        try:
            files = (await request.files).getlist("files")
            text = (await request.form).get("text")#Получаем описание к посту(если таковое есть)
        
            await self.post_service.create_post(text=text, files=files, user_id=request.user_id)
            return '', 200
        except NullDataPost as e:
            return str(e), 422
        except Exception as e:
            return str(e), 400
    
    async def get_user_posts(self):#Получение последних постов определенного пользователя ?userId=
        try:
            data = request.args
            user_id = data["userId"]
            limit = data.get("limit", MAX_GET_POSTS)
            offset = data.get("offset", 0)
        
            return jsonify(await self.post_service.get_user_posts(user_id, limit, offset)), 200
        except Exception as e:
            return str(e)
        
    # async def get_user_posts_offset(self):
    #     try:
    #         data = request.args["offset"]
            
    #     except Exception as e:
    #         return str(e), 400

    async def get_file(self, media_type, file_name):
        try:
            data = request.args
            self.token_service.verify_file_token(data["token"])
            return await send_from_directory(*self.file_storage_service.get_file(media_type, file_name)), 200
        except PermissionDenied as e:
            return str(e), 403
        except FileNotFound as e:
            return str(e), 404
        except Exception as e:
            return str(e), 400

    async def get_user_id(self):
        try:
            data = request.args
            return jsonify(await self.user_service.get_user_id(data["nickName"])), 200
        except UserNotFound as e:
            return str(e), 404
        except Exception as e:
            return str(e), 400
    
    async def set_profile_photo(self):
        try:
            photo = (await request.files).getlist("photo")
            await self.user_service.set_profile_photo(photo=photo, user_id=request.user_id)
            return '', 200
        except Exception as e:
            return str(e), 400

    async def set_user_data(self):#Метод для изменения отображаемого имени пользователя
        try:
            data = await request.form
            await self.user_service.set_user_data(data, request.user_id)
            return '', 200
        except NickNameExists as e:
            return str(e), 409
        except Exception as e:
            return str(e), 400
    
    async def set_email(self):
        try:
            email = (await request.form)["email"]
            await self.user_service.set_email(email, request.user_id)
            return '', 200
        except Exception as e:
            return str(e), 400

    async def set_password(self):
        try:
            new_password = (await request.form)["password"]
            await self.user_service.set_password(new_password, request.user_id)
            return '', 200
        except Exception as e:
            return str(e), 400

    async def remove_post(self):
        try:
            post_id = request.args["postId"] 
            await self.post_service.remove_post(request.user_id, post_id)
            return '', 200
        except PermissionDenied as e:
            return str(e), 403
        except Exception as e:
            return str(e), 400
    
    async def get_latest_posts(self):
        try:
            return jsonify(await self.post_service.get_latest_posts(request.user_id)), 200
        except FeedEnd as e:
            return str(e), 206
        except Exception as e:
            return str(e), 400
        
    async def get_post_owner_id(self):
        try:
            post_id = request.args["postId"]
            return await self.post_service.get_post_owner_id(post_id), 200
        except Exception as e:
            return str(e), 400
    
    async def get_user_followers(self):
        try:
            user_id = request.args["userId"]
            return jsonify(await self.subscribe_service.get_user_followers(user_id)), 200
        except Exception as e:
            return str(e), 400
        
    async def get_user_products(self):
        try:
            data = request.args
            user_id = data["userId"]
            limit = data.get("limit", MAX_GET_PRODUCTS)
            offset = data.get("offset", 0)
            
            return jsonify(await self.product_service.get_user_products(user_id, limit, offset)), 200
        except Exception as e:
            return str(e), 400
        
    async def get_detailed_product_info(self):
        try:
            product_id = request.args["productId"]
            return await self.product_service.get_detailed_product_info(product_id)
        except Exception as e:
            return str(e), 400
        
    async def create_product(self):
        try:
            files = (await request.files).getlist("files", None)
            text = (await request.form).get("text", None)
            statuses = (await request.form).get("statuses", None)
            price = (await request.form).get("price", None)
            
            await self.product_service.create_product(text=text, price=price, files=files, statuses=statuses, user_id=request.user_id)
            return '', 200
        except NullDataProduct as e:
            return str(e), 422
        except Exception as e:
            return str(e), 400
        
    async def remove_product(self):
        try:
            product_id = request.args["productId"]
            await self.product_service.remove_product(request.user_id, product_id)
            return '', 200
        except Exception as e:
            return str(e), 400
    
    async def set_archive_product(self):
        try:
            product_id = request.args["productId"]
            await self.product_service.set_archive_product(request.user_id, product_id)
            return '', 200
        except Exception as e:
            return str(e), 400
        
    async def get_archive_products(self):
        try:
            return jsonify(await self.product_service.get_archive_products(request.user_id)), 200
        except Exception as e:
            return str(e), 400
        
    async def get_latest_products(self):
        try:
            t = await self.product_service.get_latest_products(request.user_id)
            return jsonify(t), 200
        except Exception as e:
            return str(e), 400
        
    async def get_user_liked_products(self):
        try:
            return jsonify(await self.like_service.get_user_liked_products(request.user_id)), 200
        except Exception as e:
            return str(e), 400
        
    async def set_product_like(self):
        try:
            product_id = request.args["productId"]
            await self.like_service.set_product_like(product_id, request.user_id)
            return '', 200
        except Exception as e:
            return str(e), 400
        
    async def search_products(self):
        try:
            search_text = request.args["search"]
            return jsonify(await self.product_service.search_products(search_text)), 200
        except Exception as e:
            return str(e), 400
        
    async def get_liked_posts(self):
        try:
            limit = request.args.get("limit", MAX_GET_POSTS)
            offset = request.args.get("offset", 0)

            return jsonify(await self.like_service.get_liked_posts(request.user_id, limit, offset)), 200
        except Exception as e:
            return str(e), 400
        
    async def get_liked_products(self):
        try:
            limit = request.args.get("limit", MAX_GET_POSTS)
            offset = request.args.get("offset", 0)

            return jsonify(await self.like_service.get_liked_products(request.user_id, limit, offset)), 200
        except Exception as e:
            return str(e), 400
    
    async def get_product_likes(self):#Получения количества лайков на карточке товара
        try:
            data = request.args
        
            return jsonify(await self.like_service.get_product_likes(data["productId"])), 200
        except Exception as e:
            return str(e), 400