export type EventPackagesType = {
    id: number;
    title: string;
  };


  export type EventDetails = {
    pkg: string;
    theme: string;
    venue: string;
    eventDate: string;
    eventTime: string;
    location: string;
  };


  export type Menu = {
    id: number;
    title: string;
  }

  export type Category = {
    id: number;
    title: string;
  }


  export type PersonalInfo = {
    name: string;
    email: string;
    contact: string;
    celebrant: string;
    address: string;
  };
  
  export type GuestDetails = {
    pax: string;
    adults: string;
    kids: string;

  };
  
  export type MenuSelection = {
    beef: string;
    chicken: string;
    vegetable: string;
    pork: string;
    pasta: string;
    fillet: string;
    dessert: string;
    juice: string;
  };
  
  export type RequestInfo = {
    category: string;
    requestSlip: string;
    imageFile: string;
  };
  
  export type ReservationData = {
    personal: PersonalInfo;
    event: EventDetails;
    guests: GuestDetails;
    menu: MenuSelection;
    request: RequestInfo;
    chickenMenu: { [key: string]: boolean };
  };