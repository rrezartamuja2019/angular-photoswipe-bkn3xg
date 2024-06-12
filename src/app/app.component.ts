import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ComponentRef,
    ElementRef, Inject,
    Input,
    OnDestroy,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
    NgZone,
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { PSItem, PSUIOptions } from './photoswipe-interfaces';
import { LightboxComponent } from './components/lightbox/lightbox.component';
import { PhotoComponent } from './components/photo/photo.component';
import { DOCUMENT } from '@angular/common';
import { LegacyLibraryLazyLoaderService } from './legacy-library-loader.service';
import { combineLatest } from 'rxjs';
import { PhotoSwipe } from 'photoswipe';
import { PhotoSwipeUI_Default } from 'photoswipe/dist/photoswipe-ui-default';

const photoswipeCDN = 'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.1/';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  @ViewChildren(PhotoComponent) photoComponents: QueryList<PhotoComponent>;

  photos: PSItem[] = [];

  private overlayRef: OverlayRef;
  private lightboxComponentRef: ComponentRef<LightboxComponent>;

  constructor(
    private overlay: Overlay,
    @Inject(DOCUMENT)
    private $document: Document,
    private zone: NgZone,
    private libLoader: LegacyLibraryLazyLoaderService,
  ) { }

  ngAfterViewInit(): void {
    this.photoComponents.toArray().forEach((component: PhotoComponent) => {
      this.photos.push(component.photo);
      component.click.subscribe(this.onListingPhotoClick.bind(this));
    });
  }

  ngOnDestroy(): void {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }
  }

  onListingPhotoClick(photo: PSItem): void {
    combineLatest(
      this.libLoader.loadStyle(photoswipeCDN + 'photoswipe.min.css'),
      this.libLoader.loadStyle(photoswipeCDN + 'default-skin/default-skin.min.css'),
      this.libLoader.loadScript(photoswipeCDN + 'photoswipe.min.js'),
      this.libLoader.loadScript(photoswipeCDN + 'photoswipe-ui-default.min.js'),
    )
    .subscribe(() => 
      this.openPhotoSwipe(photo)
    );
  }

  private openPhotoSwipe(photo: PSItem): void {
    if (!window['PhotoSwipe'] || !window['PhotoSwipeUI_Default']) {
      console.log('Cannot find "PhotoSwipe" or "PhotoSwipeUI_Default" in window object...');
      return;
    }

    this.initLightbox();

    try {
      const photoIdx = this.photoComponents.toArray().findIndex(c => c.photo.src === photo.src);
      const UIOptions: PSUIOptions = {
        index: photoIdx,
        history: false,
        shareEl: false,
        showHideOpacity: true,
        addCaptionHTMLFn: (item: PSItem, captionEl: HTMLElement) => {
          if (!item.title) {
            captionEl.children[0].innerHTML = '';

            return false;
          }

          captionEl.children[0].innerHTML = item.title;

          return true;
        },
        getThumbBoundsFn: (index: number) => {
          // See Options -> getThumbBoundsFn section of documentation for more info
          const thumbnail = this.photoComponents.toArray()[index].$thumbEl.nativeElement,
            pageYScroll = window.pageYOffset || this.$document.documentElement.scrollTop,
            rect = thumbnail.getBoundingClientRect();

          console.log('this.photoComponents.toArray()', this.photoComponents.toArray());
          console.log('thumbnail', thumbnail);
          console.log('rect', rect);

          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        },
      };

      const PSWPEl: HTMLElement = <HTMLElement>this.lightboxComponentRef.location.nativeElement.firstChild;

      this.zone.runOutsideAngular(() => {
        const gallery = new window['PhotoSwipe'](PSWPEl, window['PhotoSwipeUI_Default'], this.photos, UIOptions);

        gallery.init();
        gallery.listen('destroy', this.destroyLightbox.bind(this));
      });
    } catch (e) {
      console.log('Failed to initialize PhotoSwipe', e);
      this.destroyLightbox();
    }
  }

  private initLightbox(): void {
    this.overlayRef = this.overlay.create({
      width: '100vw',
      height: '100vh',
      // positionStrategy: this.overlay.position().global(),
      disposeOnNavigation: true,
      hasBackdrop: false,
      panelClass: ['listing-photos-lightbox-overlay--disabled'],
    });

    this.lightboxComponentRef = this.overlayRef.attach(new ComponentPortal(LightboxComponent));
  }

  private destroyLightbox(): void {
    this.overlayRef.detach();
    this.overlayRef.dispose();
  }
}
