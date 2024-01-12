export const RULES = {
  required: {
    required: true,
    message: 'Required field!',
  },
  url: {
    type: 'url',
    message: 'Must be a valid url!',
  },
  validator: {},
};

export type Rule = typeof RULES[keyof typeof RULES];
