export interface NewsItem {
    id: string,
    category: string;
    userRole: string;
    arrayOfComments: string[];
    description: string;
    image: string;
    createdAt: Date; // New property
  }
  
  const newsArray: NewsItem[] = [
    {
        id: '1',
      category: 'Technology',
      userRole: 'Admin',
      arrayOfComments: ['Great news!', 'Interesting information.'],
      description: 'New technology breakthrough announced!',
      image: 'https://firebasestorage.googleapis.com/v0/b/psychic-kite-378113.appspot.com/o/Calamansi.png?alt=media&token=481d5635-6659-435b-b2b7-373e5a3da6f7',
      createdAt: new Date('2022-01-01'),
    },
    {
        id: '2',
      category: 'Sports',
      userRole: 'User',
      arrayOfComments: ['Go team!', 'Exciting match yesterday.'],
      description: 'Local sports team wins championship!',
      image: 'https://firebasestorage.googleapis.com/v0/b/psychic-kite-378113.appspot.com/o/Carrots.png?alt=media&token=9cecec48-8b07-477d-90d8-60fe232dd938',
      createdAt: new Date('2022-01-02'),
    },
    {
        id: '3',
      category: 'Entertainment',
      userRole: 'User',
      arrayOfComments: ['Amazing performance!', 'Can\'t wait for the sequel.'],
      description: 'Blockbuster movie breaks box office records!',
      image: 'https://firebasestorage.googleapis.com/v0/b/psychic-kite-378113.appspot.com/o/Apple.png?alt=media&token=9e59febd-a64d-4909-ab16-7b11f43bd947',
      createdAt: new Date('2022-01-03'),
    },
    {
        id: '4',
      category: 'Science',
      userRole: 'Admin',
      arrayOfComments: ['Fascinating discovery!', 'The future looks bright.'],
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum nostrum hic ea unde ad itaque, culpa fugit deserunt at eligendi? Minus maxime impedit dolorum cumque, ducimus ex perferendis voluptate modi.  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate, ipsam perspiciatis quibusdam iure aut quis dolore minima, commodi mollitia ea nulla, a consequatur? Unde, nisi earum nobis recusandae excepturi reiciendis.',
      image: 'https://firebasestorage.googleapis.com/v0/b/psychic-kite-378113.appspot.com/o/Sili(Labuyo).png?alt=media&token=fa850e64-2be6-40a7-ac48-a25028a1f71f',
      createdAt: new Date('2022-01-04'),
    },
    {
        id: '5',
      category: 'Business',
      userRole: 'User',
      arrayOfComments: ['Economic insights!', 'Stock market analysis.'],
      description: 'Global business trends shaping the economy!',
      image: 'https://firebasestorage.googleapis.com/v0/b/psychic-kite-378113.appspot.com/o/Carrots.png?alt=media&token=9cecec48-8b07-477d-90d8-60fe232dd938',
      createdAt: new Date('2022-01-05'),
    },
    {
        id: '6',
      category: 'Health',
      userRole: 'Admin',
      arrayOfComments: ['Stay healthy!', 'Tips for a balanced lifestyle.'],
      description: 'Wellness experts share keys to a healthy life!',
      image: 'https://firebasestorage.googleapis.com/v0/b/psychic-kite-378113.appspot.com/o/Sili(Labuyo).png?alt=media&token=fa850e64-2be6-40a7-ac48-a25028a1f71f',
      createdAt: new Date('2022-01-06'),
    },
  ];
  
  export default newsArray;
  