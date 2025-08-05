import { describe, it, expect } from 'vitest';
import { parse} from '$lib/util';

describe('parse', () => {
	it('adds 1 + 2 to equal 3', () => {
		const a = parse("A02:H02");
		expect(1 + 2).toBe(3);
	});
});
