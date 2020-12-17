interface Info {
    path: string;
    name: string;
    type?: 'folder' | 'file';
    children?: Info[];
}
export default function dirTree(filename: any): Info;
export {};
