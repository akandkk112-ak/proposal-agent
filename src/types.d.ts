declare module 'officeparser' {
    export function parseOffice(filePath: string): Promise<string>;
}
