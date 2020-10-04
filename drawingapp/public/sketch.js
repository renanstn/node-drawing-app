let socket
let color = '#FFF'
let strokeWidth = 4
const PORT = process.env.PORT || 5000;

function setup() {
	// Cria o canvas
	const cv = createCanvas(800, 600)
	cv.position(600, 100)
	cv.background(0)

	// Inicia a conexão com o server via socket.io
	// socket = io.connect('http://localhost:3000')
	socket = io.connect(`https://node-drawing-app.herokuapp.com:${PORT}`)

	// Função de callback
	socket.on('mouse', data => {
		stroke(data.color)
		strokeWeight(data.strokeWidth)
		line(data.x, data.y, data.px, data.py)
	})

	const color_picker = select('#pickcolor')
	const color_btn = select('#color-btn')
	const color_holder = select('#color-holder')

	const stroke_width_picker = select('#stroke-width-picker')
	const stroke_btn = select('#stroke-btn')

	// Cria um listener para o botão que muda a cor do pincel
	color_btn.mousePressed(() => {
		// Verifica se o input é uma cor hexadecimal válida
		if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color_picker.value())) {
			color = color_picker.value()
			color_holder.style('background-color', color)
		}
		else {console.log('Enter a valid hex value')}
	})

	// Cria um listener para o botão que altera a espessura do pincel
	stroke_btn.mousePressed(() => {
		const width = parseInt(stroke_width_picker.value())
		if (width > 0) strokeWidth = width
	})
}

function mouseDragged() {
	// Desenha
	stroke(color)
	strokeWeight(strokeWidth)
	line(mouseX, mouseY, pmouseX, pmouseY)

	// Envia as coordenadas do mouse
	sendmouse(mouseX, mouseY, pmouseX, pmouseY)
}

// Envia as informações via socket.io
function sendmouse(x, y, pX, pY) {
	const data = {
		x: x,
		y: y,
		px: pX,
		py: pY,
		color: color,
		strokeWidth: strokeWidth,
	}

	socket.emit('mouse', data)
}
