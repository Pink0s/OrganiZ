import { validateSync } from 'class-validator';

import { plainToInstance } from 'class-transformer';
import { EnvironmentsVariables } from './models/EnvironmentsVariables';

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentsVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
