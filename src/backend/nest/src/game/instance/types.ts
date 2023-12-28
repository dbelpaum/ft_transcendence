export type Position = {
	x: number;
	y: number;
	z: number;
};

export type Paddle = {
	width: number;
	height: number;
	depth: number;
	position: Position;
	movement: number;
};

export type Ball = {
	radius: number;
	speedModifier: number;
	velocity: Position;
	position: Position;
}