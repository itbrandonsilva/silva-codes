import {Component, OnInit, Input} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

export declare interface TerminalCommand {
    execute: (terminal: TerminalComponent) => Promise<any>;
}

export class TerminalCommandCls implements TerminalCommand {
    execute(terminal: TerminalComponent): Promise<any> {
        return new Promise(resolve => {
            terminal.cls();
            resolve();
        });
    }
}

export class TerminalCommandWrite implements TerminalCommand {
    constructor(private text: string, private interval: number) { }

    execute(terminal: TerminalComponent): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.text.length === 0) return resolve();

            let characters = this.text.split('');
            let index = 0;
            let interval = setInterval(() => {
                let character;
                while (true) {
                    character = characters[index++];
                    if (character === ' ') terminal.write(character);
                    else if (character === '\n') {
                        terminal.write(character);
                        for (let i = 0; i < terminal.indent; ++i) { terminal.write(' '); }
                    }
                    else break;
                }
                if ( ! character ) {
                    clearInterval(interval);
                    return resolve();
                }
                terminal.write(character);
            }, this.interval);
        });
    }
}

export class TerminalCommandWriteURL implements TerminalCommand {
    private start: string;
    private end: string = '</a>'

    constructor(private text: string, private interval: number, private url: string) {
        this.start = `<a href="${this.url}">`
    }

    execute(terminal: TerminalComponent): Promise<any> {
        return new Promise(resolve => {
            let length = terminal.text.length;
            let index = 0;
            let interval = setInterval(() => {
                let text = this.text.slice(0, index);
                let anchor = this.start + text + this.end;
                let original = terminal.text.slice(0, length);
                let final = original + anchor;
                terminal.text = final;
                if (index >= this.text.length) {
                    clearInterval(interval);
                    resolve();
                }
                index++;
            }, this.interval);
        });
    }
}

@Component({
    selector: 'app-terminal',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {
    @Input() inputs: Array<TerminalCommand>;
    @Input() indent: number = 4;
    text: string = '';
    private _queue: Array<TerminalCommand> = [];
    private busy: boolean = false;

    constructor(private _sanitizer: DomSanitizer) {
    }

    //execute(command: TerminalCommand) {
    //    this.running = true;
    //    Rx.Subscriber.create(
    //        result => this.output += result,
    //        err => console.error(err),
    //        () => this.
    //    );
    //}

    queue(commands: Array<TerminalCommand>) {
        commands.forEach(command => this._queue.push(command))
        this.execute();
    }

    write(text: string): void {
        this.text += text;
    }

    cls(): void {
        this.text = '';
    }

    execute() {
        if (this.busy) return;
        if (this._queue.length === 0) return;
        this.busy = true;
        let command = this._queue.shift();
        command.execute(this).then(
            () => {
                this.busy = false;
                this.execute();
            },
            (err) => { throw err }
        );
    }

    trust(text: string): SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(text);
    }

    ngOnInit() {
        setTimeout(() => {
            this.queue(this.inputs);
        }, 100);
    }
}
