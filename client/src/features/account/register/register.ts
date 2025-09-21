import { Component, inject, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCredentials, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { TextInput } from "../../../shared/text-input/text-input";
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, TextInput],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class Register {
    private accountService = inject(AccountService);
    private router = inject(Router);
    private formBuilder = inject(FormBuilder);
    cancelRegister = output<boolean>();
    protected credentials = {} as RegisterCredentials;
    protected credentialsForm: FormGroup;
    protected profileForm: FormGroup;
    protected currentStep = signal(1);
    protected validationErrors = signal<string[]>([]);

    constructor() {
        this.credentialsForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            displayName: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
            confirmPassword: ['', [Validators.required, this.matchValues('password')]]
        });
        this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
            this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
        })

        this.profileForm = this.formBuilder.group({
            gender: ['male', Validators.required],
            dateOfBirth: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required]
        })
    }

    matchValues(matchTo: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const parent = control.parent;

            if (!parent) return null;

            const matchValue = parent.get(matchTo)?.value;
            return control.value === matchValue ? null : { passwordMismatch: true }
        }
    }

    nextStep() {
        if (this.credentialsForm.valid) {
            this.currentStep.update(previousStep => previousStep + 1);
        }
    }

    previousStep() {
        this.currentStep.update(previousStep => previousStep - 1);
    }

    getMaxDate() {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 18);
        return today.toISOString().split('T')[0];
    }

    register() {
        if (this.credentialsForm.valid && this.profileForm.valid) {
            const formData = {...this.credentialsForm.value, ...this.profileForm.value};
            
            this.accountService.register(formData).subscribe({
                next: () => {
                    this.router.navigateByUrl('/members');
                },
                error: error => {
                    console.log(error);
                    this.validationErrors.set(error);
                }
            })
        }
    }

    cancel() {
        this.cancelRegister.emit(false);
    }
}
