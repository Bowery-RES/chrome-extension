import startCase from 'lodash/startCase'
import { UNIT_TYPES_LIST } from '../constants'

export const extractNumber = (str) => (typeof str === 'string' ? Number(str.replace(/[^0-9.-]+/g, '')) : NaN)
export const getUnitLayout = (description) => {
  const [resutl] = description.match(new RegExp(UNIT_TYPES_LIST.join('|'), 'i')) || ['']
  return startCase(resutl)
}

export const priceRegExp = ({ prefix = '\\$', pattern = '[\\d,]+', postfix = '/mo', flags = 'g' } = {}) =>
  new RegExp([prefix, pattern, postfix].join(''), flags)

export const getDefault = (value, property, defaultValue) => (value ? value[property] : defaultValue)
