export interface infish {
	id: number,
	nodeName: string,
	name: string,
	path: any[],
	type: number,
}

export class fishData {
	public static data: infish[] = [
		{ id: 0, nodeName: "fish0", name: "待定", path: [0], type: 1, },
		{ id: 1, nodeName: "fish1", name: "待定", path: [1], type: 0, },
		{ id: 2, nodeName: "fish2", name: "待定", path: [2], type: 0, },
		{ id: 3, nodeName: "fish3", name: "待定", path: [3], type: 1, },
		{ id: 4, nodeName: "fish4", name: "待定", path: [4], type: 0, },
		{ id: 5, nodeName: "fish5", name: "待定", path: [5], type: 1, },
		{ id: 6, nodeName: "fish6", name: "待定", path: [6], type: 2, },
		{ id: 7, nodeName: "fish7", name: "待定", path: [7], type: 0, },
		{ id: 8, nodeName: "fish8", name: "待定", path: [8], type: 2, },
		{ id: 9, nodeName: "fish9", name: "待定", path: [9], type: 3, },
		{ id: 10, nodeName: "fish10", name: "待定", path: [10], type: 0, },
		{ id: 11, nodeName: "fish11", name: "待定", path: [11], type: 3, },
		{ id: 12, nodeName: "fish12", name: "待定", path: [12], type: 3, },
		{ id: 13, nodeName: "fish13", name: "待定", path: [13], type: 3, },
		{ id: 14, nodeName: "fish14", name: "待定", path: [14], type: 3, },
		{ id: 15, nodeName: "fish15", name: "待定", path: [12], type: 4, },
		{ id: 16, nodeName: "fish16", name: "待定", path: [11], type: 4, },
		{ id: 17, nodeName: "fish17", name: "待定", path: [7], type: 4, },
		{ id: 18, nodeName: "fish18", name: "待定", path: [8], type: 4, },
	]
}
