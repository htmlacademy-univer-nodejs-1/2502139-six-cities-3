export const CommentValidationMessage = {
  comment: {
    min: 'Слишком короткий комментарий!',
    max: 'Слишком длинный комментарий!'
  },
  rating: {
    invalid: 'Рейтинг не число',
    invalidDecimal: 'Неверный диапазон рейтинга'
  },
  date: {
    invalidFormat: 'Неверный формат даты'
  },
  host: { invalid: 'Такой пользователь не существует'},
} as const;
