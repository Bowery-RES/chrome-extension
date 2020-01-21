import joi from '@hapi/joi'

const rentCompValidationSchema = joi.object({
  address: joi.string().required(),
  city: joi.string().required(),
  unitNumber: joi.string().required(),
  bathrooms: joi.number().required(),
  bedrooms: joi.number().required(),
  rent: joi.number().required(),
})

export function validateRentComp(data) {
  return !!rentCompValidationSchema.validate(data, { allowUnknown: true }).error
}
