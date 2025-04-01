export interface Order {
  id?: number; 
  petId?: number; 
  quantity?: number; 
  shipDate?: string; 
  status?: string; //Order Status
  complete?: boolean; 
}

export interface Category {
  id?: number; 
  name?: string; 
}

export interface User {
  id?: number; 
  username?: string; 
  firstName?: string; 
  lastName?: string; 
  email?: string; 
  password?: string; 
  phone?: string; 
  userStatus?: number; //User Status
}

export interface Tag {
  id?: number; 
  name?: string; 
}

export interface Pet {
  id?: number; 
  name?: string; 
  category?: Category; 
  photoUrls?: string[]; 
  tags?: Tag[]; 
  status?: string; //pet status in the store
}

export interface ApiResponse {
  code?: number; 
  type?: string; 
  message?: string; 
}

export interface Error {
  code?: string; 
  message?: string; 
}


//查询组合类型
export interface QueryTypefindPetsByStatus {
  status?: string;
}

export interface QueryTypefindPetsByTags {
  tags?: string[];
}

export interface QueryTypegetPetById {
  petId?: number;
}

export interface QueryTypeupdatePetWithForm {
  petId?: number;
  name?: string;
  status?: string;
}

export interface QueryTypedeletePet {
  api_key?: string;
  petId?: number;
}

export interface QueryTypeuploadFile {
  petId?: number;
  additionalMetadata?: string;
}

export interface QueryTypegetOrderById {
  orderId?: number;
}

export interface QueryTypedeleteOrder {
  orderId?: number;
}

export interface QueryTypeloginUser {
  username?: string;
  password?: string;
}

export interface QueryTypelogoutUser {
}

export interface QueryTypegetUserByName {
  username?: string;
}

export interface QueryTypeupdateUser {
  username?: string;
}

export interface QueryTypedeleteUser {
  username?: string;
}

