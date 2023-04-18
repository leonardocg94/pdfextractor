import {TextResult} from 'react-native-pdf-extractor/src/types';
import {
  CsfDataType,
  CsfDelimiterIndexes,
  CsfLocationDataTypes,
  CsfPersonDataTypes,
} from '../interfaces/csfInterfaces';

const findDelimiterIndexes = (
  text: TextResult,
): undefined | CsfDelimiterIndexes => {
  console.log("finding index delimiters")
  const startIndex = text.findIndex(val =>
    val?.includes('Datos de Identificaci'),
  );
  const addressIndex = text.findIndex(val =>
    val?.includes('Datos del domicilio') || val?.includes("Datos de Ubicaci"),
  );
  const endIndex = text.findIndex(val => val?.includes('Actividades Econ'));
  if (startIndex === -1 || addressIndex === -1 || endIndex === -1) return;
  return {
    startIndex,
    startValue: text[startIndex] as string,
    addressIndex,
    addressValue: text[addressIndex] as string,
    endIndex,
    endValue: text[endIndex] as string,
  };
};

const formatAdressData = (text: TextResult) => {
  console.log("format address data to assing")
  // console.log('\n**********Datos entratnes text**********\n');
  // console.log(JSON.stringify(text, null, 3));

  const splited = text.map(str => {
    const firstSplit = str?.split(':');
    if (firstSplit!.length < 3) return firstSplit?.join();
    const secondValue = firstSplit![1];
    const indexOfSplit = secondValue.search(/ [A-Z][a-z\u00C0-\u017F]/);
    // console.log({indexOfSplit});
    // console.log({
    //   testIndex: [secondValue.slice(0, indexOfSplit), secondValue.slice(indexOfSplit)],
    // });
    return `${firstSplit![0]}:${secondValue.slice(
      0,
      indexOfSplit,
    )};${secondValue.slice(indexOfSplit)}:${firstSplit![2]}`;
  });
  // console.log('\n**********Datos del domicilio**********\n');
  // console.log(JSON.stringify(splited, null, 3));

  const resultArr: string[] = [];
  for (let i = 0; i < splited.length; i++) {
    const value = splited[i];
    const singleDataArr = value?.split(';');
    if (singleDataArr!.length < 2) continue;
    const nextValue = splited[i + 1];
    resultArr.push(singleDataArr![0]);
    if (
      i < splited.length - 1 &&
      !nextValue?.includes(';') &&
      nextValue?.toUpperCase() === nextValue
    ) {
      resultArr.push(`${singleDataArr![1]} ${nextValue}`);
      i++;
    } else {
      resultArr.push(singleDataArr![1]);
    }
  }
  // console.log('\n**********Datos formato final**********\n');
  // console.log(JSON.stringify(resultArr, null, 3));

  return resultArr;
};

const assingDataToFinalResult = (
  indexes: CsfDelimiterIndexes,
  text: TextResult,
): CsfDataType | undefined => {
  let personData: CsfPersonDataTypes = {} as CsfPersonDataTypes;
  let addressData: CsfLocationDataTypes = {} as CsfLocationDataTypes;
  const {endIndex, addressIndex, startIndex} = indexes;
  console.log("assing person data")
  for (let i = startIndex + 1; i < addressIndex; i++) {
    const value = text[i];
    const posibleVal = value?.split(':')[1].trim() as string;

    if (value?.includes('RFC')) personData.RFC = posibleVal;
    if (value?.includes('CURP')) personData.CURP = posibleVal;
    if (value?.includes('Nombre (s)')) personData.nombres = posibleVal;
    if (value?.includes('Primer')) personData.primerApellido = posibleVal;
    if (value?.includes('Segundo')) personData.segundoApellido = posibleVal;
    if (value?.includes('Fecha inicio'))
      personData.fechaInicioOperaciones = posibleVal;
    if (value?.includes('Fecha de'))
      personData.fechaUltimoCambioDeEstado = posibleVal;
    if (value?.includes('Nombre Comercial'))
      personData.nombreComercial = posibleVal;
  }

  const addressDataArr = formatAdressData(text.slice(addressIndex + 1, endIndex));
  console.log("assing address data")
  for(let value of addressDataArr) {
    const requiredData = value.split(":")[1].trim();
    if(value.includes("Código Pos")) addressData.codigoPostal = requiredData;
    if(value.includes("Tipo de")) addressData.tipoVialidad = requiredData;
    if(value.includes("Nombre de V")) addressData.nombreVialidad = requiredData;
    if(value.includes("Número E")) addressData.noExterior = requiredData;
    if(value.includes("Número I")) addressData.noInterior = requiredData;
    if(value.includes("Nombre de la C")) addressData.colonia = requiredData;
    if(value.includes("Nombre de la L")) addressData.localidad = requiredData;
    if(value.includes("Nombre del M")) addressData.municipioDelegacion = requiredData;
    if(value.includes("Nombre de la E")) addressData.entidadFederativa = requiredData;
    if(value.includes("Entre C")) addressData.entreCalle1 = requiredData;
    if(value.includes("Y C")) addressData.entreCalle2 = requiredData;
    if(value.includes("Correo")) addressData.email = requiredData;
    if(value.includes("Tel.")) addressData.telFijoLada = requiredData;
    if(value.includes("Número:")) addressData.telFijoNumero = requiredData;
    if(value.includes("Estado del d")) addressData.estadoDelDomicilio = requiredData;
    if(value.includes("Estado del c")) addressData.estadoDelContribuyenteEnElDomicilio = requiredData;
  }

  return {persona: personData, domicilio: addressData};
};

export const extractDataFromCsfText = (
  text: TextResult,
): undefined | CsfDataType => {
  console.log("enter in extract data from cfg text main function")
  const indexes = findDelimiterIndexes(text);
  if (!indexes) return;
  // console.log(
  //   '\n**********Información de los indices:**********\n',
  //   JSON.stringify(indexes, null, 3),
  // );
  const finalData = assingDataToFinalResult(indexes, text);
  console.log("returning final data")
  // console.log('\n**********Final:**********\n');
  // console.log(JSON.stringify(finalData, null, 3));
  return finalData;
};
