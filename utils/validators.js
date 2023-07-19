const { Joi } = require('celebrate');
const { urlLinkPattern } = require('./constants');

const validateUser = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Поле "Имя" не должно быть менее 2 символов',
      'string.max': 'Поле "Имя" не должно быть более 30 символов',
      'any.required': 'Поле "Имя" не должно быть пустым!',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Поле "О себе" не должно быть менее 2 символов',
      'string.max': 'Поле "О себе" не должно быть более 30 символов',
      'any.required': 'Поле "О себе" не должно быть пустым!',
    }),
    avatar: Joi.string().regex(urlLinkPattern).message('Должна быть ссылка!'),
    email: Joi.string().required().email().messages({
      'string.email': 'Введите корректный email',
      'any.required': 'Поле email не должно быть пустым!',
    }),
    password: Joi.string().required().min(6).messages({
      'string.min': 'Пароль должен быть не менее 6 символов',
      'any.required': 'Пароль не может быть пустым!',
    }),
  }),
};

const validateEditUser = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Поле "Имя" не должно быть менее 2 символов',
        'string.max': 'Поле "Имя" не должно быть более 30 символов',
        'any.required': 'Поле "Имя" не должно быть пустым!',
      }),
    about: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Поле "О себе" не должно быть менее 2 символов',
        'string.max': 'Поле "О себе" не должно быть более 30 символов',
        'any.required': 'Поле "О себе" не должно быть пустым!',
      }),
  }),
};

const validateAvatar = {
  body: Joi.object({
    avatar: Joi.string().required().regex(urlLinkPattern).message('Должна быть ссылка!'),
  }),
};

const validateUserId = {
  params: Joi.object({
    userId: Joi.string().required().hex().length(24)
      .message('Id указан неверно'),
  }),
};

const validateCards = {
  body: Joi.object({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Имя карточки не должно быть менее 2 символов',
        'string.max': 'Имя карточки не должно быть более 30 символов',
        'any.required': 'Имя карточки не должно быть пустым',
      }),
    link: Joi.string().required().regex(urlLinkPattern).messages({
      'string.regexMsg': 'Некорректная ссылка на картинку',
      'any.required': 'Ссылка не может быть пустой',
    }),
  }),
};

const validateCardId = {
  params: Joi.object({
    cardId: Joi.string().required().hex().length(24)
      .message('Id указан неверно'),
  }),
};

const validateLogin = {
  body: Joi.object({
    email: Joi.string().required().email().messages({
      'string.email': 'Введите корректный email',
      'any.required': 'Поле email не должно быть пустым!',
    }),
    password: Joi.string().required().min(6).messages({
      'string.min': 'Пароль должен быть не менее 6 символов',
      'any.required': 'Пароль не может быть пустым!',
    }),
  }),
};

module.exports = {
  validateUser,
  validateEditUser,
  validateAvatar,
  validateUserId,
  validateCards,
  validateCardId,
  validateLogin,
};
