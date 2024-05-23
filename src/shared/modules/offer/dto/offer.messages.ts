export const OfferValidationMessage = {
  title: {
    minLength: 'Длина заголовка не может быть меньше 10 символов',
    maxLength: 'Длина заголовка не может быть больще 100 символов',
  },
  description: {
    minLength: 'Длина описания не может быть меньше 20 символов',
    maxLength: 'Длина описания не может быть меньше 1024 символов',
  },
  postDate: {
    invalidFormat: 'Неверный формат даты',
  },
  city: {
    invalid: 'Неверный город',
  },
  previewImage: {
    invalid: 'Неверная ссылка на превью',
  },
  images: {
    someImageInvalid: 'Невалидные ссылки в массиве',
    invalidLength: 'Фотографий должно быть 6',
  },
  isPremium: {
    invalid: 'Флаг премиум не булевое значение',
  },
  isFavorite: {
    invalid: 'Флаг избранное не булевое значение',
  },
  rating: {
    invalid: 'Рейтинг не число',
    invalidDecimal: 'Неверный диапазон рейтинга'
  },
  price: {
    invalid: 'Цена не число',
    invalidDecimal: 'Неверный диапазон цен'
  },
  type: {
    invalid: 'Неверный тип предложения'
  },
  bedrooms: {
    invalid: 'Количество комнат не число',
    invalidDecimal: 'Неверный диапазон количества комнат'
  },
  maxAdults: {
    invalid: 'Количество людей не число',
    invalidDecimal: 'Неверный диапазон количества гостей'
  },
  goods: {
    invalid: 'Неверный тип товаров'
  },
  host: { invalid: 'Такой пользователь не существует'},
  latitude: {
    invalid: 'Но долгота'
  },
  longitude: {
    invalid: 'Но широта'
  }
} as const;
