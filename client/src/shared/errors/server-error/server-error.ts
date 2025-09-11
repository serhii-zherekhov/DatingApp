import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../../types/error';

@Component({
    selector: 'app-server-error',
    imports: [],
    templateUrl: './server-error.html',
    styleUrl: './server-error.css'
})

export class ServerError {
    protected error: ApiError;
    private router = inject(Router);
    private location = inject(Location);
    protected showDetails = false;

    constructor() {
        const navigation = this.router.currentNavigation();
        this.error = navigation?.extras?.state?.['error'];
    }

    detailsToggle() {
        this.showDetails = !this.showDetails;
    }

    goBack() {
        this.location.back();
    }
}
