class LogService():
    def __init__(self, log_database, crypt_service):
        self.log_database = log_database
        self.crypt_service = crypt_service

    async def add_log(self, user_ip, action, user_id=None):
        secret_user_ip = self.crypt_service.crypt_ip(user_ip)
        await self.log_database.add_log(user_ip=secret_user_ip, action=action, user_id=user_id)