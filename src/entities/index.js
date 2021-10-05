import UnitComp from './UnitComp'
import UnitCompDTO from './UnitCompDTO'

const createDTO = (entity = {}, DTO) => {
  if (entity.data === undefined || DTO === undefined) {
    throw new Error(`Attempt to create DTO from ${entity} with ${DTO}`)
  }

  const typedData = Object.entries(entity.data).reduce((coercedData, [key, value]) => {
    const coercedValue = key in DTO ? DTO[key](value) : value
    return { ...coercedData, [key]: coercedValue }
  }, {})
  return typedData
}

export { createDTO, UnitComp, UnitCompDTO }
