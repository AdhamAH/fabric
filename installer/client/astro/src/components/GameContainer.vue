<!-- src/components/GameContainer.vue -->
<template>
  <section id="game-container" class="border p-4 mb-4">
    <div v-for="(row, index) in rows" :key="index" class="flex">
      <div v-for="cell in grid[index]"
           :key="cell.xpos + '-' + cell.ypos"
           @click="revealCell(cell.xpos, cell.ypos, true)"
           @contextmenu.prevent="flagCell(cell.xpos, cell.ypos)"
           :class="classNames(
               'w-8 h-8 border border-gray-400 flex items-center justify-center text-center',
               cell.isRevealed ? 'bg-gray-400' : '',
               cell.isFlagged ? 'bg-red-400' : '',
               cell.isMine ? 'bg-green-400' : '',
           )"
           class="w-8 h-8 border border-gray-400 flex items-center justify-center text-center;">
        {{ cell.isRevealed ? (cell.isMine ? '💣' : cell.value) : '' }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import classNames from 'classnames';
interface Cell {
  xpos: number;
  ypos: number;
  value: number;
  isRevealed: boolean;
  isMine: boolean;
  isFlagged: boolean;
}

const rows = ref(10);
const cols = ref(10);
const grid = ref<Cell[][]>([]);

const initializeGrid = () => {
  const tempGrid: Cell[][] = [];
  for (let r = 0; r < rows.value; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols.value; c++) {
      row.push({
        xpos: r,
        ypos: c,
        value: 0,
        isRevealed: false,
        isMine: Math.random() < 0.2,
        isFlagged: false
      });
    }
    tempGrid.push(row);
  }
  grid.value = tempGrid;
};

const getCellClasses = (x: number, y: number) => {
  const cell = grid.value[x][y];
  return {
    'bg-gray-300': cell.isRevealed,
    'bg-green-300': cell.isFlagged,
    'cursor-pointer': !cell.isRevealed
  };
};

const revealCell = (x: number, y: number, userAction: boolean) => {
  const cell = grid.value[x][y];
  if (cell.isRevealed || (userAction && cell.isFlagged)) return;

  cell.isRevealed = true;

  if (cell.isMine && userAction) {
    alert("BOOM! Game Over");
    initializeGrid();
    return;
  }

  // Count neighboring mines, and reveal them
  if (cell.value === 0) {
    const directions = [
      { x: -1, y:  0 },
      { x:  1, y:  0 },
      { x:  0, y: -1 },
      { x:  0, y:  1 },
      { x: -1, y: -1 },
      { x: -1, y:  1 },
      { x:  1, y: -1 },
      { x:  1, y:  1 },
    ];
    for (const dir of directions) {
      const nx = x + dir.x;
      const ny = y + dir.y;
      if (nx >= 0 && nx < rows.value && ny >= 0 && ny < cols.value) {
        revealCell(nx, ny, false);
      }
    }
  }
};

const flagCell = (x: number, y: number) => {
  const cell = grid.value[x][y];
  if (cell.isRevealed) return;
  cell.isFlagged = !cell.isFlagged;
};

onMounted(initializeGrid);
</script>
