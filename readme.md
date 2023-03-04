# API для проекта [gymNote](https://github.com/DubininAnton/gymnote/)

Cсылка на API: [https://localhost:5000/api/](https://localhost:5000/api/)

##Запросы связанные с авторизацией

| Запрос | Описание | Параметры | Возвращает |
| -------|----------|-----------|------------|
| POST /registration  | Регистрация пользователя | body: {"email":"test@example.com", "password":"password"} |{ "accessToken": "token",  "user": { "email": "test@example.com", "id": "635b8302f4f28e2e750042b8", "isActivated": false}} и устанавливает cookie: **refreshToken** |
| POST /login  | Авторизация пользователя | body: {"email":"test@example.com", "password":"password"} | { "accessToken": "token",  "user": { "email": "test@example.com", "id": "635b8302f4f28e2e750042b8", "isActivated": false}} и устанавливает cookie: **refreshToken**| 
| POST /logout  | Выход пользователя |  |
| GET /activate/:link  | Активация пользователя | params: link: activation-link |**302 redirect** на CLIENT_URL |
| GET /refresh  | Запрос рефреш токена | в cookie должен быть валидный токен **refreshToken**  | { "accessToken": "token",  "user": { "email": "test@example.com", "id": "635b8302f4f28e2e750042b8", "isActivated": false}} и устанавливает cookie: **refreshToken**|
| GET /users  | Возвращает список пользователей | header: Authorization: 'Bearer acessToken' | массив пользователей [{ "email": "test@example.com",        "id": "63592a6c83e34fd94fcdc4f4",        "isActivated": false    }, { "email": "test2@example.com",        "id": "63592a6c83e34fd94fcdc4f4",        "isActivated": false    }] для админа, для любого пользователя только данные текущего пользователя|

##Запросы связанные с дневником тринировок

| Запрос | Описание | Параметры | Возвращает |
| -------|----------|-----------|------------|
| 

Преременные окружения прописываются в .env
Для примера есть .env.example

