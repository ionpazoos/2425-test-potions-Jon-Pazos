import { Modifier } from "./Modifier";

export interface Antidotes {
	_id: string,
	name: string,
	description: string,
	image: string,
	type: string,
	value: number,
	modifiers: Modifier | null | undefined
}