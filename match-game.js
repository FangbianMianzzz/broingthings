class MatchGame {
    constructor() {
        this.grid = [];
        this.size = 8;
        this.colors = ['#FF6B6B', '#4ECDC4', '#FFEEAD'];
        this.selectedCell = null;
        this.score = 0;
        this.level = 1;
        this.moves = 10;
        this.boosterCount = 0;
        
        this.init();
    }

    init() {
        this.createGrid();
        this.renderGrid();
        this.setupEventListeners();
        this.updateUI();
    }

    createGrid() {
        for(let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for(let j = 0; j < this.size; j++) {
                this.grid[i][j] = this.getRandomColor();
            }
        }
    }

    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    renderGrid() {
        const container = document.querySelector('.match-game-grid');
        container.innerHTML = '';
        
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                const cell = document.createElement('div');
                cell.className = 'match-game-cell';
                cell.style.backgroundColor = this.grid[i][j];
                cell.dataset.row = i;
                cell.dataset.col = j;
                container.appendChild(cell);
            }
        }
    }

    setupEventListeners() {
        const container = document.querySelector('.match-game-grid');
        container.addEventListener('click', (e) => {
            const cell = e.target.closest('.match-game-cell');
            if(!cell) return;

            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);

            if(this.selectedCell) {
                if(this.isAdjacent(this.selectedCell, {row, col})) {
                    this.swapCells(this.selectedCell, {row, col});
                    this.moves--;
                    this.updateUI();
                    this.checkGameState();
                }
                this.selectedCell = null;
                document.querySelectorAll('.match-game-cell').forEach(c => 
                    c.style.border = 'none');
            } else {
                this.selectedCell = {row, col};
                cell.style.border = '2px solid #000';
            }
        });

        document.getElementById('restartGame').addEventListener('click', () => {
            this.restart();
        });

        document.getElementById('useBooster').addEventListener('click', () => {
            if(this.boosterCount > 0) {
                this.useBooster();
            }
        });
    }

    isAdjacent(cell1, cell2) {
        const rowDiff = Math.abs(cell1.row - cell2.row);
        const colDiff = Math.abs(cell1.col - cell2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    swapCells(cell1, cell2) {
        const temp = this.grid[cell1.row][cell1.col];
        this.grid[cell1.row][cell1.col] = this.grid[cell2.row][cell2.col];
        this.grid[cell2.row][cell2.col] = temp;
        
        if(!this.checkMatches()) {
            // 如果没有匹配，换回来
            this.grid[cell2.row][cell2.col] = this.grid[cell1.row][cell1.col];
            this.grid[cell1.row][cell1.col] = temp;
            this.moves++; // 恢复步数
        }
        
        this.renderGrid();
    }

    checkMatches() {
        let hasMatches = false;
        
        // 检查行
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size - 2; j++) {
                if(this.grid[i][j] === this.grid[i][j+1] && 
                   this.grid[i][j] === this.grid[i][j+2]) {
                    hasMatches = true;
                    this.removeMatch(i, j, 'row');
                }
            }
        }
        
        // 检查列
        for(let i = 0; i < this.size - 2; i++) {
            for(let j = 0; j < this.size; j++) {
                if(this.grid[i][j] === this.grid[i+1][j] && 
                   this.grid[i][j] === this.grid[i+2][j]) {
                    hasMatches = true;
                    this.removeMatch(i, j, 'col');
                }
            }
        }
        
        if(hasMatches) {
            this.score += 10;
            this.boosterCount = Math.floor(this.score / 100);
            this.updateUI();
            this.dropCells();
        }
        
        return hasMatches;
    }

    removeMatch(startRow, startCol, direction) {
        if(direction === 'row') {
            for(let j = startCol; j < startCol + 3; j++) {
                this.grid[startRow][j] = null;
            }
        } else {
            for(let i = startRow; i < startRow + 3; i++) {
                this.grid[i][startCol] = null;
            }
        }
    }

    dropCells() {
        // 下落逻辑
        for(let j = 0; j < this.size; j++) {
            let emptySpaces = 0;
            for(let i = this.size - 1; i >= 0; i--) {
                if(this.grid[i][j] === null) {
                    emptySpaces++;
                } else if(emptySpaces > 0) {
                    this.grid[i + emptySpaces][j] = this.grid[i][j];
                    this.grid[i][j] = null;
                }
            }
            
            // 填充新的方块
            for(let i = 0; i < emptySpaces; i++) {
                this.grid[i][j] = this.getRandomColor();
            }
        }
        
        this.renderGrid();
        
        // 检查是否还有可以消除的
        setTimeout(() => {
            if(this.checkMatches()) {
                this.dropCells();
            }
        }, 300);
    }

    useBooster() {
        if(this.selectedCell && this.boosterCount > 0) {
            const {row, col} = this.selectedCell;
            for(let i = Math.max(0, row-1); i <= Math.min(this.size-1, row+1); i++) {
                for(let j = Math.max(0, col-1); j <= Math.min(this.size-1, col+1); j++) {
                    this.grid[i][j] = null;
                }
            }
            this.boosterCount--;
            this.dropCells();
            this.selectedCell = null;
            this.updateUI();
        }
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('useBooster').disabled = this.boosterCount === 0;
    }

    checkGameState() {
        if(this.moves <= 0) {
            if(this.score >= this.level * 100) {
                this.level++;
                this.moves = 10 + this.level * 2;
                alert(`恭喜通过第${this.level-1}关！`);
            } else {
                alert('游戏结束！');
                this.restart();
            }
        }
    }

    restart() {
        this.score = 0;
        this.level = 1;
        this.moves = 10;
        this.boosterCount = 0;
        this.selectedCell = null;
        this.createGrid();
        this.renderGrid();
        this.updateUI();
    }
}

// 在 main.js 中初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const game = new MatchGame();
}); 