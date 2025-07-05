export function yardsToMiles(yards: number): number {
    if (typeof yards !== 'number' || isNaN(yards)) {
        throw new Error("Input must be a valid number");
    }
    return yards / 1000;
}