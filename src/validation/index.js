import joi from '@hapi/joi'

const rentCompValidationSchema = joi.object({
  address: joi.string().required(),
  city: joi.string().required(),
  bathrooms: joi.number().multiple(0.5).required(),
  bedrooms: joi.number().integer().required(),
  rent: joi.number().required(),
})

export default function validateRentComp(data) {
  return !!rentCompValidationSchema.validate(data, { allowUnknown: true }).error
}
