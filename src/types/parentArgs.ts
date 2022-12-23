export type ReservationParentType = {
  id: number;
  tableId: number;
  date: string;
  timeSlot: string;
  description: string;
  PplNo: number;
  reservedById: number;
};

export type TableParentType = {
  id: number;
  tableName: string;
  capability: string;
  isReserved: boolean;
  isRounded: boolean;
  position: string;
};

export type UserParentType = {
  id: number;
  name: string;
  email: string;
  phoneNo: string;
};
