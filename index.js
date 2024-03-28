const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let counter = 0;

let angle = 0;
const points = [
  [-100, -100, -100],
  [100, -100, -100],
  [100, 100, -100],
  [-100, 100, -100],
  [-100, -100, 100],
  [100, -100, 100],
  [100, 100, 100],
  [-100, 100, 100],
];

function multiply_matrices(A, B) {
  // computes A * B
  const A_rows_num = A.length;
  const A_cols_num = A[0].length;
  const B_rows_num = B.length;
  const B_cols_num = B[0].length;
  if (A_cols_num != B_rows_num) return;
  let result = [];
  for (let i = 0; i < A_rows_num; i++) {
    let row = [];
    for (let j = 0; j < B_cols_num; j++) {
      let c = 0;
      for (let k = 0; k < A_cols_num; k++) c += A[i][k] * B[k][j];
      row.push(c);
    }
    result.push(row);
  }
  return result;
}

function multiply_matrix_vector(matrix, vec) {
  // result = matrix * vec
  const matrix_rows_num = matrix.length;
  const matrix_cols_num = matrix[0].length;
  if (matrix_cols_num != vec.length) return;
  let result = [];
  for (let i = 0; i < matrix_rows_num; i++) {
    let c = 0;
    for (let j = 0; j < matrix_cols_num; j++) {
      c += matrix[i][j] * vec[j];
    }
    result.push(c);
  }
  return result;
}

function update() {
  counter += 10;

  if (counter >= 20) {
    // clear the canvas
    context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const rotationX_matrix = [
      [1, 0, 0],
      [0, Math.cos(angle), -Math.sin(angle)],
      [0, Math.sin(angle), Math.cos(angle)],
    ];
    const rotationY_matrix = [
      [Math.cos(angle), 0, Math.sin(angle)],
      [0, 1, 0],
      [-Math.sin(angle), 0, Math.cos(angle)],
    ];
    const rotationZ_matrix = [
      [Math.cos(angle), -Math.sin(angle), 0],
      [Math.sin(angle), Math.cos(angle), 0],
      [0, 0, 1],
    ];

    let rotation_matrix = multiply_matrices(rotationX_matrix, rotationY_matrix);
    rotation_matrix = multiply_matrices(rotation_matrix, rotationZ_matrix);

    let rotated_points = [];
    for (const point of points) {
      // rotate the point
      let rotated_point = multiply_matrix_vector(rotation_matrix, point);
      rotated_points.push(rotated_point);
      // draw the point
      context.beginPath();
      context.fillStyle = "white";
      context.arc(rotated_point[0], rotated_point[1], 10, 0, 2 * Math.PI);
      context.fill();
    }

    // connect the points
    for (let i = 0; i < 4; i++) {
      connect(i, (i + 1) % 4, rotated_points);
      connect(i + 4, ((i + 1) % 4) + 4, rotated_points);
      connect(i, i + 4, rotated_points);
    }

    counter = 0;
    angle += 0.01;
  }
  requestAnimationFrame(update);
}

function connect(i, j, points) {
  context.strokeStyle = "white";
  context.beginPath();
  context.moveTo(points[i][0], points[i][1]);
  context.lineTo(points[j][0], points[j][1]);
  context.stroke();
}

// Translate the coordinate system origin to the canvas center
context.translate(canvas.width * 0.5, canvas.height * 0.5);

requestAnimationFrame(update);
