# Error Handler Library

_A lightweight, flexible error handling library for Angular applications that provides standardized validation error display and management._

---

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
  - [Custom CSS Styling](#custom-css-styling)
- [API Reference](#api-reference)
  - [LmnErrorMessageComponent](#lmnerrormessagecomponent)
  - [ErrorMessageProviderService](#errormessageproviderservice)
  - [provideErrorHandling](#provideerrorhandling)

---

## Installation

```bash
npm install @solvia/ng-message-handler
```

## 📚 Overview

This library provides a comprehensive solution for handling and displaying form validation errors in Angular applications. It includes:

- ✅ A reusable error message component that integrates with Angular's form system
- 🛠️ A centralized service for managing error messages
- ⚙️ A provider function for configuring global error messages
- 🧾 Default error messages for common validation scenarios

---

## 🧩 Components

### `LmnErrorMessageComponent`

`LmnErrorMessageComponent` is a standalone component that displays form validation errors. It implements `ControlValueAccessor` to seamlessly integrate with Angular's reactive and template-driven forms.

#### 🔑 Key Features

- 🔗 **Automatic binding** to parent form controls
- 📢 **Displays the first validation error** for a form control
- 📝 **Supports custom error messages** per component instance
- 🎛️ **Configurable display conditions** based on touched or dirty states
- 🎨 **Easy styling** with standard CSS class application

---

## 🛠️ Services

### `ErrorMessageProviderService`

`ErrorMessageProviderService` is an injectable service that provides and manages global error messages used across the application. It allows registering custom error messages and retrieving them dynamically at runtime.

#### 🔑 Key Features

- 🧩 **Centralized management** of all error messages
- 🗣️ **Support for both string-based and function-based** error messages
- 🧬 **Flexible override capabilities**:
  - Globally (application-wide)
  - Per component instance

---

## ⚙️ Configuration

### `provideErrorHandling`

The `provideErrorHandling` function sets up the error handling system at the application level.  
It can be used in the `providers` array of your app's bootstrap configuration to register custom error messages during application startup.

#### 📦 Usage Example

```ts
import { provideErrorHandling } from '@solvia/ng-message-handler';

bootstrapApplication(AppComponent, {
  providers: [
    provideErrorHandling({
      required: 'This field is required',
      minlength: (err) => `Minimum ${err.requiredLength} characters required`
    })
  ]
});
```
---

## 🚀 Usage Examples

### ✅ Basic Usage

Here's a simple example of how to use the `LmnErrorMessageComponent` within a reactive form.

```ts
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LmnErrorMessageComponent } from '@solvia/ng-message-handler';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, LmnErrorMessageComponent],
  template: `
    <form [formGroup]="form">
      <div>
        <label for="email">Email</label>
        <input id="email" formControlName="email" type="email">
        <lmn-error-message controlName="email"></lmn-error-message>
      </div>

      <div>
        <label for="password">Password</label>
        <input id="password" formControlName="password" type="password">
        <lmn-error-message controlName="password"></lmn-error-message>
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
## 🎨 Component-Specific Custom Messages

You can define custom error messages at the component level using the `customMessages` input on the `LmnErrorMessageComponent`.

```html
<lmn-error-message 
  controlName="email" 
  [customMessages]="{
    required: 'Email is required for account creation',
    email: 'Please enter a valid email format (e.g., user@example.com)'
  }">
</lmn-error-message>
```

## 🎨 Custom CSS Styling

The component makes styling errors simple by applying CSS classes to the error message container. You can style errors using standard CSS:

```css
/* In your global styles or component styles */
.error-message {
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}
```
## 🎨 Custom Styling with Class Attribute

For custom styling, simply use the `class` attribute:

```html
<lmn-error-message 
  controlName="email" 
  class="error-message">
</lmn-error-message>
```

# 📘 API Reference

## `LmnErrorMessageComponent`

A standalone component that displays form validation errors.

**Selector:** `lmn-error-message`

---

## 🔧 Inputs

| Name               | Type           | Default  | Description                                                         |
|--------------------|----------------|----------|---------------------------------------------------------------------|
| `customMessages`   | `ErrorMessages`| `{}`     | Custom error messages specific to this component instance           |
| `showOnlyWhenDirty`| `boolean`      | `false`  | Whether to show errors only when the field has been modified        |
| `controlName`      | `string`       | `undefined` | The name of the form control to bind to                         |
| `debug`            | `boolean`      | `false`  | Whether to output debug information to the console                  |

## 🧩 HTML Attributes

| Attribute | Type     | Description                                        |
|-----------|----------|----------------------------------------------------|
| `class`   | `string` | CSS class(es) to apply to the error message `<div>`|

---

## 🛠️ Methods

| Method        | Parameters | Return Type | Description                                      |
|---------------|------------|-------------|--------------------------------------------------|
| `checkErrors` | none       | `void`      | Checks for errors on the bound control           |

## 🛠️ `ErrorMessageProviderService`

A service that provides and manages global error messages used across the application.

---

### Methods

| Method              | Parameters                          | Return Type     | Description                                                        |
|---------------------|-------------------------------------|-----------------|--------------------------------------------------------------------|
| `registerMessages`  | `messages: ErrorMessages`          | `void`          | Registers or overrides global error messages                       |
| `getMessages`       | none                                | `ErrorMessages` | Returns all currently registered error messages                     |
| `getMessageForError`| `errorKey: string`, `errorValue: any`| `string`        | Retrieves the error message for a specific error key               |

## 🚨 `provideErrorHandling`

A function that provides global error handling configuration for the entire Angular application.

---

### 📝 Parameters

| Name    | Type                  | Default                | Description                                        |
|---------|-----------------------|------------------------|----------------------------------------------------|
| `config`| `ErrorMessagesConfig` | `{}`                   | Configuration object containing optional custom error messages |
