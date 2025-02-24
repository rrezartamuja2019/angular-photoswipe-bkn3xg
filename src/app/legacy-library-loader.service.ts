import { Inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class LegacyLibraryLazyLoaderService {
    _loadedLibraries: { [url: string]: ReplaySubject<any> } = {};
    _loadedStyles: { [url: string]: ReplaySubject<any> } = {};

    constructor(@Inject(DOCUMENT) private readonly $document: Document) {}

    loadScript(url: string): Observable<any> {
        if (this._loadedLibraries[url]) {
            return this._loadedLibraries[url].asObservable();
        }

        this._loadedLibraries[url] = new ReplaySubject();

        const script = this.$document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = () => {
            this._loadedLibraries[url].next();
            this._loadedLibraries[url].complete();
        };

        this.$document.body.appendChild(script);

        return this._loadedLibraries[url].asObservable();
    }

    loadStyle(url: string): Observable<any> {
        if (this._loadedStyles[url]) {
            return this._loadedStyles[url].asObservable();
        }

        this._loadedStyles[url] = new ReplaySubject();

        const $style: HTMLLinkElement = this.$document.createElement('link');
        $style.rel = 'stylesheet';
        $style.href = url;
        $style.onload = () => {
            this._loadedStyles[url].next();
            this._loadedStyles[url].complete();
        };

        this.$document.head.appendChild($style);

        return this._loadedStyles[url].asObservable();
    }
}
