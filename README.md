# BD-Doc
Data Base for students

1. Скачиваем с гита репозиторий 
2. Устанавливаем Docker 
3. Изменяем конфиг в бэке, в каждой папке микросервиса (если нет папки config - создаем)

**!!!!! <ins> в конфиге должен быть файл prod.yaml (если нет - создаём и проверяем содержимое) </ins> !!!!!!!!**

---

для ApiGatewateForOrbitOfSuccess

```YAML

env: "prod"

http:
  port: 8080

auth_service:
  address: "localhost:5000"

user_service:
  address: "localhost:5001"

course_service:
  address: "localhost:5002"

s3:
  access_key: "WCJHZLLC1W0P559H4ABA"
  secret_access_key: "BT55bbBpCn9zvMucJ062dL5KfXitmeJS9SaJFaXA"
  bucket_name: "2b22bd72-555c46b6-3494-47e1-aec6-b13be2d5f5f6"
  endpoint: "https://s3.timeweb.cloud"

```

---

для AuthMicroservice

```YAML

env: "local"

GRPC:
  port: 5000
  timeout: 5s

database:
  url: "postgres://postgres:postgres@localhost:5433/authmicroservice"
  pool_max: 2

jwt_access:
  secret: "Xr1FNOTE98Dz9Y5zGCcelETgX8wcdRpamMvIg1uzB9haiQXD-2"
  duration: 900s

jwt_refresh:
  secret: "sNh31RPctnZhSAis13mhuwqGGmipDT_05c9KLwkOMBTzGUoUEq"
  duration: 2592000s

mailer:
  username: "orbitofsuccess@yandex.ru"
  password: "gkjtafkkxxxpbkvk"
  host: "smtp.yandex.ru"
  addr: "smtp.yandex.ru:587"

base_links:
  activation_url: "http://77.51.223.54:5173/auth/activate_account/"
  change_password_url: "https://cookhub.space/change_password/"

user_service:
  address: "localhost:5001"

```

---

для DocsMicroservice

```YAML

env: "local"

GRPC:
  port: 5001
  timeout: 5s

database:
  url: "postgres://postgres:postgres@localhost:5432/Lenya"
  pool_max: 2

```

---

для UserMicroserviceForOrbitOfSuccess

```YAML

env: "local"

GRPC:
  port: 5001
  timeout: 5s

database:
  url: "postgres://postgres:postgres@localhost:5433/authmicroservice"
  pool_max: 2

```

---

4. Переходим в корневую папку в BD-Doc, где есть файл docker-compose.yml
5. Прописываем в командной строке:
* Для запуска постоянно: docker-compose up --build -d
* Для запуска с отладкой (log): docker-compose up --build (при выходе из консоли сервер отключается)
* Для завершения сервисов: docker-compose down
* Для завершения сервисов и удаления БД (Доки и Юзеры): docker-compose down -v
