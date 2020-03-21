export class Athlete {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    city: string;
    state: string;
    country: string;
    profileImgUrl: string
    
    constructor(
        id: number, 
        userName: string, 
        firstName: string, 
        lastName: string,
        city: string,
        state: string,
        country: string,
        profileImgUrl: string) 
      {
        this.id = id;
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.city = city;
        this.state = state;
        this.country = country;
        this.profileImgUrl = profileImgUrl;
      }
}
