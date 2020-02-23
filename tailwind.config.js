module.exports = {
  theme: {
    textColor: {
      primary: 'var(--secondary)',
      secondary: 'var(--secondary)',
      default: 'var(--color-text-default)',
      'default-soft': 'var(--color-text-default-soft)',
      inverse: 'var(--color-text-inverse)',
      'inverse-soft': 'var(--color-text-inverse-soft)',
      red: 'var(--red)',
      yellow: 'var(--yellow)',
      green: 'var(--green)',
    },
    backgroundColor: {
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      'blue-200': 'var(--blue-200)',
      'red-200': 'var(--red-200)',
      'green-200': 'var(--green-200)',
      'gray-100': 'var(--bgColor-gray-100)',
      'gray-200': 'var(--bgColor-gray-200)',
      'gray-300': 'var(--bgColor-gray-300)',
      'red-500': 'var(--red)',
      card: 'var(--bgColor-card)',
      transparent: 'transparent',
    },
  },
  variants: {
    margin: ['first'],
    backgroundColor: ['group-hover', 'hover'],
    textColor: ['group-hover', 'hover'],
  },
};
