import { Category, EventPackagesType, Menu } from "@/types/reservation";


export const EventPackages: EventPackagesType[] = [
  { id: 1, title: 'Birthday' },
  { id: 2, title: 'Debut' },
  { id: 3, title: 'Wedding' },
  { id: 4, title: 'Baptismal' },
  { id: 5, title: 'Corporate' },
];


export const EventTypeBaptismal: EventPackagesType[] = [
  { id: 1, title: 'Rainbow' },
  { id: 2, title: 'Stars' },
  { id: 3, title: 'Clouds' },
]

export const EventTypeWedding: EventPackagesType[] = [
    { id: 1, title: 'Elegant' },
    { id: 2, title: 'Modern' },
    { id: 3, title: 'Classic' },
]


export const PastaMenu: Menu[] = [
  {id: 1, title: "Creamy Carbonara"},
  {id: 2, title: "Pansit Guisado"},
  {id: 3, title: "Pansit Bihon"}
]

export const RequestCategory: Category[] = [
  { id: 1, title: 'Catering' },
  { id: 2, title: 'Theme' },
  { id: 3, title: 'Design' },
  { id: 4, title: 'Food' },
  { id: 5, title: 'Contract' },
  
]