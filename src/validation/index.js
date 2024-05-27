import joi from '@hapi/joi'

const rentCompValidationSchema = joi.object({
  address: joi.string().required(),
  city: joi.string().required(),
  state: joi.string().required(),
  zip: joi.string().required(),
  bathrooms: joi.number().multiple(0.5).required(),
  bedrooms: joi.number().integer().required(),
  rent: joi.number().required(),
  unitNumber: joi.string().required(),
  dateOfValue: joi.date().required(),
})

export default function validateRentComp(data) {
  return !!rentCompValidationSchema.validate(data, { allowUnknown: true }).error
}
