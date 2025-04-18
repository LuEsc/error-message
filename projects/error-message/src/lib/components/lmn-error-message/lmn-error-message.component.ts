import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Optional,
  SkipSelf
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer
} from '@angular/forms';
import { ErrorMessageProviderService } from '../service/message-provider.service';
import { ErrorMessages } from '../types/error-message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lmn-error-message',
  standalone: true,
  imports: [],
  template: `
    @if (hasError) {
      <div>{{ errorMessage }}</div>
    }
  `
})
export class LmnErrorMessageComponent implements OnInit, OnDestroy {
  @Input() customMessages: ErrorMessages = {};
  @Input() showOnlyWhenDirty = false;
  @Input() controlName?: string;
  @Input() debug = false;

  hasError = false;
  errorMessage = '';
  private control: AbstractControl | null = null;
  private subscription?: Subscription;

  constructor(
    @Optional() @SkipSelf() private controlContainer: ControlContainer,
    @Optional() private readonly errorProvider: ErrorMessageProviderService
  ) {
    this.errorProvider = this.errorProvider || new ErrorMessageProviderService();
  }

  ngOnInit(): void {
    if (!this.controlName || !this.controlContainer?.control) {
      console.warn('LmnErrorMessage: No control name or control container found');
      return;
    }

    this.control = this.controlContainer.control.get(this.controlName) || null;

    if (!this.control) {
      console.warn(`LmnErrorMessage: No control found with name '${this.controlName}'`);
      return;
    }

    this.subscription = this.control.statusChanges.subscribe(() => {
      this.checkErrors();
    });

    this.checkErrors();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private checkErrors(): void {
    if (!this.control) {
      this.hasError = false;
      return;
    }

    const hasErrors = !!this.control.errors;
    const isInvalid = this.control.invalid;
    const isDirty = !this.showOnlyWhenDirty || this.control.dirty;

    this.hasError = hasErrors && isInvalid && isDirty;

    if (this.hasError) {
      this.errorMessage = this.getErrorMessage();
    }

    if (this.debug) {
      console.log('[LmnErrorMessage] Error Check:', {
        control: this.controlName,
        errors: this.control.errors,
        hasErrors,
        invalid: isInvalid,
        dirty: isDirty,
        hasError: this.hasError
      });
    }
  }

  private getErrorMessage(): string {
    if (!this.control?.errors) return '';

    const errorKey = Object.keys(this.control.errors)[0];
    const errorValue = this.control.errors[errorKey];

    const allMessages = {
      ...this.errorProvider.getMessages(),
      ...this.customMessages
    };

    const message = allMessages[errorKey];

    return typeof message === 'function'
      ? message(errorValue)
      : message ?? `Error: ${errorKey}`;
  }
}
