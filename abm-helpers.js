const twoPi = Math.PI * 2.0

const buildDistanceList= (target, others) => {
    const result = []
    for (let i = 0; i < others.length; i++)
        result.push(distanceBetween(target, others[i]))
    return result
  }

const nearbyTrianglesFast = (
    dist,
    targetIdx,
    triangles,
    distMatrix,
  ) => {
    const result = []
    let nearest = triangles[targetIdx]
    let neardist = Infinity
    for (var i = 0; i < distMatrix.length; i++) {
      let thedist = Infinity
      if (i < targetIdx) thedist = distMatrix[targetIdx][i]
      else if (i > targetIdx) thedist = distMatrix[i][targetIdx]
      if (thedist <= state.params.vision) {
        result.push(triangles[i])
        if (thedist < neardist) {
          neardist = thedist
          nearest = triangles[i]
        }
      }
    }
    return { closest: nearest, closestDist: neardist, nearby: result }
  }

  // DISTANCE BETWEEN TWO TRIANGLES
  const distanceBetween = (t1, t2) => {
    let dx = 0.0
    let dy = 0.0
    if (t1.x > t2.x) {
      if (t1.x - t2.x < WIDTH - t1.x + t2.x) dx = t1.x - t2.x
      else dx = WIDTH - t1.x + t2.x
    } else {
      if (t2.x - t1.x < WIDTH - t2.x + t1.x) dx = t2.x - t1.x
      else dx = WIDTH - t2.x + t1.x
    }
    if (t1.y > t2.y) {
      if (t1.y - t2.y < HEIGHT - t1.y + t2.y)
        dy = t1.y - t2.y
      else dy = HEIGHT - t1.y + t2.y
    } else {
      if (t2.y - t1.y < HEIGHT - t2.y + t1.y)
        dy = t2.y - t1.y
      else dy = HEIGHT - t2.y + t1.y
    }

    return (dx ** 2 + dy ** 2) ** 0.5
  }
  const aTan = (opp, adj) => {
    if (adj == 0) {
      if (opp > 0) return twoPi / 4.0
      else return (-1.0 * twoPi) / 4.0
    } else {
      let res = Math.atan(opp / adj)
      if (adj > 0) {
        return res
      } else return twoPi / 2.0 + res
    }
  }

  const getNearest = (me, group) => {
     let result = {e: null, d: Infinity}
     for (let g of group) {
      let d = distanceBetween(me, g)
      if (d < result.d)
        result = {e: g, d: d };
     }
     return result
  }

  const getNearestFront = (me, group) => {
    let result = {e: null, d: Infinity}
    for (let g of group) {
     let d = distanceBetween(me, {...g, y: g.y + 15})
     if (d < result.d)
       result = {e: g, d: d };
    }
    return result
 }

  // GET RELATIVE SEPARATION
  const getRelativeSeparation = (target, other) => {
    let dx = 0.0
    let dy = 0.0
    if (target.x > other.x) {
      if (target.x - other.x < WIDTH - target.x + other.x)
        dx = -(target.x - other.x)
      else dx = WIDTH - target.x + other.x
    } else {
      if (other.x - target.x < WIDTH + target.x - other.x)
        dx = other.x - target.x
      else dx = -(WIDTH + target.x - other.x)
    }
    if (target.y > other.y) {
      if (target.y - other.y < HEIGHT - target.y + other.y)
        dy = -(target.y - other.y)
      else dy = HEIGHT - target.y + other.y
    } else {
      if (other.y - target.y < HEIGHT + target.y - other.y)
        dy = other.y - target.y
      else dy = -(HEIGHT + target.y - other.y)
    }

    return { x: dx, y: dy }
  }

  // HEADING TOWARD NEARBY CENTER OF MASS
  const headingTowardNearby = (target, nearby) => {
    let dx = 0.0
    let dy = 0.0
    nearby.forEach((t) => {
      let d = getRelativeSeparation(target, t)
      dx += d.x
      dy += d.y
    })
    return aTan(dy, dx)
  }

  const headingToward = (me, them) => {
    let d = getRelativeSeparation(me, them)
    return aTan(d.y, d.x)
  }

  // AVERAGE HEADING OF A LIST OF TRINAGLES
  const avgHeading = (objects) => {
    let sumDX = 0.0
    let sumDY = 0.0
    objects.forEach((o) => {
        sumDX += Math.cos(o.h)
        sumDY += Math.sin(o.h)
    })
    return ((aTan(sumDY, sumDX) % twoPi) + twoPi) % twoPi
  }

  // DETERMINING THE ANGLE TOWARD ANOTHER ANGLE (MAYBE A BUG HERE- LOOK AT!)
  const angleToward = (mine, other, max) => {
    if (mine > other) {
      if (mine - other < twoPi - mine + other) {
        return -1.0 * Math.min(Math.abs(mine - other), max)
      } else {
        return Math.min(Math.abs(twoPi - mine + other), max)
      }
    } else {
      if (other - mine < twoPi - other + mine) {
        return Math.min(Math.abs(other - mine), max)
      } else {
        return -1.0 * Math.min(Math.abs(twoPi - other + mine), max)
      }
    }
  }

  const shorterAngle = (source, option1, option2) => {
    //given two options wich angle is closer to the source angle
    let minD = Infinity
    let minOpt = 1
    if (Math.abs(source - option1) < minD) {
      minD = Math.abs(source - option1)
      minOpt = 1
    }
    if (Math.abs(source - option2) < minD) {
      minD = Math.abs(source - option2)
      minOpt = 2
    }
    if (Math.abs(twoPi - source + option1) < minD) {
      minD = Math.abs(twoPi - source + option1)
      minOpt = 1
    }
    if (Math.abs(twoPi - source + option2) < minD) {
      minD = Math.abs(twoPi - source + option2)
      minOpt = 2
    }
    if (Math.abs(twoPi - option1 + source) < minD) {
      minD = Math.abs(twoPi - option1 + source)
      minOpt = 1
    }
    if (Math.abs(twoPi - option2 + source) < minD) {
      minD = Math.abs(twoPi - option2 + source)
      minOpt = 2
    }
    return minOpt == 1 ? option1 : option2
  }