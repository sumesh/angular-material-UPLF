import { Role, Roles } from "./role";

export class User {
    id?: number;
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
    token?: string;
    roles?:Roles[];
}


export class Session {
    Identity?:User
    Role?:Roles;
}

export class InputData
{
    roleid?:string;
    horzid?:string;
    subhorzid?:string;
    entitytype?:string;
    entityid?:string;
    buckettype?:string;
}

export class MasterDropdown{
   id?:string;
   value?:string;
   isdefault?:boolean;
}

