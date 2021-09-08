var elc = 0;
var n = 0.5;
var g = 0;
var maxim=10000;
var food=[]
/* 
1=r
2=g
3=b
4=вероятность деления
5=междуклеточное притяжение
6=междуклеточное отталкивание
7=высасывание еды из других клеток
8=длина жгутика
9=поворот сына при делении
10=мин.разница клетки, чтобы ее съесть
11=процент своей ротации, который передается сыну-ротация сына зависит от этого,и девятого параметра
12=слипание клеток
13=угол деления
14=перенос веществ в организме
15=модификация первого потомка
16=модификация второго потомка
*/
var bas = [[0],
//1|2| 3 |4 |5| 6| 7| 8  |9|10|11|12|13|14|15|17
[1, 1, 1, 2, 4, 2,0.1,0.1,0,1, 1,  1, 1, 1, 1, 1],
[1, 1, 1, 2, 4, 2,0.1,0.1,0,1, 1,  1, 1, 1, 1, 1],
[1, 1, 1, 2, 4, 2,0.1,0.1,0,1, 1,  1, 1, 1, 1, 1],
[1, 1, 1, 2, 4, 2,0.1,0.1,0,1, 1,  1, 1, 1, 1, 1],
[1, 1, 1, 2, 4, 2,0.1,0.1,0,1, 1,  1, 1, 1, 1, 1],
[1, 1, 1, 2, 4, 2,0.1,0.1,0,1, 1,  1, 1, 1, 1, 1],
[1, 1, 1, 2, 4, 2,0.1,0.1,0,1, 1,  1, 1, 1, 1, 1],
[1, 1, 1, 2, 4, 2,0.1,0.1,0,1, 1,  1, 1, 1, 1, 1],
];
const b = -0.3;
var pot = 0.01;
var m11 = 6;
var speed = 1;
var forse = 50;
function Stepper(x, y, ctx, width, height, m, genome, a, n) {
  var vx = 0;
  var old = 0;
  var vy = 0;
  var s = 1;
  n=Math.floor(n);
  if(n>genome.length-1){
    n=genome.length-1;
  }
  if(n<1){
    n=1;
  }
  var geno=genome[n];
  return function (i) {
    s = 1;
    if (ele[i][5] > 0) {
      m = ele[i][5];
      a = ele[i][6];
    }
    vx += Math.sin(a) * geno[7] / 100;
    vy += Math.cos(a) * geno[7] / 100;
    a = goto(Math.sin(a), Math.cos(a))
    size = 4 * m;
    m1 = (m11 / size) + geno[4];
    roo = size * 2.5 * geno[5];
    vy += g;
    for (q = 0; q <= speed; q++) {
      if (x < 10) {
        a += (a - Math.PI / 2) * 0.2;
        vx += b;
        vx *= (1 - pot);
        vy *= (1 - pot);
      } else if (x > width - 10) {
        a += ((a - Math.PI * 1.5)) * 0.2;
        vx += -b;
        vx *= (1 - pot);
        vy *= (1 - pot);
      }
      if (y < 10) {
        a += a * 0.2;
        vy += b;
        vx *= (1 - pot);
        vy *= (1 - pot);
      } else if (y > height - 10) {
        a += (a - Math.PI) * 0.2;
        vy += -b - g;
        vx *= (1 - pot);
        vy *= (1 - pot);
      }
      m -= 0.001;
      if(old > maxim){
        m-=0.003;
      }
      if (m < 0.5) {
        ele.splice(i, 1);
        food.push([x,y,vx,vy,8,m])
      }
      if ((m-1)*old/600 > geno[3]) {
        var ug = geno[12];
        m /= Math.sqrt(2);
        old = 0;
        ele.push([Stepper(Math.cos(ug) * 4 + x, Math.sin(ug) * 4 + y, ctx, width, height, m, copygen(genome,0.7), geno[8] + a * geno[10], geno[14])]);
        n=geno[15];
        genome = copygen(genome,0.7);
        n=Math.floor(n);
        if(n>genome.length-1){
          n=genome.length-1;
        }
        if(n<1){
          n=1;
        }
        geno=genome[n];
      }
      vx *= (1 - pot);
      vy *= (1 - pot);
      old++;
      x = x - vx;
      y = y - vy;
      if (ele[i] != undefined & x != NaN) {
        ele[i][1] = x;
        ele[i][2] = y;
        ele[i][3] = roo;
        ele[i][4] = m1;
        ele[i][5] = m;
        ele[i][6] = a;
        ele[i][7] = geno;
        ele[i][8] = vx;
        ele[i][9] = vy;
      }
      for (var u = 0; u < food.length;u ++) {
        if (Math.sqrt((x - food[u][0]) ** 2 + (y - food[u][1]) ** 2) < food[u][4]) {
          food[u][5]-=0.001;
          m+=0.001;
      }}
      if (ele[ele.length - 1].length > 1) {
        for (var u = 0; u < ele.length; u++) {
          if (Math.sqrt((x - ele[u][1]) ** 2 + (y - ele[u][2]) ** 2) < size * 4 & u != i) {
            m-=0.001;
          }
          if (Math.sqrt((x - ele[u][1]) ** 2 + (y - ele[u][2]) ** 2) < size * 2 & u != i) {
            if (raz(ele[u][7], geno) > geno[9]) {
              ele[u][5] -= geno[6] / 100;
              m += geno[6] / 110;
            }
            ele[u][5] -= geno[13] * (ele[u][5] - m) / 100;
            m += geno[13] * (ele[u][5] - m) / 100;
            vx = (vx + ele[u][8] * (geno[11] + ele[u][7][11])/2)/(1+(geno[11] + ele[u][7][11])/2);
            vy = (vy + ele[u][9] * (geno[11] + ele[u][7][11])/2)/(1+(geno[11] + ele[u][7][11])/2);
          }
          if (ele[u][1] > x - (size+ele[u][5]) & ele[u][1] < x + (size+ele[u][5]) & y > ele[u][2]) {
            s -= 0.3333;
          }
          vx += (grax(x, y, ele[u][1], ele[u][2], 1, 1, (roo + ele[u][3]) / 2, (m1 + ele[u][4]) / 2) / m);
          vy += (gray(x, y, ele[u][1], ele[u][2], 1, 1, (roo + ele[u][3]) / 2, (m1 + ele[u][4]) / 2) / m);
        }
      }
    }
    if (y > 0) {
      m += (s - geno[6] / 4 - Math.abs(geno[7] / 10)) * j.o.value/(y+200) / 300;
    }
    if (ele[i] != undefined & x != NaN) {
      ele[i][1] = x;
      ele[i][2] = y;
      ele[i][3] = roo;
      ele[i][4] = m1;
      ele[i][5] = m;
      ele[i][6] = a;
      ele[i][7] = geno;
    }
    if (ele[i]==undefined || ele[i]==NaN || ele[i][1]==NaN){
      ele.splice(i, 1);
    }
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0,0,0,0.05)'
    ctx.fillRect(x - size, y, size * 2, height);
    ctx.moveTo(x, y);
    ctx.lineTo(Math.sin(a) * (geno[7]+1) * size + x  + Math.random() -0.5, Math.cos(a) * (geno[7]+1) * size + y + Math.random() -0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = 'rgb(' + geno[0] * s*100 + ',' + geno[1] * s * 100 + ',' + geno[2] * s *100 + ')';
    ctx.arc(x, y, size, 0, 4 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'rgb(' + geno[6] * 200 + ',0,0)';
    ctx.arc(x, y, size / 4, 0, 4 * Math.PI);
    ctx.fill();
  }
}
var ele = [];
var width = window.innerWidth - 20;
var height = window.innerHeight - 200;
var canvas = document.getElementById("myCanvas");
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");
for (i = 0; i < elc; i++) {
  var ug = Math.random() * Math.PI * 2;
  ele.push([Stepper(Math.random() * width, Math.random() * height, ctx, width, height, 1, bas, Math.random() * Math.PI * 2, 1)]);
}
setInterval(function () {
 var grd = ctx.createLinearGradient(0, 0, 0, height/(1001-j.o.value)*1000);
 grd.addColorStop(1, "#006");
 grd.addColorStop(0, "white");
 ctx.fillStyle=grd;
  ctx.fillRect(0, 0, width, height)
  for (var i = 0; i < food.length; i++) {
      for (var u = 0; u < food.length; u++) {
        food[i][2] += grax(food[i][0], food[i][1], food[u][0], food[u][1], 1, 1, 80, 4);
        food[i][3] += gray(food[i][0], food[i][1], food[u][0], food[u][1], 1, 1, 80, 4);
      }
    ctx.beginPath();
    var grd = ctx.createRadialGradient(food[i][0],food[i][1],0, food[i][0],food[i][1],food[i][4]-1);
    grd.addColorStop(0, "rgba(50,20,0,"+food[i][5]+")");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.arc(food[i][0],food[i][1], food[i][4], 0, 4 * Math.PI);
    ctx.fill();
    food[i][5]-=0.0001;
    food[i][4]+=0.02;
    food[i][3]+=g*1;
    food[i][3]*=(1-pot)*0.9;
    food[i][2]*=(1-pot)*0.9;
    food[i][1]-=food[i][3];
    food[i][0]-=food[i][2];
    if (food[i][0] < 10) {
      food[i][2] += b;
    } else if (food[i][0] > width - 10) {
      food[i][2] += -b;
    }
    if (food[i][1] < 10) {
      food[i][3] += b;
    } else if (food[i][1] > height - 10) {
      food[i][3] += -b;
    }
    if(food[i][5]<0.01){
      food.splice(i,1);
    }
  }
  for (var i = 0; i < ele.length; i++) {
    ele[i][0](i);
    g = -j.g.value;
    pot = j.p.value;
  }
}, 0)
function grax(x, y, sx, sy, m, m2, ro, m1) {
  var r = Math.sqrt((x - sx) * (x - sx) + (y - sy) * (y - sy));
  if (r > 2 & r !=NaN & r !=undefined) {
    var t = (r / (m + m2));
    var f = (r ** n - ro ** n) / r ** m1;
    return (f * (x - sx)) * forse;
  }
  else {
    return 0;
  }
}
function gray(x, y, sx, sy, m, m2, ro, m1) {
  var r = Math.sqrt((x - sx) * (x - sx) + (y - sy) * (y - sy));
  if (r >2 & r !=NaN & r !=undefined) {
    var t = (r / (m + m2));
    var f = (r ** n - ro ** n) / r ** m1;
    return (f * (y - sy)) * forse;
  }
  else {
    return 0;
  }
}
function copygen(g,mut) {
  if (Math.random() > mut) {
    var g2 = [];
    for (var i = 0; i < g.length; i++) {
      g2.push([]);
      for (var u = 0; u < g[i].length; u++) {
        g2[i].push(g[i][u] + (Math.random() - Math.random()) * 0.3);
        if (g2[i][u] <= 0) {
          g2[i][u] = 0;
        }
      }
    }
    return g2;
  }
  return g;
}
function raz(gen1, gen2) {
  var ra = 0;
  for (var i = 0; i < gen1.length; i++) {
    for (var u = 0; u < gen1[i].length; u++) {
      ra += Math.abs(gen1[i][u] - gen2[i][u]);
    }
  }
  return ra;
}
canvas.onclick = function (nnn) {
  var t = nnn.target;
  ele.push([Stepper(nnn.pageX - t.offsetLeft, nnn.pageY - t.offsetTop, ctx, width, height, 1,bas, Math.random(), 1)]);
}
function goto(cx, cy) {
  if (cy > 0) {
    return Math.atan(cx / cy)
  }
  else { return Math.atan(cx / cy) }
}