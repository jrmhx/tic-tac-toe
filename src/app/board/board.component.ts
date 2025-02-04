import { Component, computed, OnInit, WritableSignal, signal} from '@angular/core';
import { SquareComponent } from '../square/square.component';

@Component({
    selector: 'app-board',
    imports: [SquareComponent],
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit{
    ngOnInit(): void {
        this.newGame();
    }
    
    squares: WritableSignal<('X' | 'O' | null)[]> = signal(Array(9).fill(null));
    winner: string | null = null;
    step = signal(0);
    isNextX = computed(() => this.step() % 2 === 0)
    
    get player(): 'X' | 'O'{
        return this.isNextX() ? 'X' : 'O';
    }

    calculateWinner = () => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (const line of lines) {
            const [a, b, c] = line;
            if (this.squares()[a] && this.squares()[a] === this.squares()[b] && this.squares()[a] === this.squares()[c]) {
                return this.squares()[a];
            }
        }
        return null;
    }

    newGame = () => {
        this.squares.set(Array(9).fill(null));
        this.winner = null;
        this.step.set(0);
    }
    

    move(idx: number): void {
        console.log("move "+idx);
        console.log(this.squares()[idx])

        if (this.squares()[idx] || this.winner) {
            console.log("end");
            return;
        }
        const squares = this.squares().slice();
        squares[idx] = this.player;
        this.squares.set(squares);
        this.step.update(value => value + 1);

        this.winner = this.calculateWinner();
    }
}
