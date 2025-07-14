export function generateCpf(): string {
	const rnd = (n: number): number => Math.round(Math.random() * n)
	const mod = (base: number, div: number): number =>
		Math.round(base - Math.floor(base / div) * div)

	const n = Array.from({ length: 9 }, () => rnd(9))

	let d1 = n.map((num, i) => num * (10 - i)).reduce((a, b) => a + b) % 11
	d1 = d1 < 2 ? 0 : 11 - d1

	let d2 =
		[...n, d1].map((num, i) => num * (11 - i)).reduce((a, b) => a + b) % 11
	d2 = d2 < 2 ? 0 : 11 - d2

	return `${n.join('')}${d1}${d2}`
}
