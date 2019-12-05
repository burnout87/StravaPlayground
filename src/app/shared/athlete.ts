export class Athlete {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    city: string;
    state: string;
    country: string;

    constructor(
        id: number, 
        username: string, 
        firstname: string, 
        lastname: string,
        city: string,
        state: string,
        country: string) {
        this.id = id;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.city = city;
        this.state = state;
        this.country = country;
      }
}
