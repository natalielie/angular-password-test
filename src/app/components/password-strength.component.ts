import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-password-strength',
  styleUrls: ['./password-strength.component.scss'],
  templateUrl: './password-strength.component.html',
})

export class PasswordStrengthComponent implements OnChanges {
  bar0!: string;
  bar1!: string;
  bar2!: string;

  @Input()
    public passwordToCheck: string | undefined | null;

  @Output() passwordStrength = new EventEmitter<boolean>();

  private colors = ['#730f0f', '#d69d0d', '#32a852'];

  message!: string;
  messageColor!: string;

  checkStrength(password: string) {
    // 1
    let force = 0;

    // 2
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const lowerLetters = /[a-z]+/.test(password);
    const upperLetters = /[A-Z]+/.test(password);
    const numbers = /[0-9]+/.test(password);
    const symbols = regex.test(password);

    // 3
    const flags = [lowerLetters, upperLetters, numbers, symbols];

    // 4
    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    // 5
    force += 2 * password.length + (password.length >= 10 ? 1 : 0);
    force += passedMatches * 10;

    // 6
    force = password.length <= 6 ? Math.min(force, 10) : force;

    // 7
    force = passedMatches === 1 ? Math.min(force, 10) : force;
    force = passedMatches === 2 ? Math.min(force, 20) : force;
    force = passedMatches === 3 ? Math.min(force, 30) : force;
   
    if(password.length > 0 && password.length < 8)
    force = 5;

    return force;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes['passwordToCheck'].currentValue;

    this.setBarColors(3, '#707070');

    if (password) {
      const pwdStrength = this.checkStrength(password);
      pwdStrength === 30 ? this.passwordStrength.emit(true) : this.passwordStrength.emit(false);

      const color = this.getColor(pwdStrength);
      this.setBarColors(color.index, color.color);

      switch (pwdStrength) {
        case 5:
          this.message = '';
          break;
        case 10:
          this.message = 'Poor';
          break;
        case 20:
          this.message = 'Average';
          break;
        case 30:
          this.message = 'Good';
          break;
      }
    } else {
      this.message = '';
    }
  }

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

  private setBarColors(count: number, color: string) {
    for (let n = 0; n < count; n++) {
      (this as any)['bar' + n] = color;
    }
  }
}
