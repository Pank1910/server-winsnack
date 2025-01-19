export interface Product {
    _id: string;
    sku: string;
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
    quantity: number;
}

export class Product {
    constructor(
        public _id: string="",
        public sku:string="",
        public name:string="",
        public category:string="",
        public price:number=0,
        public image:string="",
        public description:string="",
        public quantity: number=1,
    ) { }
}