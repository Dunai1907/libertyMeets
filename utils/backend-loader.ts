import { Model } from "sequelize-typescript";

/**
 * This method wraps a data loader for doing extra manipulation over Date objects: it converts
 * instances of Date into String using `.toISOString()` method.
 * It is necessary for JSON serialization since JS doesn't know how to serialize Date into String.
 * @param fn
 * @param dateFields
 */
export async function backendLoader<T extends Model>(
  fn: () => Promise<T | null>,
  dateFields: string[]
): Promise<T | null> {
  try {
    const entity = await fn();
    if (!entity) {
      return null;
    }
    const plainData = await entity.toJSON();
    return dateFields.reduce((acc, field) => {
      acc[field] = acc[field].toISOString();
      return acc;
    }, plainData);
  } catch (err) {
    return null;
  }
}
