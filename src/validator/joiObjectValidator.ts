export default function JoiObjectValidator(JoiSchema:any, data:any, joiOptions?:any) {
    const { error, value } = JoiSchema.validate(data, {
      stripUnknown: true,
      ...joiOptions
    });
    if (error) {
      throw error;
    }
    return value;
  };
  