import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output() nameChanged = new EventEmitter<string>();

  onInput(value: string): void {
    this.nameChanged.emit(value);
  }
}
