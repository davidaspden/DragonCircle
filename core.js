// Point = {x: number, y: number}  or just [x, y] array — I'll use objects for clarity

function cross(o, a, b) {
  // Vector OA × OB > 0 → left turn (counter-clockwise)
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

function convexHull(points) {
  if (points.length < 3) return points.slice();  // degenerate: 0,1,2 points

  // Sort by x, then by y (lexicographic)
  points.sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);

  const lower = [];
  for (const p of points) {
    while (lower.length >= 2 && cross(lower[lower.length-2], lower[lower.length-1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (upper.length >= 2 && cross(upper[upper.length-2], upper[upper.length-1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  // Remove the last point of each half (duplicates of start/end)
  lower.pop();
  upper.pop();

  return [...lower, ...upper];  // closed? No — but ready to close when drawing
}

const canvas = document.getElementById('dragonCanvas');
const ctx = canvas.getContext('2d');



function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw all points as small circles
  ctx.fillStyle = '#444';
  for (const p of points) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Compute hull
  const hull = convexHull(points);

  if (hull.length < 3) {
    // too few points — maybe just connect them or skip
    return;
  }

  // 3. Draw the outer path (closed polygon)
  ctx.strokeStyle = '#e74c3c';   // nice red, or #00ff9f matrix-green, your call
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(hull[0].x, hull[0].y);

  for (let i = 1; i < hull.length; i++) {
    ctx.lineTo(hull[i].x, hull[i].y);
  }
  ctx.closePath();               // connects last → first
  ctx.stroke();

  // Optional: highlight hull points differently
  ctx.fillStyle = '#e74c3c';
  for (const p of hull) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Call draw() whenever points change (on click, resize, etc.)

function generateRandomPoints(n = 5, width = canvas.width, height = canvas.height) {
  const points = [];
  const margin = 40;  // keep points away from borders

  for (let i = 0; i < n; i++) {
    const x = margin + Math.random() * (width - 2 * margin);
    const y = margin + Math.random() * (height - 2 * margin);
    points.push({ x: Math.round(x), y: Math.round(y) });
  }

  return points;
}

// Usage — call this once or on a button press
points = generateRandomPoints(5);
draw();
