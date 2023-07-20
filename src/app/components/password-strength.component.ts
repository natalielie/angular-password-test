import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-password-strength',
  styleUrls: ['./password-strength.component.scss'],
  templateUrl: './password-strength.component.html',
})

export class PasswordStrengthComponent implements OnChanges {
  section0!: string; 
  section1!: string;
  section2!: string;

  // bounds to the password control on the form
  @Input()
    public passwordToCheck: string | undefined | null;

  // event to emit boolean value
  @Output() passwordStrength = new EventEmitter<boolean>();

  colors = ['#730f0f', '#d69d0d', '#32a852'];

  message!: string;
  messageColor!: string;

  checkStrength(password: string) {

    let strength = 0;

    // regex to check the password strength
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const letters = /[A-Za-z]+/.test(password);
    const numbers = /[0-9]+/.test(password);
    const symbols = regex.test(password);

    const flags = [letters, numbers, symbols];

    let successMatchCount = 0;
    for (const flag of flags) {
      successMatchCount += flag === true ? 1 : 0;
    }

    // setting the strength level
    strength += 2 * password.length + (password.length >= 10 ? 1 : 0);
    strength += successMatchCount * 10;

    //a special case for painting all sections red
    strength = password.length <= 7 ? Math.min(strength, 5) : strength;

    //depending on passed regex, set the strehgth
    strength = successMatchCount === 1 ? Math.min(strength, 10) : strength;
    strength = successMatchCount === 2 ? Math.min(strength, 20) : strength;
    strength = successMatchCount === 3 ? Math.min(strength, 30) : strength;

    return strength;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes['passwordToCheck'].currentValue;

    this.setSectionColors(3, '#707070');

    if (password) {
      const passwordStrength = this.checkStrength(password);
      passwordStrength === 30 ? this.passwordStrength.emit(true) 
      : this.passwordStrength.emit(false);

      const color = this.getColor(passwordStrength);
      this.setSectionColors(color.index, color.color);

      switch (passwordStrength) {
        case 5:
          this.message = '';
          break;
        case 10:
          this.message = 'Poor';
          break;
        case 20:
          this.message = 'Medium';
          break;
        case 30:
          this.message = 'Good';
          break;
      }
    } else {
      this.message = '';
    }
  }


  // colors management 
  
  private getColor(strength: number) {
    let index = 0;
    let color = '';

    if (strength === 5) {
      index = 3;
      color = this.colors[0];
    } else if(strength === 10){
      index = 0;
      color = this.colors[index];
    }else if (strength === 20) {
      index = 1;
      color = this.colors[index];
    } else if (strength === 30) {
      index = 2;
      color = this.colors[index];
    } else {
      index = 3;
      color = this.colors[index];
    }

    this.messageColor = this.colors[index];

    return {
      index: index + 1,
      color: color,
    };
  }

  private setSectionColors(count: number, color: string) {
    for (let n = 0; n < count; n++) {
      (this as any)['section' + n] = color;
    }
  }
}
