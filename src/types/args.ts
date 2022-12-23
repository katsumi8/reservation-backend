type TimeInput = {
  date: string;
  timeSlot: string;
};

type UserInput = {
  name: string;
  email: string;
  phoneNo: string;
};

type ReservationInput = {
  tableId: number;
  description: string;
  PplNo: number;
  time: TimeInput;
};

export type ReservationCreateManyArgs = {
  reservations: ReservationInput[];
  userInput: UserInput;
};

export type ReservationAndUserArgs = {
  reservation: {
    tableId?: number;
    description: string;
    PplNo: number;
    time: TimeInput;
    userInput: UserInput;
  };
};

export type TableArgs = {
  id: string;
  table: {
    tableName?: string;
    capability?: string;
    isReserved?: boolean;
    position?: string;
    isRounded?: boolean;
    isUnReserved?: boolean;
  };
};

export type TimeArgs = {
  time: {
    date?: string;
    timeSlot?: string;
  };
};
