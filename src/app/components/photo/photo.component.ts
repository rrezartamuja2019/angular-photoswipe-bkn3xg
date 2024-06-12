import { ViewChild, ElementRef, Output, EventEmitter, Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { PSItem } from '../../photoswipe-interfaces';

@Component({
  selector: 'photo',
  templateUrl: './photo.component.html',
  styleUrls: [
    './photo.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoComponent {

  @Output() click = new EventEmitter<PSItem>();

  @ViewChild('thumbEl') $thumbEl: ElementRef<HTMLImageElement>;

  private width = 1500;
  private height = this.width * (3 / 4);

  get photo(): PSItem {
    return {
      src: this.src,
      msrc: this.thumbSrc,
      w: this.width,
      h: this.height,
      caption: '',
    };
  }

  get src() {
    return `https://via.placeholder.com/${this.width}x${this.height}`;
  }

  get thumbSrc() {
    return `https://via.placeholder.com/${Math.floor(this.width * .25)}x${Math.floor(this.height * .25)}`;
  }

  onClick(e: MouseEvent) {
    // Give the user an option to open the image in a new tab
    if (e.metaKey || e.ctrlKey) {
      return;
    }

    e.preventDefault();
    this.click.emit(this.photo);
  }

}
