import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCredentials, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
    selector: 'app-register',
    imports: [FormsModule],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class Register {
    private accountService = inject(AccountService);
    cancelRegister = output<boolean>();
    protected credentials = {} as RegisterCredentials;

    register() {
        this.accountService.register(this.credentials).subscribe({
            next: response => {
                console.log(response);
                this.cancel();
            },
            error: error => console.log(error)
        })
    }

    cancel() {
        this.cancelRegister.emit(false);
    }
}
