# Error Handler Library

A lightweight, flexible error handling library for Angular applications that provides standardized validation error display and management.

## Table of Contents

- [Installation](#installation)
- [Overview](#overview)
- [Components](#components)
  - [Error Message Component](#error-message-component)
- [Services](#services)
  - [Error Message Provider Service](#error-message-provider-service)
- [Configuration](#configuration)
  - [Providing Error Handling](#providing-error-handling)
- [Usage Examples](#usage-examples)
  - [Basic Usage](#basic-usage)
  - [Custom Error Messages](#custom-error-messages)
  - [Styling Error Messages](#styling-error-messages)
- [API Reference](#api-reference)
  - [LmnErrorMessageComponent](#lmnerrormessagecomponent)
  - [ErrorMessageProviderService](#errormessageproviderservice)
  - [provideErrorHandling](#provideerrorhandling)

## Installation

```bash
npm i @solvia/ng-message-handler
```

# 📚 Overview

This library provides a comprehensive solution for handling and displaying form validation errors in Angular applications. It includes:

- ✅ A reusable error message component that integrates with Angular's form system  
- 🛠️ A centralized service for managing error messages  
- ⚙️ A provider function for configuring global error messages  
- 🧾 Default error messages for common validation scenarios  

---

# 🧩 Components

## `LmnErrorMessageComponent`

`LmnErrorMessageComponent` is a **standalone component** that displays form validation errors. It implements `ControlValueAccessor` to seamlessly integrate with Angular's reactive and template-driven forms.

### 🔑 Key Features

- 🔗 **Automatic binding** to parent form controls  
- 📢 **Displays the first validation error** for a form control  
- 📝 **Supports custom error messages** per component instance  
- 🎛️ **Configurable display conditions** based on touched or dirty states  
- 🎨 **Customizable styling** through the `errorClass` input  

---

# 🛠️ Services

## `ErrorMessageProviderService`

`ErrorMessageProviderService` is an **injectable service** that provides and manages global error messages used across the application. It allows registering custom error messages and retrieving them dynamically at runtime.

### 🔑 Key Features

- 🧩 **Centralized management** of all error messages  
- 🗣️ **Support for both string-based and function-based** error messages  
- 🧬 **Flexible override capabilities**:
  - Globally (application-wide)
  - Per component instance  

---

# ⚙️ Configuration

## `provideErrorHandling`

The `provideErrorHandling` function sets up the error handling system at the **application level**.

It can be used in the `providers` array of your app's bootstrap configuration to **register custom error messages** during application startup.


### 📦 Usage Example

```ts
import { provideErrorHandling } from 'your-library';

bootstrapApplication(AppComponent, {
  providers: [
    provideErrorHandling({
      required: 'This field is required',
      minlength: (err) => `Minimum ${err.requiredLength} characters required`
    })
  ]
});
```

# 🚀 Usage Examples

## ✅ Basic Usage

Here's a simple example of how to use the `LmnErrorMessageComponent` within a reactive form.

```ts
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LmnErrorMessageComponent } from '@your-scope/error-handler';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, LmnErrorMessageComponent],
  template: `
    <form [formGroup]="form">
      <div>
        <label for="email">Email</label>
        <input id="email" formControlName="email" type="email">
        <lmn-error-message formControlName="email"></lmn-error-message>
      </div>

      <div>
        <label for="password">Password</label>
        <input id="password" formControlName="password" type="password">
        <lmn-error-message formControlName="password"></lmn-error-message>
      </div>
    </form>
  `
})
export class RegistrationComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private fb: FormBuilder) {}
}
```

# 🎨 Component-Specific Custom Messages

You can define custom error messages at the component level using the `customMessages` input on the `LmnErrorMessageComponent`.

```html
<lmn-error-message 
  formControlName="email" 
  [customMessages]="{
    required: 'Email is required for account creation',
    email: 'Please enter a valid email format (e.g., user@example.com)'
  }">
</lmn-error-message>
```

# 📘 API Reference

## `LmnErrorMessageComponent`

A standalone component that displays form validation errors.

- **Selector:** `lmn-error-message`

### 🔧 Inputs

| Name                  | Type            | Default           | Description                                                                 |
|-----------------------|-----------------|-------------------|-----------------------------------------------------------------------------|
| `customMessages`      | `ErrorMessages` | `{}`              | Custom error messages specific to this component instance                   |
| `errorClass`          | `string`        | `'error-message'` | CSS class to apply to the error message container                           |
| `showOnlyWhenTouched` | `boolean`       | `true`            | Whether to show errors only when the field has been touched                 |
| `showOnlyWhenDirty`   | `boolean`       | `false`           | Whether to show errors only when the field has been modified                |


### Methods
| Method        | Parameters                          | Return Type | Description                                            |
|---------------|-------------------------------------|-------------|--------------------------------------------------------|
| `updateErrors`| `errors: ValidationErrors or null ` | `void`      | Updates the validation errors                          |
| `markAsTouched`| `none`                              | `void`      | Marks the control as touched                           |
| `markAsDirty`  | `none`                              | `void`      | Marks the control as dirty (modified)                  |


# 🛠️ ErrorMessageProviderService
A service that provides and manages global error messages used across the application.

### Methods:

| Method              | Parameters                                       | Return Type     | Description                                               |
|---------------------|--------------------------------------------------|-----------------|-----------------------------------------------------------|
| `registerMessages`   | `messages: ErrorMessages`                        | `void`          | Registers or overrides global error messages              |
| `getMessages`        | `none`                                           | `ErrorMessages` | Returns all currently registered error messages            |
| `getMessageForError` | `errorKey: string, errorValue: any`              | `string`        | Retrieves the error message for a specific error key       |


## 🚨 `provideErrorHandling`

A function that provides global error handling configuration for the entire Angular application.

### 📝 **Parameters:**

| Name      | Type                 | Default             | Description                                              |
|-----------|----------------------|---------------------|----------------------------------------------------------|
| `config`  | `ErrorMessagesConfig` | `{}`                | Configuration object containing optional custom error messages |
