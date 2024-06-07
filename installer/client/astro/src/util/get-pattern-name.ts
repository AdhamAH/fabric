export function getPatternName(name:string){
    return name.replace('/patterns/','').replace('/system.md','').replace(/[_-]/g, ' ');
}
export function transformPath(filePath: string): string {
    // Match and capture the part of the path from "patterns" onwards until just before "/system.md"
    const regex = /\/patterns\/[^/]+/;
    const match = filePath.match(regex);

    if (match) {
        return match[0];
    }

    // If the pattern is not found, return an empty string or handle the error as needed
    return '';
}