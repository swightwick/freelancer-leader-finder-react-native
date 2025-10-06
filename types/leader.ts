export interface Leader {
  name: string;
  image: any;
  attributes: {
    earrings: boolean;
    glasses: boolean;
    hat: boolean;
    necklace: boolean;
    tattoo: boolean;
    hair: 'black' | 'blonde' | 'brown' | 'gray' | 'red' | 'bald';
  };
}

export interface Filters {
  earrings: boolean;
  glasses: boolean;
  hat: boolean;
  necklace: boolean;
  tattoo: boolean;
  hair: 'any' | 'black' | 'blonde' | 'brown' | 'gray' | 'red' | 'bald';
}