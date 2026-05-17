from cryptography.fernet import Fernet
import hashlib
import os
import base64

from settings.config import *

class CryptService():
    def reset_password(self, password):
        salt = os.urandom(SALT_SIZE)
        password_hash = self.password_hash(password, salt)

        return password_hash, salt
        
    def password_hash(self, password, salt):
        return hashlib.pbkdf2_hmac(
            PASSWORD_METHOD,
            password.encode(),
            salt,
            PASSWORD_ITERATIONS
        )

    def new_user(self, password, email):
        salt = os.urandom(SALT_SIZE)
        
        password_hash = self.password_hash(password, salt)
        
        email_hash = self.email_hash(email)

        return salt, password_hash, email_hash
    
    def email_hash(self, email):#Создание хэш почты
        return hashlib.pbkdf2_hmac(
                                        PASSWORD_METHOD,
                                        email.encode(),
                                        EMAILS_KEY.encode(),
                                        PASSWORD_ITERATIONS
                                    )
    
    #Метод, возвращает всегда хэш в байтовом представлении из любых данных
    def hash_32_bytes(self, *args):
        #Соединяем все переданные строки в одну и переводим в байты
        raw_data = (''.join(args)).encode("utf-8")
        #Создаём хэш
        hash_32b = hashlib.sha256(raw_data)
        return hash_32b.digest()#Возвращаем в виде 32 байтов

    def crypt_message(self, message, chat_id):
        raw_key = self.hash_32_bytes(chat_id, MESSAGES_KEY)#Получаем хэш в виде 32 байтов
        key = base64.urlsafe_b64encode(raw_key)

        fernet = Fernet(key)
        return fernet.encrypt(message.encode())
    
    def decrypt_message(self, message, chat_id):
        raw_key = self.hash_32_bytes(chat_id, MESSAGES_KEY)#Получаем хэш в виде 32 байтов
        key = base64.urlsafe_b64encode(raw_key)

        fernet = Fernet(key)
        return fernet.decrypt(message.encode())
    
    def crypt_ip(self, ip):
        fernet = Fernet(IPS_KEY)
        return fernet.encrypt(ip.encode())