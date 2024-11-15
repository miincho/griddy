const grid = document.getElementById('grid');
let baseHue; 

function getRandomInRange(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

//creating a recursive grid element
function createRecursiveDiv(depth = 0) {
const div = document.createElement('div');
div.classList.add('grid-item');

const width = getRandomInRange(5, 300);
const height = getRandomInRange(5, 250);

// shades of the base hue --> params for lightness and darkness
const lightness = getRandomInRange(40, 80);
const color = `hsl(${baseHue}, 70%, ${lightness}%)`;

div.style.width = `${width}px`;
div.style.height = `${height}px`;
div.style.backgroundColor = color;

//randomly adding nested items
if (depth < 2 && Math.random() > 0.5) {
const nestedGrid = document.createElement('div');
nestedGrid.classList.add('nested-grid');

const nestedItems = getRandomInRange(2, 5);
for (let i = 0; i < nestedItems; i++) {
  const nestedDiv = document.createElement('div');
  nestedDiv.classList.add('nested-item');

  // Nested items use a lighter variation
  const nestedLightness = getRandomInRange(30, 50);
  nestedDiv.style.backgroundColor = `hsl(${baseHue}, 70%, ${nestedLightness}%)`;

  nestedGrid.appendChild(nestedDiv);
}

div.appendChild(nestedGrid);
}

return div;
}

// generate a new grid dynamically --> clear grid and select new color
function generateGrid() {
    grid.innerHTML = ''; 
    baseHue = getRandomInRange(0, 360);
    const numItems = Math.floor(window.innerWidth / 60) * Math.floor(window.innerHeight / 60); // Fill screen

    let i = 0;

    //add on 10 ms timer
    function addItem() {
        if (i < numItems) {
            const div = createRecursiveDiv();
            grid.appendChild(div);
            i++;
            setTimeout(addItem, 10); 
        }
    }
    addItem();
}


//sort the grid items
function sortGrid(criteria) {
  const items = Array.from(grid.children);

  items.sort((a, b) => {
    if (criteria === 'size') {
      return a.offsetWidth * a.offsetHeight - b.offsetWidth * b.offsetHeight;
    } else if (criteria === 'color') {
      return a.style.backgroundColor.localeCompare(b.style.backgroundColor);
    }
    return 0;
  });

  // Re-add the sorted items to the grid
  items.forEach(item => grid.appendChild(item));
}

//flatten nested divs
function flattenGrid() {
  const items = Array.from(grid.children);

  items.forEach(item => {
    const nestedGrid = item.querySelector('.nested-grid');
    if (nestedGrid) {
      const nestedItems = Array.from(nestedGrid.children);

      // Detach nested items and add them to the main grid
      nestedItems.forEach(nestedItem => {
        nestedItem.classList.remove('nested-item');
        nestedItem.classList.add('grid-item');
        grid.appendChild(nestedItem);
      });

      // Remove the empty nested grid
      nestedGrid.remove();
    }
  });
}

//sort by color and then size
function sortGridByColorAndSize() {
const items = Array.from(grid.children);

//sort by color first then check to see if colors are matched --> then sort by height
items.sort((a, b) => {
    const colorComparison = a.style.backgroundColor.localeCompare(b.style.backgroundColor);
    if (colorComparison !== 0) {
    return colorComparison;
    }
    return a.offsetHeight - b.offsetHeight;
});

// Re-add the sorted items to the grid
items.forEach(item => grid.appendChild(item));
}
// generateGrid();
