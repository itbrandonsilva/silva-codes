import { Component } from '@angular/core';
import {TerminalCommand, TerminalCommandWrite, TerminalCommandWriteURL} from "./terminal/terminal.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    inputs: Array<TerminalCommand> = [];
    constructor() {
        let interval = 50;
        let intervalf = 15;
        this.inputs.push(
            new TerminalCommandWrite('\n\n\nBrandon Silva', interval),
            new TerminalCommandWrite('\n - Software Developer', interval),
            new TerminalCommandWrite('\n\nDriven by challenge.\n\n', interval),
            new TerminalCommandWriteURL('Github', intervalf, 'https://github.com/itbrandonsilva'),
            new TerminalCommandWrite('\n', interval),
            new TerminalCommandWriteURL('LinkedIn', intervalf, 'https://www.linkedin.com/in/itbrandonsilva'),
            new TerminalCommandWrite('\n', interval),
            new TerminalCommandWriteURL('Resume', intervalf, 'https://drive.google.com/open?id=0B0spQzfEVggyVXRmNnM5U2lDakk'),
            new TerminalCommandWrite('\n\n>', interval),
        );
    }
}
