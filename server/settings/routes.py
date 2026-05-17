# from server.user_auth import UserAuth
# from server.user_api import UserApi

from settings.config import *

class RouteData():
    def __init__(self, url_route, func, methods=["GET"], limit=0, limit_hours=0, limit_minutes=0):
        self.url_route = url_route
        self.methods = methods#POST, GET, PUT и тд
        self.func = func#Функция, которая выполняется при запросе

        #Ограничение запросов по времени
        self.limit = limit#количество запросов за время
        self.limit_hours = limit_hours#Ограничение в часах
        self.limit_minutes = limit_minutes#Ограничение в минутах

class Routes():
    def __init__(self, api_controller, web_controller, auth_controller, static_controller):
        self.web_controller = web_controller
        self.auth_controller = auth_controller
        self.api_controller = api_controller

        self.static_controller = static_controller

        self.ROUTES = [
                #AUTH API
                RouteData(AUTH_API_PREFIX + "/registration", self.auth_controller.registration, ["POST"], limit=2, limit_hours=1),
                RouteData(AUTH_API_PREFIX + "/login", self.auth_controller.login, ["POST"], limit=10, limit_minutes=2),
                RouteData(AUTH_API_PREFIX + "/updateAccessToken", self.auth_controller.update_access_token, ["POST"]),
                RouteData(AUTH_API_PREFIX + "/verifyToken", self.auth_controller.verify_token, ["GET"]),
                RouteData(AUTH_API_PREFIX + "/getTempToken", self.auth_controller.get_tmp_token, ["GET"]),
                
                #API
                #Пользователи
                RouteData(USER_API_PREFIX + "/getPublicUserData", self.api_controller.get_public_user_data, ["GET"]),
                RouteData(USER_API_PREFIX + "/getPrivateUserData", self.api_controller.get_private_user_data, ["GET"]),
                RouteData(USER_API_PREFIX + "/getUserId", self.api_controller.get_user_id, ["GET"]),
                RouteData(USER_API_PREFIX + "/setProfilePhoto", self.api_controller.set_profile_photo, ["POST"]),
                RouteData(USER_API_PREFIX + "/setUserData", self.api_controller.set_user_data, ["POST"]),
                RouteData(USER_API_PREFIX + "/setEmail", self.api_controller.set_email, ["POST"]),
                RouteData(USER_API_PREFIX + "/setPassword", self.api_controller.set_password, ["POST"]),
                #Карточки товаров
                RouteData(USER_API_PREFIX + "/createProduct", self.api_controller.create_product, ["POST"]),
                RouteData(USER_API_PREFIX + "/searchProducts", self.api_controller.search_products, ["GET"]),
                RouteData(USER_API_PREFIX + "/setProductArchive", self.api_controller.set_archive_product, ["POST"]),
                RouteData(USER_API_PREFIX + "/getArchiveProducts", self.api_controller.get_archive_products, ["GET"]),
                RouteData(USER_API_PREFIX + "/getLatestProducts", self.api_controller.get_latest_products, ["GET"]),
                RouteData(USER_API_PREFIX + "/getUserProducts", self.api_controller.get_user_products, ["GET"]),
                RouteData(USER_API_PREFIX + "/getProductInfo", self.api_controller.get_detailed_product_info, ["GET"]),
                RouteData(USER_API_PREFIX + "/removeProduct", self.api_controller.remove_product, ["DELETE"]),
                
                RouteData(USER_API_PREFIX + "/getUserPosts", self.api_controller.get_user_posts, ["GET"]),
                #Файлы
                RouteData(USER_API_PREFIX + "/get/<path:media_type>/<file_name>", self.api_controller.get_file, ["GET"]),
                #Посты
                RouteData(USER_API_PREFIX + "/createPost", self.api_controller.create_post, ["POST"]),
                RouteData(USER_API_PREFIX + "/removePost", self.api_controller.remove_post, ["DELETE"]),
                RouteData(USER_API_PREFIX + "/getPostOwnerId", self.api_controller.get_post_owner_id, ["GET"]),
                #Лайки
                RouteData(USER_API_PREFIX + "/getPostLikes", self.api_controller.get_post_likes, ["GET"]),
                RouteData(USER_API_PREFIX + "/setPostLike", self.api_controller.set_post_like, ["POST"]),
                RouteData(USER_API_PREFIX + "/getUserLikedProducts", self.api_controller.get_user_liked_products, ["GET"]),
                RouteData(USER_API_PREFIX + "/setProductLike", self.api_controller.set_product_like, ["POST"]),
                RouteData(USER_API_PREFIX + "/getLikedPosts", self.api_controller.get_liked_posts, ["GET"]),
                RouteData(USER_API_PREFIX + "/getLikedProducts", self.api_controller.get_liked_products, ["GET"]),
                RouteData(USER_API_PREFIX + "/getProductLikes", self.api_controller.get_product_likes, ["GET"]),
                #Подписки
                RouteData(USER_API_PREFIX + "/setSubscribe", self.api_controller.set_subscribe, ["POST"]),
                RouteData(USER_API_PREFIX + "/getSubscribe", self.api_controller.get_subscribe, ["GET"]),
                RouteData(USER_API_PREFIX + "/getUserFollowers", self.api_controller.get_user_followers, ["GET"]),
                #Лента рекомендаций
                RouteData(USER_API_PREFIX + "/getFeed", self.api_controller.get_latest_posts, ["GET"]),
                
                #Сайт
                RouteData("/<path:path>", self.web_controller.main_page, ["GET"]),
                RouteData("/", self.web_controller.main_page, ["GET"]),
                #Css/javascript/медиа/прочее
                RouteData(f"/{CSS_DIRECTORY}/<file_name>.css", self.static_controller.css, ["GET"]),
                RouteData(f"/{JSX_DIRECTORY}/<path:path>/<file_name>.js", self.static_controller.jsx, ["GET"]),
                RouteData(f"/{JS_DIRECTORY}/<path:path>/<file_name>.js", self.static_controller.js, ["GET"]),
                RouteData(f"/{JS_DIRECTORY}/<file_name>.js", self.static_controller.js, ["GET"]),
                RouteData(f"/{IMGS_DIRECTORY}/<file_name>", self.static_controller.img, ["GET"])
                ]