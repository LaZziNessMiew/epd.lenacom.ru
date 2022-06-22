## О ветке
port 3002
dev-ветка для объединения всех индивидуальных работ

## Установка и старт

Запустить дев-сервер

```bash
npm install
# or
yarn install

npm run dev
# or
yarn dev
```

Открыть [http://localhost:3000](http://localhost:3000)

Или [epd.lenacom.ru](epd.lenacom.ru) если сервер стоит за Nginx

## Файлы

Сделать скрытыми следующие файлы и папки

- .git
- .next
- node_modules

## Установка
# bootstrap
yarn add bootstrap react-bootstrap
# material ui
yarn add @mui/material @emotion/react @emotion/styled
# database
yarn add pg pg-hstore sequelize
# authorization
yarn add next bcryptjs jsonwebtoken

## Рекомендации
В БД для названия таблиц и БД использовать всегда нижний регистр, слова разделять через нижнее подчеркивание, например test_table