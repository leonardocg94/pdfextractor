//CSF DATA
export type CsfPersonDataTypes = {
  RFC: string;
  CURP: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  fechaInicioOperaciones?: string;
  estatusPadron?: string;
  fechaUltimoCambioDeEstado?: string;
  nombreComercial?: string;
};

export type CsfLocationDataTypes = {
  codigoPostal: string;
  tipoVialidad: string;
  nombreVialidad: string;
  noExterior: string;
  noInterior: string;
  colonia: string;
  localidad: string;
  municipioDelegacion: string;
  entidadFederativa: string;
  entreCalle1: string;
  entreCalle2: string;
  email?: string;
  telFijoLada?: string;
  telFijoNumero?: string;
  estadoDelDomicilio?: string;
  estadoDelContribuyenteEnElDomicilio: string;
};

export type CsfDataType = {
  persona: CsfPersonDataTypes;
  domicilio: CsfLocationDataTypes;
};
//CSF DATA
//INDEXES FOR CSF
export type CsfDelimiterIndexes = {
  startIndex: number;
  startValue: string;
  addressIndex: number;
  addressValue: string;
  endIndex: number;
  endValue: string;
};
//INDEXES FOR CSF
