// productsData.ts
export interface Product {
    id: number;
    user:{
        id: string;
        name: string;
    } ;
    productImage: string;
    productName: string;
    description: string;
    category: string;
    tag: string[];
    availableStocks: number;
  }
  
  const productsData: Product[] = [
    {
      id: 1,
      user: {id:'1', name: "User Full Name 1"} ,
      productImage: 'https://firebasestorage.googleapis.com/v0/b/psychic-kite-378113.appspot.com/o/Banana.png?alt=media&token=8c4c2b6c-5220-4f08-8b96-dc6a47c9c83f',
      productName: 'Product 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      category: 'Category A',
      tag: ['Tag1', 'Tag2'],
      availableStocks: 10,
    },
    {
      id: 2,
      user: {id:'2', name: "User Full Name 2"} ,
      productImage: 'https://firebasestorage.googleapis.com/v0/b/psychic-kite-378113.appspot.com/o/Sili(Labuyo).png?alt=media&token=fa850e64-2be6-40a7-ac48-a25028a1f71f',
      productName: 'Product 2',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam quas ex, maiores ab vel quidem illum fugit natus voluptatum earum mollitia. Omnis modi officiis magni perferendis. Nemo aliquid repellendus dolores. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid voluptas nesciunt, quas voluptatem perspiciatis necessitatibus? Consequatur, ipsum. Quis eius vero sed esse, temporibus dignissimos neque atque sequi in eligendi adipisci?',
      category: 'Category B',
      tag: ['Tag3', 'Tag4'],
      availableStocks: 15,
    },
    {
      id: 3,
      user: {id:'3', name: "User Full Name 3"} ,
      productImage: 'https://firebasestorage.googleapis.com/v0/b/psychic-kite-378113.appspot.com/o/Pechay.png?alt=media&token=adaa8949-8ffc-4c95-a1ce-995677acec01',
      productName: 'Product 3',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      category: 'Category A',
      tag: ['Tag2', 'Tag5'],
      availableStocks: 8,
    },
    {
      id: 4,
      user: {id:'4', name: "User Full Name 4"} ,
      productImage: 'https://firebasestorage.googleapis.com/v0/b/psychic-kite-378113.appspot.com/o/Orange.png?alt=media&token=033cfdf5-077b-441d-b60e-0843b15ada52',
      productName: 'Product 4',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      category: 'Category C',
      tag: ['Tag1', 'Tag4'],
      availableStocks: 20,
    },
    {
      id: 5,
      user: {id:'5', name: "User Full Name 5"} ,
      productImage: 'https://firebasestorage.googleapis.com/v0/b/psychic-kite-378113.appspot.com/o/Sili(Labuyo).png?alt=media&token=fa850e64-2be6-40a7-ac48-a25028a1f71f',
      productName: 'Product 5',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      category: 'Category B',
      tag: ['Tag3', 'Tag5'],
      availableStocks: 12,
    },
    {
      id: 6,
      user: {id:'6', name: "User Full Name 6"} ,
      productImage: 'https://firebasestorage.googleapis.com/v0/b/psychic-kite-378113.appspot.com/o/Dalandan.png?alt=media&token=4c6baaab-b8c8-4a7f-8b5d-fe1b62b39a15',
      productName: 'Product 6',
      description: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      category: 'Category C',
      tag: ['Tag1', 'Tag2'],
      availableStocks: 18,
    },
  ];
  
  export default productsData;
  