import { Injectable, signal } from '@angular/core';
import { ErrorMessages } from '../types/error-message';
import { DEFAULT_ERROR_MESSAGES } from '../default-message';

/**
 * A service that provides and manages global error messages used across the application.
 * It allows registering custom error messages and retrieving them dynamically.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorMessageProviderService {

  private globalMessages = signal<ErrorMessages>({ ...DEFAULT_ERROR_MESSAGES });

  constructor() {}

  /**
   * Registers or overrides global error messages.
   * This method merges the provided messages with the existing ones.
   *
   * @param messages - An object containing the error messages to register or override.
   */
  registerMessages(messages: ErrorMessages): void {
    this.globalMessages.update(current => ({ ...current, ...messages }));
  }

  /**
   * Returns all currently registered error messages.
   *
   * @returns The full set of error messages.
   */
  getMessages(): ErrorMessages {
    return this.globalMessages();
  }

  /**
   * Retrieves the error message for a specific error key.
   * If the message is a function, it will be executed with the provided error value.
   * If no message is found, a fallback message will be returned.
   *
   * @param errorKey - The key that identifies the error.
   * @param errorValue - Additional context or data related to the error.
   * @returns The resolved error message.
   */
  getMessageForError(errorKey: string, errorValue: any): string {
    const message = this.globalMessages()[errorKey];

    if (!message) {
      return `Error: ${errorKey}`;
    }

    return typeof message === 'function' ? message(errorValue) : message;
  }
}
