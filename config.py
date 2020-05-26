from datetime import timedelta

class Config(object):
    DEBUG=True
    SEND_FILE_MAX_AGE_DEFAULT=timedelta(seconds=1)
    TEMPLATES_AUTO_RELOAD = True  # 刷新之后自动加载