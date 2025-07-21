// types go here

export interface NumberResponse {
  id: string;              // uuid from `id`
  phoneNumber: string;     // varchar(20)
  status: boolean;         // boolean
}

export interface NumberRequest {
  phoneNumber: string;
  status?: boolean; // optional, defaults to true
}
