import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-name-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './name-input.component.html',
  styleUrl: './name-input.component.css'
})
export class NameInputComponent {
  @Input() currentName = '';
  @Input() maxLength = 40;
  @Input() hasError = false;
  @Input() errorMessage = '';

  @Output() nameChanged = new EventEmitter<string>();
  @Output() errorCleared = new EventEmitter<void>();

  @ViewChild('inputElement') inputRef!: ElementRef<HTMLInputElement>;

  onInput(value: string): void {
    if (this.hasError) {
      this.hasError = false;
      this.errorCleared.emit();
    }
    this.nameChanged.emit(value);
  }

  focusInput(): void {
    if (this.inputRef) {
      this.inputRef.nativeElement.focus();
    }
  }
}
