export type BloodGroup =
  | 'A_PLUS'
  | 'A_MINUS'
  | 'B_PLUS'
  | 'B_MINUS'
  | 'AB_PLUS'
  | 'AB_MINUS'
  | 'O_PLUS'
  | 'O_MINUS';

export type District =
  | 'BAGERHAT'
  | 'BANDARBAN'
  | 'BARGUNA'
  | 'BARISAL'
  | 'BHOLA'
  | 'BOGURA'
  | 'BRAHMANBARIA'
  | 'CHANDPUR'
  | 'CHITTAGONG'
  | 'CHUADANGA'
  | 'COMILLA'
  | 'COXSBZAR'
  | 'DHAKA'
  | 'DINAJPUR'
  | 'FARIDPUR'
  | 'FENI'
  | 'GAIBANDHA'
  | 'GAZIPUR'
  | 'GOPALGANJ'
  | 'HABIGANJ'
  | 'JAMALPUR'
  | 'JESSORE'
  | 'JHALOKATHI'
  | 'JHENAIDAH'
  | 'JOYPURHAT'
  | 'KHAGRACHHARI'
  | 'KHULNA'
  | 'KISHOREGONJ'
  | 'KURIGRAM'
  | 'KUSHTIA'
  | 'LAKSHMIPUR'
  | 'LALMONIRHAT'
  | 'MADARIPUR'
  | 'MAGURA'
  | 'MANIKGANJ'
  | 'MEHERPUR'
  | 'MOULVIBAZAR'
  | 'MUNSHIGANJ'
  | 'MYMENSINGH'
  | 'NAOGAON'
  | 'NARAIL'
  | 'NARAYANGANJ'
  | 'NARSINGDI'
  | 'NATORE'
  | 'NETROKONA'
  | 'NILPHAMARI'
  | 'NOAKHALI'
  | 'PABNA'
  | 'PANCHAGARH'
  | 'PATUAKHALI'
  | 'PIROJPUR'
  | 'RAJBARI'
  | 'RAJSHAHI'
  | 'RANGAMATI'
  | 'RANGPUR'
  | 'SATKHIRA'
  | 'SHAHRIATPUR'
  | 'SHERPUR'
  | 'SIRAJGANJ'
  | 'SUNAMGANJ'
  | 'SYLHET'
  | 'TANGAIL'
  | 'THAKURGAON';

export type Donor = {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  district: District;
  area?: string | null;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  contactPhone: string;
};

export type EmergencyRequest = {
  id: string;
  bloodGroup: BloodGroup;
  hospital: string;
  district: District;
  contactPhone: string;
  unitsNeeded?: string | null;
  note?: string | null;
  fulfilled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Organization = {
  id: string;
  name: string;
  founded: string;
  description: string;
  websiteUrl: string;
  contactPhone?: string | null;
};
