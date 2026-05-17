import os

#SQL
SQL_HOST = "127.0.0.1"
SQL_PORT = 3306
SQL_USER = "root"
SQL_PASSWORD = 'root'
SQL_DATABASE = "appDB"

#SERVER
USERS_DATA_DIR = "/home/nokrezer/Рабочий стол/MyApp/UsersData/"
USERS_AVATAR_DIR = USERS_DATA_DIR + "avatars/"
SERVER_HOST = "192.168.31.168"
SERVER_PORT = 5000
MESSENGER_PORT = 8000
SSL_CERTFILE = "../certificates/cert.pem"
SSL_CERTKEY = "../certificates/key.pem"
#Версия пользовательского соглашения, на данный момент
NOW_CONSENT_VERSION = 1

#Криптография
PASSWORD_ITERATIONS = 100_000
PASSWORD_METHOD = 'sha256'
SALT_SIZE = 16

#DATA - константы для работы с информацией
MAX_GET_POSTS = 50#Сколько максимально постов можно получить за раз с сервера
MAX_GET_PRODUCTS = 50#Сколько максимально карточек товаров можно получить за раз с сервера

#Прочее
USER_API_PREFIX = "/api"
AUTH_API_PREFIX = "/auth"

RATE_LIMIT = 200#Количество запросов
RATE_LIMIT_IN_MINUTE = 1#Интервал запросов в минуту
# REGISTRATION_RATE_LIMIT = 2#Максимум можно создать 2 аккаунта в час

#Директория расположения сайта
SITE_DIRECTORY = "/home/nokrezer/Рабочий стол/MyApp/site"
HTML_DIRECTORY = "/templates"
CSS_DIRECTORY = "/styles"
JS_DIRECTORY = "/js/"
JSX_DIRECTORY = "/jsx/"
IMGS_DIRECTORY = "/img"

#Сроки действия токенов
REFRESH_TOKEN_DAYS = 60#Срок действия refresh токена в днях
ACCESS_TOKEN_MINUTES = 10#Срок действия токена доступа в минутах

#Перец
EMAILS_KEY= os.getenv("EMAILS_KEY")
IPS_KEY = os.getenv("IPS_KEY")
MESSAGES_KEY = os.getenv("MESSAGES_KEY")