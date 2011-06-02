# Django settings for numberlink project.
import os

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    ('Piotr Dobrowolski', 'pd291528@students.mimuw.edu.pl'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', 
        'NAME': 'numberlink.db', 
        'USER': '', 
        'PASSWORD': '', 
        'HOST': '', 
        'PORT': '', 
    }
}

TIME_ZONE = 'Europe/Warsaw'

LANGUAGE_CODE = 'pl'

SITE_ID = 1
SITE_ROOT = os.path.relpath(os.path.dirname(__file__))

USE_I18N = True

USE_L10N = True

MEDIA_ROOT = os.path.abspath(os.path.dirname(__file__) + '/media/')

MEDIA_URL = '/media/'

STATIC_ROOT = os.path.abspath(os.path.dirname(__file__) + '/static/')

STATIC_URL = '/static/'

ADMIN_MEDIA_PREFIX = '/static/admin/'

# Additional locations of static files
STATICFILES_DIRS = (
#"/home/piotrek/public_html/django/numberlink/static",
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

SECRET_KEY = 'lhnnm0y7u7uww5kcpm$tlpx^!1up%=#w6kp@$c!v1snil#mz97'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "socialauth.context_processors.facebook_api_key",
    'django.core.context_processors.media',
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.request",
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'openid_consumer.middleware.OpenIDMiddleware',
)

ROOT_URLCONF = 'numberlink.urls'

TEMPLATE_DIRS = (
    os.path.abspath(os.path.dirname(__file__) + "/templates/"),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.admin',
    # 'django.contrib.admindocs',
    'numberlink.game',
    'numberlink.main',
    'numberlink.contest',
    'socialauth',
    'openid_consumer',
)

try:
    from localsettings import *
except ImportError:
    pass
