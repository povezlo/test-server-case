# GraphQL Examples

Данная папка содержит примеры GraphQL запросов и мутаций для музыкального приложения.

## Как использовать

1. Запустите сервер: `npm run dev`
2. Откройте GraphQL Playground: http://localhost:8000/graphql
3. Скопируйте и вставьте примеры из файлов ниже

## Доступные файлы

### Запросы (Queries)

- **01-get-genres.graphql** - Получение всех жанров
- **02-get-tracks.graphql** - Получение треков с пагинацией, сортировкой и фильтрацией
- **05-get-track-by-id.graphql** - Получение конкретного трека по ID или slug

### Мутации (Mutations)

- **03-create-track.graphql** - Создание нового трека
- **04-update-track.graphql** - Обновление существующего трека
- **06-delete-operations.graphql** - Операции удаления треков

## Основные возможности

### Фильтрация треков

```graphql
{
  tracks(
    input: { filter: { search: "Rock", genre: "Rock", artist: "Queen" } }
  ) {
    data {
      title
      artist
    }
  }
}
```

### Сортировка треков

```graphql
{
  tracks(input: { sort: { field: CREATED_AT, order: DESC } }) {
    data {
      title
      createdAt
    }
  }
}
```

### Пагинация

```graphql
{
  tracks(input: { pagination: { page: 1, limit: 5 } }) {
    data {
      title
    }
    pageInfo {
      total
      page
      limit
      totalPages
    }
  }
}
```

## GraphQL Schema

Основные типы:

- **Genre** - Жанр музыки
- **Track** - Музыкальный трек
- **TracksConnection** - Результат с пагинацией для треков
- **PageInfo** - Информация о пагинации

## Endpoints

- **GraphQL API**: http://localhost:8000/graphql
- **GraphQL Playground**: http://localhost:8000/graphql (только в development режиме)
- **REST API**: http://localhost:8000/api/
- **Swagger Documentation**: http://localhost:8000/documentation
