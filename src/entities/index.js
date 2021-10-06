import UnitComp from './UnitComp'
import UnitCompDTOTemplate from './UnitCompDTOTemplate'

const createDTO = (entity = {}, DTO) => {
  if (entity.data === undefined || DTO === undefined) {
    const entityOutput = JSON.stringify(entity, null, 2)
    const DTOOutput = JSON.stringify(DTO, null, 2)
    throw new Error(['Attempt to create DTO from', entityOutput, 'with', DTOOutput].join('\n'))
  }

  const typedData = Object.entries(entity.data).reduce((coercedData, [key, value]) => {
    const coercedValue = key in DTO ? DTO[key](value) : value
    return { ...coercedData, [key]: coercedValue }
  }, {})
  return typedData
}

export { createDTO, UnitComp, UnitCompDTOTemplate }
