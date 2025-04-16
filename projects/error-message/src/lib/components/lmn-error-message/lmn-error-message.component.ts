import {
  Component,
  computed,
  forwardRef,
  inject,
  input,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors
} from '@angular/forms';
import { ErrorMessageProviderService } from '../service/message-provider.service';
import { ErrorMessages } from '../types/error-message';

/**
 * Error Message Component
 *
 * A reusable component that displays form validation errors.
 * It implements ControlValueAccessor to seamlessly integrate with Angular's form system.
 *
 * @example
 * <form [formGroup]="form">
 *   <input formControlName="email" type="email">
 *   <lmn-error-message formControlName="email"></lmn-error-message>
 * </form>
 *
 * @example With custom messages
 * <lmn-error-message
 *   formControlName="name"
 *   [customMessages]="{required: 'Name is mandatory'}"
 *   errorClass="custom-error">
 * </lmn-error-message>
 */
@Component({
  selector: 'lmn-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (shouldShowError()) {
      <div [class]="errorClassValue()">{{ errorMessage() }}</div>
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LmnErrorMessageComponent),
      multi: true
    }
  ]
})
export class LmnErrorMessageComponent implements ControlValueAccessor {
  // Injected services
  private errorProvider = inject(ErrorMessageProviderService);
  private ngControl = inject(NgControl, { optional: true, self: true });

  // Inputs
  /**
   * Custom error messages for this specific instance
   * @example {required: 'This field is mandatory', minlength: (error) => `Min ${error.requiredLength} chars`}
   */
  customMessages = input<ErrorMessages>({});

  /**
   * CSS class to apply to the error message container
   */
  errorClass = input<string>('error-message');

  /**
   * Whether to show errors only when the field has been touched
   */
  showOnlyWhenTouched = input<boolean>(true);

  /**
   * Whether to show errors only when the field has been modified
   */
  showOnlyWhenDirty = input<boolean>(false);

  // Internal signals
  /**
   * The current value of the form control
   */
  private value = signal<any>(null);

  /**
   * Whether the form control has been touched
   */
  private touched = signal<boolean>(false);

  /**
   * Whether the form control has been modified
   */
  private dirty = signal<boolean>(false);

  /**
   * The current validation errors
   */
  private errors = signal<ValidationErrors | null>(null);

  // Computed values
  /**
   * The CSS class to apply to the error message
   */
  public errorClassValue = computed(() => this.errorClass());

  /**
   * Combined global and custom error messages
   */
  private combinedMessages = computed(() => {
    return {
      ...this.errorProvider.getMessages(),
      ...this.customMessages()
    };
  });

  // ControlValueAccessor callbacks
  /**
   * Callback for when the value changes
   */
  private onChange: (value: any) => void = () => {};

  /**
   * Callback for when the field is touched
   */
  private onTouched: () => void = () => {};

  constructor() {
    // Set up the connection to NgControl after the component is initialized
    setTimeout(() => {
      if (this.ngControl) {
        // Connect to the parent form control
        this.setupControlConnection();
      }
    });
  }

  /**
   * Sets up the connection to the parent form control
   */
  private setupControlConnection(): void {
    if (!this.ngControl || !this.ngControl.control) return;

    // Initial state synchronization
    this.updateErrors(this.ngControl.control.errors);
    this.touched.set(this.ngControl.control.touched);
    this.dirty.set(this.ngControl.control.dirty);

    // Subscribe to state changes
    this.ngControl.control.statusChanges.subscribe(() => {
      if (!this.ngControl || !this.ngControl.control) return;

      this.updateErrors(this.ngControl.control.errors);
      this.touched.set(this.ngControl.control.touched);
      this.dirty.set(this.ngControl.control.dirty);
    });
  }

  // Computed signals for display logic
  /**
   * Determines whether the error message should be displayed
   */
  shouldShowError = computed(() => {
    if (!this.errors() || Object.keys(this.errors() || {}).length === 0) {
      return false;
    }

    const shouldCheckTouched = this.showOnlyWhenTouched();
    const shouldCheckDirty = this.showOnlyWhenDirty();

    return (!shouldCheckTouched || this.touched()) &&
      (!shouldCheckDirty || this.dirty());
  });

  /**
   * Computes the error message to display
   */
  errorMessage = computed(() => {
    if (!this.errors()) return '';

    // Get the first error key
    const errorKey = Object.keys(this.errors() || {})[0];
    if (!errorKey) return '';

    const errorValue = this.errors()?.[errorKey];
    const messages = this.combinedMessages();

    // Find the custom message or use the default
    const message = messages[errorKey];

    if (!message) return `Error: ${errorKey}`;

    // If the message is a function, execute it with the error value
    return typeof message === 'function' ? message(errorValue) : message;
  });

  // ControlValueAccessor implementation
  /**
   * Writes a new value to the form control
   * @param value - The new value
   */
  writeValue(value: any): void {
    this.value.set(value);
  }

  /**
   * Registers a callback function that is called when the control's value changes
   * @param fn - The callback function
   */
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that is called when the control is touched
   * @param fn - The callback function
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of the control
   * @param isDisabled - Whether the control is disabled
   */
  setDisabledState?(isDisabled: boolean): void {
    // Not needed for this component
  }

  // Public methods for manual updates
  /**
   * Updates the validation errors
   * @param errors - The new validation errors
   */
  updateErrors(errors: ValidationErrors | null): void {
    this.errors.set(errors);
  }

  /**
   * Marks the control as touched
   */
  markAsTouched(): void {
    this.touched.set(true);
    this.onTouched();
  }

  /**
   * Marks the control as dirty (modified)
   */
  markAsDirty(): void {
    this.dirty.set(true);
  }
}
