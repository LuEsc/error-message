import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { ErrorMessages } from '../types/error-message';
import { ErrorMessageProviderService } from '../service/message-provider.service';

export interface ErrorMessagesConfig {
  messages?: ErrorMessages;
}

/**
 * Provides global error handling configuration for the entire Angular application.
 * This function can be used in the `providers` array of your application's `AppConfig`
 * to register custom error messages on application startup.
 *
 * @param config - Configuration object containing optional custom error messages.
 * @returns A set of environment providers that configure global error handling.
 *
 * @example
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideErrorHandling({
 *       messages: {
 *         required: 'This field is required',
 *         minlength: (value) => `Minimum length is ${value.requiredLength}`
 *       }
 *     })
 *   ]
 * });
 * ```
 */
export function provideErrorHandling(config: ErrorMessagesConfig = {}): EnvironmentProviders {
  // Factory-based provider that initializes the service and registers messages if present
  const configureErrorMessages = {
    provide: ErrorMessageProviderService,
    useFactory: () => {
      const service = new ErrorMessageProviderService();

      // Register provided messages, if any
      if (config.messages) {
        service.registerMessages(config.messages);
      }

      return service;
    }
  };

  const providers: Provider[] = [configureErrorMessages];

  return makeEnvironmentProviders(providers);
}
