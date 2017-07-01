import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {State} from './state.model';
import {GameService} from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'app';
  state:State;
  columns:number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  loading:boolean = false;

  constructor(private _gameService:GameService, private _changeDetector:ChangeDetectorRef) {
    this.state = new State();
  }

  get isGameEnded() {
    return this._gameService.isGameEnded(this.state);
  }

  makeStep(index:number) {
    if (!this.state.board[index] && !this.isGameEnded) {
      this.state = this._gameService.makeFullStep(index, this.state);
      this._changeDetector.markForCheck();
    }
  }

  reset() {
    this.loading = true;
    this.state = this._gameService.reset();
    // made this because in chrome here we have change detection bug.
    setTimeout(() => {
      this.loading = false;
      this._changeDetector.markForCheck();
    });
  }
}
