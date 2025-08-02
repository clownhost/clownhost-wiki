# Компоненты UI

## Кнопки

Это тестовая страница для описывания вашего фирменного стиля.

### Основная кнопка
Используется для главных действий на странице.

```css
.primary-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
```

### Вторичная кнопка  
Для дополнительных действий.

```css
.secondary-button {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  padding: 10px 22px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-button:hover {
  background: #667eea;
  color: white;
}
```

## Формы

### Поля ввода
- Текстовые поля
- Поля для email
- Пароли
- Текстовые области

```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
```

### Валидация
Все формы должны включать валидацию:
- Обязательные поля
- Формат email
- Минимальная длина пароля

## Карточки

Карточки используются для группировки связанного контента:

```jsx
<Card>
  <CardHeader>
    <CardTitle>Заголовок карточки</CardTitle>
  </CardHeader>
  <CardContent>
    Содержимое карточки
  </CardContent>
</Card>
```

```css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

## Цветовая палитра

### Основные цвета
- **Первичный**: `#667eea` ![#667eea](https://clown.host/667eea.jpg)
- **Вторичный**: `#764ba2` ![#764ba2](https://clown.host/764ba2.jpg)

## Иконки

Используем иконки из библиотеки Lucide React:

```jsx
import { Search, Menu, User, Settings } from 'lucide-react';

<Search size={20} />
<Menu size={24} />
<User size={16} />
<Settings size={18} />
``` 