/**
 * next-i18next not support mjs config
 */

const path = require('path')

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    // TODO: 'ko' has been temporarily removed until the Korean translation file is ready.
    locales: ['en', 'zh', 'jp'],
    // TODO: This is because there is currently no full i18n translation support,
    // so switching to other languages is temporarily disabled.
    localeDetection: false,
  },
  localePath: typeof window === 'undefined' ? path.resolve('./public/locales') : '/locales',

  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
