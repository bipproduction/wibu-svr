import * as yup from 'yup';

type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [key: string]: JsonValue };

interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  validationError?: yup.ValidationError;
}

/**
 * Creates a Yup schema based on an object structure
 * @param obj - The object to create schema from
 * @returns Yup schema
 */
function createSchemaFromDefault(obj: JsonValue): yup.Schema {
    if (Array.isArray(obj)) {
        return obj.length > 0
            ? yup.array().of(createSchemaFromDefault(obj[0])).required()
            : yup.array().required();
    }
    
    if (typeof obj === 'object' && obj !== null) {
        const shape: { [key: string]: yup.Schema } = {};
        for (const [key, value] of Object.entries(obj)) {
            shape[key] = createSchemaFromDefault(value);
        }
        return yup.object().shape(shape).required();
    }

    // Handle primitive types more specifically
    switch (typeof obj) {
        case 'string':
            return yup.string().required().min(1);
        case 'number':
            return yup.number().required();
        case 'boolean':
            return yup.boolean().required();
        default:
            return yup.mixed().required().notOneOf([null, undefined,"",{},[]]);
    }
}

/**
 * Validates an object against a default structure
 * @param defaultObj - The default object structure
 * @param targetObj - The object to validate
 * @returns Validation result
 */
export async function validateObject(
    defaultObj: JsonValue, 
    targetObj: unknown
): Promise<ValidationResult> {
    try {
        const schema = createSchemaFromDefault(defaultObj);
        await schema.validate(targetObj, { 
            abortEarly: false, 
            strict: true 
        });
        
        return { isValid: true };
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return {
                isValid: false,
                errors: error.errors,
                validationError: error
            };
        }
        
        // Handle unexpected errors
        return {
            isValid: false,
            errors: ['Unexpected validation error occurred']
        };
    }
}

/**
 * Synchronous validation check
 * @param defaultObj - The default object structure
 * @param targetObj - The object to validate
 * @returns boolean indicating if validation passed
 */
export function isValidObject(
    defaultObj: JsonValue, 
    targetObj: unknown
): boolean {
    try {
        const schema = createSchemaFromDefault(defaultObj);
        return schema.isValidSync(targetObj, { strict: true });
    } catch {
        return false;
    }
}
