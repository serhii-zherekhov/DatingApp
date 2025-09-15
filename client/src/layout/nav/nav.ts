import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';

@Component({
    selector: 'app-nav',
    imports: [FormsModule, RouterLink, RouterLinkActive],
    templateUrl: './nav.html',
    styleUrl: './nav.css'
})
export class Nav implements OnInit {
    protected accountService = inject(AccountService);
    private router = inject(Router)
    private toast = inject(ToastService)
    protected credentials: any = {}
    protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
    protected themes = themes;

    ngOnInit(): void {
        document.documentElement.setAttribute('data-theme', this.selectedTheme());
    }

    handleSelectTheme(theme: string) {
        this.selectedTheme.set(theme);
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        const element = document.activeElement as HTMLDivElement;
        if(element) element.blur();
    }

    login() {
        this.accountService.login(this.credentials).subscribe({
            next: () => {
                this.router.navigateByUrl('/members');
                this.toast.success('Logged in successfully');
                this.credentials = {};
            },
            error: error => {
                this.toast.error(error.error);
            }
        });
    }

    logout() {
        this.accountService.logout();
        this.router.navigateByUrl('/');
    }
}
