const drawWithWrap = (method, object) => {
    let objects = [object]
    let drawings = new Array()
    const x = object.x
    const y = object.y
    const r = object.r
    if (x + r > WIDTH) {
        const tempC = {...object, x:(object.x - WIDTH)}
        objects.push(tempC)
    }
    if (y + r > HEIGHT) {
        const tempC = {...object, y:(object.y - HEIGHT)}
        objects.push(tempC)
    }
    if (x - r < 0) {
        const tempC = {...object, x:(object.x + WIDTH)}
        objects.push(tempC)
    }
    if (y - r < 0) {
        const tempC = {...object, y:(object.y + HEIGHT)}
        objects.push(tempC)
    }
    if (x + r > WIDTH && y + r > HEIGHT) {
        const tempC = {...object, y:(object.y - HEIGHT), x:(object.x - WIDTH)}
        objects.push(tempC)
    }
    if (x + r > WIDTH && y - r < 0) {
        const tempC = {...object, y:(object.y + HEIGHT), x:(object.x - WIDTH)}
        objects.push(tempC)
    }
    if (x - r < 0 && y + r > HEIGHT) {
        const tempC = {...object, y:(object.y - HEIGHT), x:(object.x + WIDTH)}
        objects.push(tempC)
    }
    if (x - r < 0 && y - r < 0) {
        const tempC = {...object, y:(object.y + HEIGHT), x:(object.x + WIDTH)}
        objects.push(tempC)
    }
    for (let o of objects) {
        drawings.push(method(o))
    }
    return drawings
};

const drawTree = (t) => {
    let drawing = `
    <g transform="translate(${t.x} ${t.y}) scale(${t.r} ${t.r})">
        <path
        style="fill:#502d16"
        d="M -0.2,0.675 H 0.25 L 0.15,0.075 0.075,0.1 -0.025,0.15 -0.1,0.225 Z"
        id="path1849"
        sodipodi:nodetypes="ccccccc" />
        <ellipse
        fill="#22cc00"
        ry="0.3125"
        rx="0.27500001"
        cy="0.012500009"
        cx="-0.30000001" />
        <ellipse
        fill="#22cc00"
        cx="-0.12499999"
        cy="-0.17500003"
        rx="0.27500001"
        ry="0.3125" />
        <ellipse
        fill="#22cc00"
        cx="0.22500001"
        cy="-0.17500003"
        rx="0.27500001"
        ry="0.3125" />
        <ellipse
        fill="#22cc00"
        cx="1.0803341e-08"
        cy="0.1875"
        rx="0.27500001"
        ry="0.3125" />
        <ellipse
        fill="#22cc00"
        cx="0.29999998"
        cy="0.062499993"
        rx="0.27500001"
        ry="0.3125" />
        ${t.fruit ? `
        <circle
        fill="${t.fill}"
        cx="-0.22500001"
        cy="-0.125"
        r="0.075000003" />
        <circle
        fill="${t.fill}"
        cx="-0.024999997"
        cy="-0.32499999"
        r="0.075000003" />
        <circle
        fill="${t.fill}"
        cx="0.22500001"
        cy="-0.25"
        r="0.075000003" />
        <circle
        fill="${t.fill}"
        cx="0.050000001"
        cy="0.024999997"
        r="0.075000003" />
        <circle
        fill="${t.fill}"
        cx="-0.32499999"
        cy="0.12499999"
        r="0.075000003" />
        <circle
        fill="${t.fill}"
        cx="-0.04999999"
        cy="0.25"
        r="0.075000003" />
        <circle
        fill="${t.fill}"
        cx="0.32499999"
        cy="0.2"
        r="0.075000003" />
        <circle
        fill="${t.fill}"
        cx="0.375"
        cy="-0.050000001"
        r="0.075000003" />` : ""}
    </g>`
    return [t.y + (t.r * 0.675), drawing]
};

const drawDude = (c) => {
    return `<g transform="translate(${c.x} ${c.y}) scale(${c.r} ${c.r})">
        <path fill="${c.fill}" d="M -0.35,0.9 -0.1,0.1 v -0.45 l -0.3,0.25 -0.1,-0.1 0.4,-0.3 H 0.1 L 0.5,-0.2 0.4,-0.1 0.1,-0.35 V 0.1 L 0.35,0.9 0.2,0.9 0,0.25 -0.2,0.9 Z" id="path250"/>
        <ellipse style="stroke-width:0.793045" fill="${c.fill}" id="path252" cx="-2.9802323e-09" cy="-0.66499996" rx="0.175" ry="0.17500001" />
        </g>`;


};

const drawCircle = (c) => {
    return "<circle cx='" + c.x + "' cy='" + c.y + "' r='" + c.r +"' fill='" + c.fill + "'/>";
};

const drawBird = (b) => {
    let jO = b.jO
    let jP = (!b.baby ? b.jP : (b.jP / 2.0))
    let oS = (!b.baby ? 5 : 2.5)
    let x = ((((ticks + jO) % jP) / jP) * 2.0)
    let offset = oS * (- 1 * ((x - 1) ** 2) + 1)
    let r = (!b.baby ? b.r : b.r / 2.0)
    let drawing = `<g transform="translate(${b.x} ${(b.y + offset)}) scale(${(b.fa == "left"  ? r : (-1.0 * r))} ${r})">
    <path
       style="fill:#d45500;fill-opacity:1"
       d="m 0.04999999,0.50000005 v 0.05 l -0.1,0.1 H 0 l 0.04999999,-0.05 v 0.05 h 0.05 v -0.05 l 0.05,0.05 h 0.05 l -0.1,-0.1 v -0.05 z"/>
    <path
       style="fill:#d45500;fill-opacity:1"
       d="m -0.35000001,0.45000005 v 0.1 l -0.1,0.1 h 0.05 l 0.05,-0.05 v 0.05 h 0.05 v -0.05 l 0.05,0.05 h 0.05 l -0.1,-0.1 v -0.1 z"/>
    <circle
       fill="${b.fill}"
       cx="-0.050000001"
       cy="0.05000006"
       r="0.5" />
    <ellipse
       fill="white"
       cx="-0.10000001"
       cy="0.12500004"
       rx="0.35000002"
       ry="0.375" />
    ${ b.peck ? `<ellipse
        fill="${b.fill}"
        cx="-0.64000005"
        cy="-0.22500002"
        rx="0.30000001"
        ry="0.32499999" />
    <path
        fill="${b.fill}"
        d="m 0.28126869,-0.18304756 0.23746262,-0.73390488 0.0757296,0.25364192 0.13422525,-0.20582698 0.10602149,0.3550987 -0.41782168,0.56675256 z"/>
    <ellipse
        fill="white"
        cx="-0.80000001"
        cy="-0.29999998"
        rx="0.090000011"
        ry="0.10000002" />
    <ellipse
        fill="white"
        cx="-0.60000002"
        cy="-0.30000001"
        rx="0.10000002"
        ry="0.099999987" />
    <path
        style="fill:#ff6600;fill-opacity:1"
        d="m -0.75,-0.2 -0.15,0.1 0.05,0.2 0.2,-0.2 z"/>
    <circle
        fill="black"
        cx="-0.85000002"
        cy="-0.25"
        r="0.050000001" />
    <circle
        fill="black"
        cx="-0.64999998"
        cy="-0.25"
        r="0.050000001" />` : 
    `<ellipse
       fill="${b.fill}"
       cx="-0.25"
       cy="-0.47499999"
       rx="0.30000001"
       ry="0.32499999" />
    <path
       fill="${b.fill}"
       d="m 0.325,-0.06470583 0.4375,-0.63529412 v 0.26470588 L 0.95,-0.5941176 v 0.37058824 L 0.3875,0.20000005 Z"/>
    <ellipse
       fill="white"
       cx="-0.405"
       cy="-0.54999989"
       rx="0.094999999"
       ry="0.10000002" />
    <ellipse
       fill="white"
       cx="-0.20500001"
       cy="-0.54999995"
       rx="0.094999999"
       ry="0.099999987" />
    <path
       style="fill:#ff6600;fill-opacity:1"
       d="m -0.30000001,-0.44999995 -0.15,0.1 0.05,0.2 0.2,-0.2 z"/>
    <circle
       fill="black"
       cx="-0.40000001"
       cy=${b.eU ? "-0.5" : "-0.58" }
       r="0.050000001" />
    <circle
       fill="black"
       cx="-0.20000002"
       cy=${b.eU ? "-0.5" : "-0.58" }
       r="0.050000001" />`}
  </g>`
  return [b.y + r * 0.65, drawing]
}

const drawGrass = (g) => {
    let drawing = `<g transform="translate(${g.x} ${(g.y)}) scale(${g.rx} ${g.ry})">
    <path
       style="fill:${g.fill}"
       d="M -0.54615386,0.9 -0.8,0.25 l 0.38076923,0.5 -0.12692311,-0.7 0.38076923,0.65 v -0.8 l 0.12692311,0.7 0.25384617,-0.8 V 0.6 L 0.59615385,-0.05 0.46923077,0.65 0.85,0.2 0.46923077,0.9 Z"/>
    </g>`
    return [g.y + g.ry * 0.9, drawing]
}

const drawMeter = (b) => {
    let color = ""
    if (b.en > 100) {ticks % 10 > 5 ? color = "#0000ff" : color = "#ffffff"}
    else if (b.en < 20) {ticks % 10 > 5 ?  color = "#ff0000" : color = "#ffffff"}
    else {color = "lime"}

    return `<g transform="translate(${b.x} ${(b.y)}) scale(${b.r} ${b.r})">
    <path
       fill="${color}"
       style="fill-opacity:1"
       d="M -0.5,-0.85 V 0.8 h 1 v -1.65 h -1 l 0.05,0.05 h 0.9 v 1.55 h -0.9 V -0.8"/>
    ${b.en > 20 ? `<path
       fill="${color}"
       d="M -0.4,0.7 H 0.4 V 0.45 h -0.8 z"/>` : ""}
    ${b.en > 40 ? `<path
       fill="${color}"
       d="M -0.4,0.4 H 0.4 V 0.15 h -0.8 z"/>` : ""}
    ${b.en > 60 ? `<path
       fill="${color}"
       style="fill-opacity:1"
       d="M -0.4,0.1 H 0.4 V -0.15 H -0.4 Z"/>` : ""}
    ${b.en > 80 ? `<path
       fill="${color}"
       style="fill-opacity:1"
       d="M -0.4,-0.2 H 0.4 V -0.45 H -0.4 Z"/>` : ""}
    ${b.en > 100 ? `<path
       fill="${color}"
       style="fill-opacity:1"
       d="M -0.4,-0.5 H 0.4 V -0.75 H -0.4 Z"/>` : ""}
  </g>`

}

const drawSkull = (s) => {

    let drawing = `<g transform="translate(${s.x} ${(s.y)}) scale(${s.r} ${s.r})">
        <ellipse
            fill="grey"
            cx="-1.8626451e-09"
            cy="-0.36250001"
            rx="0.5"
            ry="0.4375" />
        <circle
            fill="grey"
            cx="-2.220446e-16"
            cy="5.9604646e-09"
            r="0.34999999" />
        <circle
            fill="grey"
            cx="-0.44999999"
            cy="0.40000001"
            r="0.15000001" />
        <ellipse
            fill="grey"
            cx="0.44999999"
            cy="0.69999999"
            rx="0.15000001"
            ry="0.15000002" />
        <ellipse
            fill="black"
            cx="-0.2"
            cy="-0.40000001"
            rx="0.15000001"
            ry="0.16249999" />
        <ellipse
            fill="black"
            cx="0.19999999"
            cy="-0.40000001"
            rx="0.15000001"
            ry="0.16249999" />
        <path
            fill="black"
            d="M -0.3,0.1 H 0.3 V 0.05 h -0.6 z"/>
        <path
            fill="black"
            d="m -0.2,0 v 0.15 h 0.05 V 0 Z"/>
        <path
            fill="black"
            d="m -0.025,0 v 0.15 h 0.05 V 0"/>
        <path
            fill="black"
            d="M 0.15,0.15 H 0.2 V 0 H 0.15 Z"/>
        <path
            fill="grey"
            d="m -0.45,0.45 0.85,0.3 c 0,0 0.1,-0.05 0.05,-0.1 C 0.4,0.6 -0.4,0.35 -0.4,0.35 Z"/>
        <circle
            fill="grey"
            cx="-0.45000002"
            cy="-0.69999999"
            r="0.15000001"
            transform="scale(1,-1)" />
        <ellipse
            fill="grey"
            cx="0.44999996"
            cy="-0.40000004"
            rx="0.15000001"
            ry="0.15000002"
            transform="scale(1,-1)" />
        <path
            fill="grey"
            d="m -0.45000003,0.65000002 0.85,-0.3 c 0,0 0.1,0.05 0.05,0.1 -0.05,0.05 -0.85,0.3 -0.85,0.3 z"/>
    </g>`
    return [s.y + s.r * 0.65, drawing]
}

const drawEgg = (e) => {
    let drawing = `<g transform="translate(${e.x} ${(e.y)}) scale(${e.r} ${e.r})">
   ${!e.cracked ? `<path
      fill="white"
      d="M 0,0.8 -0.21603371,0.7030383 -0.42,0.56428572 -0.5003567,0.33469516 -0.55,0.05 -0.45,-0.26428571 -0.3,-0.57857142 0,-0.7 0.3,-0.57857142 0.45454551,-0.25476178 0.55,0.05 0.51217115,0.30093959 0.42,0.56428572 0.21,0.70714286 Z"/>
   <ellipse
      fill="${e.fill}"
      cx="-0.2"
      cy="-0.36249998"
      rx="0.1"
      ry="0.11249999" />
   <ellipse
      fill="${e.fill}"
      cx="-0.23750001"
      cy="0.125"
      rx="0.1875"
      ry="0.22499999" />
   <ellipse
      fill="${e.fill}"
      cx="0.175"
      cy="-0.26249999"
      rx="0.175"
      ry="0.21249999" />
   <ellipse
      fill="${e.fill}"
      cx="0.25"
      cy="0.25"
      rx="0.15000001"
      ry="0.175" />
   <ellipse
      fill="${e.fill}"
      cx="-0.1"
      cy="0.55000001"
      rx="0.1"
      ry="0.125" />` :
    `<path
      fill="white"
      d="M 0.34492187,0.1 0.1,0.25 l -0.2,-0.3 -0.15,0.3 -0.2,-0.2 -0.1,0.25 -0.19492187,-0.2 -0.005859,0.0175781 0.0507809,0.28320315 0.0800781,0.23046875 0.203125,0.13867188 L -0.2,0.86757808 0.0109375,0.77382808 0.21992187,0.63124996 0.31171877,0.36757808 0.35078127,0.11757809 Z"/>
   <path
      fill="white"
      d="M 0.31992181,0.94335938 0.01914056,0.82226562 -0.12929694,0.5078125 -0.22500004,0.2109375 -0.125,0.05 0.025,0.25 0.2,0.05 0.4,0.25 0.65,0.05 0.8648437,0.2109375 0.775,0.5 0.62070312,0.82226562 Z"/>
   <ellipse
      fill="${e.fill}"
      cx="-0.40000001"
      cy="0.375"
      rx="0.10000001"
      ry="0.12499999" />
   <ellipse
      fill="${e.fill}"
      cx="-0.175"
      cy="0.60000002"
      rx="0.125"
      ry="0.175" />
   <ellipse
      fill="${e.fill}"
      cx="0.36250001"
      cy="0.60000002"
      rx="0.1875"
      ry="0.22499999" />
   <ellipse
      fill="${e.fill}"
      cx="0.64999998"
      cy="0.28749999"
      rx="0.099999994"
      ry="0.1375" />
   <ellipse
      fill="${e.fill}"
      cx="0.074999996"
      cy="0.34999999"
      rx="0.075000003"
      ry="0.087500006" />`}
      </g>`
 return [e.y + e.r * 0.7, drawing]
}